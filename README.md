# 🧠 Advanced AGI Knowledge Simulation Platform

## 🌟 **Universal Knowledge Graph / Universal Simulated Database (UKG/USKD)**

A next-generation **Artificial General Intelligence (AGI) development platform** featuring a sophisticated 16-dimensional axis coordinate system, advanced AI engines, and enterprise-grade knowledge simulation capabilities.

---

## 🚀 **Key Features**

### **🎯 Core Capabilities**
- **16-Axis Coordinate System**: Comprehensive multidimensional knowledge representation
- **AI Engine Orchestra**: KASE, SEKRE, Gemini AI, Persona & Regulatory engines  
- **Advanced Reasoning**: Multiple AI strategies (logical, probabilistic, neural, hybrid)
- **Knowledge Graph Management**: Dynamic ontology evolution and relationship mapping
- **Secure Data Handling**: Enterprise-grade encryption and access control
- **Real-time Analytics**: Performance monitoring and optimization metrics

### **🤖 AGI Development**
- **Natural Language to Coordinate Translation**: Convert human language to structured knowledge
- **Complex Reasoning Chains**: Visualize AI thought processes and decision-making
- **Multi-Persona Simulation**: Role-based AI analysis and perspective modeling  
- **Cross-Domain Knowledge Integration**: Bridge different fields and disciplines
- **Regulatory Compliance Simulation**: Model compliance across various frameworks

---

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │   AI Engines    │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│                 │
│                 │    │                  │    │  ┌─────────────┐ │
│ • AGI Interface │    │ • REST API       │    │  │ Gemini AI   │ │
│ • Visualization │    │ • Session Mgmt   │    │  │ Engine      │ │  
│ • Real-time UI  │    │ • Security       │    │  └─────────────┘ │
│                 │    │ • Orchestration  │    │  ┌─────────────┐ │
│ Port: 3000      │    │                  │    │  │ KASE Engine │ │
└─────────────────┘    │ Port: 8001       │    │  │ (Knowledge) │ │
                       └──────────────────┘    │  └─────────────┘ │
                                               │  ┌─────────────┐ │
                                               │  │ SEKRE Engine│ │
                                               │  │ (Security)  │ │
                                               │  └─────────────┘ │
                                               └─────────────────┘
```

---

## 🛠️ **Quick Start**

### **Prerequisites**
- **Python 3.10+** with FastAPI dependencies
- **Node.js 18+** with npm/yarn
- **Google Gemini API Key** (for AI capabilities)

### **1. 🐍 Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if using virtual environment)
pip install fastapi uvicorn google-generativeai pydantic

# Set up environment variables
export GOOGLE_API_KEY="your-gemini-api-key-here"

# Start the unified advanced backend server (includes all functionality)
python advanced_main.py
```

**Backend will start on:** `http://localhost:8001`

> 💡 **Note**: The `advanced_main.py` now includes all basic coordinate/simulation functionality PLUS advanced AGI features. You only need this single backend server!

### **2. 🌐 Frontend Setup**

```bash
# Navigate to frontend directory  
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

**Frontend will start on:** `http://localhost:3000`

### **3. 🎮 Access the AGI Interface**

Open your browser and navigate to:
- **Main Application**: `http://localhost:3000`
- **AGI Features**: `http://localhost:3000/advanced`
- **API Documentation**: `http://localhost:8001/docs`

---

## 📊 **16-Axis Coordinate System**

