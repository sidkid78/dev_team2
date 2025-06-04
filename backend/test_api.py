import pytest
from fastapi.testclient import TestClient
from main import app
from models import AxisCoordinate, SimulationRequest, MathematicalOperation

# Create test client
client = TestClient(app)

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data

def test_list_axes():
    """Test listing all axes"""
    response = client.get("/axis/")
    assert response.status_code == 200
    axes = response.json()
    assert len(axes) == 13
    assert all("key" in axis for axis in axes)
    assert all("name" in axis for axis in axes)

def test_get_axis_detail():
    """Test getting specific axis detail"""
    response = client.get("/axis/pillar")
    assert response.status_code == 200
    axis = response.json()
    assert axis["key"] == "pillar"
    assert axis["name"] == "Pillar Level System"

def test_get_axis_keys():
    """Test getting axis keys"""
    response = client.get("/axis/keys")
    assert response.status_code == 200
    keys = response.json()
    assert len(keys) == 13
    assert "pillar" in keys
    assert "sector" in keys

def test_parse_nuremberg_coordinate():
    """Test parsing Nuremberg coordinate string"""
    nuremberg = "PL12.2.1|5415|PL12↔5415|TECH.PROFESSIONAL_SERVICES|N-PL12-5415|GDPR|ISO-27001|Data Scientist|Data Scientist - 5415|Data Scientist - GDPR|Data Scientist - ISO-27001|US|2024-01-01T00:00:00Z"
    
    response = client.post("/axis/parse", params={"nuremberg_string": nuremberg})
    assert response.status_code == 200
    coord = response.json()
    assert coord["pillar"] == "PL12.2.1"
    assert coord["sector"] == 5415
    assert coord["role_knowledge"] == "Data Scientist"

def test_translate_text_to_coordinate():
    """Test text translation to coordinate"""
    request_data = {
        "input_text": "I am a data scientist working in healthcare",
        "target_axes": None,
        "context": None
    }
    
    response = client.post("/axis/translate", json=request_data)
    assert response.status_code == 200
    result = response.json()
    assert "suggested_coordinate" in result
    assert "confidence_score" in result
    assert result["confidence_score"] > 0

def test_validate_coordinate():
    """Test coordinate validation"""
    coordinate_data = {
        "pillar": "PL12.2.1",
        "sector": "5415",
        "role_knowledge": "Data Scientist"
    }
    
    response = client.post("/axis/validate", json=coordinate_data)
    assert response.status_code == 200
    result = response.json()
    assert "valid" in result
    assert "metrics" in result
    assert "nuremberg_number" in result["metrics"]

def test_get_crosswalk_mappings():
    """Test getting crosswalk mappings"""
    response = client.get("/axis/crosswalk")
    assert response.status_code == 200
    mappings = response.json()
    assert "pillar_to_sector" in mappings
    assert "sector_to_regulatory" in mappings
    assert len(mappings["pillar_to_sector"]) > 0

def test_simulate_axis_expansion():
    """Test axis simulation"""
    request_data = {
        "base_coordinate": None,
        "target_roles": ["Data Scientist"],
        "expansion_rules": None,
        "include_crosswalks": True
    }
    
    response = client.post("/axis/simulate", json=request_data)
    assert response.status_code == 200
    result = response.json()
    assert "expanded_coordinate" in result
    assert "persona_activation_score" in result
    assert "axis_mapping_log" in result
    assert result["persona_activation_score"] > 0

def test_math_operations():
    """Test mathematical operations"""
    operation_data = {
        "operation": "MCW",
        "axis_coordinate": {
            "pillar": "PL12.2.1",
            "sector": "5415",
            "role_knowledge": "Data Scientist"
        },
        "parameters": None,
        "weights": None
    }
    
    response = client.post("/axis/math", json=operation_data)
    assert response.status_code == 200
    result = response.json()
    assert result["operation"] == "MCW"
    assert "result" in result
    assert "explanation" in result

def test_list_math_operations():
    """Test listing math operations"""
    response = client.get("/math/ops")
    assert response.status_code == 200
    operations = response.json()
    assert "MCW" in operations
    assert "entropy" in operations
    assert "USI" in operations

def test_math_playground():
    """Test math playground"""
    coordinate_data = {
        "pillar": "PL12.2.1",
        "sector": "5415"
    }
    
    response = client.post(
        "/math/play",
        params={"operation": "completeness"},
        json=coordinate_data
    )
    assert response.status_code == 200
    result = response.json()
    assert result["operation"] == "completeness"
    assert isinstance(result["result"], float)

def test_get_example_coordinates():
    """Test getting example coordinates"""
    response = client.get("/examples/coordinates")
    assert response.status_code == 200
    examples = response.json()
    assert len(examples) > 0
    assert all("pillar" in coord for coord in examples)
    assert all("sector" in coord for coord in examples)

def test_get_system_info():
    """Test getting system information"""
    response = client.get("/system/info")
    assert response.status_code == 200
    info = response.json()
    assert info["system_name"] == "UKG/USKD 13-Axis System"
    assert info["axis_count"] == 13
    assert "mathematical_capabilities" in info
    assert "simulation_capabilities" in info

def test_generate_sample_coordinate():
    """Test generating sample coordinate"""
    response = client.post("/dev/generate-sample", params={"role": "Data Scientist"})
    assert response.status_code == 200
    coord = response.json()
    assert coord["pillar"].startswith("PL")
    assert "role_knowledge" in coord

def test_invalid_axis_key():
    """Test getting invalid axis"""
    response = client.get("/axis/invalid_axis")
    assert response.status_code == 404

def test_invalid_coordinate_validation():
    """Test validating invalid coordinate"""
    invalid_coordinate = {
        "pillar": "INVALID",  # Invalid format
        "sector": "5415"
    }
    
    response = client.post("/axis/validate", json=invalid_coordinate)
    assert response.status_code == 200
    result = response.json()
    assert result["valid"] == False
    assert len(result["errors"]) > 0

def test_math_operation_entropy():
    """Test entropy calculation"""
    operation_data = {
        "operation": "entropy",
        "axis_coordinate": {
            "pillar": "PL12.2.1",
            "sector": "5415",
            "role_knowledge": "Data Scientist"
        }
    }
    
    response = client.post("/axis/math", json=operation_data)
    assert response.status_code == 200
    result = response.json()
    assert result["operation"] == "entropy"
    assert isinstance(result["result"], float)
    assert result["result"] >= 0

def test_math_operation_usi():
    """Test USI calculation"""
    operation_data = {
        "operation": "USI",
        "axis_coordinate": {
            "pillar": "PL12.2.1",
            "sector": "5415",
            "location": "US"
        }
    }
    
    response = client.post("/axis/math", json=operation_data)
    assert response.status_code == 200
    result = response.json()
    assert result["operation"] == "USI"
    assert isinstance(result["result"], str)
    assert len(result["result"]) == 64  # SHA256 hash length

if __name__ == "__main__":
    pytest.main([__file__, "-v"]) 