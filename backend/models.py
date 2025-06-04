from pydantic import BaseModel, Field, validator
from typing import List, Union, Optional, Dict, Any
from datetime import datetime
import hashlib
import json
from enum import Enum


class AxisType(str, Enum):
    """Enumeration of the 13 axis types"""
    PILLAR = "pillar"
    SECTOR = "sector"
    HONEYCOMB = "honeycomb"
    BRANCH = "branch"
    NODE = "node"
    REGULATORY = "regulatory"
    COMPLIANCE = "compliance"
    ROLE_KNOWLEDGE = "role_knowledge"
    ROLE_SECTOR = "role_sector"
    ROLE_REGULATORY = "role_regulatory"
    ROLE_COMPLIANCE = "role_compliance"
    LOCATION = "location"
    TEMPORAL = "temporal"


# 16-Axis keys in order (expanded for enhanced functionality)
AXIS_KEYS = [
    "pillar",
    "sector",
    "honeycomb",
    "branch",
    "node",
    "regulatory",
    "compliance",
    "compliance_level",
    "audit_requirements", 
    "regulatory_framework",
    "role_knowledge",
    "role_sector",
    "role_regulatory",
    "role_compliance",
    "location",
    "temporal"
]


class AxisMetadata(BaseModel):
    """Metadata for each axis in the 13-axis system"""
    index: int = Field(..., description="Axis index (1-13)")
    key: str = Field(..., description="Axis key identifier")
    name: str = Field(..., description="Human-readable axis name")
    description: str = Field(..., description="Detailed description of the axis")
    formula: Optional[str] = Field(None, description="Mathematical formula or rule")
    data_type: str = Field(..., description="Expected data type")
    examples: List[str] = Field(default_factory=list, description="Example values")
    constraints: Optional[Dict[str, Any]] = Field(None, description="Value constraints")


class AxisCoordinate(BaseModel):
    """13-dimensional coordinate in the UKG/USKD system"""
    # Core Knowledge Architecture
    pillar: str = Field(..., description="Pillar Level System (PLxx.x.x)")
    sector: Union[str, int] = Field(..., description="Sector/Industry code")
    
    # Crosslink and Hierarchical Systems
    honeycomb: Optional[List[str]] = Field(None, description="Crosslink mappings")
    branch: Optional[str] = Field(None, description="Branch system hierarchy")
    node: Optional[str] = Field(None, description="Cross-sector node overlays")
    
    # Regulatory and Compliance Overlays
    regulatory: Optional[str] = Field(None, description="Regulatory framework code")
    compliance: Optional[str] = Field(None, description="Compliance standard code")
    compliance_level: Optional[str] = Field(None, description="Compliance level (strict, moderate, basic)")
    audit_requirements: Optional[str] = Field(None, description="Audit requirements level")
    regulatory_framework: Optional[str] = Field(None, description="Regulatory framework name")
    
    # Role/Persona Dimensions (4 role axes)
    role_knowledge: Optional[str] = Field(None, description="Knowledge domain role")
    role_sector: Optional[str] = Field(None, description="Sector expert role")
    role_regulatory: Optional[str] = Field(None, description="Regulatory expert role")
    role_compliance: Optional[str] = Field(None, description="Compliance/USI role")
    
    # Geospatial and Temporal
    location: Optional[str] = Field(None, description="Geographic location (ISO 3166)")
    temporal: Optional[str] = Field(None, description="Time/version (ISO 8601)")

    @validator('pillar')
    def validate_pillar(cls, v):
        """Validate pillar format - accept both PLxx.x.x format and natural language"""
        if v is None:
            return v
        # Allow natural language terms for AI translation
        if isinstance(v, str) and len(v) > 0:
            return v
        return v

    @validator('temporal')
    def validate_temporal(cls, v):
        """Validate ISO 8601 datetime format"""
        if v is None:
            return v
        try:
            datetime.fromisoformat(v.replace('Z', '+00:00'))
        except ValueError:
            raise ValueError('Temporal must be valid ISO 8601 format')
        return v

    def as_list(self) -> List[Union[str, List[str], None]]:
        """Return 13D coordinate as ordered list"""
        return [getattr(self, key, None) for key in AXIS_KEYS]

    def nuremberg_number(self) -> str:
        """Generate pipe-delimited 13D coordinate string"""
        values = []
        for key in AXIS_KEYS:
            value = getattr(self, key, None)
            if value is None:
                values.append("")
            elif isinstance(value, list):
                values.append(",".join(str(v) for v in value))
            else:
                values.append(str(value))
        return "|".join(values)

    def unified_system_id(self) -> str:
        """Generate Unified System ID (USI) hash"""
        # Core axes for USI: pillar + sector + location
        core_data = f"{self.pillar}|{self.sector}|{self.location or ''}"
        return hashlib.sha256(core_data.encode("utf-8")).hexdigest()

    def coordinate_hash(self) -> str:
        """Generate full coordinate hash"""
        return hashlib.sha256(self.nuremberg_number().encode("utf-8")).hexdigest()

    def get_filled_axes_count(self) -> int:
        """Count non-empty axes"""
        count = 0
        for key in AXIS_KEYS:
            value = getattr(self, key, None)
            if value is not None and value != "" and value != []:
                count += 1
        return count

    def get_axis_completeness_ratio(self) -> float:
        """Calculate completeness ratio (0.0 to 1.0)"""
        return self.get_filled_axes_count() / len(AXIS_KEYS)


