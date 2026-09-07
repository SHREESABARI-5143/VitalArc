import { Target, Heart, TrendingUp, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6">About RetinaScan AI</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Revolutionizing eye care through artificial intelligence and making advanced diagnostics accessible to everyone.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">The Challenge</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Eye diseases such as diabetic retinopathy, glaucoma, and macular degeneration affect millions worldwide.
              Early detection is crucial for preventing irreversible vision loss, yet many communities lack access to
              specialized ophthalmological care.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              In rural and underserved areas, patients often travel hundreds of miles for basic eye examinations.
              By the time symptoms become noticeable, significant damage may have already occurred.
            </p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-12 text-white">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold">285M+</div>
                  <div className="text-cyan-100">People with vision impairment globally</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold">80%</div>
                  <div className="text-cyan-100">Of vision loss is preventable with early detection</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-12 mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Our Solution</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-4xl mx-auto">
            RetinaScan AI leverages cutting-edge deep learning technology to analyze retinal images and detect
            multiple eye diseases with accuracy comparable to expert ophthalmologists. Our system provides
            instant, reliable diagnostics that can be deployed in clinics, rural health centers, and telemedicine
            platforms.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <Target className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Accurate</h3>
              <p className="text-gray-600 text-sm">95%+ accuracy across multiple disease categories</p>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <Heart className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Fast</h3>
              <p className="text-gray-600 text-sm">Results in under 2 seconds per image</p>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <Globe className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Accessible</h3>
              <p className="text-gray-600 text-sm">Deployable in any clinic with basic equipment</p>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <TrendingUp className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Scalable</h3>
              <p className="text-gray-600 text-sm">Can screen thousands of patients efficiently</p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Project Objectives</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="bg-cyan-100 text-cyan-700 rounded-lg w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Develop High-Accuracy Detection Models</h3>
                  <p className="text-gray-700">
                    Create and train deep learning models capable of identifying multiple retinal diseases with accuracy
                    comparable to or exceeding human specialists.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="bg-cyan-100 text-cyan-700 rounded-lg w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Enable Early Disease Detection</h3>
                  <p className="text-gray-700">
                    Identify eye diseases at their earliest stages, when treatment is most effective and vision loss
                    can be prevented.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="bg-cyan-100 text-cyan-700 rounded-lg w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Improve Healthcare Access</h3>
                  <p className="text-gray-700">
                    Bridge the gap in eye care availability by providing AI-powered diagnostics to rural and underserved
                    communities lacking specialist access.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="bg-cyan-100 text-cyan-700 rounded-lg w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Reduce Healthcare Costs</h3>
                  <p className="text-gray-700">
                    Lower the economic burden on healthcare systems by enabling efficient mass screening and reducing
                    the need for expensive specialist consultations for routine cases.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-6">Real-World Impact</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              By combining advanced AI technology with practical healthcare delivery, RetinaScan AI has the potential
              to save millions from preventable blindness. Our system empowers general practitioners and healthcare
              workers to provide specialist-level eye care, reducing wait times, travel burdens, and costs for patients.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              This technology represents a significant step toward democratizing healthcare and ensuring that quality
              eye care is not a privilege limited to urban areas, but a right accessible to all.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
