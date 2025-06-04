"""
Enhanced Models for Advanced Backend Engines

Extended data models to support the sophisticated multi-engine architecture:
- Enhanced simulation requests and results
- Advanced persona profiles and regulatory contexts
- Knowledge graph and security models
- Session management and workflow coordination
"""

from typing import Dict, List, Optional, Any, Union
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

# Import base models
from models import AxisCoordinate, AXIS_KEYS

class WorkflowStage(str, Enum):
    INITIALIZATION = "initialization"
    COORDINATE_ANALYSIS = "coordinate_analysis"
    PERSONA_CALIBRATION = "persona_calibration"
    SIMULATION_EXECUTION = "simulation_execution"
    REGULATORY_VALIDATION = "regulatory_validation"
    SYNTHESIS = "synthesis"
    OPTIMIZATION = "optimization"
    COMPLETION = "completion"

class SessionStatus(str, Enum):
    INITIALIZING = "initializing"
    ACTIVE = "active"
    PROCESSING = "processing"
    SUSPENDED = "suspended"
    COMPLETED = "completed"
    ERROR = "error"

class AccessLevel(str, Enum):
    PUBLIC = "public"
    RESTRICTED = "restricted"
    CONFIDENTIAL = "confidential"
    SECRET = "secret"
    TOP_SECRET = "top_secret"

class DataClassification(str, Enum):
    GENERAL = "general"
    SENSITIVE = "sensitive"
    PERSONAL = "personal"
    FINANCIAL = "financial"
    HEALTHCARE = "healthcare"
    REGULATORY = "regulatory"

class ReasoningStrategy(str, Enum):
    LOGICAL = "logical"
    PROBABILISTIC = "probabilistic"
    HEURISTIC = "heuristic"
    NEURAL = "neural"
    HYBRID = "hybrid"

# Enhanced request models
class EnhancedSimulationRequest(BaseModel):
    """Enhanced simulation request with advanced capabilities"""
    coordinate: AxisCoordinate
    target_personas: List[str] = Field(default_factory=list, description="Target persona profiles for simulation")
    regulatory_constraints: Optional[Dict[str, Any]] = Field(None, description="Regulatory compliance requirements")
    analysis_depth: str = Field("deep", description="Analysis depth: surface, moderate, deep, comprehensive")
    reasoning_strategy: Optional[ReasoningStrategy] = Field(None, description="Preferred reasoning strategy")
    optimization_goals: List[str] = Field(default_factory=list, description="Specific optimization objectives")
    security_level: AccessLevel = Field(AccessLevel.PUBLIC, description="Required security clearance level")
    session_context: Optional[Dict[str, Any]] = Field(None, description="Additional session context")
    
    class Config:
        schema_extra = {
            "example": {
                "coordinate": {
                    "pillar": "technological",
                    "sector": "healthcare",
                    "location": "north_america",
                    "role_definition": "data_scientist",
                    "user_authority": "specialist",
                    "regulatory_framework": "HIPAA",
                    "compliance_level": "strict",
                    "audit_requirements": "comprehensive"
                },
                "target_personas": ["healthcare_analyst", "compliance_officer"],
                "regulatory_constraints": {"jurisdiction": "US", "data_protection": "high"},
                "analysis_depth": "comprehensive",
                "optimization_goals": ["accuracy", "compliance", "performance"]
            }
        }

