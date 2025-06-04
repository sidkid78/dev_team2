"""
PersonaEngine - Dynamic Persona Management and Adaptation

Advanced engine for AI persona management, calibration, and behavioral simulation:
- Dynamic persona creation and modification
- Behavioral pattern analysis and prediction
- Multi-persona coordination and conflict resolution
- Context-aware persona adaptation
- Performance metrics and optimization
"""

import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any, Union, Tuple
from dataclasses import dataclass, field
from enum import Enum
import json
import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity

from enhanced_models import (
    AxisCoordinate,
    PersonaProfile,
    ReasoningStrategy,
    AccessLevel
)

logger = logging.getLogger(__name__)

class PersonaType(str, Enum):
    """Types of personas available"""
    EXECUTIVE = "executive"
    TECHNICAL = "technical" 
    REGULATORY = "regulatory"
    ANALYST = "analyst"
    CUSTOMER = "customer"
    RESEARCHER = "researcher"
    DOMAIN_EXPERT = "domain_expert"
    GENERALIST = "generalist"

class PersonaActivationLevel(str, Enum):
    """Activation levels for personas"""
    DORMANT = "dormant"
    BACKGROUND = "background"
    ACTIVE = "active"
    LEAD = "lead"
    DOMINANT = "dominant"

@dataclass
class PersonaBehavior:
    """Behavioral characteristics of a persona"""
    decision_style: str  # analytical, intuitive, consensus, authoritative
    risk_tolerance: float  # 0.0 to 1.0
    communication_style: str  # formal, casual, technical, simplified
    priority_focus: List[str]  # e.g., ["compliance", "efficiency", "innovation"]
    collaboration_preference: str  # individual, team, cross-functional
    information_processing: str  # detail-oriented, big-picture, data-driven
    response_time_preference: str  # immediate, considered, comprehensive

@dataclass
class PersonaContext:
    """Context-specific persona information"""
    domain_expertise: Dict[str, float]  # domain -> expertise level (0-1)
    current_objectives: List[str]
    constraints: List[str]
    available_resources: Dict[str, Any]
    stakeholder_relationships: Dict[str, str]  # stakeholder -> relationship type

@dataclass
class PersonaActivation:
    """Active persona state and metrics"""
    persona_id: str
    activation_level: PersonaActivationLevel
    confidence: float
    influence_score: float
    last_activation: datetime
    context_relevance: float
    performance_metrics: Dict[str, float]

