import { useState, useEffect } from 'react';
import { Folder, FileImage, Download, Trash2, Database, X, BarChart3, PieChart } from 'lucide-react';

interface StoredImage {
  id: string;
  fileName: string;
  disease: string;
  confidence: number;
  timestamp: string;
  imageUrl: string;
}

// Safe image URL sanitization to prevent DOM XSS / reinterpretation
function getSafeImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('data:image/jpeg;base64,') ||
    trimmed.startsWith('data:image/png;base64,') ||
    trimmed.startsWith('data:image/webp;base64,') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://')
  ) {
    return trimmed;
  }
  return '';
}

export default function Data() {
  const [storedImages, setStoredImages] = useState<StoredImage[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<StoredImage | null>(null);

  useEffect(() => {
    const loadStoredImages = () => {
      try {
        const stored = localStorage.getItem('eyeDiseaseImages');
        if (stored) {
          setStoredImages(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading stored images:', error);
      }
    };

    loadStoredImages();
    window.addEventListener('storage', loadStoredImages);
    return () => window.removeEventListener('storage', loadStoredImages);
  }, []);

  const diseases = ['all', 'Normal', 'Corneal Ulcer', 'Pterygium', 'Conjunctivitis'];
  const filteredImages = selectedDisease === 'all' 
    ? storedImages 
    : storedImages.filter(img => img.disease === selectedDisease);

  // Simple BI Analysis
  const diseaseStats = diseases
    .filter(d => d !== 'all')
    .map(disease => {
      const diseaseImages = storedImages.filter(img => img.disease === disease);
      const count = diseaseImages.length;
      const percentage = storedImages.length > 0 ? (count / storedImages.length) * 100 : 0;
      return { disease, count, percentage };
    })
    .filter(stat => stat.count > 0);

  const downloadBIPDF = () => {
    const reportContent = `
EYE DISEASE DETECTION - BI ANALYSIS REPORT
==========================================

Total Images Analyzed: ${storedImages.length}
Generated On: ${new Date().toLocaleString()}

DISEASE DISTRIBUTION:
${diseaseStats.map(stat => `${stat.disease}: ${stat.count} cases (${stat.percentage.toFixed(1)}%)`).join('\n')}

Total Cases: ${storedImages.length}
Normal Cases: ${storedImages.filter(img => img.disease === 'Normal').length}
Abnormal Cases: ${storedImages.filter(img => img.disease !== 'Normal').length}
    `;

    const blob = new Blob([reportContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Eye_Disease_BI_Analysis_${Date.now()}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteImage = (id: string) => {
    const updatedImages = storedImages.filter(img => img.id !== id);
    setStoredImages(updatedImages);
    localStorage.setItem('eyeDiseaseImages', JSON.stringify(updatedImages));
  };

  const downloadImage = (image: StoredImage) => {
    const safeUrl = getSafeImageUrl(image.imageUrl);
    if (!safeUrl) return;
    const link = document.createElement('a');
    link.href = safeUrl;
    link.download = `${image.disease}_${image.fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    link.click();
  };

  const downloadReport = (image: StoredImage) => {
    const reportContent = `
EYE DISEASE DETECTION REPORT
============================
File Name: ${image.fileName}
Detected Disease: ${image.disease}
Confidence: ${image.confidence.toFixed(2)}%
Analysis Date: ${new Date(image.timestamp).toLocaleString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Eye_Report_${image.disease}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to delete all stored images?')) {
      setStoredImages([]);
      localStorage.removeItem('eyeDiseaseImages');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Database className="w-12 h-12 text-cyan-400" />
            <div>
              <h1 className="text-5xl font-bold mb-2">Data Repository</h1>
              <p className="text-xl text-gray-300">
                View and manage all analyzed eye images
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-cyan-600 mb-2">{storedImages.length}</div>
            <div className="text-gray-600">Total Images</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {storedImages.filter(img => img.disease === 'Normal').length}
            </div>
            <div className="text-gray-600">Normal Cases</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {storedImages.filter(img => img.disease !== 'Normal').length}
            </div>
            <div className="text-gray-600">Abnormal Cases</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {new Set(storedImages.map(img => img.disease)).size}
            </div>
            <div className="text-gray-600">Disease Categories</div>
          </div>
        </div>

        {storedImages.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-cyan-600" />
                BI Analysis Report
              </h2>
              <button
                onClick={downloadBIPDF}
                className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download BI Report (PDF)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  Disease Distribution
                </h3>
                <div className="space-y-3">
                  {diseaseStats.map((stat) => (
                    <div key={stat.disease} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">{stat.disease}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-cyan-500"
                            style={{ width: `${stat.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-900">
                          {stat.count} ({stat.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-semibold text-slate-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Images:</span>
                    <span className="font-semibold">{storedImages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Normal Cases:</span>
                    <span className="font-semibold text-green-600">
                      {storedImages.filter(img => img.disease === 'Normal').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Abnormal Cases:</span>
                    <span className="font-semibold text-orange-600">
                      {storedImages.filter(img => img.disease !== 'Normal').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-semibold text-gray-700">Filter by Disease:</label>
              <select 
                value={selectedDisease}
                onChange={(e) => setSelectedDisease(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {diseases.map(disease => (
                  <option key={disease} value={disease}>
                    {disease === 'all' ? 'All Diseases' : disease}
                  </option>
                ))}
              </select>
            </div>
            
            {storedImages.length > 0 && (
              <button
                onClick={clearAllData}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Data</span>
              </button>
            )}
          </div>
        </div>

        {filteredImages.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Images Stored</h3>
            <p className="text-gray-600">
              {selectedDisease === 'all' 
                ? "Analyze images in the Demo page to see them stored here automatically."
                : `No images found for ${selectedDisease}.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div key={image.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="relative group">
                  <img 
                    src={getSafeImageUrl(image.imageUrl)} 
                    alt={image.fileName}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      image.disease === 'Normal' ? 'bg-green-100 text-green-800' :
                      image.disease === 'Corneal Ulcer' ? 'bg-red-100 text-red-800' :
                      image.disease === 'Pterygium' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {image.disease}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 truncate">{image.fileName}</h3>
                      <p className="text-sm text-gray-600">{image.confidence.toFixed(2)}% confidence</p>
                    </div>
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-3">
                    Analyzed: {new Date(image.timestamp).toLocaleString()}
                  </p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadImage(image)}
                      className="flex-1 flex items-center justify-center space-x-1 bg-cyan-100 hover:bg-cyan-200 text-cyan-700 px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Image</span>
                    </button>
                    <button
                      onClick={() => downloadReport(image)}
                      className="flex-1 flex items-center justify-center space-x-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      <FileImage className="w-4 h-4" />
                      <span>Download Report</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900">{selectedImage.fileName}</h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={getSafeImageUrl(selectedImage.imageUrl)} 
                    alt={selectedImage.fileName}
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Diagnosis Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Disease:</span>
                        <span className="font-semibold">{selectedImage.disease}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confidence:</span>
                        <span className="font-semibold">{selectedImage.confidence.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold">{new Date(selectedImage.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadImage(selectedImage)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Image</span>
                    </button>
                    <button
                      onClick={() => downloadReport(selectedImage)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <FileImage className="w-4 h-4" />
                      <span>Download Report</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}