class MathematicalOperation(BaseModel):
    """Request for mathematical operations on axis coordinates"""
    operation: str = Field(..., description="Operation type (MCW, entropy, etc.)")
    coordinate: AxisCoordinate = Field(..., description="Target coordinate")
    parameters: Optional[Dict[str, Any]] = Field(None, description="Operation parameters")
    weights: Optional[List[float]] = Field(None, description="Weights for weighted operations")


class MathematicalResult(BaseModel):
    """Result of mathematical operation"""
    operation: str = Field(..., description="Operation performed")
    result: Union[float, str, Dict[str, Any]] = Field(..., description="Operation result")
    explanation: str = Field(..., description="Human-readable explanation")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")


class SimulationRequest(BaseModel):
    """Request for axis-driven simulation"""
    base_coordinate: Optional[AxisCoordinate] = Field(None, description="Base coordinate")
    target_roles: Optional[List[str]] = Field(None, description="Target persona roles")
    expansion_rules: Optional[Dict[str, Any]] = Field(None, description="Expansion parameters")
    include_crosswalks: bool = Field(True, description="Include crosswalk mapping")


class SimulationResult(BaseModel):
    """Result of axis simulation"""
    expanded_coordinate: AxisCoordinate = Field(..., description="Fully expanded coordinate")
    persona_activation_score: float = Field(..., description="Persona activation score")
    axis_mapping_log: List[str] = Field(..., description="Step-by-step mapping log")
    crosswalk_mappings: Optional[Dict[str, List[str]]] = Field(None, description="Crosswalk relationships")
    confidence_scores: Dict[str, float] = Field(..., description="Confidence per axis")


class CrosswalkMapping(BaseModel):
    """Crosswalk relationship between axes"""
    from_axis: str = Field(..., description="Source axis")
    to_axis: str = Field(..., description="Target axis")
    from_value: str = Field(..., description="Source value")
    to_values: List[str] = Field(..., description="Mapped target values")
    relationship_type: str = Field(..., description="Type of relationship")
    confidence: float = Field(..., description="Mapping confidence (0.0-1.0)")


class AxisTranslationRequest(BaseModel):
    """Request to translate names/tags to axis coordinates"""
    input_text: str = Field(..., description="Input text to translate")
    target_axes: Optional[List[str]] = Field(None, description="Specific axes to target")
    context: Optional[Dict[str, Any]] = Field(None, description="Additional context")


class AxisTranslationResult(BaseModel):
    """Result of axis translation"""
    input_text: str = Field(..., description="Original input")
    suggested_coordinate: AxisCoordinate = Field(..., description="Suggested coordinate")
    confidence_score: float = Field(..., description="Translation confidence")
    alternative_suggestions: List[AxisCoordinate] = Field(default_factory=list, description="Alternative coordinates")
    mapping_rationale: List[str] = Field(..., description="Explanation of mapping decisions")


