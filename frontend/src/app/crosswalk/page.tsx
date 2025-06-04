'use client'

import { useState, useEffect } from 'react'
import { getExampleCoordinates } from '@/lib/api'
import { AxisCoordinate, createEmptyCoordinate, coordinateToNuremberg } from '../../lib/types'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, GitBranch, Sparkles, Network, Zap, ArrowRight, MapPin, Gauge, Brain, Target, Route, TrendingUp } from "lucide-react"

export default function CrosswalkPage() {
  const [sourceCoordinate, setSourceCoordinate] = useState<AxisCoordinate>(createEmptyCoordinate())
  const [targetCoordinate, setTargetCoordinate] = useState<AxisCoordinate>(createEmptyCoordinate())
  const [crosswalkResult, setCrosswalkResult] = useState<CrosswalkResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [examples, setExamples] = useState<AxisCoordinate[]>([])
  const [selectedMapping, setSelectedMapping] = useState<string>('pillar_to_sector')
  const [hoveredMapping, setHoveredMapping] = useState<string | null>(null)

  interface CrosswalkResult {
    source_axis: string
    target_axis: string
    mappings: Array<{
      source_value: string
      target_values: string[]
      confidence: number
      reasoning: string
    }>
    traversal_path: string[]
    related_coordinates: AxisCoordinate[]
  }

  useEffect(() => {
    const loadExamples = async () => {
      try {
        const exampleCoords = await getExampleCoordinates()
        setExamples(exampleCoords)
        if (exampleCoords.length > 0) {
          setSourceCoordinate(exampleCoords[0])
        }
        if (exampleCoords.length > 1) {
          setTargetCoordinate(exampleCoords[1])
        }
      } catch (error) {
        console.error('Failed to load examples:', error)
      }
    }
    loadExamples()
  }, [])

  const predefinedMappings = [
    { 
      key: 'pillar_to_sector', 
      label: 'Pillar → Sector', 
      description: 'Map knowledge domains to industry sectors',
      gradient: 'from-blue-500 to-cyan-500',
      icon: Brain
    },
    { 
      key: 'sector_to_regulatory', 
      label: 'Sector → Regulatory', 
      description: 'Industry sectors to regulatory frameworks',
      gradient: 'from-green-500 to-emerald-500',
      icon: Target
    },
    { 
      key: 'regulatory_to_compliance', 
      label: 'Regulatory → Compliance', 
      description: 'Regulatory frameworks to compliance standards',
      gradient: 'from-purple-500 to-violet-500',
      icon: Gauge
    },
    { 
      key: 'role_knowledge_to_sector', 
      label: 'Knowledge Role → Sector', 
      description: 'Knowledge roles to applicable sectors',
      gradient: 'from-orange-500 to-red-500',
      icon: Network
    },
    { 
      key: 'location_to_regulatory', 
      label: 'Location → Regulatory', 
      description: 'Geographic regions to regulatory jurisdictions',
      gradient: 'from-teal-500 to-blue-500',
      icon: MapPin
    },
    { 
      key: 'temporal_to_compliance', 
      label: 'Temporal → Compliance', 
      description: 'Time windows to compliance versions',
      gradient: 'from-pink-500 to-rose-500',
      icon: TrendingUp
    }
  ]

  const handleCrosswalk = async () => {
    setLoading(true)
    
    // Simulate crosswalk analysis
    setTimeout(() => {
      const mockResult: CrosswalkResult = {
        source_axis: selectedMapping.split('_to_')[0],
        target_axis: selectedMapping.split('_to_')[1],
        mappings: [
          {
            source_value: sourceCoordinate.pillar || 'PL09.3.2',
            target_values: ['5415', '5416', '5417'],
            confidence: 0.89,
            reasoning: 'Healthcare knowledge pillar strongly correlates with healthcare sectors'
          },
          {
            source_value: sourceCoordinate.sector?.toString() || '5415',
            target_values: ['HIPAA-164', 'HITECH-13400', 'FDA-21CFR11'],
            confidence: 0.94,
            reasoning: 'Healthcare services sector directly regulated by HIPAA and related frameworks'
          }
        ],
        traversal_path: ['pillar', 'sector', 'regulatory', 'compliance'],
        related_coordinates: examples.slice(0, 3)
      }
      setCrosswalkResult(mockResult)
      setLoading(false)
    }, 1500)
  }

  const loadExample = (example: AxisCoordinate, isTarget = false) => {
    if (isTarget) {
      setTargetCoordinate(example)
    } else {
      setSourceCoordinate(example)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-purple-950/30">
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-green-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>

      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-12 text-center max-w-4xl mx-auto">
          <div className="mb-6">
            <Badge className="mb-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-800/50 backdrop-blur-sm">
              <GitBranch className="w-3 h-3 mr-1" />
              Cross-Dimensional Analysis
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-indigo-800 to-purple-800 dark:from-slate-100 dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                Axis Crosswalk
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Mapping Engine
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Discover sophisticated relationships across the 13-dimensional knowledge graph. Map knowledge domains 
              to sectors, sectors to regulatory frameworks, and explore the intricate traversal paths that connect 
              different dimensional spaces.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="xl:col-span-2 space-y-6">
            {/* Mapping Type Selection */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-lg opacity-50"></div>
              <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-800/20 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <Route className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Crosswalk Configuration</CardTitle>
                      <CardDescription>Select mapping type and dimensional traversal</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Mapping Type</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {predefinedMappings.map(mapping => {
                          const IconComponent = mapping.icon
                          return (
                            <div 
                              key={mapping.key}
                              className={`group relative p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                                selectedMapping === mapping.key 
                                  ? 'border-transparent bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90 shadow-xl' 
                                  : 'border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80'
                              }`}
                              onClick={() => setSelectedMapping(mapping.key)}
                              onMouseEnter={() => setHoveredMapping(mapping.key)}
                              onMouseLeave={() => setHoveredMapping(null)}
                            >
                              {selectedMapping === mapping.key && (
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur opacity-50"></div>
                              )}
                              <div className="relative">
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white bg-gradient-to-r ${mapping.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                                    <IconComponent className="w-4 h-4" />
                                  </div>
                                  <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                                    {mapping.label}
                                  </div>
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                  {mapping.description}
                                </div>
                                {hoveredMapping === mapping.key && (
                                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl"></div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coordinate Input Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Source Coordinate */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 rounded-2xl blur-lg opacity-30"></div>
                <Card className="relative h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-800/20 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg">
                        S
                      </div>
                      <div>
                        <CardTitle className="text-lg">Source Coordinate</CardTitle>
                        <CardDescription>Starting point for crosswalk analysis</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Pillar</label>
                        <input
                          type="text"
                          value={sourceCoordinate.pillar}
                          onChange={(e) => setSourceCoordinate(prev => ({ ...prev, pillar: e.target.value }))}
                          placeholder="PL09.3.2"
                          className="w-full px-3 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm shadow-sm hover:shadow-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Sector</label>
                        <input
                          type="text"
                          value={sourceCoordinate.sector}
                          onChange={(e) => setSourceCoordinate(prev => ({ ...prev, sector: e.target.value }))}
                          placeholder="5415"
                          className="w-full px-3 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm shadow-sm hover:shadow-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Regulatory</label>
                        <input
                          type="text"
                          value={sourceCoordinate.regulatory || ''}
                          onChange={(e) => setSourceCoordinate(prev => ({ ...prev, regulatory: e.target.value || undefined }))}
                          placeholder="HIPAA-164"
                          className="w-full px-3 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm shadow-sm hover:shadow-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Location</label>
                        <input
                          type="text"
                          value={sourceCoordinate.location || ''}
                          onChange={(e) => setSourceCoordinate(prev => ({ ...prev, location: e.target.value || undefined }))}
                          placeholder="US-CA"
                          className="w-full px-3 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm shadow-sm hover:shadow-md"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Target Coordinate */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-teal-500/20 rounded-2xl blur-lg opacity-30"></div>
                <Card className="relative h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-800/20 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg">
                        T
                      </div>
                      <div>
                        <CardTitle className="text-lg">Target Coordinate</CardTitle>
                        <CardDescription>Comparison point for crosswalk analysis</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Pillar</label>
                        <input
                          type="text"
                          value={targetCoordinate.pillar}
                          onChange={(e) => setTargetCoordinate(prev => ({ ...prev, pillar: e.target.value }))}
                          placeholder="PL10.2.1"
                          className="w-full px-3 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-green-200/50 dark:border-green-800/50 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all text-sm shadow-sm hover:shadow-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Sector</label>
                        <input
                          type="text"
                          value={targetCoordinate.sector}
                          onChange={(e) => setTargetCoordinate(prev => ({ ...prev, sector: e.target.value }))}
                          placeholder="5412"
                          className="w-full px-3 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-green-200/50 dark:border-green-800/50 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all text-sm shadow-sm hover:shadow-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Regulatory</label>
                        <input
                          type="text"
                          value={targetCoordinate.regulatory || ''}
                          onChange={(e) => setTargetCoordinate(prev => ({ ...prev, regulatory: e.target.value || undefined }))}
                          placeholder="SOX-302"
                          className="w-full px-3 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-green-200/50 dark:border-green-800/50 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all text-sm shadow-sm hover:shadow-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Location</label>
                        <input
                          type="text"
                          value={targetCoordinate.location || ''}
                          onChange={(e) => setTargetCoordinate(prev => ({ ...prev, location: e.target.value || undefined }))}
                          placeholder="US-NY"
                          className="w-full px-3 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-green-200/50 dark:border-green-800/50 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all text-sm shadow-sm hover:shadow-md"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Premium Action Button */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-xl opacity-50"></div>
              <Button 
                onClick={handleCrosswalk} 
                disabled={loading || !sourceCoordinate.pillar}
                className="relative w-full group bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 shadow-2xl hover:shadow-indigo-500/25 transition-all duration-500 px-8 py-4 text-lg font-semibold rounded-2xl"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Analyzing Crosswalks...</span>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse delay-200"></div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Analyze {selectedMapping.replace('_to_', ' → ').replace('_', ' ')}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {crosswalkResult && (
              <>
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-2xl blur-lg opacity-50"></div>
                  <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-800/20 shadow-2xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Network className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                              Crosswalk Analysis
                              <Badge className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 dark:text-green-300 border-green-200/50 dark:border-green-800/50">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Complete
                              </Badge>
                            </CardTitle>
                            <CardDescription>
                              {crosswalkResult.source_axis} → {crosswalkResult.target_axis}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Traversal Path</p>
                          <div className="flex flex-wrap gap-2">
                            {crosswalkResult.traversal_path.map((axis, idx) => (
                              <div key={idx} className="flex items-center">
                                <Badge className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 border-0 shadow-sm">
                                  {axis}
                                </Badge>
                                {idx < crosswalkResult.traversal_path.length - 1 && (
                                  <ArrowRight className="mx-2 w-4 h-4 text-slate-400" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {crosswalkResult.mappings.map((mapping, idx) => (
                          <div key={idx} className="group p-4 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-100/50 dark:border-blue-900/50 hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-between items-start mb-3">
                              <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{mapping.source_value}</div>
                              <Badge className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 dark:text-green-300 border-green-200/50 dark:border-green-800/50">
                                {(mapping.confidence * 100).toFixed(0)}%
                              </Badge>
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400 mb-3 font-mono">
                              → {mapping.target_values.join(', ')}
                            </div>
                            <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 p-3 rounded-lg">
                              {mapping.reasoning}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 rounded-2xl blur-lg opacity-30"></div>
                  <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-800/20 shadow-xl">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                          <GitBranch className="w-4 h-4" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Related Coordinates</CardTitle>
                          <CardDescription>Similar coordinates in the knowledge graph</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {crosswalkResult.related_coordinates.map((coord, index) => (
                          <div key={index} className="group p-3 bg-gradient-to-r from-slate-50/50 to-purple-50/50 dark:from-slate-800/50 dark:to-purple-900/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 transition-all duration-300 hover:shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">Related {index + 1}</span>
                              <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border-purple-200/50 dark:border-purple-800/50">
                                {coord.pillar}
                              </Badge>
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-slate-100/70 dark:bg-slate-800/70 p-2 rounded-lg truncate">
                              {coordinateToNuremberg(coord)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {/* Example Coordinates */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-2xl blur-lg opacity-30"></div>
              <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-800/20 shadow-xl">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Example Coordinates</CardTitle>
                      <CardDescription>Click to load as source or target</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {examples.map((example, index) => (
                      <div key={index} className="group p-3 bg-gradient-to-r from-slate-50/50 to-cyan-50/50 dark:from-slate-800/50 dark:to-cyan-900/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">Example {index + 1}</span>
                          <Badge className="bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200/50 dark:border-cyan-800/50">
                            {example.pillar}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-slate-100/70 dark:bg-slate-800/70 p-2 rounded-lg truncate mb-3">
                          {coordinateToNuremberg(example)}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => loadExample(example, false)}
                            className="flex-1 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all"
                          >
                            As Source
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => loadExample(example, true)}
                            className="flex-1 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-green-200/50 dark:border-green-800/50 hover:bg-green-50 dark:hover:bg-green-900/50 transition-all"
                          >
                            As Target
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Crosswalk Info */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-30"></div>
              <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-800/20 shadow-xl">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                      <Route className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Crosswalk Intelligence</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <strong className="text-slate-900 dark:text-slate-100">Available Mappings:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {predefinedMappings.map(mapping => (
                          <Badge key={mapping.key} className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 border-0 shadow-sm text-xs">
                            {mapping.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20 p-3 rounded-lg">
                      Crosswalk analysis identifies sophisticated relationships and traversal paths between different axes in the knowledge graph, 
                      enabling intelligent mapping across dimensional boundaries.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 