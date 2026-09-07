import { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle, Loader2, Eye, XCircle, Info, Camera, Sparkles, Ban, Download, Mail, MessageSquare, Send } from 'lucide-react';

interface Prediction {
  disease: string;
  confidence: number;
  severity: string;
}

interface ApiResponse {
  predictions: Prediction[];
  primaryDiagnosis: string;
  confidence: number;
  recommendation: string;
  processingTime: number;
  message?: string;
  error?: string;
  error_type?: string;
  suggestions?: string[];
}

interface Question {
  question: string;
  answer: string;
  timestamp: Date;
}

const DISEASE_INFO = {
  'Normal': {
    description: 'No detectable abnormalities in eye examination',
    symptoms: ['Clear vision', 'No redness or discomfort', 'Normal eye appearance'],
    risk: 'Maintain regular eye checkups',
    urgency: 'low'
  },
  'Corneal Ulcer': {
    description: 'Open sore on the cornea, often caused by infection',
    symptoms: ['Severe eye pain', 'Redness', 'Blurred vision', 'Sensitivity to light', 'Eye discharge'],
    risk: 'Can lead to permanent vision loss if untreated',
    urgency: 'high'
  },
  'Pterygium': {
    description: 'Non-cancerous growth of conjunctival tissue onto cornea',
    symptoms: ['Fleshy growth on eye', 'Redness', 'Irritation', 'Blurred vision if covering pupil'],
    risk: 'Common in sunny climates, usually not vision-threatening',
    urgency: 'medium'
  },
  'Conjunctivitis': {
    description: 'Inflammation or infection of the conjunctiva (pink eye)',
    symptoms: ['Red or pink color in white of eye', 'Increased tearing', 'Itching or burning', 'Discharge', 'Crusting of eyelids'],
    risk: 'Highly contagious for viral and bacterial types',
    urgency: 'medium'
  }
};

const ACCEPTED_IMAGE_TYPES = [
  {
    type: 'Anterior Eye Image',
    description: 'Front view of the eye',
    examples: ['Shows iris, pupil, and white sclera', 'Clear cornea visible', 'Well-lit and focused'],
    icon: '👁️'
  },
  {
    type: 'Retinal Fundus Image', 
    description: 'Back of the eye view',
    examples: ['Red-orange background', 'Visible blood vessels', 'Circular shape', 'Medical camera quality'],
    icon: '🔍'
  }
];

const REJECTED_IMAGE_TYPES = [
  { type: 'Vehicles & Objects', reason: 'Not eye images - wrong shape and features' },
  { type: 'Faces & People', reason: 'Shows entire face, not just eye' },
  { type: 'Animals & Nature', reason: 'No human eye content' },
  { type: 'Documents & Text', reason: 'Not visual eye data' },
  { type: 'Landscapes & Scenery', reason: 'Wrong textures and patterns' },
  { type: 'Other Body Parts', reason: 'Model trained only on eyes' }
];

