from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional
import uvicorn
from datetime import datetime

# Import our models and engines
from models import (
    AxisCoordinate,
    AxisMetadata,
    MathematicalOperation,
    MathematicalResult,
    SimulationRequest,
    SimulationResult,
    AxisTranslationRequest,
    AxisTranslationResult,
    CrosswalkMapping,
    AXIS_METADATA,
    AXIS_KEYS
)
from math_engine import math_engine
from simulation_engine import simulation_engine

# Create FastAPI app
app = FastAPI(
    title="UKG/USKD 13-Axis System API",
    description="Universal Knowledge Graph / Universal Simulated Database 13-Axis System Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "service": "UKG/USKD 13-Axis System API"
    }

# Axis metadata endpoints
@app.get("/axis/", response_model=List[AxisMetadata])
async def list_axes():
    """Get metadata for all 13 axes"""
    return AXIS_METADATA

@app.get("/axis/{axis_key}", response_model=AxisMetadata)
async def get_axis_detail(axis_key: str):
    """Get detailed metadata for a specific axis"""
    for axis in AXIS_METADATA:
        if axis.key == axis_key:
            return axis
    raise HTTPException(status_code=404, detail=f"Axis '{axis_key}' not found")

@app.get("/axis/keys", response_model=List[str])
async def get_axis_keys():
    """Get list of all axis keys"""
    return AXIS_KEYS

# Coordinate operations
@app.post("/axis/parse", response_model=AxisCoordinate)
async def parse_nuremberg_coordinate(nuremberg_string: str):
    """Parse a Nuremberg coordinate string into AxisCoordinate"""
    try:
        # Split by pipe delimiter
        values = nuremberg_string.split("|")
        
        if len(values) != len(AXIS_KEYS):
            raise ValueError(f"Expected {len(AXIS_KEYS)} values, got {len(values)}")
        
        # Create coordinate dict
        coord_data = {}
        for i, key in enumerate(AXIS_KEYS):
            value = values[i].strip()
            if value:  # Only set non-empty values
                if key == "honeycomb" and value:
                    # Handle honeycomb as array
                    coord_data[key] = [v.strip() for v in value.split(",") if v.strip()]
                elif key == "sector":
                    # Try to convert sector to int if possible
                    try:
                        coord_data[key] = int(value)
                    except ValueError:
                        coord_data[key] = value
                else:
                    coord_data[key] = value
        
        # Ensure required fields
        if "pillar" not in coord_data:
            coord_data["pillar"] = "PL01.1.1"
        if "sector" not in coord_data:
            coord_data["sector"] = "Unknown"
        
        return AxisCoordinate(**coord_data)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse coordinate: {str(e)}")

