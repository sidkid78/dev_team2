# Advanced Knowledge Simulation Platform - Backend Startup Script
# Starts the enterprise-grade backend with all engines

Write-Host "🚀 Starting Advanced Knowledge Simulation Platform Backend..." -ForegroundColor Cyan
Write-Host "🏗️  Enterprise-grade multi-engine architecture initializing..." -ForegroundColor Green

# Navigate to backend directory
Set-Location backend

# Check if virtual environment exists
if (!(Test-Path "venv")) {
    Write-Host "📦 Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Yellow
& "venv\Scripts\Activate.ps1"

# Install/upgrade dependencies
Write-Host "📋 Installing advanced dependencies..." -ForegroundColor Yellow
pip install --upgrade pip
pip install -r requirements-advanced.txt

# Start the advanced backend
Write-Host "🌟 Launching Advanced Knowledge Simulation Platform..." -ForegroundColor Magenta
Write-Host "✨ Features include:" -ForegroundColor Cyan
Write-Host "   • AppOrchestrator - Intelligent workflow coordination" -ForegroundColor Gray
Write-Host "   • KASE - Advanced reasoning and ML-powered simulation" -ForegroundColor Gray  
Write-Host "   • SEKRE - Enterprise security and knowledge graphs" -ForegroundColor Gray
Write-Host "   • Multi-strategy reasoning (logical, probabilistic, neural, hybrid)" -ForegroundColor Gray
Write-Host "   • Real-time optimization and performance monitoring" -ForegroundColor Gray

Write-Host ""
Write-Host "🔗 API Documentation: http://localhost:8000/docs" -ForegroundColor Green
Write-Host "📊 System Metrics: http://localhost:8000/metrics/system" -ForegroundColor Green
Write-Host "🛡️  Security Metrics: http://localhost:8000/metrics/security" -ForegroundColor Green
Write-Host ""

# Start the server
python -m uvicorn advanced_main:app --reload --host 0.0.0.0 --port 8000 