export default function Demo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationSuggestions, setValidationSuggestions] = useState<string[]>([]);
  
  // State for questions
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResults(null);
      setError(null);
      setValidationError(null);
      setValidationSuggestions([]);
      setQuestions([]); // Clear questions when new image is uploaded
      setCurrentQuestion('');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Basic client-side validation
      if (file.size > 10 * 1024 * 1024) {
        setValidationError('File size too large. Please upload an image smaller than 10MB.');
        return;
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setValidationError('Invalid file type. Please upload JPEG, PNG, or WebP images.');
        return;
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setError(null);
    setValidationError(null);
    setValidationSuggestions([]);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:5001/api/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to analyze image';
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.error_type === 'invalid_image_type' || data.error_type === 'poor_quality') {
            setValidationError(data.error || 'Invalid image');
            if (data.suggestions) {
              setValidationSuggestions(data.suggestions);
            }
            return;
          }
          errorMessage = data.error || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || response.statusText || errorMessage;
        }
        setError(errorMessage);
        return;
      }

      const data: ApiResponse = await response.json();

      // Ensure all predictions have proper confidence values
      const processedData = {
        ...data,
        predictions: data.predictions.map(pred => ({
          ...pred,
          confidence: pred.confidence || 0 // Ensure no undefined values
        }))
      };

      setResults(processedData);
      
      // Store the analyzed image in localStorage for Data page
      if (previewUrl && selectedFile) {
        const storedImage = {
          id: Date.now().toString(),
          fileName: selectedFile.name,
          disease: processedData.primaryDiagnosis,
          confidence: processedData.confidence,
          timestamp: new Date().toISOString(),
          imageUrl: previewUrl,
          predictions: processedData.predictions,
          recommendation: processedData.recommendation,
          processingTime: processedData.processingTime
        };
        
        const existingImages = JSON.parse(localStorage.getItem('eyeDiseaseImages') || '[]');
        const updatedImages = [storedImage, ...existingImages];
        localStorage.setItem('eyeDiseaseImages', JSON.stringify(updatedImages));
        
        // Trigger storage event for Data page to update
        window.dispatchEvent(new Event('storage'));
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResults(null);
    setError(null);
    setValidationError(null);
    setValidationSuggestions([]);
    setQuestions([]); // Clear questions on reset
    setCurrentQuestion('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // PDF Download Function
  const downloadPDFReport = () => {
    if (!results || !previewUrl) return;

    const reportContent = `
EYE DISEASE DETECTION REPORT
============================

PATIENT REPORT
--------------
Analysis Date: ${new Date().toLocaleString()}
Processing Time: ${results.processingTime} seconds
Model Version: v2.1

DIAGNOSIS RESULTS
-----------------
Primary Diagnosis: ${results.primaryDiagnosis}
Confidence Level: ${results.confidence.toFixed(1)}%

DETAILED PREDICTIONS:
${results.predictions.map(pred => 
  `- ${pred.disease}: ${pred.confidence.toFixed(1)}% (${pred.severity})`
).join('\n')}

MEDICAL RECOMMENDATION
----------------------
${results.recommendation}

DISEASE INFORMATION
-------------------
${DISEASE_INFO[results.primaryDiagnosis as keyof typeof DISEASE_INFO]?.description || 'No additional information available.'}

Common Symptoms:
${DISEASE_INFO[results.primaryDiagnosis as keyof typeof DISEASE_INFO]?.symptoms.map(symptom => `• ${symptom}`).join('\n') || 'N/A'}

URGENCY LEVEL: ${DISEASE_INFO[results.primaryDiagnosis as keyof typeof DISEASE_INFO]?.urgency?.toUpperCase() || 'MEDIUM'}

IMPORTANT DISCLAIMER
--------------------
This report is generated by an AI system for preliminary screening purposes only. 
The results should be verified by a qualified healthcare professional. 
Always consult with medical experts for proper diagnosis and treatment.

Generated by RetinaScan AI System
© ${new Date().getFullYear()} - All rights reserved
    `.trim();

    // Create and download text file (simplified PDF alternative)
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Eye_Report_${results.primaryDiagnosis.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Email Sharing Function
  const shareViaEmail = () => {
    if (!results) return;

    const subject = `Eye Disease Detection Report - ${results.primaryDiagnosis}`;
    const body = `
Hello,

Please find below the eye disease detection report generated by RetinaScan AI:

DIAGNOSIS SUMMARY:
------------------
Primary Diagnosis: ${results.primaryDiagnosis}
Confidence Level: ${results.confidence.toFixed(1)}%
Analysis Date: ${new Date().toLocaleString()}

DETAILED RESULTS:
${results.predictions.map(pred => 
  `• ${pred.disease}: ${pred.confidence.toFixed(1)}% confidence`
).join('\n')}

MEDICAL RECOMMENDATION:
${results.recommendation}

ADDITIONAL INFORMATION:
${DISEASE_INFO[results.primaryDiagnosis as keyof typeof DISEASE_INFO]?.description || ''}

Common Symptoms:
${DISEASE_INFO[results.primaryDiagnosis as keyof typeof DISEASE_INFO]?.symptoms.map(symptom => `- ${symptom}`).join('\n')}

Urgency Level: ${DISEASE_INFO[results.primaryDiagnosis as keyof typeof DISEASE_INFO]?.urgency?.toUpperCase() || 'MEDIUM'}

IMPORTANT:
This report is generated by an AI system for preliminary screening purposes only. 
Please consult with qualified healthcare professionals for proper medical diagnosis and treatment.

Best regards,
RetinaScan AI System
    `.trim();

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  // Function to ask questions to LLM
  const askQuestion = async () => {
    if (!currentQuestion.trim() || !results || !previewUrl) return;

    setIsAsking(true);
    try {
      const response = await fetch('http://localhost:5001/api/ask-llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion,
          diagnosis: results.primaryDiagnosis,
          confidence: results.confidence,
          predictions: results.predictions,
          recommendation: results.recommendation,
          diseaseInfo: DISEASE_INFO[results.primaryDiagnosis as keyof typeof DISEASE_INFO]
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(prev => [...prev, {
          question: currentQuestion,
          answer: data.answer,
          timestamp: new Date()
        }]);
        setCurrentQuestion('');
      } else {
        let errorMessage = 'Failed to get answer';
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || response.statusText || errorMessage;
        }
        console.error('Failed to get answer:', errorMessage);
      }
    } catch (error) {
      console.error('Error asking question:', error);
    } finally {
      setIsAsking(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'text-red-600 bg-red-50';
    if (confidence >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getConfidenceBarColor = (confidence: number) => {
    if (confidence >= 70) return 'bg-red-500';
    if (confidence >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getDiseaseColor = (disease: string) => {
    const colors = {
      'Normal': 'text-green-600 bg-green-50 border-green-200',
      'Corneal Ulcer': 'text-red-600 bg-red-50 border-red-200',
      'Pterygium': 'text-orange-600 bg-orange-50 border-orange-200',
      'Conjunctivitis': 'text-blue-600 bg-blue-50 border-blue-200'
    };
    return colors[disease as keyof typeof colors] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getUrgencyBadge = (urgency: string) => {
    const badges = {
      'high': 'bg-red-100 text-red-800 border border-red-200',
      'medium': 'bg-orange-100 text-orange-800 border border-orange-200',
      'low': 'bg-green-100 text-green-800 border border-green-200'
    };
    return badges[urgency as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  // Ensure all diseases are displayed with their confidence values
  const getAllPredictions = () => {
    if (!results) return [];
    
    return results.predictions.map(pred => ({
      disease: pred.disease,
      confidence: pred.confidence || 0,
      severity: pred.severity || 'Low'
    })).sort((a, b) => b.confidence - a.confidence);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">Eye Disease Detection AI</h1>
          <p className="text-lg text-gray-300 max-w-3xl">
            Specialized AI model trained exclusively for eye disease detection. Upload only eye or retinal images for analysis.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Processing Error</h3>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Validation Error Display */}
        {validationError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8 rounded-r-lg">
            <div className="flex items-start">
              <Ban className="w-6 h-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Invalid Image Type</h3>
                <p className="text-red-800 mb-3">{validationError}</p>
                
                {validationSuggestions && validationSuggestions.length > 0 && (
                  <div className="bg-red-100 rounded-lg p-4 mb-3">
                    <p className="text-sm font-semibold text-red-900 mb-2">What to upload instead:</p>
                    <ul className="text-sm text-red-800 space-y-1">
                      {validationSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-white rounded p-3 border border-red-200">
                  <p className="text-sm font-semibold text-red-900 mb-1">This model specifically rejects:</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-red-700">
                    <div className="flex items-center">
                      <XCircle className="w-3 h-3 mr-1" />
                      <span>Vehicles & Objects</span>
                    </div>
                    <div className="flex items-center">
                      <XCircle className="w-3 h-3 mr-1" />
                      <span>Faces & People</span>
                    </div>
                    <div className="flex items-center">
                      <XCircle className="w-3 h-3 mr-1" />
                      <span>Animals & Nature</span>
                    </div>
                    <div className="flex items-center">
                      <XCircle className="w-3 h-3 mr-1" />
                      <span>Documents & Text</span>
                    </div>
                    <div className="flex items-center">
                      <XCircle className="w-3 h-3 mr-1" />
                      <span>Landscapes</span>
                    </div>
                    <div className="flex items-center">
                      <XCircle className="w-3 h-3 mr-1" />
                      <span>Other Body Parts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload Section */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Upload Image for Analysis</h2>

              {!previewUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition-all duration-200"
                >
                  <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-slate-900 mb-2">Upload Eye/Retinal Image</p>
                  <p className="text-sm text-gray-600">Model accepts only eye and retinal images</p>
                  <p className="text-xs text-gray-500 mt-2">JPEG, PNG • Max 10MB</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-slate-100">
                    <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-80 object-contain" />
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5 text-cyan-500" />
                      <div>
                        <div className="font-medium text-slate-900">{selectedFile?.name}</div>
                        <div className="text-sm text-gray-600">
                          {selectedFile && (selectedFile.size / 1024).toFixed(2)} KB
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleReset}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {previewUrl && !results && !validationError && (
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-300 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing with AI Model...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Analyze with Eye AI</span>
                    </>
                  )}
                </button>
              )}

              {validationError && (
                <button
                  onClick={handleReset}
                  className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-xl transition-all duration-200"
                >
                  Upload Correct Image Type
                </button>
              )}

              {results && (
                <button
                  onClick={handleReset}
                  className="w-full mt-6 bg-slate-700 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-all duration-200"
                >
                  Analyze Another Image
                </button>
              )}
            </div>

            {/* Model Information with Q&A Section Below */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                About This AI Model
              </h3>
              <p className="text-sm text-blue-800 mb-3">
                This specialized AI model is trained exclusively on eye and retinal images to detect specific eye conditions.
              </p>
              <div className="text-xs text-blue-700 space-y-1">
                <div className="flex justify-between">
                  <span>Model Type:</span>
                  <span className="font-semibold">Eye Disease Detection</span>
                </div>
                <div className="flex justify-between">
                  <span>Trained On:</span>
                  <span className="font-semibold">Eye & Retinal Images Only</span>
                </div>
                <div className="flex justify-between">
                  <span>Cannot Process:</span>
                  <span className="font-semibold">Other Image Types</span>
                </div>
              </div>
            </div>

            {/* Q&A Section - Below About This AI Model */}
            {results && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-cyan-500" />
                  <h3 className="font-semibold text-slate-900">Ask Questions About Your Diagnosis</h3>
                </div>
                
                {/* Questions History */}
                {questions.length > 0 && (
                  <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2">
                    {questions.map((q, index) => (
                      <div key={index} className="space-y-2">
                        <div className="bg-cyan-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-cyan-900 mb-1">You asked:</p>
                          <p className="text-sm text-cyan-800">{q.question}</p>
                          <p className="text-xs text-cyan-600 mt-1">
                            {q.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="bg-slate-100 rounded-lg p-3">
                          <p className="text-sm font-medium text-slate-900 mb-1">Answer:</p>
                          <p className="text-sm text-slate-700">{q.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Question Input */}
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
                    placeholder="Ask about symptoms, treatment, risks, or next steps..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    disabled={isAsking}
                  />
                  <button
                    onClick={askQuestion}
                    disabled={isAsking || !currentQuestion.trim()}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-300 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    {isAsking ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Suggested Questions */}
                <div>
                  <p className="text-xs text-slate-500 mb-2">Suggested questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "What are the next steps for treatment?",
                      "How urgent is this condition?",
                      "What symptoms should I watch for?",
                      "Is this condition treatable?",
                      "What causes this eye infection?",
                      "How long does recovery take?"
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestion(suggestion)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition-colors duration-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Disclaimer for Q&A */}
                <p className="text-xs text-gray-500 mt-4">
                  Answers are generated by AI and should be verified with healthcare professionals.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Results/Info Section */}
          <div>
            {!results ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
                <div className="text-center p-6">
                  <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Camera className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Model Ready</h3>
                  <p className="text-gray-600 mb-6">
                    Upload an eye or retinal image for AI-powered disease detection.
                  </p>
                  
                  {/* Accepted Images */}
                  <div className="bg-green-50 rounded-xl p-4 text-left mb-4">
                    <h4 className="font-semibold text-green-900 mb-3 text-sm flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      ACCEPTED IMAGES:
                    </h4>
                    <div className="space-y-3">
                      {ACCEPTED_IMAGE_TYPES.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">{item.icon}</span>
                            <div>
                              <div className="font-semibold text-green-900 text-sm">{item.type}</div>
                              <div className="text-xs text-green-700">{item.description}</div>
                            </div>
                          </div>
                          <ul className="text-xs text-green-600 space-y-1">
                            {item.examples.map((example, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="mr-1">•</span>
                                <span>{example}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rejected Images */}
                  <div className="bg-red-50 rounded-xl p-4 text-left">
                    <h4 className="font-semibold text-red-900 mb-3 text-sm flex items-center">
                      <XCircle className="w-4 h-4 mr-2" />
                      REJECTED IMAGES:
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {REJECTED_IMAGE_TYPES.map((item, index) => (
                        <div key={index} className="bg-white rounded p-2 border border-red-200">
                          <div className="font-medium text-red-900">{item.type}</div>
                          <div className="text-red-700">{item.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Results display */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Analysis Complete</h2>
                      {results.message && (
                        <p className="text-sm text-green-600 mt-1">{results.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Primary Diagnosis */}
                  <div className={`border-2 rounded-xl p-6 mb-6 ${getDiseaseColor(results.primaryDiagnosis)}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold uppercase">Primary Diagnosis</div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyBadge(DISEASE_INFO[results.primaryDiagnosis as keyof typeof DISEASE_INFO]?.urgency || 'medium')}`}>
                        {DISEASE_INFO[results.primaryDiagnosis as keyof typeof DISEASE_INFO]?.urgency?.toUpperCase() || 'MEDIUM'} PRIORITY
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-2">{results.primaryDiagnosis}</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-lg font-semibold">{results.confidence.toFixed(1)}% Confidence</div>
                    </div>
                    <p className="text-sm mt-3 opacity-90">
                      {DISEASE_INFO[results.primaryDiagnosis as keyof typeof DISEASE_INFO]?.description}
                    </p>
                  </div>

                  {/* All Predictions */}
                  <div className="space-y-3 mb-6">
                    <h3 className="font-semibold text-slate-900">All Predictions:</h3>
                    {getAllPredictions().map((pred: Prediction, index: number) => (
                      <div key={index} className={`border rounded-lg p-4 ${getDiseaseColor(pred.disease)}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-slate-900">{pred.disease}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getUrgencyBadge(DISEASE_INFO[pred.disease as keyof typeof DISEASE_INFO]?.urgency || 'medium')}`}>
                              {DISEASE_INFO[pred.disease as keyof typeof DISEASE_INFO]?.urgency || 'medium'}
                            </span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(pred.confidence)}`}>
                            {pred.confidence.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getConfidenceBarColor(pred.confidence)}`}
                            style={{ width: `${Math.max(pred.confidence, 5)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Medical Recommendation */}
                  <div className="bg-slate-900 rounded-xl p-6 text-white">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold mb-2">Medical Recommendation</div>
                        <p className="text-sm text-gray-300">{results.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export & Share Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Export & Share Report</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={downloadPDFReport}
                      className="flex items-center justify-center space-x-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download PDF Report</span>
                    </button>
                    <button
                      onClick={shareViaEmail}
                      className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Share via Email</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Report will be automatically saved to your Data repository
                  </p>
                </div>

                {/* Processing Details */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Processing Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Processing Time</div>
                      <div className="text-2xl font-bold text-cyan-600">{results.processingTime}s</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Model Version</div>
                      <div className="text-2xl font-bold text-cyan-600">v2.1</div>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-800">
                      <strong>Disclaimer:</strong> This AI tool is specifically trained for eye disease detection and assists in preliminary screening only. Always consult qualified healthcare professionals for medical diagnosis and treatment decisions.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}