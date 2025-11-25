"""
Rutas del chat - Interfaz principal
"""
from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from pathlib import Path

router = APIRouter(tags=["chat"])

BASE_DIR = Path(__file__).resolve().parent.parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

@router.get("/chat")
async def chat_page(request: Request):
    """Renderizar página del chat"""
    return templates.TemplateResponse("chat.html", {"request": request})