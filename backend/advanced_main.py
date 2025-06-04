"""
Advanced FastAPI Main Application

Enterprise-grade backend with sophisticated multi-engine architecture:
- AppOrchestrator for workflow coordination
- KASE for advanced reasoning and simulation
- SEKRE for secure knowledge management
- Comprehensive API endpoints with full functionality
- Real-time monitoring and metrics
"""

import asyncio
import logging
from datetime import datetime
from contextlib import asynccontextmanager
from typing import Dict, List, Optional, Any

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
import uvicorn

# Import engines and models
from engines import (
    AppOrchestrator, 
    KnowledgeAxisSimulationEngine, 
    SecureKnowledgeRepositoryEngine
)
from engines.gemini_engine import GeminiAIEngine
from enhanced_models import (
    EnhancedSimulationRequest, 
    EnhancedSimulationResult,
    SessionStatusResponse,
    SystemMetricsResponse,
    SecurityMetricsResponse,
    AxisTranslationRequest,
    AxisTranslationResult,
    AccessLevel,
    DataClassification
)
from models import (
    AxisCoordinate, 
    SimulationRequest,
    SimulationResult,
    AxisTranslationRequest as BasicTranslationRequest,
    MathematicalOperation,
    MathematicalResult
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global engine instances
app_orchestrator: Optional[AppOrchestrator] = None
kase_engine: Optional[KnowledgeAxisSimulationEngine] = None
sekre_engine: Optional[SecureKnowledgeRepositoryEngine] = None
gemini_engine: Optional[GeminiAIEngine] = None

# Security
security = HTTPBearer(auto_error=False)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management with engine initialization"""
    global app_orchestrator, kase_engine, sekre_engine, gemini_engine
    
    logger.info("🚀 Initializing Advanced Knowledge Simulation Platform...")
    
    try:
        # Initialize Gemini AI Engine first
        logger.info("Initializing Gemini AI Engine...")
        try:
            gemini_engine = GeminiAIEngine()
            logger.info("✅ Gemini AI Engine initialized successfully!")
        except Exception as e:
            logger.warning(f"⚠️ Gemini AI Engine initialization failed: {e}")
            logger.info("Continuing without Gemini AI enhancement...")
            gemini_engine = None
        
        # Initialize engines with AI enhancement
        logger.info("Initializing KASE (Knowledge Axis Simulation Engine)...")
        kase_engine = KnowledgeAxisSimulationEngine(gemini_engine=gemini_engine)
        
        logger.info("Initializing SEKRE (Secure Knowledge Repository Engine)...")
        sekre_config = {
            'sekre_config': {
                'proposal_confidence_threshold': 0.98,
                'sparse_node_neighbor_threshold': 3,
                'max_proposals_per_session': 10
            }
        }
        sekre_engine = SecureKnowledgeRepositoryEngine(config=sekre_config)
        await sekre_engine.initialize_database()
        
        logger.info("Initializing AppOrchestrator...")
        app_orchestrator = AppOrchestrator()
        
        # Inject engine dependencies including Gemini
        app_orchestrator.inject_engines(
            kase=kase_engine,
            sekre=sekre_engine,
            persona=None,  # Will be implemented later
            regulatory=None,  # Will be implemented later
            gemini=gemini_engine
        )
        
        # Start background tasks
        asyncio.create_task(cleanup_sessions_periodically())
        
        logger.info("✅ All engines initialized successfully!")
        logger.info("🌟 Advanced Knowledge Simulation Platform is ready!")
        
        yield
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize engines: {e}")
        raise
    finally:
        logger.info("🔄 Shutting down Advanced Knowledge Simulation Platform...")

# Create FastAPI app with advanced configuration
app = FastAPI(
    title="Advanced Knowledge Simulation Platform",
    description="""
    🚀 **Next-Generation Knowledge Simulation Engine**
    
    Enterprise-grade platform for sophisticated multi-dimensional analysis and simulation:
    
    ## 🏗️ **Architecture**
    - **AppOrchestrator**: Advanced workflow coordination and session management
    - **KASE**: Knowledge Axis Simulation Engine with ML-powered reasoning
    - **SEKRE**: Secure Knowledge Repository with enterprise security
    
    ## 🎯 **Capabilities**
    - **13-Axis Coordinate System**: Comprehensive dimensional framework
    - **Advanced Reasoning**: Multiple AI strategies (logical, probabilistic, neural, hybrid)
    - **Security**: Enterprise-grade encryption and access control
    - **Real-time Analytics**: Performance monitoring and optimization
    - **Knowledge Graphs**: Intelligent relationship mapping
    
    ## 🔬 **Use Cases**
    - Regulatory compliance simulation
    - AI persona modeling and behavior prediction
    - Complex decision-making analysis
    - Risk assessment and mitigation planning
    - Cross-dimensional knowledge exploration
    """,
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Extract user information from authorization token"""
    if not credentials:
        return "anonymous"
    # In production, implement proper JWT validation
    return "authenticated_user"

# Background tasks
async def cleanup_sessions_periodically():
    """Periodic cleanup of expired sessions"""
    while True:
        try:
            if app_orchestrator:
                await app_orchestrator.cleanup_expired_sessions()
            await asyncio.sleep(3600)  # Cleanup every hour
        except Exception as e:
            logger.error(f"Session cleanup error: {e}")
            await asyncio.sleep(3600)

# Health and monitoring endpoints
@app.get("/health", tags=["System"])
async def health_check():
    """Comprehensive health check with engine status"""
    status_checks = {
        "app_orchestrator": app_orchestrator is not None,
        "kase_engine": kase_engine is not None,
        "sekre_engine": sekre_engine is not None,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    overall_status = all(status_checks.values())
    
    return {
        "status": "healthy" if overall_status else "degraded",
        "components": status_checks,
        "version": "2.0.0",
        "platform": "Advanced Knowledge Simulation"
    }

@app.get("/metrics/system", response_model=SystemMetricsResponse, tags=["Monitoring"])
async def get_system_metrics(user_id: str = Depends(get_current_user)):
    """Get comprehensive system performance metrics"""
    if not app_orchestrator:
        raise HTTPException(status_code=503, detail="AppOrchestrator not available")
    
    metrics = app_orchestrator.get_system_metrics()
    return SystemMetricsResponse(**metrics)

@app.get("/metrics/security", response_model=SecurityMetricsResponse, tags=["Monitoring"])
async def get_security_metrics(user_id: str = Depends(get_current_user)):
    """Get security and audit metrics"""
    if not sekre_engine:
        raise HTTPException(status_code=503, detail="SEKRE engine not available")
    
    metrics = await sekre_engine.get_security_metrics()
    return SecurityMetricsResponse(**metrics)

# Enhanced simulation endpoints
@app.post("/api/simulate/enhanced", response_model=EnhancedSimulationResult, tags=["Advanced Simulation"])
async def enhanced_simulation(
    request: EnhancedSimulationRequest,
    background_tasks: BackgroundTasks,
    user_id: str = Depends(get_current_user)
):
    """
    🚀 **Advanced Multi-Engine Simulation**
    
    Performs sophisticated analysis using the full engine stack:
    - Intelligent workflow orchestration
    - Multi-strategy reasoning (logical, probabilistic, neural, hybrid)
    - Security-aware processing
    - Real-time optimization
    """
    if not app_orchestrator:
        raise HTTPException(status_code=503, detail="Simulation engines not available")
    
    try:
        # Create session with enhanced context
        session_id = await app_orchestrator.create_session(request)
        
        # Execute enhanced simulation
        result = await app_orchestrator.execute_simulation(session_id, request)
        
        # Store result securely if required
        if request.security_level != AccessLevel.PUBLIC:
            background_tasks.add_task(
                store_secure_result, 
                result, 
                request.security_level, 
                user_id
            )
        
        return result
        
    except Exception as e:
        logger.error(f"Enhanced simulation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")

@app.post("/api/session", tags=["Session Management"])
async def create_session(request: EnhancedSimulationRequest, user_id: str = Depends(get_current_user)):
    """Create a new simulation session with intelligent workflow planning"""
    if not app_orchestrator:
        raise HTTPException(status_code=503, detail="AppOrchestrator not available")
    
    try:
        session_id = await app_orchestrator.create_session(request)
        return {"session_id": session_id, "status": "created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Session creation failed: {str(e)}")

@app.get("/api/session/{session_id}", response_model=SessionStatusResponse, tags=["Session Management"])
async def get_session_status(session_id: str, user_id: str = Depends(get_current_user)):
    """Get comprehensive session status and progress"""
    if not app_orchestrator:
        raise HTTPException(status_code=503, detail="AppOrchestrator not available")
    
    status = app_orchestrator.get_session_status(session_id)
    if not status:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return SessionStatusResponse(**status)

# Advanced analysis endpoints
@app.post("/api/analyze/coordinate", tags=["Advanced Analysis"])
async def analyze_coordinate(
    coordinate: AxisCoordinate,
    analysis_depth: str = "deep",
    user_id: str = Depends(get_current_user)
):
    """
    🔬 **Deep Coordinate Analysis**
    
    Performs comprehensive multi-dimensional analysis:
    - Individual axis insights with impact analysis
    - Cross-axis correlation detection
    - Complexity assessment and risk evaluation
    - Optimization opportunity identification
    """
    if not kase_engine:
        raise HTTPException(status_code=503, detail="KASE engine not available")
    
    try:
        from .engines.kase import AnalysisDepth
        
        depth_map = {
            "surface": AnalysisDepth.SURFACE,
            "moderate": AnalysisDepth.MODERATE,
            "deep": AnalysisDepth.DEEP,
            "comprehensive": AnalysisDepth.COMPREHENSIVE
        }
        
        depth_enum = depth_map.get(analysis_depth, AnalysisDepth.DEEP)
        analysis = await kase_engine.analyze_coordinate(coordinate, depth_enum)
        
        return analysis
        
    except Exception as e:
        logger.error(f"Coordinate analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Knowledge graph endpoints
@app.post("/api/knowledge/node", tags=["Knowledge Graph"])
async def create_knowledge_node(
    node_type: str,
    content: Dict[str, Any],
    access_level: AccessLevel = AccessLevel.PUBLIC,
    user_id: str = Depends(get_current_user)
):
    """Create a new node in the secure knowledge graph"""
    if not sekre_engine:
        raise HTTPException(status_code=503, detail="SEKRE engine not available")
    
    try:
        node_id = await sekre_engine.create_knowledge_node(
            node_type=node_type,
            content=content,
            access_level=access_level,
            user_id=user_id
        )
        return {"node_id": node_id, "status": "created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Node creation failed: {str(e)}")

@app.post("/api/knowledge/connect", tags=["Knowledge Graph"])
async def connect_knowledge_nodes(
    source_node_id: str,
    target_node_id: str,
    connection_type: str = "relates_to",
    user_id: str = Depends(get_current_user)
):
    """Create connections between knowledge graph nodes"""
    if not sekre_engine:
        raise HTTPException(status_code=503, detail="SEKRE engine not available")
    
    try:
        success = await sekre_engine.connect_knowledge_nodes(
            source_node_id=source_node_id,
            target_node_id=target_node_id,
            connection_type=connection_type,
            user_id=user_id
        )
        return {"success": success, "connection_type": connection_type}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Connection failed: {str(e)}")

@app.post("/api/knowledge/query", tags=["Knowledge Graph"])
async def query_knowledge_graph(
    query_type: str,
    parameters: Dict[str, Any],
    max_depth: int = 3,
    user_id: str = Depends(get_current_user)
):
    """
    🕸️ **Advanced Knowledge Graph Queries**
    
    Supported query types:
    - `find_by_type`: Find nodes by type
    - `traverse_connections`: Traverse node connections
    - `find_shortest_path`: Find shortest path between nodes
    """
    if not sekre_engine:
        raise HTTPException(status_code=503, detail="SEKRE engine not available")
    
    try:
        results = await sekre_engine.query_knowledge_graph(
            query_type=query_type,
            parameters=parameters,
            user_id=user_id,
            max_depth=max_depth
        )
        return {"results": results, "query_type": query_type}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")

# Gemini AI Integration Endpoints
@app.post("/api/ai/analyze-coordinate", tags=["🤖 Gemini AI"])
async def ai_analyze_coordinate(
    coordinate: AxisCoordinate,
    user_id: str = Depends(get_current_user)
):
    """🧠 **AI-Powered Coordinate Analysis** - Analyze coordinate using Gemini AI for enhanced insights"""
    if not gemini_engine:
        raise HTTPException(status_code=503, detail="Gemini AI Engine not available")
    
    try:
        assessment = await gemini_engine.analyze_coordinate(coordinate)
        return {
            "status": "success",
            "coordinate": coordinate.dict(),
            "assessment": assessment.dict(),
            "ai_enhanced": True,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"AI coordinate analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

@app.post("/api/ai/extract-knowledge", tags=["🤖 Gemini AI"])
async def ai_extract_knowledge(
    content: str,
    content_type: str = "text",
    user_id: str = Depends(get_current_user)
):
    """🔍 **AI Knowledge Extraction** - Extract structured knowledge from content using Gemini AI"""
    if not gemini_engine:
        raise HTTPException(status_code=503, detail="Gemini AI Engine not available")
    
    try:
        extraction = await gemini_engine.extract_knowledge(content, content_type)
        return {
            "status": "success",
            "content_type": content_type,
            "extraction": extraction.dict(),
            "ai_enhanced": True,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"AI knowledge extraction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Knowledge extraction failed: {str(e)}")

@app.post("/api/ai/reasoning-chain", tags=["🤖 Gemini AI"])
async def ai_generate_reasoning_chain(
    query: str,
    strategy: str = "hybrid",
    user_id: str = Depends(get_current_user)
):
    """🧠 **AI Reasoning Chain** - Generate detailed reasoning chain using Gemini AI"""
    if not gemini_engine:
        raise HTTPException(status_code=503, detail="Gemini AI Engine not available")
    
    try:
        from enhanced_models import ReasoningStrategy
        strategy_enum = ReasoningStrategy(strategy)
        reasoning_chain = await gemini_engine.generate_reasoning_chain(query, strategy_enum)
        
        return {
            "status": "success",
            "query": query,
            "strategy": strategy,
            "reasoning_chain": reasoning_chain,
            "ai_enhanced": True,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"AI reasoning chain generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Reasoning chain generation failed: {str(e)}")

@app.post("/api/ai/translate-text", tags=["🤖 Gemini AI"])
async def ai_translate_text_to_coordinate(
    text: str,
    context: Optional[Dict[str, Any]] = None,
    user_id: str = Depends(get_current_user)
):
    """🔄 **AI Text Translation** - Translate natural language to axis coordinates using Gemini AI"""
    if not gemini_engine:
        raise HTTPException(status_code=503, detail="Gemini AI Engine not available")
    
    try:
        coordinate, confidence, rationale = await gemini_engine.translate_text_to_coordinate(text, context)
        
        return {
            "status": "success",
            "input_text": text,
            "coordinate": coordinate.dict(),
            "confidence": confidence,
            "rationale": rationale,
            "ai_enhanced": True,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"AI text translation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Text translation failed: {str(e)}")

@app.get("/api/ai/health", tags=["🤖 Gemini AI"])
async def ai_health_check(user_id: str = Depends(get_current_user)):
    """💊 **AI Health Check** - Check Gemini AI Engine health and capabilities"""
    if not gemini_engine:
        return {
            "status": "unavailable",
            "message": "Gemini AI Engine not initialized",
            "ai_enhanced": False,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    try:
        health_status = await gemini_engine.health_check()
        performance_metrics = await gemini_engine.get_performance_metrics()
        
        return {
            "status": "healthy",
            "health_check": health_status,
            "performance_metrics": performance_metrics,
            "ai_enhanced": True,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"AI health check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "ai_enhanced": False,
            "timestamp": datetime.utcnow().isoformat()
        }

# Secure data management endpoints
@app.post("/api/secure/store", tags=["Secure Storage"])
async def store_secure_data(
    data: Dict[str, Any],
    data_type: str,
    classification: DataClassification = DataClassification.GENERAL,
    access_level: AccessLevel = AccessLevel.PUBLIC,
    tags: Optional[List[str]] = None,
    user_id: str = Depends(get_current_user)
):
    """Store data with enterprise-grade security and encryption"""
    if not sekre_engine:
        raise HTTPException(status_code=503, detail="SEKRE engine not available")
    
    try:
        record_id = await sekre_engine.store_secure_data(
            data=data,
            data_type=data_type,
            classification=classification,
            access_level=access_level,
            user_id=user_id,
            tags=tags or []
        )
        return {"record_id": record_id, "status": "stored_securely"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Secure storage failed: {str(e)}")

@app.get("/api/secure/retrieve/{record_id}", tags=["Secure Storage"])
async def retrieve_secure_data(
    record_id: str,
    required_access_level: AccessLevel = AccessLevel.PUBLIC,
    user_id: str = Depends(get_current_user)
):
    """Retrieve securely stored data with access control validation"""
    if not sekre_engine:
        raise HTTPException(status_code=503, detail="SEKRE engine not available")
    
    try:
        data = await sekre_engine.retrieve_secure_data(
            record_id=record_id,
            user_id=user_id,
            required_access_level=required_access_level
        )
        
        if not data:
            raise HTTPException(status_code=404, detail="Record not found or access denied")
        
        return {"record_id": record_id, "data": data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retrieval failed: {str(e)}")

# Legacy compatibility endpoints
@app.get("/examples/coordinates", tags=["Legacy Compatibility"])
async def get_example_coordinates():
    """Get example coordinates for frontend testing"""
    examples = [
        AxisCoordinate(
            pillar="technological",
            sector="healthcare",
            regulatory="HIPAA",
            location="US-CA",
            role_knowledge="data_scientist"
        ),
        AxisCoordinate(
            pillar="financial",
            sector="banking",
            regulatory="SOX",
            location="US-NY",
            role_knowledge="risk_analyst"
        ),
        AxisCoordinate(
            pillar="regulatory",
            sector="pharmaceuticals",
            regulatory="FDA",
            location="US-MA",
            role_knowledge="compliance_officer"
        ),
        AxisCoordinate(
            pillar="operational",
            sector="manufacturing",
            regulatory="OSHA",
            location="US-MI",
            role_knowledge="safety_engineer"
        )
    ]
    return examples

@app.post("/axis/simulate", response_model=SimulationResult, tags=["Legacy Compatibility"])
async def simulate_axis_expansion_legacy(request: SimulationRequest):
    """Legacy endpoint for axis simulation"""
    try:
        # Convert to enhanced simulation
        enhanced_request = EnhancedSimulationRequest(
            coordinate=request.base_coordinate or AxisCoordinate(pillar='technological', sector='healthcare'),
            target_personas=request.target_roles or [],
            analysis_depth="moderate"
        )
        
        # Run enhanced simulation
        enhanced_result = await kase_engine.run_simulation(enhanced_request)
        
        # Convert back to legacy format
        return SimulationResult(
            expanded_coordinate=enhanced_result.coordinate,
            persona_activation_score=enhanced_result.confidence,
            axis_mapping_log=enhanced_result.recommendations[:5],  # First 5 recommendations as log
            crosswalk_mappings=enhanced_result.axis_insights,
            confidence_scores=enhanced_result.validation_scores
        )
    except Exception as e:
        logger.error(f"Legacy simulation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")

@app.post("/api/simulate", tags=["Legacy Compatibility"])
async def simulate(request: SimulationRequest, user_id: str = Depends(get_current_user)):
    """Legacy simulation endpoint for backward compatibility"""
    # Convert to enhanced request
    enhanced_request = EnhancedSimulationRequest(
        coordinate=request.coordinate,
        target_personas=request.target_personas or [],
        regulatory_constraints=request.regulatory_constraints
    )
    
    return await enhanced_simulation(enhanced_request, BackgroundTasks(), user_id)

@app.post("/axis/translate", response_model=AxisTranslationResult, tags=["Legacy Compatibility"])
async def translate_text_to_coordinate(request: BasicTranslationRequest):
    """Legacy translation endpoint with enhanced processing"""
    if not kase_engine:
        raise HTTPException(status_code=503, detail="Translation service not available")
    
    try:
        # Use the enhanced simulation engine for translation
        coordinate, confidence, rationale = kase_engine.translate_text_to_coordinate(
            text=request.input_text,
            target_axes=request.target_axes,
            context=request.context
        )
        
        return AxisTranslationResult(
            suggested_coordinate=coordinate,
            confidence=confidence,
            translation_rationale=rationale,
            alternative_suggestions=[]
        )
        
    except Exception as e:
        logger.error(f"Translation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")

# Helper functions
async def store_secure_result(result: EnhancedSimulationResult, security_level: AccessLevel, user_id: str):
    """Background task to securely store simulation results"""
    if sekre_engine:
        try:
            await sekre_engine.store_secure_data(
                data=result.dict(),
                data_type="simulation_result",
                classification=DataClassification.SENSITIVE if security_level != AccessLevel.PUBLIC else DataClassification.GENERAL,
                access_level=security_level,
                user_id=user_id,
                tags=["simulation", "result", result.strategy_used]
            )
        except Exception as e:
            logger.error(f"Failed to store secure result: {e}")

# Development server
if __name__ == "__main__":
    uvicorn.run(
        "advanced_main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    ) 