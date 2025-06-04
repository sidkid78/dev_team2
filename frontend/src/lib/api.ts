// API Client for UKG/USKD 13-Axis System Backend
import { 
  AxisCoordinate, 
  AxisMetadata, 
  MathematicalOperation,
  MathematicalResult,
  SimulationRequest,
  SimulationResult,
  AxisTranslationRequest,
  AxisTranslationResult,
  MathOperation,
  // Enhanced types for advanced backend
  EnhancedSimulationRequest,
  EnhancedSimulationResult,
  SessionStatusResponse,
  SystemMetricsResponse,
  SecurityMetricsResponse,
  AccessLevel,
  DataClassification,
  KnowledgeNode,
  KnowledgeConnection,
  SecureDataRecord
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(
      `API request failed: ${response.status} ${response.statusText}\n${errorText}`,
      response.status
    );
  }

  return response.json();
}

// Axis Metadata & Schema
export async function fetchAxes(): Promise<AxisMetadata[]> {
  return apiRequest<AxisMetadata[]>('/axis/');
}

export async function fetchAxisDetail(axisKey: string): Promise<AxisMetadata> {
  return apiRequest<AxisMetadata>(`/axis/${axisKey}`);
}

export async function fetchAxisKeys(): Promise<string[]> {
  return apiRequest<string[]>('/axis/keys');
}

// Coordinate Operations
export async function parseNurembergCoordinate(
  nurembergString: string
): Promise<AxisCoordinate> {
  return apiRequest<AxisCoordinate>('/axis/parse', {
    method: 'POST',
    body: JSON.stringify({ coordinate: nurembergString }),
  });
}

