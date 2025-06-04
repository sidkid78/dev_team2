'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  enhancedSimulation,
  aiAnalyzeCoordinate,
  aiTranslateTextToCoordinate,
  getSystemMetrics,
  createSession,
  getSessionStatus,
  aiHealthCheck,
  aiGenerateReasoningChain,
  aiExtractKnowledge
} from '@/lib/api';
import {
  AxisCoordinate,
  AxisTranslationResult,
  EnhancedSimulationRequest,
  EnhancedSimulationResult,
  SessionStatusResponse,
  SystemMetricsResponse,
  createEmptyCoordinate
} from '@/lib/types';
import { 
  Sparkles, Brain, Zap, Network, Shield, TrendingUp, Activity, Layers, 
  Target, Code, BarChart3, ArrowRight, CheckCircle, XCircle, Loader2,
  Cpu, Database, Lock, Globe, Settings, Play, PauseCircle, 
  MessageSquare, Search, FileSearch, Clock, Users, Eye, Monitor,
  Bot, Lightbulb, GitBranch, Workflow, Atom, Microscope, AlertTriangle
} from 'lucide-react';

interface AGIConversation {
  id: string;
  messages: Array<{
    role: 'user' | 'agi' | 'system';
    content: string;
    timestamp: string;
    reasoning_chain?: Array<{
      step: number;
      reasoning: string;
      confidence: number;
    }>;
    coordinate_analysis?: any;
  }>;
  status: 'active' | 'reasoning' | 'completed';
  session_id?: string;
}

