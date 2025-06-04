from typing import List, Dict, Any, Optional, Tuple
import random
from models import (
    AxisCoordinate, 
    SimulationRequest, 
    SimulationResult,
    CrosswalkMapping,
    AXIS_KEYS,
    AXIS_METADATA
)
from math_engine import math_engine, calculate_axis_relevance
import re
import numpy as np
from datetime import datetime


class AxisSimulationEngine:
    """Enhanced simulation engine for 13-axis coordinate system with sophisticated crosswalk analysis"""
    
    def __init__(self):
        # Enhanced role mappings with more sophisticated persona data
        self.role_mappings = {
            "Data Scientist": {
                "role_knowledge": "Data Scientist",
                "pillar": "PL25.6.1",
                "sector": "5415",
                "skills": ["machine_learning", "statistics", "python", "data_analysis"],
                "activation_weight": 0.95,
                "crosswalk_axes": ["pillar", "sector", "regulatory"]
            },
            "Software Engineer": {
                "role_knowledge": "Software Engineer", 
                "pillar": "PL09.3.2",
                "sector": "5415",
                "skills": ["programming", "software_architecture", "apis", "databases"],
                "activation_weight": 0.90,
                "crosswalk_axes": ["pillar", "sector", "compliance"]
            },
            "Healthcare Analyst": {
                "role_knowledge": "Healthcare Analyst",
                "role_sector": "Healthcare Analyst",
                "pillar": "PL15.4.3", 
                "sector": "6215",
                "regulatory": "HIPAA-164",
                "skills": ["medical_data", "healthcare_systems", "patient_privacy"],
                "activation_weight": 0.88,
                "crosswalk_axes": ["pillar", "sector", "regulatory", "compliance"]
            },
            "Physicist": {
                "role_knowledge": "Physicist",
                "pillar": "PL12.2.1",
                "sector": "5417", 
                "skills": ["theoretical_physics", "mathematics", "modeling", "research"],
                "activation_weight": 0.85,
                "crosswalk_axes": ["pillar", "sector"]
            },
            "Compliance Auditor": {
                "role_knowledge": "Compliance Auditor",
                "role_compliance": "Compliance Auditor",
                "pillar": "PL18.4.7",
                "regulatory": "CFR_40.122",
                "compliance": "ISO9001",
                "skills": ["audit", "risk_assessment", "regulatory_compliance", "documentation"],
                "activation_weight": 0.92,
                "crosswalk_axes": ["regulatory", "compliance", "pillar"]
            },
            "GDPR Compliance Officer": {
                "role_regulatory": "GDPR Compliance Officer",
                "pillar": "PL18.4.7",
                "regulatory": "GDPR-ART5",
                "compliance": "ISO27001",
                "skills": ["privacy_law", "data_protection", "gdpr", "compliance_management"],
                "activation_weight": 0.93,
                "crosswalk_axes": ["regulatory", "compliance", "location"]
            },
            "Manufacturing Engineer": {
                "role_sector": "Manufacturing Engineer",
                "pillar": "PL14.3.2",
                "sector": "3345",
                "compliance": "ISO9001",
                "skills": ["process_optimization", "quality_control", "lean_manufacturing"],
                "activation_weight": 0.87,
                "crosswalk_axes": ["pillar", "sector", "compliance"]
            },
            "Cybersecurity Specialist": {
                "role_knowledge": "Cybersecurity Specialist",
                "pillar": "PL18.4.7",
                "sector": "5415",
                "regulatory": "GDPR-ART32",
                "compliance": "NIST_CSF",
                "skills": ["information_security", "threat_analysis", "incident_response"],
                "activation_weight": 0.94,
                "crosswalk_axes": ["pillar", "sector", "regulatory", "compliance"]
            }
        }
        
        # Enhanced crosswalk rules for sophisticated axis traversal
        self.crosswalk_rules = {
            # Pillar to Sector mappings
            ("pillar", "sector"): {
                "PL25.6.1": ["5415", "6215"],  # Data Science -> Software/Healthcare
                "PL12.2.1": ["5417", "3345"],  # Physics -> R&D/Manufacturing  
                "PL18.4.7": ["5415", "9281"],  # Cybersecurity -> Software/Defense
                "PL15.4.3": ["6215", "6216"],  # Healthcare -> Medical
                "PL14.3.2": ["3345", "3346"],  # Engineering -> Manufacturing
            },
            # Sector to Regulatory mappings
            ("sector", "regulatory"): {
                "6215": ["HIPAA-164", "FDA-CFR21"],  # Healthcare
                "5415": ["GDPR-ART5", "SOX-404"],    # Software  
                "9281": ["ITAR", "NIST_800-53"],     # Defense
                "3345": ["OSHA", "EPA-CAA"],         # Manufacturing
            },
            # Regulatory to Compliance mappings
            ("regulatory", "compliance"): {
                "HIPAA-164": ["ISO27001", "SOC2"],
                "GDPR-ART5": ["ISO27001", "SOC2"], 
                "ITAR": ["CMMC", "ISO27001"],
                "OSHA": ["ISO45001", "ISO14001"],
                "FDA-CFR21": ["ISO13485", "GMP"],
            }
        }
        
        # Natural language patterns for text-to-coordinate translation
        self.text_patterns = {
            "pillar_indicators": {
                r"data science|machine learning|ai|artificial intelligence": "PL25.6.1",
                r"physics|theoretical physics|quantum": "PL12.2.1", 
                r"cybersecurity|information security|infosec": "PL18.4.7",
                r"healthcare|medical|patient": "PL15.4.3",
                r"engineering|manufacturing|industrial": "PL14.3.2",
            },
            "sector_indicators": {
                r"healthcare|medical|hospital|clinic": "6215",
                r"software|tech|programming|development": "5415",
                r"defense|military|government": "9281", 
                r"manufacturing|factory|production": "3345",
                r"research|r&d|laboratory": "5417",
            },
            "regulatory_indicators": {
                r"hipaa|health insurance": "HIPAA-164",
                r"gdpr|privacy|data protection": "GDPR-ART5",
                r"itar|export control": "ITAR",
                r"osha|workplace safety": "OSHA",
                r"fda|drug|medical device": "FDA-CFR21",
            },
            "compliance_indicators": {
                r"iso 27001|information security management": "ISO27001", 
                r"soc 2|service organization": "SOC2",
                r"iso 9001|quality management": "ISO9001",
                r"nist|cybersecurity framework": "NIST_CSF",
                r"cmmc|cybersecurity maturity": "CMMC",
            }
        }
    
    def expand_persona(self, role_name: str, target_roles: Optional[List[str]] = None) -> Dict[str, Any]:
        """Expand a persona/role into full 13D coordinate with activation scoring"""
        
        if role_name not in self.role_mappings:
            return {
                "error": f"Unknown role: {role_name}",
                "available_roles": list(self.role_mappings.keys())
            }
        
        role_data = self.role_mappings[role_name]
        
        # Create base coordinate from role mapping
        coordinate_data = {
            "pillar": role_data.get("pillar", "PL01.1.1"),
            "sector": role_data.get("sector", "5415"),
            "role_knowledge": role_data.get("role_knowledge"),
            "role_sector": role_data.get("role_sector"), 
            "role_regulatory": role_data.get("role_regulatory"),
            "role_compliance": role_data.get("role_compliance"),
            "regulatory": role_data.get("regulatory"),
            "compliance": role_data.get("compliance"),
        }
        
        # Generate crosswalk connections
        crosswalks = self._generate_crosswalks(coordinate_data)
        coordinate_data["honeycomb"] = crosswalks.get("honeycomb", [])
        coordinate_data["node"] = crosswalks.get("node")
        
        # Calculate persona activation score
        activation_score = self._calculate_persona_activation_score(
            role_data, target_roles or []
        )
        
        # Generate traversal path
        traversal_path = self._generate_traversal_path(coordinate_data, role_data["crosswalk_axes"])
        
        return {
            "role_name": role_name,
            "coordinate": coordinate_data,
            "activation_score": activation_score,
            "skills": role_data["skills"], 
            "traversal_path": traversal_path,
            "crosswalk_connections": len(crosswalks.get("honeycomb", [])),
            "primary_axes": role_data["crosswalk_axes"]
        }
    
    def translate_text_to_coordinate(self, text: str, target_axes: Optional[List[str]] = None, context: Optional[Dict[str, Any]] = None) -> Tuple[AxisCoordinate, float, List[str]]:
        """Translate natural language text into axis coordinates using pattern matching"""
        
        text_lower = text.lower()
        coordinate_data = {}
        matches = {}
        rationale = []
        
        # Match pillar indicators
        for pattern, pillar_code in self.text_patterns["pillar_indicators"].items():
            if re.search(pattern, text_lower):
                coordinate_data["pillar"] = pillar_code
                matches["pillar"] = pattern
                rationale.append(f"Matched pillar '{pillar_code}' from pattern: {pattern}")
                break
        
        # Match sector indicators  
        for pattern, sector_code in self.text_patterns["sector_indicators"].items():
            if re.search(pattern, text_lower):
                coordinate_data["sector"] = sector_code
                matches["sector"] = pattern
                rationale.append(f"Matched sector '{sector_code}' from pattern: {pattern}")
                break
        
        # Match regulatory indicators
        for pattern, reg_code in self.text_patterns["regulatory_indicators"].items():
            if re.search(pattern, text_lower):
                coordinate_data["regulatory"] = reg_code
                matches["regulatory"] = pattern
                rationale.append(f"Matched regulatory '{reg_code}' from pattern: {pattern}")
                break
        
        # Match compliance indicators
        for pattern, comp_code in self.text_patterns["compliance_indicators"].items():
            if re.search(pattern, text_lower):
                coordinate_data["compliance"] = comp_code
                matches["compliance"] = pattern
                rationale.append(f"Matched compliance '{comp_code}' from pattern: {pattern}")
                break
        
        # Add defaults if no matches
        if not coordinate_data.get("pillar"):
            coordinate_data["pillar"] = "PL01.1.1"
            rationale.append("Applied default pillar: PL01.1.1")
        if not coordinate_data.get("sector"):
            coordinate_data["sector"] = "5415"
            rationale.append("Applied default sector: 5415")
        
        # Use context if provided
        if context:
            for key, value in context.items():
                if key in AXIS_KEYS and value:
                    coordinate_data[key] = value
                    rationale.append(f"Applied context {key}: {value}")
        
        # Generate crosswalks and metadata
        crosswalks = self._generate_crosswalks(coordinate_data)
        coordinate_data.update(crosswalks)
        
        if crosswalks.get("honeycomb"):
            rationale.append(f"Generated crosswalks: {crosswalks['honeycomb']}")
        if crosswalks.get("node"):
            rationale.append(f"Generated node: {crosswalks['node']}")
        
        confidence_score = len(matches) / 4.0  # Max 4 types of matches
        
        # Create AxisCoordinate object
        coordinate = AxisCoordinate(**coordinate_data)
        
        return coordinate, confidence_score, rationale
    
    def perform_crosswalk_analysis(
        self, 
        source_axis: str, 
        source_value: str, 
        target_axis: str
    ) -> Dict[str, Any]:
        """Perform sophisticated crosswalk analysis between axes"""
        
        crosswalk_key = (source_axis, target_axis)
        reverse_key = (target_axis, source_axis)
        
        mappings = []
        traversal_path = [f"{source_axis}:{source_value}"]
        
        # Direct crosswalk
        if crosswalk_key in self.crosswalk_rules:
            direct_mappings = self.crosswalk_rules[crosswalk_key].get(source_value, [])
            for target_value in direct_mappings:
                mappings.append({
                    "source_value": source_value,
                    "target_values": [target_value],
                    "confidence": 0.95,
                    "reasoning": f"Direct {source_axis} to {target_axis} mapping"
                })
                traversal_path.append(f"{target_axis}:{target_value}")
        
        # Reverse crosswalk
        elif reverse_key in self.crosswalk_rules:
            reverse_mappings = self.crosswalk_rules[reverse_key]
            for rev_source, rev_targets in reverse_mappings.items():
                if source_value in rev_targets:
                    mappings.append({
                        "source_value": source_value,
                        "target_values": [rev_source],
                        "confidence": 0.90,
                        "reasoning": f"Reverse {target_axis} to {source_axis} mapping"
                    })
                    traversal_path.append(f"{target_axis}:{rev_source}")
        
        # Indirect crosswalk (via intermediate axis)
        else:
            indirect_mappings = self._find_indirect_crosswalk(source_axis, source_value, target_axis)
            mappings.extend(indirect_mappings)
            if indirect_mappings:
                traversal_path.extend([m["intermediate_path"] for m in indirect_mappings if "intermediate_path" in m])
        
        # Generate related coordinates
        related_coordinates = self._generate_related_coordinates(source_axis, source_value, mappings)
        
        return {
            "source_axis": source_axis,
            "target_axis": target_axis,
            "mappings": mappings,
            "traversal_path": traversal_path,
            "related_coordinates": related_coordinates,
            "analysis_timestamp": datetime.now().isoformat()
        }
    
    def _generate_crosswalks(self, coordinate_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate honeycomb crosslinks and node connections"""
        
        honeycomb = []
        pillar = coordinate_data.get("pillar")
        sector = coordinate_data.get("sector") 
        regulatory = coordinate_data.get("regulatory")
        compliance = coordinate_data.get("compliance")
        
        # Generate crosslinks
        if pillar and sector:
            honeycomb.append(f"{pillar}↔{sector}")
        if pillar and regulatory:
            honeycomb.append(f"{pillar}↔{regulatory}")
        if sector and regulatory:
            honeycomb.append(f"{sector}↔{regulatory}")
        if regulatory and compliance:
            honeycomb.append(f"{regulatory}↔{compliance}")
        
        # Generate node
        node = None
        if pillar and sector:
            node = f"N-{pillar}-{sector}"
        elif pillar:
            node = f"N-{pillar}"
        
        return {
            "honeycomb": honeycomb,
            "node": node
        }
    
    def _calculate_persona_activation_score(
        self, 
        role_data: Dict[str, Any], 
        target_roles: List[str]
    ) -> float:
        """Calculate how well a persona activates given target roles"""
        
        base_weight = role_data.get("activation_weight", 0.5)
        
        if not target_roles:
            return base_weight
        
        # Check overlap with target roles
        role_overlap = 0.0
        skills = role_data.get("skills", [])
        
        for target_role in target_roles:
            if target_role in self.role_mappings:
                target_skills = self.role_mappings[target_role].get("skills", [])
                overlap = len(set(skills) & set(target_skills))
                total_skills = len(set(skills) | set(target_skills))
                if total_skills > 0:
                    role_overlap += overlap / total_skills
        
        # Average overlap across target roles
        if target_roles:
            role_overlap /= len(target_roles)
        
        # Combine base weight with role overlap
        activation_score = (base_weight * 0.7) + (role_overlap * 0.3)
        
        return min(1.0, activation_score)
    
    def _generate_traversal_path(self, coordinate_data: Dict[str, Any], primary_axes: List[str]) -> List[str]:
        """Generate a logical traversal path through the coordinate space"""
        
        path = []
        
        for axis in primary_axes:
            value = coordinate_data.get(axis)
            if value:
                path.append(f"{axis}:{value}")
        
        # Add crosswalk connections
        honeycomb = coordinate_data.get("honeycomb", [])
        for link in honeycomb:
            path.append(f"crosswalk:{link}")
        
        return path
    
    def _find_indirect_crosswalk(
        self, 
        source_axis: str, 
        source_value: str, 
        target_axis: str
    ) -> List[Dict[str, Any]]:
        """Find indirect crosswalk mappings via intermediate axes"""
        
        mappings = []
        
        # Try common intermediate axes
        intermediate_axes = ["pillar", "sector", "regulatory", "compliance"]
        
        for intermediate_axis in intermediate_axes:
            if intermediate_axis == source_axis or intermediate_axis == target_axis:
                continue
            
            # Check source -> intermediate
            source_to_intermediate = (source_axis, intermediate_axis)
            if source_to_intermediate in self.crosswalk_rules:
                intermediate_values = self.crosswalk_rules[source_to_intermediate].get(source_value, [])
                
                # Check intermediate -> target
                for intermediate_value in intermediate_values:
                    intermediate_to_target = (intermediate_axis, target_axis)
                    if intermediate_to_target in self.crosswalk_rules:
                        target_values = self.crosswalk_rules[intermediate_to_target].get(intermediate_value, [])
                        
                        if target_values:
                            mappings.append({
                                "source_value": source_value,
                                "target_values": target_values,
                                "confidence": 0.75,
                                "reasoning": f"Indirect mapping via {intermediate_axis}:{intermediate_value}",
                                "intermediate_path": f"{intermediate_axis}:{intermediate_value}"
                            })
        
        return mappings
    
    def _generate_related_coordinates(
        self, 
        source_axis: str, 
        source_value: str, 
        mappings: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Generate related coordinates based on crosswalk mappings"""
        
        related = []
        
        for mapping in mappings:
            for target_value in mapping["target_values"]:
                coordinate = {
                    source_axis: source_value,
                    "target_axis": target_value,
                    "confidence": mapping["confidence"],
                    "relationship": mapping["reasoning"]
                }
                related.append(coordinate)
        
        return related

    def simulate_axis_expansion(self, request: SimulationRequest) -> SimulationResult:
        """Main simulation method for axis-driven expansion (backward compatibility)"""
        
        # Start with base coordinate or create minimal one
        if request.base_coordinate:
            expanded_coord = request.base_coordinate.copy()
        else:
            expanded_coord = AxisCoordinate(pillar="PL01.1.1", sector="5415")
        
        mapping_log = ["Starting axis simulation..."]
        confidence_scores = {}
        
        # Apply role-based expansions using new persona expansion
        if request.target_roles:
            for role in request.target_roles:
                if role in self.role_mappings:
                    role_expansion = self.expand_persona(role, request.target_roles)
                    
                    # Update coordinate with role expansion data
                    if "coordinate" in role_expansion:
                        coord_data = role_expansion["coordinate"]
                        for key, value in coord_data.items():
                            if value and hasattr(expanded_coord, key):
                                setattr(expanded_coord, key, value)
                    
                    mapping_log.append(f"Expanded role: {role}")
                    mapping_log.extend(role_expansion.get("traversal_path", []))
                    confidence_scores[f"role_{role}"] = role_expansion.get("activation_score", 0.5)
        
        # Calculate overall persona activation score
        persona_score = 0.0
        if request.target_roles:
            persona_score = sum(confidence_scores.get(f"role_{role}", 0.0) for role in request.target_roles) / len(request.target_roles)
        
        # Generate crosswalk mappings if requested
        crosswalk_mappings = None
        if request.include_crosswalks:
            crosswalk_mappings = self._generate_crosswalk_mappings_old_format(expanded_coord)
        
        mapping_log.append(f"Simulation complete. Persona score: {persona_score:.3f}")
        
        return SimulationResult(
            expanded_coordinate=expanded_coord,
            persona_activation_score=persona_score,
            axis_mapping_log=mapping_log,
            crosswalk_mappings=crosswalk_mappings,
            confidence_scores=confidence_scores
        )
    
    def _generate_crosswalk_mappings_old_format(self, coordinate: AxisCoordinate) -> Dict[str, List[str]]:
        """Generate crosswalk mappings in the old format for backward compatibility"""
        
        mappings = {}
        
        # Honeycomb mappings
        if coordinate.honeycomb:
            mappings["honeycomb"] = coordinate.honeycomb
        
        # Role mappings
        role_mappings = []
        for role_axis in ["role_knowledge", "role_sector", "role_regulatory", "role_compliance"]:
            value = getattr(coordinate, role_axis, None)
            if value:
                role_mappings.append(f"{role_axis}: {value}")
        
        if role_mappings:
            mappings["roles"] = role_mappings
        
        # Regulatory-compliance mappings
        if coordinate.regulatory and coordinate.compliance:
            mappings["regulatory_compliance"] = [f"{coordinate.regulatory} → {coordinate.compliance}"]
        
        # Pillar-sector mappings
        if coordinate.pillar and coordinate.sector:
            mappings["pillar_sector"] = [f"{coordinate.pillar} ↔ {coordinate.sector}"]
        
        return mappings


# Global simulation engine instance
simulation_engine = AxisSimulationEngine() 