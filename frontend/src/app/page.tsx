import Link from 'next/link'
import { Sparkles, Brain, Zap, Globe, ArrowRight, BarChart3, Layers, Network, Shield, TrendingUp, Activity } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/30 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-[32rem] h-[32rem] bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

      <div className="relative container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="relative inline-block mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-2xl blur-lg"></div>
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20 dark:border-slate-800/20 shadow-xl">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent font-semibold">
                  Next-Generation Intelligence Framework
                </span>
                <Sparkles className="w-5 h-5 text-purple-600 animate-pulse delay-500" />
              </div>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
              Universal Knowledge
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              Graph System
            </span>
            <div className="relative inline-block ml-4">
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                13D
              </span>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-ping"></div>
            </div>
          </h1>
          
          <p className="text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            A revolutionary multidimensional coordinate framework powering advanced AI reasoning, 
            sophisticated regulatory simulation, and adaptive role/persona alignment across 
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 13 orthogonal dimensions</span>.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <Link href="/axis">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-3">
                  <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-semibold">Explore Axes</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            <Link href="/coordinate">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-600 via-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/20 px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-slate-100 dark:to-blue-300 bg-clip-text text-transparent">Create Coordinate</span>
                  <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 13 Axes Overview Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-4">
              13 Knowledge Dimensions
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Navigate the complete spectrum of human knowledge through our sophisticated dimensional framework
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {axisOverview.map((axis, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 dark:border-slate-800/20 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg mr-4 group-hover:scale-110 transition-transform">
                      {axis.index}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                        {axis.name}
                      </h3>
                      <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400">
                        {axis.type}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{axis.description}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: BarChart3,
              title: "Mathematical Engine",
              description: "Advanced computation of MCW, entropy, USI, temporal deltas, and multi-dimensional coordinate similarity across all 13 axes with precision analytics.",
              link: "/math",
              color: "blue",
              gradient: "from-blue-500 to-purple-500"
            },
            {
              icon: Zap,
              title: "AI Simulation",
              description: "Sophisticated role-based persona expansion, dynamic crosswalk mapping, and comprehensive regulatory compliance simulation with real-time analysis.",
              link: "/simulation",
              color: "green", 
              gradient: "from-green-500 to-teal-500"
            },
            {
              icon: Network,
              title: "Crosswalk Mapping",
              description: "Intelligent axis traversal, regulatory framework integration, and multi-domain knowledge connections with adaptive routing algorithms.",
              link: "/crosswalk",
              color: "purple",
              gradient: "from-purple-500 to-pink-500"
            }
          ].map((feature, index) => (
            <div key={index} className="group relative">
              <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
              <div className="relative h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-slate-800/20 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <Link href={feature.link}>
                  <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-50 to-${feature.color}-50 dark:from-slate-800 dark:to-${feature.color}-900/30 border border-${feature.color}-200/50 dark:border-${feature.color}-800/50 rounded-xl hover:shadow-lg transition-all duration-300 group/btn`}>
                    <span className={`font-semibold text-${feature.color}-700 dark:text-${feature.color}-300 mr-2`}>
                      Explore {feature.title.split(' ')[0]}
                    </span>
                    <ArrowRight className={`w-4 h-4 text-${feature.color}-700 dark:text-${feature.color}-300 group-hover/btn:translate-x-1 transition-transform`} />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Premium System Status */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 dark:border-slate-800/20 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  System Intelligence
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Real-time framework analytics and operational metrics</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">ACTIVE</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Layers, value: "13", label: "Total Axes", color: "blue", description: "Dimensional framework" },
                { icon: Activity, value: "10", label: "Math Operations", color: "green", description: "Computational functions" },
                { icon: TrendingUp, value: "∞", label: "Possible Coordinates", color: "purple", description: "Infinite combinations" },
                { icon: Shield, value: "API", label: "System Status", color: "orange", description: "Fully operational" }
              ].map((stat, index) => (
                <div key={index} className="group text-center p-6 rounded-2xl bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-4xl font-bold bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{stat.label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-500">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const axisOverview = [
  { index: 1, name: "Pillar", description: "Human knowledge architecture foundation (PLxx.x.x)", type: "String" },
  { index: 2, name: "Sector", description: "Industry/domain classification codes (NAICS, etc.)", type: "String/Int" },
  { index: 3, name: "Honeycomb", description: "Dynamic crosslinks/pairings between axes", type: "Array" },
  { index: 4, name: "Branch", description: "Disciplinary hierarchy/taxonomy structure", type: "String" },
  { index: 5, name: "Node", description: "Cross-sector convergence overlay points", type: "String" },
  { index: 6, name: "Regulatory", description: "Regulatory framework overlays (CFR/GDPR/HIPAA)", type: "String" },
  { index: 7, name: "Compliance", description: "Standards/compliance overlay systems", type: "String" },
  { index: 8, name: "Role Knowledge", description: "Knowledge domain role/persona definition", type: "String" },
  { index: 9, name: "Role Sector", description: "Industry alignment persona mapping", type: "String" },
  { index: 10, name: "Role Regulatory", description: "Regulatory/compliance persona framework", type: "String" },
  { index: 11, name: "Role Compliance", description: "Compliance expert/USI role definition", type: "String" },
  { index: 12, name: "Location", description: "Geospatial/regional anchor coordinates", type: "String" },
  { index: 13, name: "Temporal", description: "Time/version window specifications (ISO8601)", type: "String" }
]
