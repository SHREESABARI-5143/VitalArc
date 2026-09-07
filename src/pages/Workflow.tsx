import { Brain, ArrowRight, Shield, Zap, Users, CheckCircle, Upload, Cpu, BarChart3 } from 'lucide-react';

export default function Workflow() {
  const steps = [
    {
      icon: Upload,
      title: 'Image Upload & Validation',
      description: 'Users upload eye images through our secure interface. The system automatically validates image quality and ensures it\'s a genuine eye/retinal image before processing.',
      details: [
        'Smart validation to reject non-eye images (vehicles, faces, objects)',
        'Quality checks: Focus, brightness, and resolution validation',
        'Supported formats: JPEG, PNG, WebP up to 10MB',
        'Real-time preview and instant feedback'
      ],
      color: 'cyan',
      technologies: ['React TypeScript', 'File Validation', 'Image Preview'],
      
    },
    {
      icon: Cpu,
      title: 'AI Preprocessing',
      description: 'Images undergo advanced preprocessing optimized for our deep learning model. This step ensures consistent input quality and enhances detection accuracy.',
      details: [
        'Automatic resizing to 224x224 pixels for model input',
        'Pixel normalization to [0,1] range',
        'Color space optimization for eye feature detection',
        'Noise reduction and contrast enhancement'
      ],
      color: 'blue',
      technologies: ['Python OpenCV', 'NumPy', 'Pillow'],
     
    },
    {
      icon: Brain,
      title: 'AI Disease Detection',
      description: 'Our trained CNN model analyzes the preprocessed image to detect multiple eye conditions simultaneously with high accuracy.',
      details: [
        'Deep Learning CNN architecture with transfer learning',
        'Multi-class classification: Normal, Corneal Ulcer, Pterygium, Conjunctivitis',
        'Real-time inference with TensorFlow backend',
        'Confidence scoring for each detected condition'
      ],
      color: 'cyan',
      technologies: ['TensorFlow/Keras', 'CNN Model', 'Transfer Learning'],
      
    },
    {
      icon: BarChart3,
      title: 'Results & Recommendations',
      description: 'The system generates comprehensive diagnostic reports with actionable insights and medical recommendations for healthcare professionals.',
      details: [
        'Detailed confidence scores for each condition',
        'Color-coded severity indicators and urgency levels',
        'Medical recommendations based on detected conditions',
        'Exportable reports for clinical documentation'
      ],
      color: 'blue',
      technologies: ['Flask API', 'React Components', 'Medical Guidelines'],
      
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'All image processing happens securely with strict data privacy measures. No patient data is stored permanently.',
      stats: 'HIPAA Compliant'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Complete analysis in under 2 seconds. Optimized pipeline for real-time clinical use.',
      stats: '< 2s Processing'
    },
    {
      icon: Users,
      title: 'Clinician-Friendly',
      description: 'Designed with healthcare workflows in mind. Clear results that support clinical decision making.',
      stats: '95% Accuracy'
    }
  ];

  // Color mapping for consistent styling
  const colorMap = {
    cyan: {
      bg: 'bg-cyan-500',
      gradient: 'from-cyan-500 to-cyan-600',
      light: 'bg-cyan-50',
      border: 'border-cyan-200',
      dot: 'bg-cyan-500'
    },
    blue: {
      bg: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      light: 'bg-blue-50',
      border: 'border-blue-200',
      dot: 'bg-blue-500'
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6">AI Workflow</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Our end-to-end AI pipeline transforms eye images into actionable diagnostic insights through four carefully engineered stages.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Process Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How Our AI Detection Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From image upload to clinical insights - our automated pipeline ensures accurate and reliable eye disease detection.
            </p>
          </div>

          {/* Process Steps Visualization */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8 lg:space-x-12">
              {steps.map((step, index) => {
                const color = colorMap[step.color as keyof typeof colorMap];
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`relative ${color.bg} w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-xl mb-4`}>
                      <step.icon className="w-10 h-10" />
                      <div className="absolute -top-2 -right-2 bg-white border-2 border-slate-200 w-8 h-8 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-slate-900">{index + 1}</span>
                      </div>
                    </div>
                    <div className="text-center max-w-[200px]">
                      <h3 className="font-semibold text-slate-900 text-sm mb-2">{step.title}</h3>
                      <div className="flex flex-wrap justify-center gap-1">
                        {step.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden md:block">
                        <ArrowRight className="w-8 h-8 text-slate-400 mx-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Steps */}
        <div className="space-y-8 mb-16">
          {steps.map((step, index) => {
            const color = colorMap[step.color as keyof typeof colorMap];
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="p-8 md:p-10">
                  <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
                    <div className="flex flex-col items-center lg:items-start space-y-4">
                      <div className={`${color.bg} w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                        <step.icon className="w-10 h-10" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                          <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold">
                            Step {index + 1}
                          </span>
                          <h2 className="text-2xl font-bold text-slate-900">{step.title}</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {step.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        {step.description}
                      </p>
                      
                      <div className={`${color.light} rounded-xl p-6 border ${color.border}`}>
                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          Key Features:
                        </h3>
                        <ul className="space-y-3">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full ${color.dot} mt-2 flex-shrink-0`}></div>
                              <span className="text-gray-700">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
              <div className="text-2xl font-bold text-cyan-600">{feature.stats}</div>
            </div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-8 text-center">System Performance</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">&lt;2s</div>
              <div className="text-gray-300 font-semibold mb-2">Processing Time</div>
              <div className="text-sm text-gray-400">From upload to results</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">99.9%</div>
              <div className="text-gray-300 font-semibold mb-2">Uptime</div>
              <div className="text-sm text-gray-400">Reliable clinical performance</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">95%+</div>
              <div className="text-gray-300 font-semibold mb-2">Accuracy</div>
              <div className="text-sm text-gray-400">Across all disease categories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">24/7</div>
              <div className="text-gray-300 font-semibold mb-2">Availability</div>
              <div className="text-sm text-gray-400">Always ready for analysis</div>
            </div>
          </div>
          
          <div className="mt-12 bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Technical Stack</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-4 bg-slate-700 rounded-lg">
                <div className="font-semibold text-cyan-400">Frontend</div>
                <div className="text-gray-300">React + TypeScript + Tailwind</div>
              </div>
              <div className="text-center p-4 bg-slate-700 rounded-lg">
                <div className="font-semibold text-cyan-400">Backend</div>
                <div className="text-gray-300">Python Flask + TensorFlow</div>
              </div>
              <div className="text-center p-4 bg-slate-700 rounded-lg">
                <div className="font-semibold text-cyan-400">AI/ML</div>
                <div className="text-gray-300">CNN + OpenCV + NumPy</div>
              </div>
              <div className="text-center p-4 bg-slate-700 rounded-lg">
                <div className="font-semibold text-cyan-400">Validation</div>
                <div className="text-gray-300">Smart Image Detection</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}