class EnhancedSimulationResult(BaseModel):
    """Enhanced simulation result with comprehensive analysis"""
    session_id: str
    coordinate: AxisCoordinate
    reasoning_chain: List[Dict[str, Any]]
    confidence: float = Field(ge=0, le=1, description="Overall confidence score")
    recommendations: List[str]
    
    # Advanced analytics
    axis_insights: Dict[str, Any] = Field(default_factory=dict, description="Deep axis analysis results")
    cross_correlations: List[Dict[str, Any]] = Field(default_factory=list, description="Cross-axis correlation analysis")
    complexity_assessment: Dict[str, Any] = Field(default_factory=dict, description="Complexity analysis metrics")
    optimization_opportunities: List[Dict[str, Any]] = Field(default_factory=list, description="Identified optimizations")
    
    # Performance metrics
    processing_time: float = Field(description="Total processing time in seconds")
    strategy_used: ReasoningStrategy = Field(description="Reasoning strategy employed")
    performance_metrics: Dict[str, float] = Field(default_factory=dict, description="Performance indicators")
    
    # Personas and regulatory
    personas_involved: List[Dict[str, Any]] = Field(default_factory=list, description="Persona analysis results")
    regulatory_status: Dict[str, Any] = Field(default_factory=dict, description="Regulatory compliance status")
    
    # Quality assurance
    validation_scores: Dict[str, float] = Field(default_factory=dict, description="Result validation metrics")
    optimization_applied: bool = Field(False, description="Whether optimization was applied")
    
    class Config:
        schema_extra = {
            "example": {
                "session_id": "session_123",
                "confidence": 0.87,
                "processing_time": 2.45,
                "strategy_used": "hybrid",
                "optimization_applied": True,
                "recommendations": [
                    "Consider staged implementation due to high complexity",
                    "Implement additional validation for regulatory compliance"
                ]
            }
        }

# Persona and regulatory models
class PersonaProfile(BaseModel):
    """Advanced persona profile with behavioral modeling"""
    persona_id: str
    name: str
    role_type: str
    authority_level: str
    domain_expertise: List[str]
    behavioral_traits: Dict[str, float] = Field(default_factory=dict, description="Behavioral characteristic scores")
    decision_patterns: Dict[str, Any] = Field(default_factory=dict, description="Decision-making patterns")
    risk_tolerance: float = Field(ge=0, le=1, description="Risk tolerance level")
    communication_style: str = Field("professional", description="Preferred communication approach")
    constraint_preferences: Dict[str, Any] = Field(default_factory=dict, description="Personal constraint preferences")

class RegulatoryContext(BaseModel):
    """Comprehensive regulatory context modeling"""
    jurisdiction: str
    frameworks: List[str]
    compliance_requirements: Dict[str, Any]
    audit_standards: List[str]
    risk_categories: Dict[str, str]
    enforcement_history: Optional[Dict[str, Any]] = None
    update_frequency: str = "quarterly"
    effective_date: datetime = Field(default_factory=datetime.utcnow)

# Knowledge graph models
class KnowledgeGraph(BaseModel):
    """Knowledge graph structure"""
    graph_id: str
    nodes: Dict[str, Dict[str, Any]] = Field(default_factory=dict)
    edges: List[Dict[str, Any]] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class AccessPermission(BaseModel):
    """Access control permissions"""
    user_id: str
    resource_id: str
    access_level: AccessLevel
    granted_by: str
    granted_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    conditions: Dict[str, Any] = Field(default_factory=dict)

class AuditRecord(BaseModel):
    """Security audit record"""
    record_id: str
    user_id: str
    action: str
    resource_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    success: bool
    details: Optional[str] = None
    ip_address: Optional[str] = None
    session_id: Optional[str] = None

# Session management models
class SessionState(BaseModel):
    """Enhanced session state management"""
    session_id: str
    status: SessionStatus
    current_stage: WorkflowStage
    start_time: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    
    # Core state
    primary_coordinate: Optional[AxisCoordinate] = None
    active_personas: List[PersonaProfile] = Field(default_factory=list)
    regulatory_context: Optional[RegulatoryContext] = None
    
    # Analysis state
    axis_analysis: Dict[str, Any] = Field(default_factory=dict)
    persona_calibrations: Dict[str, Any] = Field(default_factory=dict)
    simulation_results: List[EnhancedSimulationResult] = Field(default_factory=list)
    
    # Performance tracking
    processing_times: Dict[str, float] = Field(default_factory=dict)
    confidence_scores: Dict[str, float] = Field(default_factory=dict)
    optimization_history: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Error handling
    errors: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)

# Advanced analysis models
class ReasoningStep(BaseModel):
    """Individual step in reasoning chain"""
    step_number: int
    step_type: str
    description: str
    analysis: str
    confidence: float = Field(ge=0, le=1)
    evidence: Dict[str, Any] = Field(default_factory=dict)
    duration: Optional[float] = None