| # | Axis | Description | Example |
|---|------|-------------|---------|
| 1 | `pillar` | Knowledge architecture anchor | `"technological"` |
| 2 | `sector` | Industry/domain classification | `"healthcare"` |
| 3 | `honeycomb` | Crosslink relationships | `["PL09.3.2↔5415"]` |
| 4 | `branch` | Hierarchical taxonomy | `"medical_devices"` |
| 5 | `node` | Cross-sector overlays | `"AI_ethics"` |
| 6 | `regulatory` | Regulatory framework | `"HIPAA"` |
| 7 | `compliance` | Compliance standards | `"ISO_27001"` |
| 8 | `compliance_level` | Compliance strictness | `"strict"` |
| 9 | `audit_requirements` | Audit level needed | `"comprehensive"` |
| 10 | `regulatory_framework` | Framework name | `"FDA_510K"` |
| 11 | `role_knowledge` | Knowledge domain role | `"data_scientist"` |
| 12 | `role_sector` | Industry expert role | `"healthcare_analyst"` |
| 13 | `role_regulatory` | Regulatory expert | `"compliance_officer"` |
| 14 | `role_compliance` | Compliance specialist | `"auditor"` |
| 15 | `location` | Geographic context | `"US-CA"` |
| 16 | `temporal` | Time/version context | `"2024-06-04T12:00:00Z"` |

---

## 🔌 **API Endpoints**

### **🤖 AGI & AI Endpoints**
```http
POST /api/ai/reasoning-chain?query={query}&strategy={strategy}
POST /api/ai/translate-text?text={text}
POST /api/ai/extract-knowledge?content={content}
POST /api/ai/analyze-coordinate
GET  /api/ai/health
```

### **🎯 Simulation Endpoints**  
```http
POST /api/simulate/enhanced
POST /axis/simulate  # Legacy compatibility
GET  /examples/coordinates
```

### **📈 Monitoring & Management**
```http
GET  /health
GET  /metrics/system
GET  /metrics/security
POST /api/session
GET  /api/session/{session_id}
```

### **🔒 Knowledge Graph & Security**
```http
POST /api/knowledge/node
POST /api/knowledge/connect  
POST /api/knowledge/query
POST /api/secure/store
GET  /api/secure/retrieve/{record_id}
```

---

## 💡 **Usage Examples**

### **🗣️ Natural Language AGI Query**
```typescript
// Ask the AGI system a complex question
const response = await fetch('http://localhost:8001/api/ai/reasoning-chain', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "Analyze the ethical implications of AI in healthcare data processing",
    strategy: "hybrid"
  })
});
```

### **🧩 Coordinate Translation**
```typescript
// Convert natural language to structured coordinates
const translation = await fetch('http://localhost:8001/api/ai/translate-text', {
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "Healthcare AI system with HIPAA compliance requirements"
  })
});
```

### **🎭 Multi-Persona Simulation**
```typescript
// Run simulation with multiple AI personas
const simulation = await fetch('http://localhost:8001/api/simulate/enhanced', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    coordinate: {
      pillar: "technological",
      sector: "healthcare", 
      regulatory: "HIPAA",
      compliance_level: "strict"
    },
    target_personas: ["data_scientist", "compliance_officer", "healthcare_analyst"],
    analysis_depth: "comprehensive"
  })
});
```

---

## 🗃️ **Database Configuration**

### **Development (Current)**
- **SQLite**: Local development database
- **In-Memory**: Session and simulation state
- **File-based**: YAML configuration data

### **Production (Planned)**
- **PostgreSQL**: Main knowledge graph storage
- **Redis**: Session caching and real-time data  
- **Neo4j**: Complex relationship mapping

### **Database Schema**
```sql
-- Auto-created on first run
CREATE TABLE knowledge_nodes (
    id TEXT PRIMARY KEY,
    content JSON,
    access_level TEXT,
    created_at DATETIME
);

CREATE TABLE audit_logs (
    session_id TEXT,
    action TEXT,
    timestamp DATETIME,
    details JSON
);
```

---

## 🎨 **Frontend Features**

### **🏠 Main Dashboard** (`/`)
- 16-axis coordinate visualization
- Real-time system metrics
- Navigation to all modules

### **🚀 Advanced AGI Interface** (`/advanced`)
- **AGI Conversation**: Natural language interaction with AI
- **Knowledge Agent Orchestra**: Multiple AI engines working together
- **Reasoning Chain Visualization**: See how AI thinks step-by-step
- **Multi-dimensional Analysis**: Complex coordinate reasoning
- **Security & Audit**: Enterprise-grade data handling

