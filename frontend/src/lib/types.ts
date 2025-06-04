// 13-Axis System TypeScript Types
// Matches backend Pydantic models for type safety

export interface AxisCoordinate {
  // Core Knowledge Architecture (axes 1-2)
  pillar: string;  // "PLxx.x.x" format
  sector: string | number;  // Industry/domain code
  
  // Crosslink and Hierarchical Systems (axes 3-5)
  honeycomb?: string[];  // Crosslink mappings ["PL09.3.2↔5415"]
  branch?: string;       // Branch system hierarchy
  node?: string;         // Cross-sector node overlays
  
  // Regulatory and Compliance Overlays (axes 6-7+)
  regulatory?: string;   // Regulatory framework code
  compliance?: string;   // Compliance standard code
  compliance_level?: string;      // Compliance level (strict, moderate, basic)
  audit_requirements?: string;    // Audit requirements level  
  regulatory_framework?: string;  // Regulatory framework name
  
  // Role/Persona Dimensions (axes 8-11)
  role_knowledge?: string;   // Knowledge domain role
  role_sector?: string;      // Sector expert role  
  role_regulatory?: string;  // Regulatory expert role
  role_compliance?: string;  // Compliance/USI role
  
  // Geospatial and Temporal (axes 12-13)
  location?: string;  // Geographic location (ISO 3166)
  temporal?: string;  // Time/version (ISO 8601)
}

export interface AxisMetadata {
  index: number;
  key: string;
  name: string;
  description: string;
  formula?: string;
  data_type: string;
  examples: string[];
  constraints?: Record<string, unknown>;
}

export interface MathematicalOperation {
  operation: string;
  axis_coordinate: AxisCoordinate;
  parameters?: Record<string, unknown>;
  weights?: number[];
}

export interface MathematicalResult {
  operation: string;
  result: unknown;
  explanation: string;
  metadata?: Record<string, unknown>;
}

export interface SimulationRequest {
  base_coordinate?: AxisCoordinate;
  target_roles?: string[];
  expansion_rules?: Record<string, unknown>;
  include_crosswalks?: boolean;
}

export interface SimulationResult {
  expanded_coordinate: AxisCoordinate;
  persona_activation_score: number;
  axis_mapping_log: string[];
  crosswalk_mappings?: Record<string, string[]>;
  confidence_scores: Record<string, number>;
}

export interface AxisTranslationRequest {
  input_text: string;
  target_axes?: string[];
  context?: Record<string, unknown>;
}

export interface AxisTranslationResult {
  input_text: string;
  suggested_coordinate: AxisCoordinate;
  confidence_score: number;
  alternative_suggestions: AxisCoordinate[];
  mapping_rationale: string[];
}

// Enhanced types for advanced backend features
export interface EnhancedSimulationRequest {
  coordinate: AxisCoordinate;
  strategy?: 'LOGICAL' | 'PROBABILISTIC' | 'HEURISTIC' | 'NEURAL' | 'HYBRID';
  analysis_depth?: 'SURFACE' | 'MODERATE' | 'DEEP' | 'COMPREHENSIVE';
  enable_ai_enhancement?: boolean;
  security_level?: AccessLevel;
  session_id?: string;
  metadata?: Record<string, unknown>;
}

export interface ReasoningStep {
  step_number: number;
  description: string;
  confidence: number;
  dependencies: string[];
}

export interface AnalysisMetrics {
  complexity_score: number;
  confidence_level: number;
  processing_efficiency: number;
  accuracy_estimation: number;
}

export interface EnhancedSimulationResult {
  answer: string;
  confidence: number;
  reasoning_steps: ReasoningStep[];
  coordinate: AxisCoordinate;
  processing_time: number;
  metadata: Record<string, unknown>;
  analysis_metrics?: AnalysisMetrics;
  session_id?: string;
}

export interface SessionStatusResponse {
  session_id: string;
  status: 'ACTIVE' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  created_at: string;
  last_activity: string;
  metadata: Record<string, unknown>;
}

export interface SystemMetricsResponse {
  cpu_usage: number;
  memory_usage: number;
  active_sessions: number;
  total_requests: number;
  average_response_time: number;
  engine_status: Record<string, boolean>;
  timestamp: string;
}

export interface SecurityMetricsResponse {
  authentication_rate: number;
  authorization_failures: number;
  data_classification_stats: Record<string, number>;
  access_level_distribution: Record<string, number>;
  encryption_status: boolean;
}

export enum AccessLevel {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  CONFIDENTIAL = 'CONFIDENTIAL',
  RESTRICTED = 'RESTRICTED',
  TOP_SECRET = 'TOP_SECRET'
}

export enum DataClassification {
  GENERAL = 'GENERAL',
  SENSITIVE = 'SENSITIVE',
  CONFIDENTIAL = 'CONFIDENTIAL',
  RESTRICTED = 'RESTRICTED'
}

export interface KnowledgeNode {
  id: string;
  type: string;
  content: Record<string, unknown>;
  access_level: AccessLevel;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown>;
}

export interface KnowledgeConnection {
  id: string;
  source_node_id: string;
  target_node_id: string;
  connection_type: string;
  strength: number;
  metadata: Record<string, unknown>;
}

export interface SecureDataRecord {
  id: string;
  data_type: string;
  classification: DataClassification;
  access_level: AccessLevel;
  tags: string[];
  created_at: string;
  accessed_at?: string;
  metadata: Record<string, unknown>;
}

// 16 Axis Keys in order (expanded for enhanced functionality)
export const AXIS_KEYS = [
  'pillar', 'sector', 'honeycomb', 'branch', 'node',
  'regulatory', 'compliance', 'compliance_level', 'audit_requirements', 'regulatory_framework',
  'role_knowledge', 'role_sector', 'role_regulatory', 'role_compliance', 
  'location', 'temporal'
] as const;

export type AxisKey = typeof AXIS_KEYS[number];

// Math operation types
export type MathOperation = 
  | "MCW" 
  | "entropy" 
  | "certainty" 
  | "USI" 
  | "nuremberg" 
  | "temporal_delta" 
  | "completeness" 
  | "similarity" 
  | "distance" 
  | "crosswalk_score";

// Utility functions
export function createEmptyCoordinate(): AxisCoordinate {
  return {
    pillar: '',
    sector: ''
  };
}

export function coordinateToArray(coord: AxisCoordinate): (string | number | string[] | undefined)[] {
  return AXIS_KEYS.map(key => coord[key]);
}

export function coordinateToNuremberg(coord: AxisCoordinate): string {
  return AXIS_KEYS.map(key => {
    const value = coord[key];
    if (Array.isArray(value)) {
      return value.join(',');
    }
    return value?.toString() || '';
  }).join('|');
} 