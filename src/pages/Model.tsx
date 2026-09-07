import { Cpu, Database, Layers, Code2, BookOpen, Zap } from 'lucide-react';

export default function Model() {
  const technologies = [
    {
      name: 'TensorFlow & Keras',
      description: 'Primary deep learning framework for model development and training',
      icon: Layers
    },
    {
      name: 'Python',
      description: 'Core programming language for data processing and model implementation',
      icon: Code2
    },
    {
      name: 'OpenCV',
      description: 'Image preprocessing and computer vision operations',
      icon: BookOpen
    },
    {
      name: 'NumPy & Pandas',
      description: 'Data manipulation and numerical computations',
      icon: Database
    }
  ];

  const modelFeatures = [
    {
      title: 'Transfer Learning',
      description: 'Leveraging pre-trained ImageNet weights to accelerate training and improve accuracy with limited medical imaging data.',
      icon: Zap
    },
    {
      title: 'Data Augmentation',
      description: 'Rotation, flipping, zooming, and color adjustments to increase dataset diversity and model robustness.',
      icon: Database
    },
    {
      title: 'Fine-tuning',
      description: 'Gradual unfreezing of layers to adapt the pre-trained network to retinal disease classification.',
      icon: Layers
    },
    {
      title: 'Ensemble Methods',
      description: 'Combining predictions from multiple models to improve overall accuracy and reduce false positives.',
      icon: Cpu
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6">Model & Technology</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Deep learning architecture and technical implementation powering accurate retinal disease detection.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Model Architecture</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">ResNet50 with Transfer Learning</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our model is built on ResNet50 (Residual Network with 50 layers), a proven architecture that has
                achieved state-of-the-art performance in image classification tasks. We employ transfer learning
                by starting with weights pre-trained on ImageNet, then fine-tuning the network on our curated
                retinal image dataset.
              </p>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="font-semibold text-slate-900 mb-2">Input Layer</div>
                  <div className="text-gray-600 text-sm">224×224×3 RGB retinal images</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="font-semibold text-slate-900 mb-2">Feature Extraction</div>
                  <div className="text-gray-600 text-sm">50 convolutional layers with skip connections</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="font-semibold text-slate-900 mb-2">Classification Head</div>
                  <div className="text-gray-600 text-sm">Fully connected layers + Softmax activation</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="font-semibold text-slate-900 mb-2">Output Layer</div>
                  <div className="text-gray-600 text-sm">5 disease classes + normal category</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-cyan-600 font-semibold mb-2">Total Parameters</div>
                  <div className="text-3xl font-bold text-slate-900">25.6M</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-cyan-600 font-semibold mb-2">Trainable Parameters</div>
                  <div className="text-3xl font-bold text-slate-900">8.2M</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-cyan-600 font-semibold mb-2">Training Time</div>
                  <div className="text-3xl font-bold text-slate-900">~12 hours</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-cyan-600 font-semibold mb-2">Inference Time</div>
                  <div className="text-3xl font-bold text-slate-900">&lt;1 second</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Key Techniques</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {modelFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 hover:border-cyan-500 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="bg-cyan-100 p-3 rounded-lg">
                    <feature.icon className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-12 mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Dataset & Training</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">2500+</div>
              <div className="text-slate-900 font-semibold mb-2">Training Images</div>
              <div className="text-sm text-gray-600">Diverse retinal images from multiple sources</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">600+</div>
              <div className="text-slate-900 font-semibold mb-2">Validation Images</div>
              <div className="text-sm text-gray-600">Used for hyperparameter tuning</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">600+</div>
              <div className="text-slate-900 font-semibold mb-2">Test Images</div>
              <div className="text-sm text-gray-600">Independent evaluation set</div>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Preprocessing Pipeline</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2"></div>
                <span className="text-gray-700"><strong>Image Resizing:</strong> Standardized to 224×224 pixels for network input</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2"></div>
                <span className="text-gray-700"><strong>Normalization:</strong> Pixel values scaled to [0,1] range using ImageNet statistics</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2"></div>
                <span className="text-gray-700"><strong>Augmentation:</strong> Random rotations (±15°), horizontal flips, brightness adjustments (±20%)</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2"></div>
                <span className="text-gray-700"><strong>Class Balancing:</strong> Weighted sampling to handle imbalanced disease distribution</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Technology Stack</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <tech.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{tech.name}</h3>
                <p className="text-sm text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-6">Training Configuration</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">Hyperparameters</h3>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-gray-300">Optimizer</span>
                  <span className="font-semibold">Adam</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-300">Learning Rate</span>
                  <span className="font-semibold">0.0001</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-300">Batch Size</span>
                  <span className="font-semibold">32</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-300">Epochs</span>
                  <span className="font-semibold">50</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">Regularization</h3>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-gray-300">Dropout Rate</span>
                  <span className="font-semibold">0.5</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-300">L2 Regularization</span>
                  <span className="font-semibold">0.0001</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-300">Early Stopping</span>
                  <span className="font-semibold">Patience: 10</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-300">Loss Function</span>
                  <span className="font-semibold">Categorical Crossentropy</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
