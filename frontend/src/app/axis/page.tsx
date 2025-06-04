'use client'

import { useState, useEffect } from 'react'
import { fetchAxes } from '@/lib/api'
import { AxisMetadata } from '../../lib/types'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Sparkles, Zap, Brain, Globe, ArrowRight, Filter, Grid3X3, BarChart3 } from "lucide-react"
import Link from 'next/link'

export default function AxisExplorerPage() {
  const [axes, setAxes] = useState<AxisMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    const loadAxes = async () => {
      try {
        setLoading(true)
        const axisData = await fetchAxes()
        setAxes(axisData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load axes')
      } finally {
        setLoading(false)
      }
    }

    loadAxes()
  }, [])

  const filteredAxes = axes.filter(axis => 
    axis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    axis.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    axis.key.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/30">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div className="relative flex flex-col items-center justify-center min-h-screen">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-blue-600/20"></div>
                </div>
                <div>
                  <p className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    Loading 13-Axis System
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Initializing dimensional framework...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50/30 to-orange-50/50 dark:from-red-950/20 dark:via-rose-950/10 dark:to-orange-950/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 via-rose-500/20 to-orange-500/20 rounded-full blur-xl"></div>
              <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-red-200/50 dark:border-red-800/50 shadow-2xl">
                <Zap className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">System Error</h1>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{error}</p>
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white border-0 shadow-lg hover:shadow-red-500/25"
                >
                  Retry Connection
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/30">
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center max-w-4xl mx-auto">
          <div className="mb-6">
            <Badge className="mb-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              Neural Architecture
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                Universal Knowledge
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                Graph System
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Navigate the multidimensional coordinate framework powering next-generation AI reasoning, 
              regulatory simulation, and adaptive persona alignment through our sophisticated 13-axis architecture.
            </p>
          </div>
          
          {/* Enhanced Search Bar */}
          <div className="relative mb-8 max-w-2xl mx-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-teal-500/50 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-800/20 shadow-2xl">
              <div className="flex items-center p-4">
                <Search className="h-5 w-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search axes by name, description, or key..."
                  className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Filter className="h-5 w-5 text-slate-400 ml-3" />
              </div>
            </div>
          </div>

          {/* Premium Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link href="/coordinate">
              <Button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 px-6 py-3 text-base">
                <Brain className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Create Coordinate
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link href="/simulation">
              <Button variant="outline" className="group bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-900/80 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-base">
                <Zap className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Run Simulation
              </Button>
            </Link>
            <Link href="/math">
              <Button variant="outline" className="group bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-900/80 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-base">
                <BarChart3 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Math Playground
              </Button>
            </Link>
          </div>
        </div>

        {/* Premium Axis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredAxes.map((axis) => (
            <div
              key={axis.key}
              className="group relative"
              onMouseEnter={() => setHoveredCard(axis.key)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Gradient glow effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-2xl blur-lg transition-opacity duration-500 ${
                hoveredCard === axis.key ? 'opacity-100' : 'opacity-0'
              }`}></div>
              
              <Card className="relative h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-800/20 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        {axis.index}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                          {axis.name}
                        </CardTitle>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 border-0 shadow-sm">
                      {axis.key}
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {axis.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-3">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Data Type</p>
                    <Badge variant="outline" className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                      {axis.data_type}
                    </Badge>
                  </div>
                  
                  {axis.formula && (
                    <div className="bg-gradient-to-r from-green-50/50 to-teal-50/50 dark:from-green-950/20 dark:to-teal-950/20 rounded-xl p-3">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Formula</p>
                      <code className="block text-sm bg-slate-100/70 dark:bg-slate-800/70 backdrop-blur-sm px-3 py-2 rounded-lg text-slate-800 dark:text-slate-200 font-mono">
                        {axis.formula}
                      </code>
                    </div>
                  )}
                  
                  {axis.examples.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Examples</p>
                      <div className="flex flex-wrap gap-2">
                        {axis.examples.slice(0, 3).map((example, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="text-xs bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/70 transition-colors"
                          >
                            {example}
                          </Badge>
                        ))}
                        {axis.examples.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-200/50 dark:border-blue-800/50 text-blue-700 dark:text-blue-300">
                            +{axis.examples.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Link href={`/axis/${axis.key}`}>
                      <Button 
                        variant="ghost" 
                        className="w-full group/btn bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-800/50 dark:to-blue-900/50 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300"
                      >
                        <Globe className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                        Explore Axis
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {filteredAxes.length === 0 && searchTerm && (
          <div className="text-center py-16">
            <div className="relative max-w-md mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-slate-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-xl"></div>
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-white/20 dark:border-slate-800/20 shadow-xl">
                <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                 <p className="text-slate-600 dark:text-slate-400 text-lg">
                   No axes found matching <span className="font-semibold text-slate-900 dark:text-slate-100">&quot;{searchTerm}&quot;</span>
                 </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">Try adjusting your search terms</p>
              </div>
            </div>
          </div>
        )}

        {/* Premium System Overview */}
        <div className="mt-16">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 dark:border-slate-800/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
                    System Architecture
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">Comprehensive dimensional analysis framework</p>
                </div>
                <Grid3X3 className="w-8 h-8 text-blue-500" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="group text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-100/50 dark:border-blue-900/50 hover:shadow-lg transition-all duration-300">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Total Axes</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    {axes.length}
                  </p>
                </div>
                <div className="group text-center p-4 rounded-2xl bg-gradient-to-br from-green-50/50 to-teal-50/50 dark:from-green-950/20 dark:to-teal-950/20 border border-green-100/50 dark:border-green-900/50 hover:shadow-lg transition-all duration-300">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Core Architecture</p>
                  <p className="text-lg font-medium text-green-700 dark:text-green-300 group-hover:scale-110 transition-transform">Axes 1-2</p>
                </div>
                <div className="group text-center p-4 rounded-2xl bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-100/50 dark:border-orange-900/50 hover:shadow-lg transition-all duration-300">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Hierarchical Systems</p>
                  <p className="text-lg font-medium text-orange-700 dark:text-orange-300 group-hover:scale-110 transition-transform">Axes 3-5</p>
                </div>
                <div className="group text-center p-4 rounded-2xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-100/50 dark:border-purple-900/50 hover:shadow-lg transition-all duration-300">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Role Dimensions</p>
                  <p className="text-lg font-medium text-purple-700 dark:text-purple-300 group-hover:scale-110 transition-transform">Axes 8-11</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}