### **🧮 Simulation Engine** (`/simulation`)
- Multi-persona coordinate expansion
- Role-based analysis and prediction
- Crosswalk relationship mapping
- Advanced mathematical operations

### **📐 Coordinate Builder** (`/coordinate`)
- Interactive 16-axis coordinate creation
- Real-time validation and suggestions
- Export/import functionality

---

## ⚡ **Development Workflow**

### **🔄 Hot Reload Development**
```bash
# Terminal 1: Backend (auto-reloads on changes)
cd backend && python advanced_main.py

# Terminal 2: Frontend (auto-reloads on changes)  
cd frontend && npm run dev
```

### **🧪 Testing AGI Features**
1. Open `http://localhost:3000/advanced`
2. Enter complex queries like:
   - *"Analyze cross-sector compliance requirements for healthcare AI"*
   - *"Generate reasoning chain for ethical AI implementation"*
   - *"Translate regulatory requirements to axis coordinates"*

### **📊 Monitoring Performance**
- **System Metrics**: `http://localhost:8001/metrics/system`
- **Security Metrics**: `http://localhost:8001/metrics/security` 
- **API Documentation**: `http://localhost:8001/docs`

---

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Required
GOOGLE_API_KEY=your-gemini-api-key

# Optional
NEXT_PUBLIC_API_BASE=http://localhost:8001
DATABASE_URL=sqlite:///./data/uskd.db
LOG_LEVEL=INFO
```

### **Config Files**
- `backend/advanced_main.py` - Main server configuration
- `frontend/next.config.js` - Frontend build settings
- `frontend/src/lib/api.ts` - API client configuration

---

## 🚀 **Advanced Features**

### **🧠 AI Reasoning Strategies**
- **Logical**: Step-by-step deductive reasoning
- **Probabilistic**: Bayesian inference and uncertainty handling
- **Neural**: Deep learning pattern recognition
- **Hybrid**: Combined multi-strategy approach

### **🔐 Security Levels**
- **Public**: Open access data
- **Internal**: Organization-restricted
- **Confidential**: Need-to-know basis
- **Restricted**: Highest security clearance
- **Top Secret**: Maximum protection

### **📈 Analysis Depths**
- **Surface**: Quick overview analysis
- **Moderate**: Standard depth investigation  
- **Deep**: Comprehensive examination
- **Comprehensive**: Exhaustive multi-angle analysis

---

## 🤝 **Contributing**

### **Development Guidelines**
1. **Backend**: Follow FastAPI best practices, type hints, async patterns
2. **Frontend**: Use TypeScript, React 19, Next.js 15 App Router
3. **AI Engines**: Implement proper error handling and logging
4. **Documentation**: Update README and API docs for new features

### **Code Style**
- **Python**: PEP 8, Black formatting, type annotations
- **TypeScript**: ESLint, Prettier, strict mode enabled
- **Commit Messages**: Conventional commits format

---

## 📄 **License**

This project is part of an advanced AGI research and development initiative.

---

## 🆘 **Support & Troubleshooting**

### **Common Issues**

**Backend won't start:**
```bash
# Check Python version
python --version  # Should be 3.10+

# Install missing dependencies
pip install -r requirements.txt

# Check port availability
netstat -ano | findstr :8001
```

**Frontend build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version  
node --version  # Should be 18+
```

**AGI features not working:**
- Verify `GOOGLE_API_KEY` is set correctly
- Check backend logs for API errors
- Ensure all engines are initialized successfully

### **Performance Optimization**
- **Backend**: Use async/await patterns, implement connection pooling
- **Frontend**: Lazy load components, optimize bundle size
- **Database**: Add indexes for frequently queried fields

---

**🎯 Ready to explore the future of AGI?** Start with `http://localhost:3000/advanced` and begin your journey into advanced artificial intelligence development! 🚀 