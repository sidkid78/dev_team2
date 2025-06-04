import math
import numpy as np
from typing import List, Dict, Any, Tuple, Optional
from datetime import datetime, timedelta
from models import AxisCoordinate, MathematicalResult, AXIS_KEYS
import hashlib


class AxisMathEngine:
    """Mathematical engine for 13-axis calculations and operations"""
    
    def __init__(self):
        self.supported_operations = [
            "MCW",  # Mathematical Confidence Weighting
            "entropy",  # Shannon entropy
            "certainty",  # Certainty score (1 - entropy)
            "USI",  # Unified System ID
            "nuremberg",  # Nuremberg number
            "temporal_delta",  # Time difference
            "completeness",  # Axis completeness ratio
            "similarity",  # Coordinate similarity
            "distance",  # Multidimensional distance
            "crosswalk_score",  # Crosswalk relevance score
        ]
    
    def execute_operation(
        self, 
        operation: str, 
        axis_coordinate: AxisCoordinate,
        parameters: Optional[Dict[str, Any]] = None,
        weights: Optional[List[float]] = None
    ) -> MathematicalResult:
        """Execute a mathematical operation on an axis coordinate"""
        
        if operation not in self.supported_operations:
            raise ValueError(f"Unsupported operation: {operation}")
        
        if operation == "MCW":
            return self._calculate_mcw(axis_coordinate, weights)
        elif operation == "entropy":
            return self._calculate_entropy(axis_coordinate)
        elif operation == "certainty":
            return self._calculate_certainty(axis_coordinate)
        elif operation == "USI":
            return self._calculate_usi(axis_coordinate)
        elif operation == "nuremberg":
            return self._calculate_nuremberg(axis_coordinate)
        elif operation == "temporal_delta":
            return self._calculate_temporal_delta(axis_coordinate, parameters)
        elif operation == "completeness":
            return self._calculate_completeness(axis_coordinate)
        elif operation == "similarity":
            return self._calculate_similarity(axis_coordinate, parameters)
        elif operation == "distance":
            return self._calculate_distance(axis_coordinate, parameters)
        elif operation == "crosswalk_score":
            return self._calculate_crosswalk_score(axis_coordinate, parameters)
        else:
            raise ValueError(f"Operation {operation} not implemented")
    
    def _calculate_mcw(
        self, 
        coordinate: AxisCoordinate, 
        weights: Optional[List[float]] = None
    ) -> MathematicalResult:
        """Calculate Mathematical Confidence Weighting (MCW)"""
        
        # Default weights if not provided
        if weights is None:
            weights = [1.0] * len(AXIS_KEYS)
        
        # Handle flexible weight arrays - pad or truncate to match 13 axes
        if len(weights) < len(AXIS_KEYS):
            # Pad with 1.0 for missing weights
            weights = weights + [1.0] * (len(AXIS_KEYS) - len(weights))
        elif len(weights) > len(AXIS_KEYS):
            # Truncate to 13 values
            weights = weights[:len(AXIS_KEYS)]
        
        # Calculate weighted presence score
        total_weight = 0.0
        weighted_sum = 0.0
        
        for i, key in enumerate(AXIS_KEYS):
            value = getattr(coordinate, key, None)
            weight = weights[i]
            
            # Presence score (0 or 1)
            presence = 1.0 if (value is not None and value != "" and value != []) else 0.0
            
            weighted_sum += presence * weight
            total_weight += weight
        
        mcw = weighted_sum / total_weight if total_weight > 0 else 0.0
        
        explanation = (
            f"MCW calculated as weighted sum of axis presence. "
            f"Filled axes: {coordinate.get_filled_axes_count()}/{len(AXIS_KEYS)}. "
            f"Weighted score: {mcw:.4f}"
        )
        
        return MathematicalResult(
            operation="MCW",
            result=mcw,
            explanation=explanation,
            metadata={
                "filled_axes": coordinate.get_filled_axes_count(),
                "total_axes": len(AXIS_KEYS),
                "weights_used": weights
            }
        )
    
    def _calculate_entropy(self, coordinate: AxisCoordinate) -> MathematicalResult:
        """Calculate Shannon entropy of axis distribution"""
        
        filled_count = coordinate.get_filled_axes_count()
        total_count = len(AXIS_KEYS)
        
        if filled_count == 0:
            entropy = 0.0
        else:
            # Probability of filled vs empty axes
            p_filled = filled_count / total_count
            p_empty = 1 - p_filled
            
            # Shannon entropy calculation
            entropy = 0.0
            if p_filled > 0:
                entropy -= p_filled * math.log2(p_filled)
            if p_empty > 0:
                entropy -= p_empty * math.log2(p_empty)
        
        explanation = (
            f"Shannon entropy of axis distribution. "
            f"Filled: {filled_count}, Empty: {total_count - filled_count}. "
            f"Entropy: {entropy:.4f} bits"
        )
        
        return MathematicalResult(
            operation="entropy",
            result=entropy,
            explanation=explanation,
            metadata={
                "filled_count": filled_count,
                "empty_count": total_count - filled_count,
                "max_entropy": 1.0
            }
        )
    
    def _calculate_certainty(self, coordinate: AxisCoordinate) -> MathematicalResult:
        """Calculate certainty score (1 - normalized entropy)"""
        
        entropy_result = self._calculate_entropy(coordinate)
        entropy = entropy_result.result
        
        # Normalize entropy to 0-1 range (max entropy for binary distribution is 1)
        normalized_entropy = entropy / 1.0 if entropy <= 1.0 else 1.0
        certainty = 1.0 - normalized_entropy
        
        explanation = (
            f"Certainty score calculated as 1 - normalized_entropy. "
            f"Raw entropy: {entropy:.4f}, Certainty: {certainty:.4f}"
        )
        
        return MathematicalResult(
            operation="certainty",
            result=certainty,
            explanation=explanation,
            metadata={
                "entropy": entropy,
                "normalized_entropy": normalized_entropy
            }
        )
    
    def _calculate_usi(self, coordinate: AxisCoordinate) -> MathematicalResult:
        """Calculate Unified System ID (USI)"""
        
        usi = coordinate.unified_system_id()
        
        explanation = (
            f"USI generated from core axes: pillar({coordinate.pillar}), "
            f"sector({coordinate.sector}), location({coordinate.location}). "
            f"SHA256 hash: {usi[:16]}..."
        )
        
        return MathematicalResult(
            operation="USI",
            result=usi,
            explanation=explanation,
            metadata={
                "core_axes": {
                    "pillar": coordinate.pillar,
                    "sector": str(coordinate.sector),
                    "location": coordinate.location
                }
            }
        )
    
    def _calculate_nuremberg(self, coordinate: AxisCoordinate) -> MathematicalResult:
        """Calculate Nuremberg number (pipe-delimited coordinate)"""
        
        nuremberg = coordinate.nuremberg_number()
        
        explanation = (
            f"Nuremberg number: pipe-delimited 13D coordinate string. "
            f"Length: {len(nuremberg)} characters. "
            f"Format: {nuremberg[:50]}{'...' if len(nuremberg) > 50 else ''}"
        )
        
        return MathematicalResult(
            operation="nuremberg",
            result=nuremberg,
            explanation=explanation,
            metadata={
                "length": len(nuremberg),
                "axis_count": len(nuremberg.split("|"))
            }
        )
    
    def _calculate_temporal_delta(
        self, 
        coordinate: AxisCoordinate, 
        parameters: Optional[Dict[str, Any]] = None
    ) -> MathematicalResult:
        """Calculate temporal difference"""
        
        if not coordinate.temporal:
            raise ValueError("Temporal axis must be set for temporal_delta operation")
        
        # Default comparison is to current time (timezone-aware)
        if parameters and "compare_to" in parameters:
            compare_to = parameters["compare_to"]
        else:
            # Create timezone-aware current time
            from datetime import timezone
            compare_to = datetime.now(timezone.utc).isoformat()
        
        try:
            # Ensure both datetimes are timezone-aware
            dt1 = datetime.fromisoformat(coordinate.temporal.replace('Z', '+00:00'))
            if 'Z' in compare_to or '+' in compare_to[-6:] or '-' in compare_to[-6:]:
                dt2 = datetime.fromisoformat(compare_to.replace('Z', '+00:00'))
            else:
                # If compare_to is timezone-naive, make it UTC
                from datetime import timezone
                dt2 = datetime.fromisoformat(compare_to).replace(tzinfo=timezone.utc)
            
            delta = abs((dt2 - dt1).total_seconds())
            days = delta / 86400  # seconds to days
            
            explanation = (
                f"Temporal delta between {coordinate.temporal} and {compare_to}. "
                f"Difference: {days:.2f} days ({delta:.0f} seconds)"
            )
            
            return MathematicalResult(
                operation="temporal_delta",
                result=days,
                explanation=explanation,
                metadata={
                    "from_time": coordinate.temporal,
                    "to_time": compare_to,
                    "delta_seconds": delta
                }
            )
            
        except ValueError as e:
            raise ValueError(f"Invalid temporal format: {e}")
    
    def _calculate_completeness(self, coordinate: AxisCoordinate) -> MathematicalResult:
        """Calculate axis completeness ratio"""
        
        ratio = coordinate.get_axis_completeness_ratio()
        filled = coordinate.get_filled_axes_count()
        total = len(AXIS_KEYS)
        
        explanation = (
            f"Completeness ratio: {filled}/{total} axes filled. "
            f"Ratio: {ratio:.4f} ({ratio*100:.1f}%)"
        )
        
        return MathematicalResult(
            operation="completeness",
            result=ratio,
            explanation=explanation,
            metadata={
                "filled_axes": filled,
                "total_axes": total,
                "percentage": ratio * 100
            }
        )
    
    def _calculate_similarity(
        self, 
        coordinate: AxisCoordinate,
        parameters: Optional[Dict[str, Any]] = None
    ) -> MathematicalResult:
        """Calculate similarity between two coordinates"""
        
        if not parameters or "other_coordinate" not in parameters:
            raise ValueError("Other coordinate required for similarity calculation")
        
        other_data = parameters["other_coordinate"]
        other_coord = AxisCoordinate(**other_data)
        
        # Calculate Jaccard similarity based on filled axes
        coord1_values = set()
        coord2_values = set()
        
        for key in AXIS_KEYS:
            val1 = getattr(coordinate, key, None)
            val2 = getattr(other_coord, key, None)
            
            if val1 is not None and val1 != "" and val1 != []:
                coord1_values.add(f"{key}:{str(val1)}")
            if val2 is not None and val2 != "" and val2 != []:
                coord2_values.add(f"{key}:{str(val2)}")
        
        intersection = len(coord1_values.intersection(coord2_values))
        union = len(coord1_values.union(coord2_values))
        
        similarity = intersection / union if union > 0 else 0.0
        
        explanation = (
            f"Jaccard similarity between coordinates. "
            f"Common values: {intersection}, Total unique: {union}. "
            f"Similarity: {similarity:.4f}"
        )
        
        return MathematicalResult(
            operation="similarity",
            result=similarity,
            explanation=explanation,
            metadata={
                "intersection_size": intersection,
                "union_size": union,
                "coord1_filled": len(coord1_values),
                "coord2_filled": len(coord2_values)
            }
        )
    
    def _calculate_distance(
        self,
        coordinate: AxisCoordinate,
        parameters: Optional[Dict[str, Any]] = None
    ) -> MathematicalResult:
        """Calculate multidimensional distance between coordinates"""
        
        if not parameters or "other_coordinate" not in parameters:
            raise ValueError("Other coordinate required for distance calculation")
        
        other_data = parameters["other_coordinate"]
        other_coord = AxisCoordinate(**other_data)
        
        # Calculate Hamming distance (number of differing axes)
        differences = 0
        total_comparable = 0
        
        for key in AXIS_KEYS:
            val1 = getattr(coordinate, key, None)
            val2 = getattr(other_coord, key, None)
            
            # Only compare if both have values
            if val1 is not None and val2 is not None:
                total_comparable += 1
                if str(val1) != str(val2):
                    differences += 1
        
        distance = differences / total_comparable if total_comparable > 0 else 0.0
        
        explanation = (
            f"Normalized Hamming distance between coordinates. "
            f"Differences: {differences}, Comparable axes: {total_comparable}. "
            f"Distance: {distance:.4f}"
        )
        
        return MathematicalResult(
            operation="distance",
            result=distance,
            explanation=explanation,
            metadata={
                "differences": differences,
                "comparable_axes": total_comparable,
                "raw_hamming_distance": differences
            }
        )
    
    def _calculate_crosswalk_score(
        self,
        coordinate: AxisCoordinate,
        parameters: Optional[Dict[str, Any]] = None
    ) -> MathematicalResult:
        """Calculate crosswalk relevance score"""
        
        # Simple crosswalk scoring based on honeycomb connections
        honeycomb_score = 0.0
        
        if coordinate.honeycomb:
            honeycomb_score = len(coordinate.honeycomb) / 10.0  # Normalize
            honeycomb_score = min(honeycomb_score, 1.0)  # Cap at 1.0
        
        # Bonus for role alignment (if multiple roles filled)
        role_axes = ["role_knowledge", "role_sector", "role_regulatory", "role_compliance"]
        filled_roles = sum(1 for role in role_axes if getattr(coordinate, role, None))
        role_bonus = filled_roles / len(role_axes)
        
        total_score = (honeycomb_score * 0.7) + (role_bonus * 0.3)
        
        explanation = (
            f"Crosswalk relevance score. "
            f"Honeycomb connections: {len(coordinate.honeycomb or [])}. "
            f"Filled roles: {filled_roles}/{len(role_axes)}. "
            f"Score: {total_score:.4f}"
        )
        
        return MathematicalResult(
            operation="crosswalk_score",
            result=total_score,
            explanation=explanation,
            metadata={
                "honeycomb_connections": len(coordinate.honeycomb or []),
                "filled_roles": filled_roles,
                "honeycomb_score": honeycomb_score,
                "role_bonus": role_bonus
            }
        )


