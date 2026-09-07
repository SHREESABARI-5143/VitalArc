import { Eye, ArrowRight, Shield, Zap, Users } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center justify-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-6 py-2 text-cyan-400 text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>AI-Powered Eye Disease Detection</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              Early Detection,
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Better Vision
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-gray-300 leading-relaxed">
              Leveraging deep learning to detect retinal diseases with unprecedented accuracy.
              Bringing advanced diagnostic capabilities to underserved communities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button
                onClick={() => onNavigate('demo')}
                className="group flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
              >
                <span>Try Demo</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 border border-slate-700"
              >
                <span>Learn More</span>
              </button>
            </div>
          </div>

          <div className="mt-24 grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300">
              <div className="bg-cyan-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Advanced Detection</h3>
              <p className="text-gray-400 leading-relaxed">
                State-of-the-art deep learning models trained on thousands of retinal images for accurate disease identification.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300">
              <div className="bg-cyan-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Early Intervention</h3>
              <p className="text-gray-400 leading-relaxed">
                Detect diseases at their earliest stages, enabling timely treatment and preventing vision loss.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300">
              <div className="bg-cyan-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Accessible Healthcare</h3>
              <p className="text-gray-400 leading-relaxed">
                Bringing expert-level diagnostics to rural and underserved areas where ophthalmologists are scarce.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-cyan-400 mb-2">95%+</div>
              <div className="text-gray-400">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-400 mb-2">10K+</div>
              <div className="text-gray-400">Images Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-400 mb-2">5</div>
              <div className="text-gray-400">Disease Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-400 mb-2">&lt;2s</div>
              <div className="text-gray-400">Analysis Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
