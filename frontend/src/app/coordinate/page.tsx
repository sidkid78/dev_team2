'use client'

import { useState } from 'react'
import { AxisCoordinate, AXIS_KEYS, createEmptyCoordinate, coordinateToNuremberg } from '../../lib/types'
import { validateCoordinate, translateTextToCoordinate } from '@/lib/api'
import { Sparkles, Brain, Wand2, CheckCircle, XCircle, Loader2, Copy, Save, Play, Code, ArrowRight, Globe, Zap } from 'lucide-react'

export default function CoordinatePage() {
  const [coordinate, setCoordinate] = useState<AxisCoordinate>(createEmptyCoordinate())
  const [translationText, setTranslationText] = useState('')
  const [validationResult, setValidationResult] = useState<{valid: boolean; errors?: string[]} | null>(null)
  const [loading, setLoading] = useState(false)
  const [hoveredField, setHoveredField] = useState<string | null>(null)

  const updateCoordinate = (key: keyof AxisCoordinate, value: string | string[]) => {
    setCoordinate(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }))
  }

  const handleValidate = async () => {
    try {
      setLoading(true)
      const result = await validateCoordinate(coordinate)
      setValidationResult(result)
    } catch (error) {
      setValidationResult({
        valid: false,
        errors: [error instanceof Error ? error.message : 'Validation failed']
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTranslate = async () => {
    if (!translationText.trim()) return

    try {
      setLoading(true)
      const result = await translateTextToCoordinate({
        input_text: translationText
      })
      setCoordinate(result.suggested_coordinate)
      setValidationResult({ valid: true })
    } catch (error) {
      console.error('Translation error:', error)
      
      // Check if this is the specific backend signature error
      const errorMessage = error instanceof Error ? error.message : 'Translation failed'
      const isSignatureError = errorMessage.includes('takes 2 positional arguments but 4 were given')
      
      setValidationResult({
        valid: false,
        errors: isSignatureError 
          ? [
              'Backend API Error: The translation service needs to be updated.',
              'The translate_text_to_coordinate method signature is incorrect.',
              'Please check the backend implementation.'
            ]
          : [errorMessage]
      })
    } finally {
      setLoading(false)
    }
  }

  const nurembergString = coordinateToNuremberg(coordinate)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/30">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-2xl blur-lg"></div>
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20 dark:border-slate-800/20 shadow-xl">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-600 animate-pulse" />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent font-semibold">
                  Intelligent Coordinate Builder
                </span>
                <Sparkles className="w-5 h-5 text-purple-600 animate-pulse delay-500" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
              13D Coordinate
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              Builder
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Create and validate sophisticated coordinates in the Universal Knowledge Graph system 
            with intelligent translation and real-time validation.
          </p>
        </div>

        {/* Smart Translation Section */}
        <div className="mb-12">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 dark:border-slate-800/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
                    Smart Translation Engine
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Transform natural language into precise 13D coordinates using advanced AI
                  </p>
                </div>
                <Wand2 className="w-8 h-8 text-purple-500" />
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-teal-500/30 rounded-2xl blur opacity-30"></div>
                  <textarea
                    placeholder="e.g., 'Data scientist in healthcare working with HIPAA compliance regulations in California, focusing on patient privacy and machine learning algorithms...'"
                    className="relative w-full px-6 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-800/20 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-slate-100 placeholder-slate-500 resize-none transition-all duration-300"
                    rows={4}
                    value={translationText}
                    onChange={(e) => setTranslationText(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleTranslate}
                    disabled={loading || !translationText.trim()}
                    className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-3"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Wand2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="font-semibold">
                      {loading ? 'Translating...' : 'Generate Coordinate'}
                    </span>
                    {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
          {/* Manual Input Form */}
          <div className="xl:col-span-2">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-slate-800/20 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
                      Manual Coordinate Input
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Precisely define each dimensional parameter
                    </p>
                  </div>
                  <Globe className="w-8 h-8 text-blue-500" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {AXIS_KEYS.map((key, index) => (
                    <div 
                      key={key}
                      className="group relative"
                      onMouseEnter={() => setHoveredField(key)}
                      onMouseLeave={() => setHoveredField(null)}
                    >
                      <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-2xl blur-lg transition-opacity duration-500 ${
                        hoveredField === key ? 'opacity-100' : 'opacity-0'
                      }`}></div>
                      <div className="relative bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 group-hover:shadow-lg">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </div>
                            <span>
                              {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                            </span>
                            {index < 2 && <span className="text-red-500 ml-1">*</span>}
                          </div>
                        </label>
                        {key === 'honeycomb' ? (
                          <input
                            type="text"
                            placeholder="Comma-separated values (e.g., PL09.3.2↔5415)"
                            className="w-full px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-slate-100 placeholder-slate-500 transition-all duration-300"
                            value={Array.isArray(coordinate[key]) ? coordinate[key]?.join(', ') : ''}
                            onChange={(e) => updateCoordinate(key, e.target.value ? e.target.value.split(',').map(s => s.trim()) : [])}
                          />
                        ) : (
                          <input
                            type="text"
                            placeholder={getPlaceholder(key)}
                            className="w-full px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-slate-100 placeholder-slate-500 transition-all duration-300"
                            value={coordinate[key]?.toString() || ''}
                            onChange={(e) => updateCoordinate(key, e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview and Validation Panel */}
          <div className="space-y-6">
            {/* Nuremberg String Preview */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 dark:border-slate-800/20 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    Nuremberg 13D String
                  </h3>
                  <Code className="w-5 h-5 text-orange-500" />
                </div>
                <div className="relative">
                  <textarea
                    readOnly
                    title="Nuremberg 13D coordinate string representation"
                    className="w-full px-4 py-3 bg-gradient-to-br from-slate-100/80 to-slate-200/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 font-mono text-sm resize-none"
                    rows={4}
                    value={nurembergString}
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(nurembergString)}
                    className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Validation */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-teal-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 dark:border-slate-800/20 shadow-xl">
                <h3 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-4">
                  Validation & Analysis
                </h3>
                
                <button
                  onClick={handleValidate}
                  disabled={loading}
                  className="group w-full px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-2xl shadow-xl hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 mb-4"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                  <span className="font-semibold">
                    {loading ? 'Validating...' : 'Validate Coordinate'}
                  </span>
                </button>
                
                {validationResult && (
                  <div className={`p-4 rounded-2xl border backdrop-blur-sm ${
                    validationResult.valid 
                      ? 'bg-green-50/80 dark:bg-green-950/20 border-green-200/50 dark:border-green-800/50' 
                      : 'bg-red-50/80 dark:bg-red-950/20 border-red-200/50 dark:border-red-800/50'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {validationResult.valid ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                      <p className={`font-semibold ${
                        validationResult.valid 
                          ? 'text-green-800 dark:text-green-300' 
                          : 'text-red-800 dark:text-red-300'
                      }`}>
                        {validationResult.valid ? 'Valid Coordinate' : 'Invalid Coordinate'}
                      </p>
                    </div>
                    {validationResult.errors && validationResult.errors.length > 0 && (
                      <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                        {validationResult.errors.map((error, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span>•</span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                disabled={!validationResult?.valid}
                className="group w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Use in Simulation</span>
              </button>
              <button
                disabled={!validationResult?.valid}
                className="group w-full px-6 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Save Coordinate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Coordinate JSON Viewer */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 dark:border-slate-800/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Coordinate JSON Structure
              </h3>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="relative">
              <pre className="bg-gradient-to-br from-slate-100/80 to-slate-200/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 text-sm overflow-x-auto text-slate-800 dark:text-slate-200 font-mono leading-relaxed">
                {JSON.stringify(coordinate, null, 2)}
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(coordinate, null, 2))}
                className="absolute top-4 right-4 p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-lg"
                title="Copy JSON to clipboard"
              >
                <Copy className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getPlaceholder(key: string): string {
  const placeholders: Record<string, string> = {
    pillar: 'PL09.3.2',
    sector: '5415 or Healthcare',
    branch: '5417.120/physics',
    node: 'N-PL09.3.2-5415',
    regulatory: 'HIPAA-164 or GDPR-ART5',
    compliance: 'ISO9001 or SOC2',
    role_knowledge: 'Data Scientist',
    role_sector: 'Healthcare Expert',
    role_regulatory: 'Compliance Officer',
    role_compliance: 'Auditor',
    location: 'US-CA or USA',
    temporal: '2024-01-01T00:00:00Z'
  }
  return placeholders[key] || ''
} 