# Global math engine instance
math_engine = AxisMathEngine()


def calculate_axis_relevance(
    coordinate: AxisCoordinate,
    target_axes: List[str]
) -> Dict[str, float]:
    """Calculate relevance scores for specific axes"""
    
    relevance_scores = {}
    
    for axis in target_axes:
        if axis not in AXIS_KEYS:
            continue
            
        value = getattr(coordinate, axis, None)
        
        if value is None or value == "" or value == []:
            relevance_scores[axis] = 0.0
        else:
            # Base relevance on data richness
            if isinstance(value, list):
                relevance_scores[axis] = min(len(value) / 5.0, 1.0)
            elif isinstance(value, str):
                relevance_scores[axis] = min(len(value) / 20.0, 1.0)
            else:
                relevance_scores[axis] = 1.0
    
    return relevance_scores


def generate_coordinate_fingerprint(coordinate: AxisCoordinate) -> str:
    """Generate a unique fingerprint for a coordinate"""
    
    # Combine all non-null values
    values = []
    for key in AXIS_KEYS:
        value = getattr(coordinate, key, None)
        if value is not None and value != "" and value != []:
            if isinstance(value, list):
                values.append(f"{key}:{','.join(map(str, value))}")
            else:
                values.append(f"{key}:{str(value)}")
    
    # Create fingerprint
    fingerprint_data = "|".join(sorted(values))
    return hashlib.md5(fingerprint_data.encode("utf-8")).hexdigest() 