export default function AdvancedFeatures() {
  // Core AGI states
  const [agiQuery, setAgiQuery] = useState('');
  const [currentConversation, setCurrentConversation] = useState<AGIConversation | null>(null);
  const [conversations, setConversations] = useState<AGIConversation[]>([]);
  
  // Coordinate and analysis states
  const [coordinate, setCoordinate] = useState<AxisCoordinate>(createEmptyCoordinate());
  const [activeKnowledgeAgents, setActiveKnowledgeAgents] = useState<string[]>([]);
  const [reasoningStrategy, setReasoningStrategy] = useState<'logical' | 'probabilistic' | 'neural' | 'hybrid'>('hybrid');
  
  // System states
  const [simulationResult, setSimulationResult] = useState<EnhancedSimulationResult | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetricsResponse | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatusResponse | null>(null);
  const [aiHealth, setAiHealth] = useState<Record<string, unknown> | null>(null);
  
  // UI states
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const setLoadingState = (key: string, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  // Core AGI interaction function
  const handleAGIQuery = async () => {
    if (!agiQuery.trim()) return;
    
    setLoadingState('agi_query', true);
    
    try {
      // Create new conversation if none exists
      if (!currentConversation) {
        const newConversation: AGIConversation = {
          id: Date.now().toString(),
          messages: [],
          status: 'active'
        };
        setCurrentConversation(newConversation);
      }
      
      // Add user message
      const userMessage = {
        role: 'user' as const,
        content: agiQuery,
        timestamp: new Date().toISOString()
      };
      
      const updatedConversation = {
        ...currentConversation!,
        messages: [...(currentConversation?.messages || []), userMessage],
        status: 'reasoning' as const
      };
      setCurrentConversation(updatedConversation);
      setAgiQuery('');
      
      // Step 1: Translate query to coordinate
      const translationResult = await aiTranslateTextToCoordinate(agiQuery);
      const queryCoordinate = translationResult.suggested_coordinate || coordinate;
      
      // Step 2: Generate reasoning chain
      const reasoningResult = await aiGenerateReasoningChain(agiQuery, reasoningStrategy);
      
      // Step 3: Perform enhanced simulation with AI
      const enhancedRequest: EnhancedSimulationRequest = {
        coordinate: queryCoordinate,
        strategy: reasoningStrategy.toUpperCase() as any,
        analysis_depth: 'COMPREHENSIVE',
        enable_ai_enhancement: true
      };
      
      const simulationResponse = await enhancedSimulation(enhancedRequest);
      
      // Step 4: Extract knowledge insights
      const knowledgeExtraction = await aiExtractKnowledge(agiQuery, 'query');
      
      // Create AGI response
      const agiResponse = {
        role: 'agi' as const,
        content: simulationResponse.answer || 'I have analyzed your query using advanced reasoning and coordinate analysis.',
        timestamp: new Date().toISOString(),
        reasoning_chain: reasoningResult.steps || [],
        coordinate_analysis: {
          coordinate: queryCoordinate,
          confidence: simulationResponse.confidence,
          insights: knowledgeExtraction.insights,
          complexity_score: simulationResponse.analysis_metrics?.complexity_score
        }
      };
      
      // Update conversation
      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, agiResponse],
        status: 'completed' as const,
        session_id: simulationResponse.session_id
      };
      
      setCurrentConversation(finalConversation);
      setConversations(prev => {
        const existing = prev.find(c => c.id === finalConversation.id);
        if (existing) {
          return prev.map(c => c.id === finalConversation.id ? finalConversation : c);
        }
        return [...prev, finalConversation];
      });
      
      setSimulationResult(simulationResponse);
      
    } catch (error) {
      console.error('AGI Query Error:', error);
      const errorMessage = {
        role: 'system' as const,
        content: `Error processing query: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
      
      const errorConversation = {
        ...currentConversation!,
        messages: [...(currentConversation?.messages || []), errorMessage],
        status: 'completed' as const
      };
      setCurrentConversation(errorConversation);
    } finally {
      setLoadingState('agi_query', false);
    }
  };

  const handleKnowledgeAgentToggle = (agentName: string) => {
    setActiveKnowledgeAgents(prev => 
      prev.includes(agentName) 
        ? prev.filter(a => a !== agentName)
        : [...prev, agentName]
    );
  };

  const handleSystemDiagnostics = async () => {
    setLoadingState('diagnostics', true);
    try {
      const [metrics, health] = await Promise.all([
        getSystemMetrics(),
        aiHealthCheck()
      ]);
      setSystemMetrics(metrics);
      setAiHealth(health);
    } catch (error) {
      console.error('Diagnostics Error:', error);
    } finally {
      setLoadingState('diagnostics', false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
      <div className="fixed bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 to-indigo-900 rounded-full">
            <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Advanced AGI Development Platform</span>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
            AGI Reasoning Engine
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Interact with sophisticated AI through 13-dimensional knowledge coordinates, 
            multi-strategy reasoning, and advanced knowledge agent orchestration.
          </p>
          
          <div className="flex items-center justify-center gap-6">
            <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:bg-emerald-900/20">
              <Activity className="w-3 h-3 mr-1" />
              {activeKnowledgeAgents.length} Active KAs
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-900/20">
              <Cpu className="w-3 h-3 mr-1" />
              KASE + SEKRE + Gemini
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:bg-purple-900/20">
              <Shield className="w-3 h-3 mr-1" />
              Secure AGI Processing
            </Badge>
          </div>
        </div>

        {/* Main AGI Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AGI Conversation Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">AGI Conversation Interface</CardTitle>
                      <CardDescription>Natural language interaction with advanced reasoning AI</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentConversation(null)}
                    >
                      New Session
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSystemDiagnostics}
                      disabled={loading.diagnostics}
                    >
                      {loading.diagnostics ? <Loader2 className="w-4 h-4 animate-spin" /> : <Monitor className="w-4 h-4" />}
                      Diagnostics
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Conversation Display */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
                  {currentConversation?.messages.length ? (
                    <div className="space-y-4">
                      {currentConversation.messages.map((message, index) => (
                        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-4 rounded-lg ${
                            message.role === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : message.role === 'agi'
                              ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              {message.role === 'user' && <Users className="w-4 h-4" />}
                              {message.role === 'agi' && <Brain className="w-4 h-4" />}
                              {message.role === 'system' && <AlertTriangle className="w-4 h-4" />}
                              <span className="text-xs opacity-75">
                                {message.role === 'agi' ? 'AGI Assistant' : message.role === 'user' ? 'You' : 'System'}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            
                            {/* Show reasoning chain for AGI responses */}
                            {message.reasoning_chain && message.reasoning_chain.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-white/20">
                                <div className="text-xs opacity-75 mb-2">Reasoning Chain:</div>
                                {message.reasoning_chain.slice(0, 3).map((step, stepIndex) => (
                                  <div key={stepIndex} className="text-xs opacity-90 mb-1">
                                    {step.step}. {step.reasoning} ({Math.round(step.confidence * 100)}%)
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Show coordinate analysis */}
                            {message.coordinate_analysis && (
                              <div className="mt-3 pt-3 border-t border-white/20">
                                <div className="text-xs opacity-75 mb-2">13D Analysis:</div>
                                <div className="text-xs opacity-90">
                                  Confidence: {Math.round((message.coordinate_analysis.confidence || 0) * 100)}% | 
                                  Complexity: {Math.round((message.coordinate_analysis.complexity_score || 0) * 100)}%
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {currentConversation.status === 'reasoning' && (
                        <div className="flex justify-start">
                          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-4 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm">AGI is reasoning through your query...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                      <div className="text-center">
                        <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Start a conversation with the AGI</p>
                        <p className="text-sm mt-2">Try: "Analyze the healthcare sector for compliance requirements"</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Query Input */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Ask the AGI anything... e.g., 'Analyze the cybersecurity implications of PL18.4.7 in the financial sector with GDPR compliance'"
                      value={agiQuery}
                      onChange={(e) => setAgiQuery(e.target.value)}
                      className="min-h-[80px] bg-white dark:bg-slate-800"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAGIQuery();
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Strategy:</span>
                        <select 
                          value={reasoningStrategy} 
                          onChange={(e) => setReasoningStrategy(e.target.value as any)}
                          className="text-sm border rounded px-2 py-1 bg-white dark:bg-slate-800"
                        >
                          <option value="logical">Logical</option>
                          <option value="probabilistic">Probabilistic</option>
                          <option value="neural">Neural</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleAGIQuery}
                      disabled={loading.agi_query || !agiQuery.trim()}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {loading.agi_query ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Query AGI
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Knowledge Agents */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                    <Network className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-lg">Knowledge Agents</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'KASE', description: 'Knowledge Axis Simulation', icon: Atom },
                  { name: 'SEKRE', description: 'Secure Knowledge Repository', icon: Shield },
                  { name: 'Persona Engine', description: 'Role-based Analysis', icon: Users },
                  { name: 'Regulatory Engine', description: 'Compliance Analysis', icon: FileSearch },
                  { name: 'Gemini AI', description: 'Advanced Reasoning', icon: Brain }
                ].map(agent => (
                  <div key={agent.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <agent.icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <div>
                        <div className="text-sm font-medium">{agent.name}</div>
                        <div className="text-xs text-slate-500">{agent.description}</div>
                      </div>
                    </div>
                    <Button
                      variant={activeKnowledgeAgents.includes(agent.name) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleKnowledgeAgentToggle(agent.name)}
                      className={activeKnowledgeAgents.includes(agent.name) 
                        ? "bg-emerald-600 hover:bg-emerald-700" 
                        : ""
                      }
                    >
                      {activeKnowledgeAgents.includes(agent.name) ? 'Active' : 'Activate'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <Monitor className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-lg">System Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiHealth ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">AI Engine Status</span>
                      <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Operational
                      </Badge>
                    </div>
                    
                    {systemMetrics && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Active Sessions</span>
                          <span className="text-sm font-medium">{systemMetrics.active_sessions}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Avg Response Time</span>
                          <span className="text-sm font-medium">{systemMetrics.average_response_time}ms</span>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8 text-slate-500">
                    <div className="text-center">
                      <Monitor className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Run diagnostics to see status</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setAgiQuery("What are the key regulatory frameworks for healthcare AI?")}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Healthcare AI Analysis
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setAgiQuery("Generate a comprehensive security framework for financial services")}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  FinSec Framework
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setAgiQuery("Analyze cross-sector compliance requirements for PL25.6.1")}
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  Cross-Sector Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
