"""
Rutas de autenticación - Login y Registro
"""
from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from pathlib import Path

router = APIRouter(tags=["auth"])

BASE_DIR = Path(__file__).resolve().parent.parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

@router.get("/login")
async def login_page(request: Request):
    """Renderizar página de login"""
    return templates.TemplateResponse("login.html", {"request": request})

@router.get("/register")
async def register_page(request: Request):
    """Renderizar página de registro"""
    return templates.TemplateResponse("register.html", {"request": request})