@app.post("/axis/translate", response_model=AxisTranslationResult)
async def translate_text_to_coordinate(request: AxisTranslationRequest):
    """Translate natural language text to axis coordinate"""
    try:
        coordinate, confidence, rationale = simulation_engine.translate_text_to_coordinate(
            request.input_text,
            request.target_axes,
            request.context
        )
        
        return AxisTranslationResult(
            input_text=request.input_text,
            suggested_coordinate=coordinate,
            confidence_score=confidence,
            alternative_suggestions=[],  # Could implement multiple suggestions
            mapping_rationale=rationale
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Translation failed: {str(e)}")

@app.post("/axis/validate", response_model=Dict[str, Any])
async def validate_coordinate(coordinate: AxisCoordinate):
    """Validate and analyze an axis coordinate"""
    try:
        # Calculate various metrics
        nuremberg = coordinate.nuremberg_number()
        usi = coordinate.unified_system_id()
        completeness = coordinate.get_axis_completeness_ratio()
        filled_count = coordinate.get_filled_axes_count()
        
        # Validate format compliance
        validation_errors = []
        
        # Check pillar format
        if not coordinate.pillar.startswith("PL") or len(coordinate.pillar) < 6:
            validation_errors.append("Pillar must follow PLxx.x.x format")
        
        # Check temporal format if present
        if coordinate.temporal:
            try:
                datetime.fromisoformat(coordinate.temporal.replace('Z', '+00:00'))
            except ValueError:
                validation_errors.append("Temporal must be valid ISO 8601 format")
        
        return {
            "valid": len(validation_errors) == 0,
            "errors": validation_errors,
            "metrics": {
                "nuremberg_number": nuremberg,
                "usi": usi,
                "completeness_ratio": completeness,
                "filled_axes": filled_count,
                "total_axes": len(AXIS_KEYS)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Validation failed: {str(e)}")

# Crosswalk operations
@app.get("/axis/crosswalk", response_model=Dict[str, List[str]])
async def get_crosswalk_mappings():
    """Get available crosswalk mappings between axes"""
    return {
        "pillar_to_sector": [
            "PL12 → 5415 (Technology to Professional Services)",
            "PL08 → Healthcare (Analytics to Healthcare)",
            "PL03 → 62 (Healthcare to Healthcare Services)",
            "PL05 → 52 (Finance to Finance Services)",
            "PL15 → 5112 (AI/ML to Software)"
        ],
        "sector_to_regulatory": [
            "Healthcare → HIPAA",
            "62 → HIPAA",
            "52 → SOX",
            "Finance → SOX",
            "5415 → GDPR",
            "Tech → GDPR"
        ],
        "regulatory_to_compliance": [
            "HIPAA → HITECH",
            "GDPR → ISO-27001",
            "SOX → SOC1",
            "CFR-21 → FDA-21CFR"
        ],
        "role_to_pillar": [
            "Data Scientist → PL12.2.1",
            "Software Engineer → PL12.1.1",
            "Compliance Officer → PL06.1.1",
            "Healthcare Analyst → PL03.2.1",
            "AI Specialist → PL15.2.2"
        ]
    }

# Simulation endpoints
@app.post("/axis/simulate", response_model=SimulationResult)
async def simulate_axis_expansion(request: SimulationRequest):
    """Perform axis-driven simulation and role expansion"""
    try:
        result = simulation_engine.simulate_axis_expansion(request)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Simulation failed: {str(e)}")

# Mathematical operations
@app.post("/axis/math", response_model=MathematicalResult)
async def calculate_axis_math(operation: MathematicalOperation):
    """Perform mathematical operations on axis coordinates"""
    try:
        result = math_engine.execute_operation(
            operation.operation,
            operation.coordinate,
            operation.parameters,
            operation.weights
        )
        return result
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Mathematical operation failed: {str(e)}")

@app.get("/math/ops", response_model=List[str])
async def list_math_operations():
    """Get list of supported mathematical operations"""
    return math_engine.supported_operations

@app.post("/math/play", response_model=MathematicalResult)
async def math_playground(request: MathematicalOperation):
    """Mathematical operations playground"""
    try:
        result = math_engine.execute_operation(
            request.operation, 
            request.coordinate, 
            request.parameters, 
            request.weights
        )
        return result
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Math playground operation failed: {str(e)}")

# Example coordinates endpoint
@app.get("/examples/coordinates", response_model=List[AxisCoordinate])
async def get_example_coordinates():
    """Get example axis coordinates for testing and demonstration"""
    examples = [
        AxisCoordinate(
            pillar="PL12.2.1",
            sector="5415",
            honeycomb=["PL12↔5415"],
            branch="TECH.PROFESSIONAL_SERVICES",
            node="N-PL12-5415",
            regulatory="GDPR",
            compliance="ISO-27001",
            role_knowledge="Data Scientist",
            role_sector="Data Scientist - 5415",
            role_regulatory="Data Scientist - GDPR",
            role_compliance="Data Scientist - ISO-27001",
            location="US",
            temporal="2024-01-01T00:00:00Z"
        ),
        AxisCoordinate(
            pillar="PL03.2.1",
            sector="Healthcare",
            honeycomb=["PL03↔Healthcare"],
            branch="HEALTH.SERVICES",
            node="N-PL03-Healthcare",
            regulatory="HIPAA",
            compliance="HITECH",
            role_knowledge="Healthcare Analyst",
            role_sector="Healthcare Analyst - Healthcare",
            role_regulatory="Healthcare Analyst - HIPAA",
            role_compliance="Healthcare Analyst - HITECH",
            location="US",
            temporal="2024-01-01T00:00:00Z"
        ),
        AxisCoordinate(
            pillar="PL06.1.1",
            sector="52",
            honeycomb=["PL06↔52"],
            branch="FINANCE.SERVICES",
            regulatory="SOX",
            compliance="SOC1",
            role_knowledge="Compliance Officer",
            role_sector="Compliance Officer - 52",
            location="US",
            temporal="2024-01-01T00:00:00Z"
        )
    ]
    return examples

# System info endpoint
@app.get("/system/info", response_model=Dict[str, Any])
async def get_system_info():
    """Get system information and statistics"""
    return {
        "system_name": "UKG/USKD 13-Axis System",
        "version": "1.0.0",
        "axis_count": len(AXIS_KEYS),
        "supported_math_operations": len(math_engine.supported_operations),
        "axis_metadata": {
            "total_axes": len(AXIS_METADATA),
            "required_axes": ["pillar", "sector"],
            "optional_axes": [key for key in AXIS_KEYS if key not in ["pillar", "sector"]]
        },
        "mathematical_capabilities": {
            "operations": math_engine.supported_operations,
            "coordinate_functions": [
                "nuremberg_number",
                "unified_system_id", 
                "coordinate_hash",
                "completeness_ratio"
            ]
        },
        "simulation_capabilities": {
            "role_expansion": True,
            "crosswalk_mapping": True,
            "persona_scoring": True,
            "natural_language_translation": True
        }
    }

# Development and testing endpoints
@app.post("/dev/generate-sample", response_model=AxisCoordinate)
async def generate_sample_coordinate(role: Optional[str] = None):
    """Generate a sample coordinate for development/testing"""
    try:
        if role:
            # Generate based on role
            request = SimulationRequest(
                target_roles=[role],
                include_crosswalks=True
            )
            result = simulation_engine.simulate_axis_expansion(request)
            return result.expanded_coordinate
        else:
            # Generate random sample
            import random
            from datetime import datetime
            
            sample_roles = ["Data Scientist", "Software Engineer", "Healthcare Analyst", "Compliance Officer"]
            selected_role = random.choice(sample_roles)
            
            request = SimulationRequest(
                target_roles=[selected_role],
                include_crosswalks=True
            )
            result = simulation_engine.simulate_axis_expansion(request)
            return result.expanded_coordinate
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Sample generation failed: {str(e)}")

# Add new endpoints for enhanced functionality

@app.post("/crosswalk/analyze", response_model=Dict[str, Any])
async def analyze_crosswalk(
    source_axis: str = Query(..., description="Source axis name"),
    source_value: str = Query(..., description="Source axis value"),
    target_axis: str = Query(..., description="Target axis name")
):
    """Perform sophisticated crosswalk analysis between axes"""
    try:
        result = simulation_engine.perform_crosswalk_analysis(
            source_axis, source_value, target_axis
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/translate/text", response_model=Dict[str, Any])
async def translate_text_to_coordinate(text: str = Query(..., description="Natural language text to translate")):
    """Translate natural language text into axis coordinates using pattern matching"""
    try:
        result = simulation_engine.translate_text_to_coordinate(text)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/persona/expand", response_model=Dict[str, Any])
async def expand_persona(
    role_name: str = Query(..., description="Role/persona name to expand"),
    target_roles: Optional[List[str]] = Query(None, description="Target roles for activation scoring")
):
    """Expand a persona/role into full 13D coordinate with activation scoring"""
    try:
        result = simulation_engine.expand_persona(role_name, target_roles)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/roles/available", response_model=Dict[str, Any])
async def get_available_roles():
    """Get list of available roles and their metadata"""
    return {
        "available_roles": list(simulation_engine.role_mappings.keys()),
        "role_details": {
            name: {
                "pillar": role.get("pillar"),
                "sector": role.get("sector"),
                "skills": role.get("skills"),
                "activation_weight": role.get("activation_weight"),
                "crosswalk_axes": role.get("crosswalk_axes")
            }
            for name, role in simulation_engine.role_mappings.items()
        }
    }


@app.post("/math/playground", response_model=MathematicalResult)
async def mathematical_playground(request: MathematicalOperation):
    """Enhanced mathematical playground for testing all axis operations"""
    try:
        result = math_engine.execute_operation(
            operation=request.operation,
            axis_coordinate=request.coordinate,
            parameters=request.parameters,
            weights=request.weights
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/math/operations", response_model=Dict[str, List[str]])
async def get_mathematical_operations():
    """Get list of all supported mathematical operations"""
    return {
        "supported_operations": math_engine.supported_operations,
        "operation_descriptions": {
            "MCW": "Mathematical Confidence Weighting - weighted presence scoring",
            "entropy": "Shannon entropy of axis distribution",
            "certainty": "Certainty score (1 - normalized entropy)",
            "USI": "Unified System ID - SHA256 hash of core axes",
            "nuremberg": "Nuremberg number - pipe-delimited coordinate string",
            "temporal_delta": "Time difference calculation",
            "completeness": "Axis completeness ratio",
            "similarity": "Coordinate similarity scoring",
            "distance": "Multidimensional distance calculation",
            "crosswalk_score": "Crosswalk relevance scoring"
        }
    }


@app.post("/coordinate/validate", response_model=Dict[str, Any])
async def validate_coordinate(coordinate: AxisCoordinate):
    """Validate a 13D axis coordinate and provide feedback"""
    try:
        # Get completeness stats
        filled_count = coordinate.get_filled_axes_count()
        total_count = len(AXIS_KEYS)
        
        # Generate USI and Nuremberg
        usi = coordinate.unified_system_id()
        nuremberg = coordinate.nuremberg_number()
        
        # Calculate entropy
        entropy_result = math_engine._calculate_entropy(coordinate)
        
        return {
            "valid": True,
            "coordinate": coordinate,
            "statistics": {
                "filled_axes": filled_count,
                "total_axes": total_count,
                "completeness_ratio": filled_count / total_count,
                "entropy": entropy_result.result
            },
            "identifiers": {
                "usi": usi,
                "nuremberg": nuremberg
            },
            "validation_timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "valid": False,
            "error": str(e),
            "validation_timestamp": datetime.now().isoformat()
        }


@app.get("/examples/comprehensive", response_model=Dict[str, Any])
async def get_comprehensive_examples():
    """Get comprehensive examples showcasing all 13-axis features"""
    return {
        "data_scientist_example": {
            "pillar": "PL25.6.1",
            "sector": "5415",
            "honeycomb": ["PL25.6.1↔5415", "PL25.6.1↔GDPR-ART5"],
            "branch": "DATA_SCIENCE.ML",
            "node": "N-PL25.6.1-5415",
            "regulatory": "GDPR-ART5",
            "compliance": "ISO27001",
            "role_knowledge": "Data Scientist",
            "role_sector": "Tech Analyst",
            "role_regulatory": "GDPR Specialist",
            "role_compliance": "Data Protection Officer",
            "location": "EU-DE",
            "temporal": "2024-01-15T10:00:00Z"
        },
        "healthcare_analyst_example": {
            "pillar": "PL15.4.3",
            "sector": "6215",
            "honeycomb": ["PL15.4.3↔6215", "6215↔HIPAA-164"],
            "branch": "HEALTHCARE.ANALYTICS",
            "node": "N-PL15.4.3-6215",
            "regulatory": "HIPAA-164",
            "compliance": "SOC2",
            "role_knowledge": "Healthcare Analyst",
            "role_sector": "Healthcare Systems Expert",
            "role_regulatory": "HIPAA Compliance Officer",
            "role_compliance": "Medical Data Auditor",
            "location": "US-CA",
            "temporal": "2024-01-15T10:00:00Z"
        },
        "cybersecurity_specialist_example": {
            "pillar": "PL18.4.7",
            "sector": "5415",
            "honeycomb": ["PL18.4.7↔5415", "GDPR-ART32↔NIST_CSF"],
            "branch": "CYBERSECURITY.INFOSEC",
            "node": "N-PL18.4.7-5415",
            "regulatory": "GDPR-ART32",
            "compliance": "NIST_CSF",
            "role_knowledge": "Cybersecurity Specialist",
            "role_sector": "InfoSec Engineer",
            "role_regulatory": "Security Compliance Lead",
            "role_compliance": "NIST Framework Specialist",
            "location": "US-VA",
            "temporal": "2024-01-15T10:00:00Z"
        }
    }


@app.get("/crosswalk/types", response_model=Dict[str, Any])
async def get_crosswalk_types():
    """Get available crosswalk mapping types and rules"""
    return {
        "available_crosswalks": list(simulation_engine.crosswalk_rules.keys()),
        "crosswalk_rules": {
            f"{source_axis}→{target_axis}": {
                "source_axis": source_axis,
                "target_axis": target_axis,
                "mapping_count": len(mappings)
            }
            for (source_axis, target_axis), mappings in simulation_engine.crosswalk_rules.items()
        },
        "supported_patterns": {
            "pillar_indicators": list(simulation_engine.text_patterns["pillar_indicators"].keys()),
            "sector_indicators": list(simulation_engine.text_patterns["sector_indicators"].keys()),
            "regulatory_indicators": list(simulation_engine.text_patterns["regulatory_indicators"].keys()),
            "compliance_indicators": list(simulation_engine.text_patterns["compliance_indicators"].keys())
        }
    }


# Enhanced health check with more system information
@app.get("/health/detailed", response_model=Dict[str, Any])
async def detailed_health_check():
    """Detailed health check with system information"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "system_info": {
            "total_axes": len(AXIS_KEYS),
            "available_roles": len(simulation_engine.role_mappings),
            "crosswalk_rules": len(simulation_engine.crosswalk_rules),
            "mathematical_operations": len(math_engine.supported_operations),
            "text_patterns": sum(len(patterns) for patterns in simulation_engine.text_patterns.values())
        },
        "api_version": "1.1.0",
        "features": [
            "13-axis coordinate system",
            "mathematical operations",
            "persona expansion",
            "crosswalk analysis",
            "text-to-coordinate translation",
            "natural language processing patterns"
        ]
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
