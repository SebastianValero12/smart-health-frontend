"""
SmartHealth Frontend - FastAPI Main Application
"""
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

# Importar las rutas
from app.routes import auth, chat

# Crear la aplicación FastAPI
app = FastAPI(
    title="SmartHealth Frontend",
    description="Frontend para el sistema de consultas clínicas con RAG",
    version="1.0.0"
)

# Configurar CORS para el desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios exactos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurar archivos estáticos
BASE_DIR = Path(__file__).resolve().parent
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")

# Configurar templates
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# Incluir las rutas
app.include_router(auth.router)
app.include_router(chat.router)

@app.get("/")
async def root():
    """Redirigir a la página de login"""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/login")

@app.get("/health")
async def health_check():
    """Endpoint de health check"""
    return {"status": "healthy", "service": "smarthealth-frontend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)