"""
VitalArc Clinical RAG & LLM Copilot Service
"""
import google.generativeai as genai
from typing import Dict, Any, Optional
import os


class ClinicalRAGService:
    """Service handling clinical guidance and guideline-augmented report generation."""

    def __init__(self, api_key: Optional[str] = None):
        key = api_key or os.getenv("GEMINI_API_KEY")
        if key:
            genai.configure(api_key=key)
        self.model = genai.GenerativeModel('gemini-flash-latest')

    def generate_clinical_response(
        self,
        question: str,
        diagnosis: str,
        confidence: float,
        recommendation: str
    ) -> Dict[str, Any]:
        """Synthesize an empathetic, evidence-informed response to patient inquiries."""
        prompt = f"""
You are an empathetic medical assistant specialized in eye diseases for VitalArc CDSS.
The patient's AI screening shows: {diagnosis} (Confidence: {confidence:.1f}%).
Screening Recommendation: {recommendation}

Patient's Question: {question}

Instructions:
1. Answer their question directly in a warm, concise, and professional tone.
2. Structure the answer using 3-4 clear bullet points.
3. Highlight critical warning signs (e.g., sudden vision loss, severe eye pain) that require immediate ER attention.
4. Conclude with a clear disclaimer to consult a licensed ophthalmologist for definitive clinical diagnosis.
"""
        try:
            response = self.model.generate_content(prompt)
            return {
                "success": True,
                "answer": response.text,
                "diagnosis": diagnosis,
                "confidence": confidence
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "answer": "Unable to reach the clinical AI assistant at this moment. Please consult a medical professional."
            }
