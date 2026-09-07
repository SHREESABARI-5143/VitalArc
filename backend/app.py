from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import SegformerConfig, SegformerForImageClassification
import torchvision.transforms as transforms
import numpy as np
from PIL import Image
import io
import base64
import time
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyArlQqO4IJlkgGX1N5zmW0mXJoeJfiUB9U")
genai.configure(api_key=GEMINI_API_KEY)

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'VitalArc Diagnostic API',
        'version': '1.0.0',
        'model_loaded': model is not None,
        'classes': CLASS_NAMES
    }), 200

# Load your model
model_path = os.path.join(os.path.dirname(__file__), 'segformer.pth')
state_dict = torch.load(model_path, map_location='cpu')
num_classes = state_dict['classifier.weight'].shape[0]

config = SegformerConfig(
    num_labels=num_classes, 
    num_channels=3, 
    depths=[2, 2, 2, 2], 
    sr_ratios=[8, 4, 2, 1], 
    hidden_sizes=[32, 64, 160, 256], 
    patch_sizes=[7, 3, 3, 3], 
    strides=[4, 2, 2, 2], 
    num_attention_heads=[1, 2, 5, 8], 
    mlp_ratios=[4, 4, 4, 4], 
    hidden_act='gelu', 
    hidden_dropout_prob=0.0, 
    attention_probs_dropout_prob=0.0, 
    classifier_dropout_prob=0.1, 
    drop_path_rate=0.1, 
    decoder_hidden_size=256
)
model = SegformerForImageClassification(config)
model.load_state_dict(state_dict)
model.eval()

# Define disease classes based on the model's output classes
USER_CLASSES = ['Conjunctivitis', 'Pterygium']
CLASS_NAMES = USER_CLASSES[:num_classes]

def preprocess_image(image):
    """Preprocess the image for model prediction"""
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    image_tensor = transform(image).unsqueeze(0)
    return image_tensor

@app.route('/api/ask-llm', methods=['POST'])
def ask_llm():
    try:
        data = request.json
        question = data.get('question')
        diagnosis = data.get('diagnosis')
        confidence = data.get('confidence')
        recommendation = data.get('recommendation')
        
        prompt = f"""
You are an empathetic medical assistant specialized in eye diseases.
The patient's AI screening shows: {diagnosis} (Confidence: {confidence}%). 
Screening Recommendation: {recommendation}

Patient's Question: {question}

Instructions:
1. Answer their question directly in a very short, warm, and humanized tone.
2. Provide the answer ONLY using a few brief bullet points.
3. Keep the overall response extremely concise and easy to read.
4. Gently remind them to consult a real eye doctor for an official diagnosis.
        """
        
        model = genai.GenerativeModel('gemini-flash-latest')
        response = model.generate_content(prompt)
        
        return jsonify({'answer': response.text})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        start_time = time.time()
        
        # Get image from request
        if 'file' in request.files:
            file = request.files['file']
            image = Image.open(file.stream)
        elif 'image' in request.json:
            image_data = request.json['image'].split(',')[1]
            image = Image.open(io.BytesIO(base64.b64decode(image_data)))
        else:
            return jsonify({'error': 'No image provided'}), 400

        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Preprocess and make prediction
        processed_image = preprocess_image(image)
        with torch.no_grad():
            outputs = model(processed_image)
            logits = outputs.logits
            confidence_scores = torch.nn.functional.softmax(logits, dim=-1)[0].numpy()
        
        # Process results
        results = []
        for i, disease in enumerate(CLASS_NAMES):
            confidence = confidence_scores[i]
            results.append({
                'disease': disease,
                'confidence': float(confidence * 100),
                'severity': 'High' if confidence > 0.7 else 'Moderate' if confidence > 0.3 else 'Low'
            })
        
        results.sort(key=lambda x: x['confidence'], reverse=True)
        primary_diagnosis = results[0]
        processing_time = round(time.time() - start_time, 2)
        
        response = {
            'predictions': results,
            'primaryDiagnosis': primary_diagnosis['disease'],
            'confidence': primary_diagnosis['confidence'],
            'recommendation': generate_recommendation(primary_diagnosis),
            'processingTime': processing_time,
            'message': 'Analysis completed successfully'
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': f'Processing error: {str(e)}'}), 500

def generate_recommendation(diagnosis):
    """Generate medical recommendation based on diagnosis"""
    recommendations = {
        'Normal': 'No significant abnormalities detected. Regular eye checkups recommended.',
        'Corneal Ulcer': 'URGENT: Immediate ophthalmologist consultation required for proper treatment.',
        'Pterygium': 'Consult an ophthalmologist for evaluation and management options.',
        'Conjunctivitis': 'Schedule appointment with eye doctor for proper diagnosis and treatment.'
    }
    return recommendations.get(diagnosis['disease'], 'Consult healthcare professional.')



if __name__ == '__main__':
    app.run(debug=True, port=5001)