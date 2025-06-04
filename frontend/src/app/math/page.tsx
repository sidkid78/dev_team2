'use client'

import { useState, useEffect } from 'react'
import { getMathOperations, mathPlayground, getExampleCoordinates } from '@/lib/api'
import { AxisCoordinate, MathOperation, MathematicalResult, createEmptyCoordinate, coordinateToNuremberg } from '../../lib/types'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Calculator, Sparkles, Brain, TrendingUp, ArrowRight, Code, Play, Target, Gauge } from "lucide-react"

export default function MathPlaygroundPage() {
  const [operations, setOperations] = useState<string[]>([])
  const [selectedOperation, setSelectedOperation] = useState<MathOperation>('MCW')
  const [coordinate, setCoordinate] = useState<AxisCoordinate>(createEmptyCoordinate())
  const [parameters, setParameters] = useState<string>('{}')
  const [weights, setWeights] = useState<string>('[1.0, 0.9, 0.8]')
  const [result, setResult] = useState<MathematicalResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [examples, setExamples] = useState<AxisCoordinate[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ops, exampleCoords] = await Promise.all([
          getMathOperations(),
          getExampleCoordinates()
        ])
        setOperations(ops)
        setExamples(exampleCoords)
        if (exampleCoords.length > 0) {
          setCoordinate(exampleCoords[0])
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    }
    loadData()
  }, [])

  const handleCalculate = async () => {
    try {
      setLoading(true)
      let parsedParameters: Record<string, unknown> = {}
      let parsedWeights: number[] | undefined

      // Parse parameters
      try {
        if (parameters.trim()) {
          parsedParameters = JSON.parse(parameters)
        }
      } catch (e) {
        console.error('Invalid parameters JSON', e)
        throw new Error('Invalid parameters JSON')
      }

      // Parse weights
      try {
        if (weights.trim()) {
          parsedWeights = JSON.parse(weights)
        }
      } catch (e) {
        console.error('Invalid weights array', e)
        throw new Error('Invalid weights array')
      }

      const mathResult = await mathPlayground(
        selectedOperation,
        coordinate,
        parsedParameters,
        parsedWeights
      )
      setResult(mathResult)
    } catch (error) {
      setResult({
        operation: selectedOperation,
        result: null,
        explanation: error instanceof Error ? error.message : 'Calculation failed',
        metadata: { error: true }
      })
    } finally {
      setLoading(false)
    }
  }

  const loadExample = (example: AxisCoordinate) => {
    setCoordinate(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-fuchsia-50/50 dark:from-slate-950 dark:via-violet-950/20 dark:to-fuchsia-950/30">
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-violet-400/10 to-fuchsia-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-orange-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>

      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="mb-12 text-center max-w-4xl mx-auto">
          <div className="mb-6">
            <Badge className="mb-4 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 text-violet-700 dark:text-violet-300 border-violet-200/50 dark:border-violet-800/50 backdrop-blur-sm">
              <Calculator className="w-3 h-3 mr-1" />
              Mathematical Intelligence
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-violet-800 to-fuchsia-800 dark:from-slate-100 dark:via-violet-200 dark:to-fuchsia-200 bg-clip-text text-transparent">
                Mathematical
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                Playground
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Execute sophisticated mathematical operations on 13-dimensional axis coordinates. Explore MCW calculations, 
              entropy analysis, USI computations, and advanced algorithmic transformations within the knowledge graph space.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            {/* Operation Selection */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-pink-500/20 rounded-3xl blur-lg opacity-50"></div>
              <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-800/20 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Operation Selection</CardTitle>
                      <CardDescription>Choose a mathematical operation to perform</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Mathematical Operation</label>
                      <div className="relative">
                        <select
                          title="Mathematical Operation"
                          value={selectedOperation}
                          onChange={(e) => setSelectedOperation(e.target.value as MathOperation)}
                          className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-violet-200/50 dark:border-violet-800/50 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm shadow-sm hover:shadow-md appearance-none"
                        >
                          {operations.map(op => (
                            <option key={op} value={op}>{op}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <TrendingUp className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Parameters (JSON)</label>
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl blur opacity-20"></div>
                        <Textarea
                          value={parameters}
                          onChange={(e) => setParameters(e.target.value)}
                          placeholder='{"key": "value"}'
                          className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-800/50 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-mono text-sm shadow-sm hover:shadow-md"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Weights (Array)</label>
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-xl blur opacity-20"></div>
                        <input
                          type="text"
                          value={weights}
                          onChange={(e) => setWeights(e.target.value)}
                          placeholder="[1.0, 0.9, 0.8]"
                          className="relative w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-orange-200/50 dark:border-orange-800/50 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all font-mono text-sm shadow-sm hover:shadow-md"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coordinate Input */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 rounded-2xl blur-lg opacity-30"></div>
              <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-800/20 shadow-xl">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Coordinate Input</CardTitle>
                      <CardDescription>Current coordinate for calculation</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Pillar *</label>
                      <input
                        type="text"
                        value={coordinate.pillar}
                        onChange={(e) => setCoordinate(prev => ({ ...prev, pillar: e.target.value }))}
                        placeholder="PL09.3.2"
                        className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm shadow-sm hover:shadow-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Sector *</label>
                      <input
                        type="text"
                        value={coordinate.sector}
                        onChange={(e) => setCoordinate(prev => ({ ...prev, sector: e.target.value }))}
                        placeholder="5415"
                        className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm shadow-sm hover:shadow-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Location</label>
                      <input
                        type="text"
                        value={coordinate.location || ''}
                        onChange={(e) => setCoordinate(prev => ({ ...prev, location: e.target.value || undefined }))}
                        placeholder="US-CA"
                        className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm shadow-sm hover:shadow-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Temporal</label>
                      <input
                        type="text"
                        value={coordinate.temporal || ''}
                        onChange={(e) => setCoordinate(prev => ({ ...prev, temporal: e.target.value || undefined }))}
                        placeholder="2024-01-01T00:00:00Z"
                        className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm shadow-sm hover:shadow-md"
                      />
                    </div>

                    <div className="pt-4">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nuremberg String:</p>
                      <div className="relative">
                        <code className="block text-xs bg-gradient-to-r from-slate-100/80 to-blue-100/80 dark:from-slate-800/80 dark:to-blue-900/80 backdrop-blur-sm p-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 break-all font-mono text-slate-800 dark:text-slate-200">
                          {coordinateToNuremberg(coordinate)}
                        </code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Premium Calculate Button */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/30 via-fuchsia-500/30 to-pink-500/30 rounded-2xl blur-xl opacity-50"></div>
              <Button 
                onClick={handleCalculate} 
                disabled={loading || !coordinate.pillar || !coordinate.sector}
                className="relative w-full group bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 text-white border-0 shadow-2xl hover:shadow-violet-500/25 transition-all duration-500 px-8 py-4 text-lg font-semibold rounded-2xl"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Calculating...</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Calculate {selectedOperation}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {result && (
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-2xl blur-lg opacity-50"></div>
                <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-800/20 shadow-2xl">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Gauge className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          Result: {result.operation}
                          <Badge className={`${result.metadata?.error 
                            ? 'bg-gradient-to-r from-red-500/10 to-rose-500/10 text-red-700 dark:text-red-300 border-red-200/50 dark:border-red-800/50' 
                            : 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 dark:text-green-300 border-green-200/50 dark:border-green-800/50'
                          }`}>
                            <Sparkles className="w-3 h-3 mr-1" />
                            {result.metadata?.error ? "Error" : "Success"}
                          </Badge>
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Result Value</label>
                        <div className="relative">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-20"></div>
                          <pre className="relative bg-gradient-to-r from-slate-100/80 to-blue-100/80 dark:from-slate-800/80 dark:to-blue-900/80 backdrop-blur-sm p-4 rounded-xl text-sm overflow-x-auto border border-slate-200/50 dark:border-slate-700/50 font-mono text-slate-800 dark:text-slate-200">
                            {JSON.stringify(result.result, null, 2)}
                          </pre>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Explanation</label>
                        <div className="relative">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur opacity-20"></div>
                          <p className="relative text-sm text-slate-700 dark:text-slate-300 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/40 dark:to-teal-950/40 backdrop-blur-sm p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 leading-relaxed">
                            {result.explanation}
                          </p>
                        </div>
                      </div>

                      {result.metadata && (
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Metadata</label>
                          <div className="relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-20"></div>
                            <pre className="relative bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-950/40 dark:to-pink-950/40 backdrop-blur-sm p-4 rounded-xl text-xs overflow-x-auto border border-purple-200/50 dark:border-purple-800/50 font-mono text-slate-800 dark:text-slate-200">
                              {JSON.stringify(result.metadata, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Example Coordinates */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-2xl blur-lg opacity-30"></div>
              <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-800/20 shadow-xl">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <Code className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Example Coordinates</CardTitle>
                      <CardDescription>Click to load pre-configured examples</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {examples.map((example, index) => (
                      <div 
                        key={index} 
                        className="group p-4 bg-gradient-to-r from-slate-50/50 to-cyan-50/50 dark:from-slate-800/50 dark:to-cyan-900/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 dark:hover:from-cyan-900/50 dark:hover:to-blue-900/50 transition-all duration-300 hover:shadow-lg" 
                        onClick={() => loadExample(example)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">Example {index + 1}</span>
                          <Badge className="bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200/50 dark:border-cyan-800/50">
                            {example.pillar}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-slate-100/70 dark:bg-slate-800/70 backdrop-blur-sm p-3 rounded-lg truncate">
                          {coordinateToNuremberg(example)}
                        </div>
                      </div>
                    ))}
                    {examples.length === 0 && (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Code className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          No example coordinates available
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Operation Info */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-500/20 rounded-2xl blur-lg opacity-30"></div>
              <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-800/20 shadow-xl">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Mathematical Intelligence</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <strong className="text-slate-900 dark:text-slate-100">Available Operations:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {operations.map(op => (
                          <Badge key={op} className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 border-0 shadow-sm text-xs">
                            {op}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-slate-100">Currently Selected:</strong> 
                      <Badge className="ml-2 bg-gradient-to-r from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30 text-violet-700 dark:text-violet-300 border-violet-200/50 dark:border-violet-800/50">
                        {selectedOperation}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 p-4 rounded-xl border border-orange-200/50 dark:border-orange-800/50">
                      Mathematical operations compute sophisticated metrics across the 13-dimensional coordinate space, 
                      enabling advanced analysis of knowledge relationships, entropy calculations, and dimensional transformations.
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