export async function translateTextToCoordinate(
  request: AxisTranslationRequest
): Promise<AxisTranslationResult> {
  return apiRequest<AxisTranslationResult>('/axis/translate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function validateCoordinate(
  coordinate: AxisCoordinate
): Promise<{ valid: boolean; errors?: string[] }> {
  return apiRequest<{ valid: boolean; errors?: string[] }>('/axis/validate', {
    method: 'POST',
    body: JSON.stringify(coordinate),
  });
}

// Crosswalk Operations
export async function getCrosswalkMappings(): Promise<Record<string, string[]>> {
  return apiRequest<Record<string, string[]>>('/axis/crosswalk');
}

// Simulation Operations
export async function simulateAxisExpansion(
  request: SimulationRequest
): Promise<SimulationResult> {
  return apiRequest<SimulationResult>('/axis/simulate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// Mathematical Operations
export async function calculateAxisMath(
  operation: MathematicalOperation
): Promise<MathematicalResult> {
  return apiRequest<MathematicalResult>('/axis/math', {
    method: 'POST',
    body: JSON.stringify(operation),
  });
}

export async function getMathOperations(): Promise<string[]> {
  return apiRequest<string[]>('/math/ops');
}

export async function mathPlayground(
  operation: MathOperation,
  coordinate: AxisCoordinate,
  parameters?: Record<string, unknown>,
  weights?: number[]
): Promise<MathematicalResult> {
  return apiRequest<MathematicalResult>('/math/play', {
    method: 'POST',
    body: JSON.stringify({
      operation,
      coordinate,
      parameters,
      weights,
    }),
  });
}

// Example Data
export async function getExampleCoordinates(): Promise<AxisCoordinate[]> {
  return apiRequest<AxisCoordinate[]>('/examples/coordinates');
}

// System Info
export async function getSystemInfo(): Promise<Record<string, unknown>> {
  return apiRequest<Record<string, unknown>>('/system/info');
}

// Development Tools
export async function generateSampleCoordinate(
  role?: string
): Promise<AxisCoordinate> {
  const params = role ? `?role=${encodeURIComponent(role)}` : '';
  return apiRequest<AxisCoordinate>(`/dev/generate-sample${params}`, {
    method: 'POST',
  });
}

// Health Check
export async function healthCheck(): Promise<{ status: string; message?: string }> {
  return apiRequest<{ status: string; message?: string }>('/health');
}

// =====================================
// ENHANCED API FUNCTIONS FOR ADVANCED BACKEND
// =====================================

// Enhanced Simulation
export async function enhancedSimulation(
  request: EnhancedSimulationRequest
): Promise<EnhancedSimulationResult> {
  return apiRequest<EnhancedSimulationResult>('/api/simulate/enhanced', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// Session Management
export async function createSession(
  request: EnhancedSimulationRequest
): Promise<{ session_id: string; status: string }> {
  return apiRequest<{ session_id: string; status: string }>('/api/session', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function getSessionStatus(
  sessionId: string
): Promise<SessionStatusResponse> {
  return apiRequest<SessionStatusResponse>(`/api/session/${sessionId}`);
}

// Advanced Coordinate Analysis
export async function analyzeCoordinate(
  coordinate: AxisCoordinate,
  analysisDepth: 'surface' | 'moderate' | 'deep' | 'comprehensive' = 'deep'
): Promise<Record<string, unknown>> {
  return apiRequest<Record<string, unknown>>(`/api/analyze/coordinate`, {
    method: 'POST',
    body: JSON.stringify({ coordinate, analysis_depth: analysisDepth }),
  });
}

// Knowledge Graph Operations
export async function createKnowledgeNode(
  nodeType: string,
  content: Record<string, unknown>,
  accessLevel: AccessLevel = AccessLevel.PUBLIC
): Promise<KnowledgeNode> {
  return apiRequest<KnowledgeNode>('/api/knowledge/node', {
    method: 'POST',
    body: JSON.stringify({
      node_type: nodeType,
      content,
      access_level: accessLevel,
    }),
  });
}

export async function connectKnowledgeNodes(
  sourceNodeId: string,
  targetNodeId: string,
  connectionType: string = 'relates_to'
): Promise<KnowledgeConnection> {
  return apiRequest<KnowledgeConnection>('/api/knowledge/connect', {
    method: 'POST',
    body: JSON.stringify({
      source_node_id: sourceNodeId,
      target_node_id: targetNodeId,
      connection_type: connectionType,
    }),
  });
}

export async function queryKnowledgeGraph(
  queryType: string,
  parameters: Record<string, unknown>,
  maxDepth: number = 3
): Promise<Record<string, unknown>> {
  return apiRequest<Record<string, unknown>>('/api/knowledge/query', {
    method: 'POST',
    body: JSON.stringify({
      query_type: queryType,
      parameters,
      max_depth: maxDepth,
    }),
  });
}

// Gemini AI Functions
export async function aiAnalyzeCoordinate(
  coordinate: AxisCoordinate
): Promise<Record<string, unknown>> {
  return apiRequest<Record<string, unknown>>('/api/ai/analyze-coordinate', {
    method: 'POST',
    body: JSON.stringify({ coordinate }),
  });
}

export async function aiExtractKnowledge(
  content: string,
  contentType: string = 'text'
): Promise<Record<string, unknown>> {
  const params = new URLSearchParams();
  params.append('content', content);
  params.append('content_type', contentType);
  
  return apiRequest<Record<string, unknown>>(`/api/ai/extract-knowledge?${params.toString()}`, {
    method: 'POST',
  });
}

export async function aiGenerateReasoningChain(
  query: string,
  strategy: string = 'hybrid'
): Promise<Record<string, unknown>> {
  const params = new URLSearchParams();
  params.append('query', query);
  params.append('strategy', strategy);
  
  return apiRequest<Record<string, unknown>>(`/api/ai/reasoning-chain?${params.toString()}`, {
    method: 'POST',
  });
}

export async function aiTranslateTextToCoordinate(
  text: string,
  context?: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const params = new URLSearchParams();
  params.append('text', text);
  if (context) {
    params.append('context', JSON.stringify(context));
  }
  
  return apiRequest<Record<string, unknown>>(`/api/ai/translate-text?${params.toString()}`, {
    method: 'POST',
  });
}

export async function aiHealthCheck(): Promise<Record<string, unknown>> {
  return apiRequest<Record<string, unknown>>('/api/ai/health');
}

// Secure Storage
export async function storeSecureData(
  data: Record<string, unknown>,
  dataType: string,
  classification: DataClassification = DataClassification.GENERAL,
  accessLevel: AccessLevel = AccessLevel.PUBLIC,
  tags?: string[]
): Promise<SecureDataRecord> {
  return apiRequest<SecureDataRecord>('/api/secure/store', {
    method: 'POST',
    body: JSON.stringify({
      data,
      data_type: dataType,
      classification,
      access_level: accessLevel,
      tags,
    }),
  });
}

export async function retrieveSecureData(
  recordId: string,
  requiredAccessLevel: AccessLevel = AccessLevel.PUBLIC
): Promise<Record<string, unknown>> {
  return apiRequest<Record<string, unknown>>(`/api/secure/retrieve/${recordId}`, {
    method: 'GET',
    headers: {
      'X-Required-Access-Level': requiredAccessLevel,
    },
  });
}

// System Monitoring
export async function getSystemMetrics(): Promise<SystemMetricsResponse> {
  return apiRequest<SystemMetricsResponse>('/metrics/system');
}

export async function getSecurityMetrics(): Promise<SecurityMetricsResponse> {
  return apiRequest<SecurityMetricsResponse>('/metrics/security');
}

// Legacy Compatibility (routes that exist in both backends)
export async function legacySimulate(
  request: SimulationRequest
): Promise<Record<string, unknown>> {
  return apiRequest<Record<string, unknown>>('/api/simulate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
} 