class AnalysisMetrics(BaseModel):
    """Comprehensive analysis metrics"""
    confidence: float = Field(ge=0, le=1)
    completeness: float = Field(ge=0, le=1)
    correlation_score: float = Field(ge=0, le=1)
    complexity_score: float = Field(ge=0, le=1)
    analysis_quality: float = Field(ge=0, le=1)
    processing_efficiency: float = Field(ge=0, le=1)

# API response models
class SessionStatusResponse(BaseModel):
    """Session status API response"""
    session_id: str
    status: SessionStatus
    current_stage: WorkflowStage
    duration: float
    progress: float = Field(ge=0, le=1)
    performance_metrics: Dict[str, float]
    confidence_scores: Dict[str, float]
    error_count: int
    warning_count: int
    results_count: int

class SystemMetricsResponse(BaseModel):
    """System performance metrics response"""
    total_sessions: int
    successful_simulations: int
    average_processing_time: float
    current_load: int
    optimization_improvements: int
    active_sessions: int
    total_sessions_managed: int
    system_uptime: str
    memory_usage: int
    workflow_efficiency: float

class SecurityMetricsResponse(BaseModel):
    """Security metrics API response"""
    total_records: int
    classification_distribution: Dict[str, int]
    access_level_distribution: Dict[str, int]
    recent_activities_24h: Dict[str, int]
    cache_hit_ratio: float
    knowledge_graph_nodes: int
    knowledge_graph_connections: int
    active_sessions: int
    security_level: str

# Mathematical operations models
class MathOperation(BaseModel):
    """Mathematical operation on coordinates"""
    operation_type: str
    description: str
    input_coordinates: List[AxisCoordinate]
    operation_parameters: Dict[str, Any] = Field(default_factory=dict)
    
class MathematicalResult(BaseModel):
    """Result of mathematical operations"""
    operation_id: str
    result_coordinate: AxisCoordinate
    confidence: float = Field(ge=0, le=1)
    intermediate_steps: List[Dict[str, Any]] = Field(default_factory=list)
    mathematical_proof: Optional[str] = None
    validation_metrics: Dict[str, float] = Field(default_factory=dict)

# Translation and crosswalk models
class AxisTranslationRequest(BaseModel):
    """Request for axis coordinate translation"""
    input_text: str = Field(description="Natural language description to translate")
    target_axes: Optional[List[str]] = Field(None, description="Specific axes to focus on")
    context: Optional[Dict[str, Any]] = Field(None, description="Additional context for translation")
    
class AxisTranslationResult(BaseModel):
    """Result of axis translation"""
    suggested_coordinate: AxisCoordinate
    confidence: float = Field(ge=0, le=1)
    translation_rationale: List[str]
    alternative_suggestions: List[AxisCoordinate] = Field(default_factory=list)

class CrosswalkMapping(BaseModel):
    """Mapping between different coordinate systems"""
    source_coordinate: AxisCoordinate
    target_coordinate: AxisCoordinate
    mapping_confidence: float = Field(ge=0, le=1)
    transformation_rules: List[str]
    validation_status: str

# Basic simulation models (for backward compatibility)
class SimulationRequest(BaseModel):
    """Basic simulation request"""
    base_coordinate: Optional[AxisCoordinate] = Field(None, description="Base coordinate")
    target_roles: Optional[List[str]] = Field(None, description="Target persona roles")
    expansion_rules: Optional[Dict[str, Any]] = Field(None, description="Expansion parameters")
    include_crosswalks: bool = Field(True, description="Include crosswalk mapping")

class SimulationResult(BaseModel):
    """Basic simulation result"""
    expanded_coordinate: AxisCoordinate = Field(..., description="Fully expanded coordinate")
    persona_activation_score: float = Field(..., description="Persona activation score")
    axis_mapping_log: List[str] = Field(..., description="Step-by-step mapping log")
    crosswalk_mappings: Optional[Dict[str, List[str]]] = Field(None, description="Crosswalk relationships")
    confidence_scores: Dict[str, float] = Field(..., description="Confidence per axis") 