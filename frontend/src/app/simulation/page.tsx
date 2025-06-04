'use client'

import { useState, useEffect } from 'react'
import { simulateAxisExpansion, getExampleCoordinates } from '@/lib/api'
import { AxisCoordinate, SimulationRequest, SimulationResult, createEmptyCoordinate, coordinateToNuremberg } from '../../lib/types'
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Brain, Zap, Users, Settings, Play, TrendingUp, Network, CheckCircle, XCircle, Copy, Loader2, ArrowRight, Target, Code, BarChart3 } from 'lucide-react'

export default function SimulationPage() {
  const [baseCoordinate, setBaseCoordinate] = useState<AxisCoordinate>(createEmptyCoordinate())
  const [targetRoles, setTargetRoles] = useState<string[]>(['Data Scientist', 'Healthcare Expert'])
  const [roleInput, setRoleInput] = useState('')
  const [includeCrosswalks, setIncludeCrosswalks] = useState(true)
  const [expansionRules, setExpansionRules] = useState<string>('{"confidence_threshold": 0.7, "max_expansions": 5}')
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [examples, setExamples] = useState<AxisCoordinate[]>([])
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)

  useEffect(() => {
    const loadExamples = async () => {
      try {
        const exampleCoords = await getExampleCoordinates()
        setExamples(exampleCoords)
        if (exampleCoords.length > 0) {
          setBaseCoordinate(exampleCoords[0])
        }
      } catch (error) {
        console.error('Failed to load examples:', error)
      }
    }
    loadExamples()
  }, [])

  const addRole = () => {
    if (roleInput.trim() && !targetRoles.includes(roleInput.trim())) {
      setTargetRoles(prev => [...prev, roleInput.trim()])
      setRoleInput('')
    }
  }

  const removeRole = (role: string) => {
    setTargetRoles(prev => prev.filter(r => r !== role))
  }

  const handleSimulate = async () => {
    try {
      setLoading(true)
      let parsedRules: Record<string, unknown> = {}
      
      try {
        if (expansionRules.trim()) {
          parsedRules = JSON.parse(expansionRules)
        }
      } catch {
        throw new Error('Invalid expansion rules JSON')
      }

      const request: SimulationRequest = {
        base_coordinate: baseCoordinate,
        target_roles: targetRoles,
        expansion_rules: parsedRules,
        include_crosswalks: includeCrosswalks
      }

      const simulationResult = await simulateAxisExpansion(request)
      setResult(simulationResult)
    } catch (error) {
      setResult({
        expanded_coordinate: baseCoordinate,
        persona_activation_score: 0,
        axis_mapping_log: [error instanceof Error ? error.message : 'Simulation failed'],
        crosswalk_mappings: {},
        confidence_scores: {}
      })
    } finally {
      setLoading(false)
    }
  }

  const loadExample = (example: AxisCoordinate) => {
    setBaseCoordinate(example)
  }

  const predefinedRoles = [
    'Data Scientist', 'Software Engineer', 'Healthcare Expert', 'Compliance Officer',
    'Regulatory Analyst', 'Financial Advisor', 'Security Specialist', 'Product Manager',
    'Research Scientist', 'Business Analyst', 'AI/ML Engineer', 'DevOps Engineer'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/30">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-green-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-lg"></div>
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20 dark:border-slate-800/20 shadow-xl">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent font-semibold">
                  Advanced AI Persona Simulation
                </span>
                <Zap className="w-5 h-5 text-blue-600 animate-pulse delay-500" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-purple-800 to-blue-800 dark:from-slate-100 dark:via-purple-200 dark:to-blue-200 bg-clip-text text-transparent">
              AI Persona
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Simulation Engine
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto">
            Expand base coordinates through sophisticated role-based persona reasoning and dynamic crosswalk mapping. 
            Simulate how different AI personas interpret and extend multidimensional knowledge coordinates.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="xl:col-span-2 space-y-8">
            {/* Base Coordinate Card */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-800/20 shadow-xl">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
                        Base Coordinate
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        Starting point for persona expansion simulation
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-blue-500" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {[
                      { key: 'pillar', label: 'Pillar', placeholder: 'PL09.3.2', required: true },
                      { key: 'sector', label: 'Sector', placeholder: '5415', required: true },
                      { key: 'regulatory', label: 'Regulatory', placeholder: 'HIPAA-164', required: false },
                      { key: 'location', label: 'Location', placeholder: 'US-CA', required: false }
                    ].map((field) => (
                      <div key={field.key} className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 group-hover:shadow-lg">
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type="text"
                            value={baseCoordinate[field.key as keyof AxisCoordinate] as string || ''}
                            onChange={(e) => setBaseCoordinate(prev => ({ 
                              ...prev, 
                              [field.key]: e.target.value || undefined 
                            }))}
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-slate-100 placeholder-slate-500 transition-all duration-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gradient-to-r from-slate-100/80 to-blue-100/80 dark:from-slate-800/80 dark:to-blue-900/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Coordinate</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(coordinateToNuremberg(baseCoordinate))}
                        className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </button>
                    </div>
                    <code className="block text-sm font-mono text-slate-800 dark:text-slate-200 leading-relaxed break-all">
                      {coordinateToNuremberg(baseCoordinate)}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Target Roles Card */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-800/20 shadow-xl">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
                        Target AI Personas
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        Activate specific personas for coordinate expansion analysis
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-purple-500" />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={roleInput}
                          onChange={(e) => setRoleInput(e.target.value)}
                          placeholder="Enter custom role/persona..."
                          className="w-full px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-800/20 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-900 dark:text-slate-100 placeholder-slate-500 transition-all duration-300"
                          onKeyPress={(e) => e.key === 'Enter' && addRole()}
                        />
                      </div>
                      <button
                        onClick={addRole}
                        disabled={!roleInput.trim()}
                        className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
                      >
                        <span className="font-semibold">Add Role</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Active Personas ({targetRoles.length})</p>
                      <div className="flex flex-wrap gap-3">
                        {targetRoles.map(role => (
                          <div
                            key={role}
                            className="group relative"
                            onMouseEnter={() => setHoveredRole(role)}
                            onMouseLeave={() => setHoveredRole(null)}
                          >
                            <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-2xl blur-lg transition-opacity duration-300 ${
                              hoveredRole === role ? 'opacity-100' : 'opacity-0'
                            }`}></div>
                            <div
                              className="relative bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-2xl shadow-lg cursor-pointer hover:shadow-purple-500/25 transition-all duration-300 flex items-center space-x-2 group-hover:scale-105"
                              onClick={() => removeRole(role)}
                            >
                              <span className="font-semibold text-sm">{role}</span>
                              <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quick Add Personas</p>
                      <div className="flex flex-wrap gap-2">
                        {predefinedRoles.filter(role => !targetRoles.includes(role)).map(role => (
                          <button
                            key={role}
                            className="group px-3 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 flex items-center space-x-1"
                            onClick={() => setTargetRoles(prev => [...prev, role])}
                          >
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">+ {role}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulation Settings Card */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-teal-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-800/20 shadow-xl">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
                        Simulation Configuration
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        Fine-tune expansion rules and simulation parameters
                      </p>
                    </div>
                    <Settings className="w-8 h-8 text-green-500" />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50/80 to-teal-50/80 dark:from-green-950/20 dark:to-teal-950/20 p-4 rounded-2xl border border-green-200/50 dark:border-green-800/50">
                      <label className="flex items-center space-x-3">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={includeCrosswalks}
                            onChange={(e) => setIncludeCrosswalks(e.target.checked)}
                            className="w-5 h-5 text-green-600 border-2 border-green-300 rounded focus:ring-green-500 focus:ring-2"
                          />
                          <CheckCircle className={`absolute inset-0 w-5 h-5 text-green-600 pointer-events-none transition-opacity ${includeCrosswalks ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-green-800 dark:text-green-300">Include Crosswalk Mappings</span>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            Automatically traverse related axes (pillar→sector→regulatory→compliance)
                          </p>
                        </div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        Expansion Rules (JSON Configuration)
                      </label>
                      <div className="relative">
                        <Textarea
                          value={expansionRules}
                          onChange={(e) => setExpansionRules(e.target.value)}
                          placeholder='{"confidence_threshold": 0.7, "max_expansions": 5}'
                          className="font-mono text-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-green-500/50 resize-none"
                          rows={4}
                        />
                        <Code className="absolute top-3 right-3 w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulation Button */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-xl"></div>
              <button
                onClick={handleSimulate}
                disabled={loading || !baseCoordinate.pillar || !baseCoordinate.sector || targetRoles.length === 0}
                className="relative w-full group bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white p-6 rounded-3xl shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 flex items-center justify-center space-x-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-2xl font-bold">Running Simulation...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    <span className="text-2xl font-bold">Simulate {targetRoles.length} Personas</span>
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-8">
            {result && (
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-3xl blur-xl"></div>
                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-800/20 shadow-xl">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                        Simulation Results
                      </h2>
                      <div className="flex items-center space-x-2">
                        {result.persona_activation_score > 0 ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500" />
                        )}
                        <Badge className={`${
                          result.persona_activation_score > 0 
                            ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white' 
                            : 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                        } border-0 shadow-lg`}>
                          {result.persona_activation_score > 0 ? "Success" : "Error"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Persona Activation Score</p>
                          <TrendingUp className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out" 
                              style={{ width: `${result.persona_activation_score * 100}%` }}
                            />
                          </div>
                          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {(result.persona_activation_score * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-slate-100/80 to-blue-100/80 dark:from-slate-800/80 dark:to-blue-900/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Expanded Coordinate</p>
                          <button
                            onClick={() => navigator.clipboard.writeText(coordinateToNuremberg(result.expanded_coordinate))}
                            className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          </button>
                        </div>
                        <code className="block text-sm font-mono text-slate-800 dark:text-slate-200 leading-relaxed break-all">
                          {coordinateToNuremberg(result.expanded_coordinate)}
                        </code>
                      </div>

                      {result.axis_mapping_log && result.axis_mapping_log.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mapping Log</p>
                            <BarChart3 className="w-5 h-5 text-blue-500" />
                          </div>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {result.axis_mapping_log.map((log, idx) => (
                              <div key={idx} className="text-sm text-blue-800 dark:text-blue-300 p-3 bg-blue-100/60 dark:bg-blue-900/20 rounded-xl backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50">
                                {log}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.crosswalk_mappings && Object.keys(result.crosswalk_mappings).length > 0 && (
                        <div className="bg-gradient-to-r from-green-50/80 to-teal-50/80 dark:from-green-950/20 dark:to-teal-950/20 p-4 rounded-2xl border border-green-200/50 dark:border-green-800/50">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Crosswalk Mappings</p>
                            <Network className="w-5 h-5 text-green-500" />
                          </div>
                          <div className="space-y-3">
                            {Object.entries(result.crosswalk_mappings).map(([key, values]) => (
                              <div key={key} className="p-3 bg-green-100/60 dark:bg-green-900/20 rounded-xl backdrop-blur-sm border border-green-200/50 dark:border-green-800/50">
                                <div className="font-semibold text-sm text-green-800 dark:text-green-300 mb-1">{key}</div>
                                <div className="text-sm text-green-600 dark:text-green-400">{values.join(', ')}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.confidence_scores && Object.keys(result.confidence_scores).length > 0 && (
                        <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-950/20 dark:to-pink-950/20 p-4 rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confidence Scores</p>
                            <button
                              onClick={() => navigator.clipboard.writeText(JSON.stringify(result.confidence_scores, null, 2))}
                              className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                              title="Copy JSON to clipboard"
                            >
                              <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            </button>
                          </div>
                          <pre className="bg-purple-100/60 dark:bg-purple-900/20 p-3 rounded-xl text-sm overflow-x-auto text-purple-800 dark:text-purple-200 font-mono leading-relaxed border border-purple-200/50 dark:border-purple-800/50">
                            {JSON.stringify(result.confidence_scores, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Example Coordinates */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-red-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-800/20 shadow-xl">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
                        Example Coordinates
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        Click to load as base coordinate
                      </p>
                    </div>
                    <Sparkles className="w-8 h-8 text-orange-500" />
                  </div>
                  
                  <div className="space-y-4">
                    {examples.map((example, index) => (
                      <div 
                        key={index} 
                        className="group relative cursor-pointer"
                        onClick={() => loadExample(example)}
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-red-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative p-4 bg-gradient-to-br from-orange-50/80 to-yellow-50/80 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-2xl border border-orange-200/50 dark:border-orange-800/50 hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-sm text-orange-800 dark:text-orange-300">
                              Example {index + 1}
                            </span>
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-sm">
                              {example.pillar}
                            </Badge>
                          </div>
                          <code className="block text-xs text-orange-600 dark:text-orange-400 font-mono leading-relaxed break-all">
                            {coordinateToNuremberg(example)}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 