"""
RegulatoryEngine - Compliance and Regulatory Simulation

Advanced engine for regulatory compliance analysis and simulation:
- Multi-jurisdictional compliance checking
- Regulatory framework analysis and mapping
- Compliance risk assessment and mitigation
- Audit trail generation and management
- Real-time regulatory updates and monitoring
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union, Tuple
from dataclasses import dataclass, field
from enum import Enum
import json
import re

from enhanced_models import (
    AxisCoordinate,
    AccessLevel,
    DataClassification
)

logger = logging.getLogger(__name__)

class ComplianceLevel(str, Enum):
    """Compliance assessment levels"""
    UNKNOWN = "unknown"
    NON_COMPLIANT = "non_compliant"
    PARTIALLY_COMPLIANT = "partially_compliant"
    COMPLIANT = "compliant"
    FULLY_COMPLIANT = "fully_compliant"
    EXCEEDS_REQUIREMENTS = "exceeds_requirements"

class RegulatoryFramework(str, Enum):
    """Supported regulatory frameworks"""
    GDPR = "gdpr"
    HIPAA = "hipaa"
    SOX = "sox"
    PCI_DSS = "pci_dss"
    ISO27001 = "iso27001"
    SOC2 = "soc2"
    CCPA = "ccpa"
    NIST = "nist"
    FDA = "fda"
    FINRA = "finra"
    BASEL_III = "basel_iii"
    MIFID_II = "mifid_ii"

class AuditType(str, Enum):
    """Types of audits"""
    INTERNAL = "internal"
    EXTERNAL = "external"
    REGULATORY = "regulatory"
    CERTIFICATION = "certification"
    CONTINUOUS = "continuous"

@dataclass
class ComplianceRule:
    """Individual compliance rule"""
    rule_id: str
    framework: RegulatoryFramework
    title: str
    description: str
    requirements: List[str]
    severity: str  # low, medium, high, critical
    jurisdictions: List[str]
    effective_date: datetime
    review_cycle: int  # days
    automated_check: bool = False
    check_function: Optional[str] = None

@dataclass
class ComplianceAssessment:
    """Result of compliance assessment"""
    coordinate: AxisCoordinate
    overall_level: ComplianceLevel
    framework_assessments: Dict[str, Dict[str, Any]]
    risk_score: float  # 0.0 to 1.0
    gaps: List[Dict[str, Any]]
    recommendations: List[str]
    audit_trail: List[Dict[str, Any]]
    timestamp: datetime
    assessor: str

@dataclass
class RegulatoryAlert:
    """Regulatory change or alert"""
    alert_id: str
    framework: RegulatoryFramework
    title: str
    description: str
    impact_level: str  # low, medium, high, critical
    affected_areas: List[str]
    effective_date: datetime
    compliance_deadline: Optional[datetime]
    action_required: bool
    recommendations: List[str]

class RegulatoryEngine:
    """
    Advanced Regulatory Engine for Compliance Analysis
    
    Provides comprehensive regulatory compliance capabilities:
    - Multi-framework compliance assessment
    - Risk analysis and gap identification
    - Audit trail generation and management
    - Regulatory change monitoring
    - Automated compliance checking
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        
        # Compliance rule registry
        self.compliance_rules: Dict[str, ComplianceRule] = {}
        self.framework_mappings: Dict[RegulatoryFramework, List[str]] = {}
        
        # Assessment history and audit trails
        self.assessment_history: List[ComplianceAssessment] = []
        self.audit_trails: Dict[str, List[Dict[str, Any]]] = {}
        
        # Regulatory alerts and updates
        self.regulatory_alerts: List[RegulatoryAlert] = []
        
        # Performance metrics
        self.assessment_count = 0
        self.compliance_rate = 0.0
        
        # Initialize default rules and frameworks
        self._initialize_compliance_rules()
        self._initialize_framework_mappings()
        
        logger.info("RegulatoryEngine initialized with multi-framework compliance support")
    
    def _initialize_compliance_rules(self):
        """Initialize default compliance rules"""
        default_rules = [
            {
                "rule_id": "GDPR_001",
                "framework": RegulatoryFramework.GDPR,
                "title": "Data Protection Impact Assessment",
                "description": "Conduct DPIA for high-risk processing activities",
                "requirements": [
                    "Identify data processing activities",
                    "Assess privacy risks",
                    "Implement mitigation measures",
                    "Document assessment process"
                ],
                "severity": "high",
                "jurisdictions": ["EU", "EEA"],
                "effective_date": datetime(2018, 5, 25),
                "review_cycle": 365,
                "automated_check": True
            },
            {
                "rule_id": "HIPAA_001",
                "framework": RegulatoryFramework.HIPAA,
                "title": "Administrative Safeguards",
                "description": "Implement administrative safeguards for PHI",
                "requirements": [
                    "Designate security officer",
                    "Conduct workforce training",
                    "Implement access management",
                    "Regular security assessments"
                ],
                "severity": "critical",
                "jurisdictions": ["US"],
                "effective_date": datetime(1996, 8, 21),
                "review_cycle": 180,
                "automated_check": False
            },
            {
                "rule_id": "SOX_001",
                "framework": RegulatoryFramework.SOX,
                "title": "Internal Controls Over Financial Reporting",
                "description": "Establish and maintain ICFR",
                "requirements": [
                    "Document control procedures",
                    "Test control effectiveness",
                    "Report control deficiencies",
                    "Management assessment"
                ],
                "severity": "critical",
                "jurisdictions": ["US"],
                "effective_date": datetime(2002, 7, 30),
                "review_cycle": 90,
                "automated_check": False
            }
        ]
        
        for rule_data in default_rules:
            rule = ComplianceRule(**rule_data)
            self.compliance_rules[rule.rule_id] = rule
    
    def _initialize_framework_mappings(self):
        """Initialize framework to axis mappings"""
        self.framework_mappings = {
            RegulatoryFramework.GDPR: [
                "data_protection", "privacy", "consent", "security"
            ],
            RegulatoryFramework.HIPAA: [
                "healthcare", "phi", "medical", "patient_data"
            ],
            RegulatoryFramework.SOX: [
                "financial", "reporting", "auditing", "controls"
            ],
            RegulatoryFramework.PCI_DSS: [
                "payment", "card_data", "financial", "security"
            ],
            RegulatoryFramework.ISO27001: [
                "information_security", "risk_management", "security"
            ]
        }
    
    async def validate_compliance(self, 
                                coordinate: AxisCoordinate,
                                context: Optional[Dict[str, Any]] = None) -> ComplianceAssessment:
        """
        Perform comprehensive compliance validation for a coordinate
        
        Args:
            coordinate: The axis coordinate to validate
            context: Additional context for validation
            
        Returns:
            ComplianceAssessment with detailed results
        """
        start_time = datetime.utcnow()
        
        # Identify applicable frameworks
        applicable_frameworks = await self._identify_applicable_frameworks(coordinate, context)
        
        # Assess each framework
        framework_assessments = {}
        overall_risk = 0.0
        gaps = []
        recommendations = []
        
        for framework in applicable_frameworks:
            assessment = await self._assess_framework_compliance(
                coordinate, framework, context
            )
            framework_assessments[framework.value] = assessment
            overall_risk = max(overall_risk, assessment.get("risk_score", 0.0))
            gaps.extend(assessment.get("gaps", []))
            recommendations.extend(assessment.get("recommendations", []))
        
        # Determine overall compliance level
        overall_level = self._determine_overall_compliance_level(framework_assessments)
        
        # Create audit trail entry
        audit_entry = {
            "timestamp": start_time.isoformat(),
            "action": "compliance_validation",
            "coordinate": coordinate.__dict__,
            "frameworks_assessed": [f.value for f in applicable_frameworks],
            "overall_level": overall_level.value,
            "risk_score": overall_risk
        }
        
        # Create assessment result
        assessment = ComplianceAssessment(
            coordinate=coordinate,
            overall_level=overall_level,
            framework_assessments=framework_assessments,
            risk_score=overall_risk,
            gaps=gaps,
            recommendations=recommendations,
            audit_trail=[audit_entry],
            timestamp=start_time,
            assessor="RegulatoryEngine"
        )
        
        # Store assessment
        self.assessment_history.append(assessment)
        self.assessment_count += 1
        
        # Update compliance rate
        self._update_compliance_metrics()
        
        logger.info(f"Compliance validation completed: {overall_level.value} "
                   f"(risk: {overall_risk:.2f})")
        
        return assessment
    
    async def _identify_applicable_frameworks(self, 
                                           coordinate: AxisCoordinate,
                                           context: Optional[Dict[str, Any]]) -> List[RegulatoryFramework]:
        """Identify which regulatory frameworks apply to the coordinate"""
        applicable_frameworks = []
        
        # Check sector-based frameworks
        sector = str(coordinate.sector).lower() if coordinate.sector else ""
        
        if any(term in sector for term in ["health", "medical", "patient"]):
            applicable_frameworks.append(RegulatoryFramework.HIPAA)
        
        if any(term in sector for term in ["financial", "banking", "investment"]):
            applicable_frameworks.extend([
                RegulatoryFramework.SOX, 
                RegulatoryFramework.BASEL_III
            ])
        
        if any(term in sector for term in ["payment", "card", "transaction"]):
            applicable_frameworks.append(RegulatoryFramework.PCI_DSS)
        
        # Check jurisdiction-based frameworks
        if coordinate.regulatory:
            reg_lower = coordinate.regulatory.lower()
            if "eu" in reg_lower or "gdpr" in reg_lower:
                applicable_frameworks.append(RegulatoryFramework.GDPR)
            if "us" in reg_lower:
                applicable_frameworks.extend([
                    RegulatoryFramework.SOX,
                    RegulatoryFramework.CCPA
                ])
        
        # Check context-based frameworks
        if context:
            data_types = context.get("data_types", [])
            if "personal_data" in data_types:
                applicable_frameworks.append(RegulatoryFramework.GDPR)
            if "financial_data" in data_types:
                applicable_frameworks.append(RegulatoryFramework.SOX)
        
        # Always include general security frameworks
        applicable_frameworks.extend([
            RegulatoryFramework.ISO27001,
            RegulatoryFramework.SOC2
        ])
        
        # Remove duplicates
        return list(set(applicable_frameworks))
    
    async def _assess_framework_compliance(self,
                                        coordinate: AxisCoordinate,
                                        framework: RegulatoryFramework,
                                        context: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Assess compliance for a specific framework"""
        
        # Get relevant rules for this framework
        framework_rules = [
            rule for rule in self.compliance_rules.values()
            if rule.framework == framework
        ]
        
        compliance_score = 0.0
        rule_assessments = []
        gaps = []
        recommendations = []
        
        for rule in framework_rules:
            rule_assessment = await self._assess_rule_compliance(coordinate, rule, context)
            rule_assessments.append(rule_assessment)
            compliance_score += rule_assessment["score"]
            
            if rule_assessment["score"] < 0.8:  # Below compliance threshold
                gaps.append({
                    "rule_id": rule.rule_id,
                    "title": rule.title,
                    "gap_description": rule_assessment.get("gap_description", ""),
                    "severity": rule.severity,
                    "requirements": rule.requirements
                })
                
                recommendations.extend(rule_assessment.get("recommendations", []))
        
        # Calculate average compliance score
        avg_compliance = compliance_score / len(framework_rules) if framework_rules else 0.0
        
        # Calculate risk score (inverse of compliance)
        risk_score = 1.0 - avg_compliance
        
        # Determine compliance level for this framework
        if avg_compliance >= 0.95:
            level = ComplianceLevel.FULLY_COMPLIANT
        elif avg_compliance >= 0.8:
            level = ComplianceLevel.COMPLIANT
        elif avg_compliance >= 0.6:
            level = ComplianceLevel.PARTIALLY_COMPLIANT
        else:
            level = ComplianceLevel.NON_COMPLIANT
        
        return {
            "framework": framework.value,
            "compliance_level": level.value,
            "compliance_score": avg_compliance,
            "risk_score": risk_score,
            "rule_assessments": rule_assessments,
            "gaps": gaps,
            "recommendations": recommendations,
            "assessment_timestamp": datetime.utcnow().isoformat()
        }
    
    async def _assess_rule_compliance(self,
                                   coordinate: AxisCoordinate,
                                   rule: ComplianceRule,
                                   context: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Assess compliance for a specific rule"""
        
        # This is a simplified assessment - in production, this would involve
        # more sophisticated analysis based on the coordinate and context
        
        score = 0.0
        gap_description = ""
        recommendations = []
        
        # Basic scoring based on coordinate attributes
        if rule.framework == RegulatoryFramework.GDPR:
            score = self._assess_gdpr_rule(coordinate, rule, context)
        elif rule.framework == RegulatoryFramework.HIPAA:
            score = self._assess_hipaa_rule(coordinate, rule, context)
        elif rule.framework == RegulatoryFramework.SOX:
            score = self._assess_sox_rule(coordinate, rule, context)
        else:
            # Default assessment
            score = 0.7  # Assume partial compliance by default
        
        # Generate gap description and recommendations if score is low
        if score < 0.8:
            gap_description = f"Insufficient compliance with {rule.title}"
            recommendations = [
                f"Review and implement {req}" for req in rule.requirements[:2]
            ]
        
        return {
            "rule_id": rule.rule_id,
            "score": score,
            "gap_description": gap_description,
            "recommendations": recommendations,
            "assessment_method": "automated" if rule.automated_check else "manual"
        }
    
    def _assess_gdpr_rule(self, coordinate: AxisCoordinate, rule: ComplianceRule, context: Optional[Dict[str, Any]]) -> float:
        """Assess GDPR-specific rule compliance"""
        score = 0.5  # Base score
        
        # Check for privacy-related attributes
        if coordinate.compliance:
            compliance_lower = coordinate.compliance.lower()
            if any(term in compliance_lower for term in ["privacy", "gdpr", "data_protection"]):
                score += 0.3
        
        # Check context for data handling practices
        if context and "data_practices" in context:
            practices = context["data_practices"]
            if "consent_management" in practices:
                score += 0.2
            if "data_minimization" in practices:
                score += 0.1
        
        return min(score, 1.0)
    
    def _assess_hipaa_rule(self, coordinate: AxisCoordinate, rule: ComplianceRule, context: Optional[Dict[str, Any]]) -> float:
        """Assess HIPAA-specific rule compliance"""
        score = 0.5  # Base score
        
        # Check for healthcare-related attributes
        if coordinate.sector:
            sector_lower = str(coordinate.sector).lower()
            if any(term in sector_lower for term in ["health", "medical", "clinical"]):
                score += 0.3
        
        # Check for security measures
        if coordinate.audit_requirements:
            req_lower = coordinate.audit_requirements.lower()
            if "comprehensive" in req_lower:
                score += 0.2
        
        return min(score, 1.0)
    
    def _assess_sox_rule(self, coordinate: AxisCoordinate, rule: ComplianceRule, context: Optional[Dict[str, Any]]) -> float:
        """Assess SOX-specific rule compliance"""
        score = 0.5  # Base score
        
        # Check for financial-related attributes
        if coordinate.sector:
            sector_lower = str(coordinate.sector).lower()
            if any(term in sector_lower for term in ["financial", "banking", "investment"]):
                score += 0.3
        
        # Check for audit requirements
        if coordinate.audit_requirements:
            req_lower = coordinate.audit_requirements.lower()
            if any(term in req_lower for term in ["comprehensive", "continuous"]):
                score += 0.2
        
        return min(score, 1.0)
    
    def _determine_overall_compliance_level(self, framework_assessments: Dict[str, Dict[str, Any]]) -> ComplianceLevel:
        """Determine overall compliance level from framework assessments"""
        if not framework_assessments:
            return ComplianceLevel.UNKNOWN
        
        # Get the lowest compliance level as overall level
        levels = [
            ComplianceLevel(assessment["compliance_level"])
            for assessment in framework_assessments.values()
        ]
        
        # Order by severity (most restrictive first)
        level_order = [
            ComplianceLevel.NON_COMPLIANT,
            ComplianceLevel.PARTIALLY_COMPLIANT,
            ComplianceLevel.COMPLIANT,
            ComplianceLevel.FULLY_COMPLIANT,
            ComplianceLevel.EXCEEDS_REQUIREMENTS
        ]
        
        for level in level_order:
            if level in levels:
                return level
        
        return ComplianceLevel.UNKNOWN
    
    def _update_compliance_metrics(self):
        """Update compliance performance metrics"""
        if not self.assessment_history:
            return
        
        # Calculate compliance rate
        compliant_assessments = sum(
            1 for assessment in self.assessment_history[-100:]  # Last 100 assessments
            if assessment.overall_level in [
                ComplianceLevel.COMPLIANT,
                ComplianceLevel.FULLY_COMPLIANT,
                ComplianceLevel.EXCEEDS_REQUIREMENTS
            ]
        )
        
        total_assessments = len(self.assessment_history[-100:])
        self.compliance_rate = compliant_assessments / total_assessments if total_assessments > 0 else 0.0
    
    async def generate_audit_report(self, 
                                  time_range: Optional[Tuple[datetime, datetime]] = None) -> Dict[str, Any]:
        """Generate comprehensive audit report"""
        if time_range:
            start_date, end_date = time_range
            assessments = [
                a for a in self.assessment_history
                if start_date <= a.timestamp <= end_date
            ]
        else:
            assessments = self.assessment_history[-50:]  # Last 50 assessments
        
        if not assessments:
            return {"error": "No assessments found for the specified time range"}
        
        # Aggregate statistics
        total_assessments = len(assessments)
        compliance_levels = [a.overall_level for a in assessments]
        
        compliance_distribution = {}
        for level in ComplianceLevel:
            compliance_distribution[level.value] = compliance_levels.count(level)
        
        avg_risk_score = sum(a.risk_score for a in assessments) / total_assessments
        
        # Framework analysis
        framework_stats = {}
        for assessment in assessments:
            for framework, data in assessment.framework_assessments.items():
                if framework not in framework_stats:
                    framework_stats[framework] = []
                framework_stats[framework].append(data["compliance_score"])
        
        framework_averages = {
            framework: sum(scores) / len(scores)
            for framework, scores in framework_stats.items()
        }
        
        # Common gaps analysis
        all_gaps = []
        for assessment in assessments:
            all_gaps.extend(assessment.gaps)
        
        gap_frequency = {}
        for gap in all_gaps:
            rule_id = gap["rule_id"]
            gap_frequency[rule_id] = gap_frequency.get(rule_id, 0) + 1
        
        top_gaps = sorted(gap_frequency.items(), key=lambda x: x[1], reverse=True)[:10]
        
        return {
            "report_generated": datetime.utcnow().isoformat(),
            "time_range": {
                "start": time_range[0].isoformat() if time_range else "N/A",
                "end": time_range[1].isoformat() if time_range else "N/A"
            },
            "summary": {
                "total_assessments": total_assessments,
                "average_risk_score": avg_risk_score,
                "compliance_rate": self.compliance_rate,
                "compliance_distribution": compliance_distribution
            },
            "framework_analysis": {
                "frameworks_assessed": list(framework_averages.keys()),
                "framework_averages": framework_averages
            },
            "gap_analysis": {
                "total_gaps": len(all_gaps),
                "most_common_gaps": [
                    {"rule_id": rule_id, "frequency": freq}
                    for rule_id, freq in top_gaps
                ]
            },
            "recommendations": self._generate_global_recommendations(assessments)
        }
    
    def _generate_global_recommendations(self, assessments: List[ComplianceAssessment]) -> List[str]:
        """Generate global recommendations based on assessment history"""
        recommendations = []
        
        # Analyze patterns in assessments
        high_risk_assessments = [a for a in assessments if a.risk_score > 0.7]
        
        if len(high_risk_assessments) > len(assessments) * 0.3:
            recommendations.append("Implement comprehensive risk management program")
        
        # Framework-specific recommendations
        all_gaps = []
        for assessment in assessments:
            all_gaps.extend(assessment.gaps)
        
        gdpr_gaps = [g for g in all_gaps if "GDPR" in g["rule_id"]]
        if len(gdpr_gaps) > 5:
            recommendations.append("Strengthen GDPR compliance program")
        
        hipaa_gaps = [g for g in all_gaps if "HIPAA" in g["rule_id"]]
        if len(hipaa_gaps) > 3:
            recommendations.append("Enhance HIPAA security safeguards")
        
        return recommendations
    
    async def get_performance_metrics(self) -> Dict[str, Any]:
        """Get performance metrics for the regulatory engine"""
        return {
            "total_assessments": self.assessment_count,
            "compliance_rate": self.compliance_rate,
            "supported_frameworks": [f.value for f in RegulatoryFramework],
            "total_rules": len(self.compliance_rules),
            "assessment_history_size": len(self.assessment_history),
            "timestamp": datetime.utcnow().isoformat()
        } 