class PersonaEngine:
    """
    Advanced Persona Engine for Dynamic AI Personality Management
    
    Manages multiple AI personas with distinct characteristics, behaviors,
    and expertise areas. Handles dynamic activation, calibration, and 
    coordination between different persona types.
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        
        # Persona registry and state
        self.personas: Dict[str, PersonaProfile] = {}
        self.persona_behaviors: Dict[str, PersonaBehavior] = {}
        self.persona_contexts: Dict[str, PersonaContext] = {}
        self.active_personas: Dict[str, PersonaActivation] = {}
        
        # Performance tracking
        self.activation_history: List[Dict[str, Any]] = []
        self.performance_metrics: Dict[str, float] = {}
        
        # Initialize default personas
        self._initialize_default_personas()
        
        logger.info("PersonaEngine initialized with dynamic persona management")
    
    def _initialize_default_personas(self):
        """Initialize default persona templates"""
        default_personas = [
            {
                "persona_id": "exec_001",
                "name": "Executive Decision Maker",
                "persona_type": PersonaType.EXECUTIVE,
                "expertise_areas": ["strategy", "leadership", "business"],
                "authority_level": 0.9,
                "behavior": PersonaBehavior(
                    decision_style="authoritative",
                    risk_tolerance=0.6,
                    communication_style="formal",
                    priority_focus=["roi", "strategy", "efficiency"],
                    collaboration_preference="cross-functional",
                    information_processing="big-picture",
                    response_time_preference="considered"
                )
            },
            {
                "persona_id": "tech_001",
                "name": "Technical Expert",
                "persona_type": PersonaType.TECHNICAL,
                "expertise_areas": ["software", "architecture", "engineering"],
                "authority_level": 0.8,
                "behavior": PersonaBehavior(
                    decision_style="analytical",
                    risk_tolerance=0.4,
                    communication_style="technical",
                    priority_focus=["accuracy", "performance", "scalability"],
                    collaboration_preference="team",
                    information_processing="detail-oriented",
                    response_time_preference="comprehensive"
                )
            },
            {
                "persona_id": "reg_001",
                "name": "Regulatory Specialist",
                "persona_type": PersonaType.REGULATORY,
                "expertise_areas": ["compliance", "law", "policy"],
                "authority_level": 0.85,
                "behavior": PersonaBehavior(
                    decision_style="consensus",
                    risk_tolerance=0.2,
                    communication_style="formal",
                    priority_focus=["compliance", "risk_mitigation", "documentation"],
                    collaboration_preference="cross-functional",
                    information_processing="detail-oriented",
                    response_time_preference="comprehensive"
                )
            }
        ]
        
        for persona_data in default_personas:
            self._create_persona(persona_data)
    
    def _create_persona(self, persona_data: Dict[str, Any]):
        """Create a new persona from data"""
        persona_id = persona_data["persona_id"]
        
        # Create PersonaProfile
        profile = PersonaProfile(
            name=persona_data["name"],
            expertise_areas=persona_data["expertise_areas"],
            authority_level=persona_data["authority_level"],
            behavioral_traits=persona_data.get("behavioral_traits", {}),
            activation_threshold=persona_data.get("activation_threshold", 0.5)
        )
        
        # Store persona and behavior
        self.personas[persona_id] = profile
        self.persona_behaviors[persona_id] = persona_data["behavior"]
        
        # Initialize context
        self.persona_contexts[persona_id] = PersonaContext(
            domain_expertise={area: 0.8 for area in persona_data["expertise_areas"]},
            current_objectives=[],
            constraints=[],
            available_resources={},
            stakeholder_relationships={}
        )
    
    async def calibrate_personas(self, 
                               coordinate: AxisCoordinate,
                               context: Optional[Dict[str, Any]] = None) -> Dict[str, float]:
        """
        Calibrate personas based on coordinate context and requirements
        
        Args:
            coordinate: The axis coordinate for context
            context: Additional context information
            
        Returns:
            Dict mapping persona_id to activation score
        """
        calibration_scores = {}
        
        for persona_id, persona in self.personas.items():
            score = await self._calculate_persona_relevance(
                persona_id, persona, coordinate, context
            )
            calibration_scores[persona_id] = score
            
            # Update activation if score meets threshold
            if score >= persona.activation_threshold:
                await self._activate_persona(persona_id, score, coordinate)
        
        # Store calibration results
        self.activation_history.append({
            "timestamp": datetime.utcnow().isoformat(),
            "coordinate": coordinate.__dict__,
            "scores": calibration_scores,
            "context": context
        })
        
        logger.info(f"Persona calibration completed: {len(calibration_scores)} personas evaluated")
        return calibration_scores
    
    async def _calculate_persona_relevance(self,
                                        persona_id: str,
                                        persona: PersonaProfile,
                                        coordinate: AxisCoordinate,
                                        context: Optional[Dict[str, Any]]) -> float:
        """Calculate how relevant a persona is for the given context"""
        relevance_score = 0.0
        
        # Expertise area matching
        if coordinate.sector:
            sector_match = self._match_sector_expertise(persona_id, str(coordinate.sector))
            relevance_score += sector_match * 0.3
        
        # Regulatory expertise
        if coordinate.regulatory:
            reg_match = self._match_regulatory_expertise(persona_id, coordinate.regulatory)
            relevance_score += reg_match * 0.25
        
        # Role-based matching
        role_fields = [coordinate.role_knowledge, coordinate.role_sector, 
                      coordinate.role_regulatory, coordinate.role_compliance]
        role_match = max([self._match_role_expertise(persona_id, role) 
                         for role in role_fields if role], default=0.0)
        relevance_score += role_match * 0.25
        
        # Context-based scoring
        if context:
            context_match = self._match_context_requirements(persona_id, context)
            relevance_score += context_match * 0.2
        
        return min(relevance_score, 1.0)
    
    def _match_sector_expertise(self, persona_id: str, sector: str) -> float:
        """Match persona expertise to sector requirements"""
        persona_context = self.persona_contexts.get(persona_id)
        if not persona_context:
            return 0.0
        
        # Simple keyword matching - in production, use more sophisticated NLP
        sector_keywords = {
            "technology": ["software", "tech", "engineering", "digital"],
            "healthcare": ["medical", "health", "clinical", "biotech"],
            "finance": ["financial", "banking", "investment", "fintech"],
            "manufacturing": ["industrial", "production", "manufacturing"]
        }
        
        sector_lower = sector.lower()
        max_match = 0.0
        
        for domain, expertise_level in persona_context.domain_expertise.items():
            domain_lower = domain.lower()
            if domain_lower in sector_lower or any(kw in sector_lower for kw in sector_keywords.get(domain_lower, [])):
                max_match = max(max_match, expertise_level)
        
        return max_match
    
    def _match_regulatory_expertise(self, persona_id: str, regulatory: str) -> float:
        """Match persona regulatory expertise"""
        persona = self.personas.get(persona_id)
        if not persona:
            return 0.0
        
        # Regulatory experts get higher scores for regulatory contexts
        regulatory_keywords = ["compliance", "law", "policy", "regulatory", "legal"]
        if any(keyword in persona.expertise_areas for keyword in regulatory_keywords):
            return 0.9
        
        return 0.3 if regulatory else 0.0
    
    def _match_role_expertise(self, persona_id: str, role: Optional[str]) -> float:
        """Match persona expertise to role requirements"""
        if not role:
            return 0.0
            
        persona = self.personas.get(persona_id)
        if not persona:
            return 0.0
        
        # Simple role matching
        role_lower = role.lower()
        for expertise in persona.expertise_areas:
            if expertise.lower() in role_lower or role_lower in expertise.lower():
                return 0.8
        
        return 0.2
    
    def _match_context_requirements(self, persona_id: str, context: Dict[str, Any]) -> float:
        """Match persona to context requirements"""
        persona_behavior = self.persona_behaviors.get(persona_id)
        if not persona_behavior:
            return 0.0
        
        match_score = 0.0
        
        # Match decision style requirements
        if "decision_style" in context:
            if context["decision_style"] == persona_behavior.decision_style:
                match_score += 0.3
        
        # Match priority focus
        if "priorities" in context:
            context_priorities = context["priorities"]
            common_priorities = set(context_priorities) & set(persona_behavior.priority_focus)
            if common_priorities:
                match_score += 0.4 * (len(common_priorities) / len(context_priorities))
        
        # Match risk tolerance
        if "risk_level" in context:
            risk_diff = abs(context["risk_level"] - persona_behavior.risk_tolerance)
            match_score += 0.3 * (1.0 - risk_diff)
        
        return match_score
    
    async def _activate_persona(self, persona_id: str, score: float, coordinate: AxisCoordinate):
        """Activate a persona with given score"""
        activation_level = self._determine_activation_level(score)
        
        activation = PersonaActivation(
            persona_id=persona_id,
            activation_level=activation_level,
            confidence=score,
            influence_score=self._calculate_influence_score(persona_id, score),
            last_activation=datetime.utcnow(),
            context_relevance=score,
            performance_metrics={}
        )
        
        self.active_personas[persona_id] = activation
        logger.info(f"Activated persona {persona_id} with level {activation_level.value}")
    
    def _determine_activation_level(self, score: float) -> PersonaActivationLevel:
        """Determine activation level based on score"""
        if score >= 0.9:
            return PersonaActivationLevel.DOMINANT
        elif score >= 0.8:
            return PersonaActivationLevel.LEAD
        elif score >= 0.6:
            return PersonaActivationLevel.ACTIVE
        elif score >= 0.4:
            return PersonaActivationLevel.BACKGROUND
        else:
            return PersonaActivationLevel.DORMANT
    
    def _calculate_influence_score(self, persona_id: str, relevance_score: float) -> float:
        """Calculate influence score for a persona"""
        persona = self.personas.get(persona_id)
        if not persona:
            return 0.0
        
        # Combine relevance with authority level
        influence = (relevance_score * 0.7) + (persona.authority_level * 0.3)
        return min(influence, 1.0)
    
    async def get_active_personas(self) -> List[PersonaActivation]:
        """Get list of currently active personas"""
        active_list = [
            activation for activation in self.active_personas.values()
            if activation.activation_level != PersonaActivationLevel.DORMANT
        ]
        
        # Sort by influence score descending
        active_list.sort(key=lambda x: x.influence_score, reverse=True)
        return active_list
    
    async def get_persona_recommendations(self, 
                                        coordinate: AxisCoordinate,
                                        context: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Get recommendations for persona activation"""
        calibration = await self.calibrate_personas(coordinate, context)
        
        recommendations = []
        for persona_id, score in calibration.items():
            persona = self.personas[persona_id]
            behavior = self.persona_behaviors[persona_id]
            
            recommendations.append({
                "persona_id": persona_id,
                "name": persona.name,
                "relevance_score": score,
                "expertise_areas": persona.expertise_areas,
                "authority_level": persona.authority_level,
                "decision_style": behavior.decision_style,
                "recommended_role": self._suggest_role(persona_id, score),
                "activation_rationale": self._generate_activation_rationale(persona_id, coordinate)
            })
        
        # Sort by relevance score
        recommendations.sort(key=lambda x: x["relevance_score"], reverse=True)
        return recommendations
    
    def _suggest_role(self, persona_id: str, score: float) -> str:
        """Suggest role for persona based on score"""
        if score >= 0.8:
            return "lead_advisor"
        elif score >= 0.6:
            return "primary_contributor"
        elif score >= 0.4:
            return "secondary_contributor"
        else:
            return "observer"
    
    def _generate_activation_rationale(self, persona_id: str, coordinate: AxisCoordinate) -> str:
        """Generate rationale for persona activation"""
        persona = self.personas[persona_id]
        
        rationales = []
        
        # Expertise match
        if coordinate.sector and any(exp in str(coordinate.sector).lower() for exp in persona.expertise_areas):
            rationales.append(f"Sector expertise in {coordinate.sector}")
        
        # Regulatory expertise
        if coordinate.regulatory and "compliance" in persona.expertise_areas:
            rationales.append(f"Regulatory expertise for {coordinate.regulatory}")
        
        # Authority level
        if persona.authority_level > 0.8:
            rationales.append("High authority level for decision making")
        
        return "; ".join(rationales) if rationales else "General expertise applicable"
    
    async def deactivate_persona(self, persona_id: str):
        """Deactivate a specific persona"""
        if persona_id in self.active_personas:
            del self.active_personas[persona_id]
            logger.info(f"Deactivated persona {persona_id}")
    
    async def deactivate_all_personas(self):
        """Deactivate all personas"""
        self.active_personas.clear()
        logger.info("Deactivated all personas")
    
    async def get_performance_metrics(self) -> Dict[str, Any]:
        """Get performance metrics for the persona engine"""
        return {
            "total_personas": len(self.personas),
            "active_personas": len(self.active_personas),
            "activation_history_count": len(self.activation_history),
            "performance_metrics": self.performance_metrics,
            "timestamp": datetime.utcnow().isoformat()
        } 