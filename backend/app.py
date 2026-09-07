import os
import io
import base64
import time
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import SegformerConfig, SegformerForImageClassification
import torchvision.transforms as transforms
from PIL import Image, UnidentifiedImageError
from dotenv import load_dotenv
import google.generativeai as genai

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger("VitalArcAPI")

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB maximum upload payload

# Load model checkpoint safely
model_path = os.path.join(os.path.dirname(__file__), 'segformer.pth')
model = None
CLASS_NAMES = ['Conjunctivitis', 'Pterygium']

try:
    if os.path.exists(model_path):
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
        CLASS_NAMES = CLASS_NAMES[:num_classes]
        logger.info("Successfully loaded SegFormer checkpoint.")
    else:
        logger.warning(f"Model file not found at {model_path}.")
except Exception as e:
    logger.exception(f"Failed to load SegFormer model weights: {e}")

def preprocess_image(image):
    """Preprocess PIL image for model prediction."""
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    return transform(image).unsqueeze(0)

def generate_recommendation(diagnosis):
    """Generate medical recommendation based on primary diagnosis."""
    recommendations = {
        'Normal': 'No significant abnormalities detected. Regular eye checkups recommended.',
        'Corneal Ulcer': 'URGENT: Immediate ophthalmologist consultation required for proper treatment.',
        'Pterygium': 'Consult an ophthalmologist for evaluation and management options.',
        'Conjunctivitis': 'Schedule appointment with eye doctor for proper diagnosis and treatment.'
    }
    return recommendations.get(diagnosis['disease'], 'Consult healthcare professional for proper evaluation.')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'VitalArc Diagnostic API',
        'version': '1.0.0',
        'model_loaded': model is not None,
        'classes': CLASS_NAMES,
        'llm_configured': bool(GEMINI_API_KEY)
    }), 200

@app.route('/api/ask-llm', methods=['POST'])
def ask_llm():
    try:
        data = request.json or {}
        question = data.get('question')
        diagnosis = data.get('diagnosis', 'Screening Observation')
        confidence = data.get('confidence', 'N/A')
        recommendation = data.get('recommendation', 'Consult an eye specialist')
        
        if not question or not str(question).strip():
            return jsonify({'error': 'Question is required'}), 400

        if not GEMINI_API_KEY:
            return jsonify({
                'answer': 'The clinical AI assistant is in offline mode. Please configure GEMINI_API_KEY in backend environment. Reminder: Always consult a licensed ophthalmologist for medical advice.'
            }), 200
        
        prompt = f"""
You are an empathetic medical assistant specialized in eye diseases for VitalArc clinical support.
The patient's AI screening shows: {diagnosis} (Confidence: {confidence}%). 
Screening Recommendation: {recommendation}

Patient's Question: {question}

Instructions:
1. Answer their question directly in a very short, warm, and humanized tone.
2. Provide the answer ONLY using a few brief bullet points.
3. Keep the overall response extremely concise and easy to read.
4. Gently remind them to consult a real eye doctor for an official diagnosis.
"""
        model_llm = genai.GenerativeModel('gemini-flash-latest')
        response = model_llm.generate_content(prompt)
        return jsonify({'answer': response.text})
        
    except Exception as e:
        logger.exception(f"Error handling clinical assistant request: {e}")
        return jsonify({'error': 'Unable to complete clinical assistant request. Please try again later.'}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        start_time = time.time()
        
        # Validate model readiness
        if model is None:
            logger.error("Predict endpoint called but model is not loaded.")
            return jsonify({'error': 'Classification model is currently unavailable.'}), 503

        # Extract image from request safely
        image = None
        if 'file' in request.files:
            file = request.files['file']
            if not file or file.filename == '':
                return jsonify({'error': 'No selected file in upload'}), 400
            try:
                image = Image.open(file.stream)
            except (UnidentifiedImageError, OSError, ValueError):
                return jsonify({'error': 'Invalid or corrupted image format. Please upload a valid JPEG, PNG, or WebP image.'}), 400
        elif request.is_json and 'image' in (request.json or {}):
            try:
                raw_image_data = request.json['image']
                if ',' in raw_image_data:
                    raw_image_data = raw_image_data.split(',')[1]
                image_bytes = base64.b64decode(raw_image_data)
                image = Image.open(io.BytesIO(image_bytes))
            except Exception:
                return jsonify({'error': 'Invalid base64 image encoding provided.'}), 400
        else:
            return jsonify({'error': 'No image provided in request'}), 400

        # Convert to RGB
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Preprocess and infer
        processed_image = preprocess_image(image)
        with torch.no_grad():
            outputs = model(processed_image)
            logits = outputs.logits
            confidence_scores = torch.nn.functional.softmax(logits, dim=-1)[0].tolist()
        
        # Build predictions
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
        
        return jsonify({
            'predictions': results,
            'primaryDiagnosis': primary_diagnosis['disease'],
            'confidence': primary_diagnosis['confidence'],
            'recommendation': generate_recommendation(primary_diagnosis),
            'processingTime': processing_time,
            'message': 'Analysis completed successfully'
        }), 200
        
    except Exception as e:
        logger.exception(f"Error during image analysis: {e}")
        return jsonify({'error': 'Image analysis failed due to an internal server error.'}), 500


if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_DEBUG', 'false').lower() in ('true', '1', 't')
    port = int(os.getenv('PORT', 5001))
    host = os.getenv('HOST', '0.0.0.0')
    app.run(host=host, port=port, debug=debug_mode)