# Static axis metadata
AXIS_METADATA: List[AxisMetadata] = [
    AxisMetadata(
        index=1,
        key="pillar",
        name="Pillar Level System",
        description="Human knowledge architecture primary anchor/index",
        formula="PLxx.x.x",
        data_type="string",
        examples=["PL01.1.1", "PL12.2.1", "PL08.4.2"],
        constraints={"pattern": r"^PL\d{2}\.\d+\.\d+$"}
    ),
    AxisMetadata(
        index=2,
        key="sector",
        name="Sector of Industry",
        description="Industry/domain codes (NAICS, SIC, etc.)",
        formula="Integer or string code",
        data_type="string|int",
        examples=["5415", "62", "Healthcare", "541511"],
        constraints={"min_length": 1}
    ),
    AxisMetadata(
        index=3,
        key="honeycomb",
        name="Honeycomb System",
        description="Crosslinks/pairings (pillar↔sector); mesh for dynamic crosswalks",
        formula="[Pillar↔Sector,...]",
        data_type="array[string]",
        examples=["PL12↔5415", "PL08↔Healthcare"],
        constraints={"pattern": r"^PL\d{2}↔.*$"}
    ),
    AxisMetadata(
        index=4,
        key="branch",
        name="Branch System",
        description="Disciplinary/industry hierarchy/taxonomy",
        formula="Branch path code",
        data_type="string",
        examples=["TECH.AI.ML", "HEALTH.CLINICAL.NURSING"],
        constraints={"separator": "."}
    ),
    AxisMetadata(
        index=5,
        key="node",
        name="Node System",
        description="Cross-sector node/convergence overlays",
        formula="N-{Pillar}-{Sector}",
        data_type="string",
        examples=["N-PL12-5415", "N-PL08-Healthcare"],
        constraints={"pattern": r"^N-PL\d{2}-.*$"}
    ),
    AxisMetadata(
        index=6,
        key="regulatory",
        name="Regulatory (Octopus)",
        description="Regulatory overlays (CFR, GDPR, HIPAA, etc.)",
        formula="Regulatory code",
        data_type="string",
        examples=["CFR-21", "GDPR", "HIPAA", "SOX"],
        constraints={"min_length": 2}
    ),
    AxisMetadata(
        index=7,
        key="compliance",
        name="Compliance (Spiderweb)",
        description="Standard/compliance overlays (ISO, NIST, etc.)",
        formula="Compliance code",
        data_type="string",
        examples=["ISO-27001", "NIST-800-53", "SOC2", "FedRAMP"],
        constraints={"min_length": 2}
    ),
    AxisMetadata(
        index=8,
        key="role_knowledge",
        name="Knowledge Role/Persona",
        description="Persona/job/skill mapping (knowledge domain)",
        formula="Role identifier",
        data_type="string",
        examples=["Data Scientist", "Software Engineer", "Compliance Officer"],
        constraints={"min_length": 2}
    ),
    AxisMetadata(
        index=9,
        key="role_sector",
        name="Sector Expert Role",
        description="Persona (industry alignment)",
        formula="Role identifier",
        data_type="string",
        examples=["Healthcare Analyst", "Financial Advisor", "Manufacturing Engineer"],
        constraints={"min_length": 2}
    ),
    AxisMetadata(
        index=10,
        key="role_regulatory",
        name="Regulatory Expert Role",
        description="Persona (regulatory/compliance)",
        formula="Role identifier",
        data_type="string",
        examples=["GDPR Officer", "HIPAA Compliance", "FDA Specialist"],
        constraints={"min_length": 2}
    ),
    AxisMetadata(
        index=11,
        key="role_compliance",
        name="Compliance Expert/USI",
        description="Compliance persona/unified system orchestrator",
        formula="Role/hash identifier",
        data_type="string",
        examples=["ISO Auditor", "NIST Specialist", "SOC Analyst"],
        constraints={"min_length": 2}
    ),
    AxisMetadata(
        index=12,
        key="location",
        name="Location",
        description="Geospatial/region anchor (ISO 3166)",
        formula="ISO 3166 country/region code",
        data_type="string",
        examples=["US", "US-CA", "GB", "DE", "JP"],
        constraints={"pattern": r"^[A-Z]{2}(-[A-Z0-9]{1,3})?$"}
    ),
    AxisMetadata(
        index=13,
        key="temporal",
        name="Temporal",
        description="Time/version window (ISO 8601)",
        formula="ISO 8601 datetime",
        data_type="string",
        examples=["2024-01-01T00:00:00Z", "2024-Q1", "2024-01"],
        constraints={"format": "iso8601"}
    ),
] 