# SmartHealth Frontend 🏥

Frontend del sistema de consultas clínicas con RAG (Retrieval-Augmented Generation) desarrollado con FastAPI, HTML, CSS y JavaScript vanilla.

## 📋 Descripción

Interfaz web para el sistema SmartHealth que permite a los usuarios autenticados realizar consultas sobre información clínica de pacientes utilizando inteligencia artificial.

## 🏗️ Estructura del Proyecto

```
frontend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Aplicación principal FastAPI
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py            # Rutas de autenticación
│   │   └── chat.py            # Rutas del chat
│   ├── static/
│   │   ├── css/
│   │   │   ├── base.css       # Estilos globales
│   │   │   ├── auth.css       # Estilos de login/registro
│   │   │   └── chat.css       # Estilos del chat
│   │   ├── js/
│   │   │   ├── utils.js       # Funciones utilitarias
│   │   │   ├── auth.js        # Lógica de autenticación
│   │   │   └── chat.js        # Lógica del chat
│   │   └── img/
│   │       └── logo.png       # Logo (agregar)
│   └── templates/
│       ├── base.html          # Template base
│       ├── login.html         # Página de login
│       ├── register.html      # Página de registro
│       └── chat.html          # Interfaz del chat
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

## 🚀 Instalación

### Prerrequisitos

* Python 3.9 o superior
* pip

### Pasos

1. **Clonar el repositorio**

   ```bash
   cd frontend
   ```
2. **Crear entorno virtual**

   ```bash
   python -m venv venv

   # En Windows
   venv\Scripts\activate

   # En Linux/Mac
   source venv/bin/activate
   ```
3. **Instalar dependencias**

   ```bash
   pip install -r requirements.txt
   ```
4. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```
5. **Ejecutar la aplicación**

   ```bash
   cd app
   python main.py
   ```

   O usando uvicorn directamente:

   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
6. **Acceder a la aplicación**

   * Abrir navegador en: `http://localhost:8000`

## 🔑 Credenciales de Prueba (Temporal)

Mientras el backend no esté implementado, puedes usar estas credenciales:

* **Email:** `test@smarthealth.com`
* **Password:** `password123`

## 📱 Funcionalidades

### ✅ Implementadas

* **Autenticación**
  * Login de usuarios
  * Registro de nuevos usuarios
  * Validación de formularios
  * Gestión de JWT (simulado)
* **Interfaz de Chat**
  * Diseño responsivo tipo WhatsApp
  * Entrada de información del paciente (tipo y número de documento)
  * Área de mensajes con scroll automático
  * Indicador de escritura
  * Historial de sesiones (UI lista)
* **UI/UX**
  * Diseño moderno con gradientes
  * Animaciones suaves
  * Estados de carga
  * Mensajes de error y éxito
  * Modo responsive para móviles

### 🔄 Pendientes (Requieren Backend)

* **Integración con Backend**
  * Endpoints reales de `/auth/register` y `/auth/login`
  * Endpoint `/query` para consultas RAG
  * WebSocket `/ws/chat` para streaming
  * Validación real de JWT
* **Funcionalidades Avanzadas**
  * Historial de conversaciones persistente
  * Búsqueda en historial
  * Exportación de conversaciones
  * Preferencias de usuario

## 🔗 Integración con Backend

### URLs que el Frontend espera del Backend

1. **POST /auth/register**
   ```json
   Request:
   {
     "full_name": "Juan Pérez",
     "email": "juan@example.com",
     "password": "password123"
   }

   Response:
   {
     "message": "Usuario registrado exitosamente",
     "user_id": "user_001"
   }
   ```
2. **POST /auth/login**
   ```json
   Request:
   {
     "email": "juan@example.com",
     "password": "password123"
   }

   Response:
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user_id": "user_001",
     "full_name": "Juan Pérez",
     "email": "juan@example.com"
   }
   ```
3. **POST /query**
   ```json
   Request:
   {
     "user_id": "user_001",
     "token": "jwt_token",
     "session_id": "550e8400-e29b-41d4-a716-446655440000",
     "document_type_id": 1,
     "document_number": "1234567890",
     "question": "¿Cuáles son las últimas citas del paciente?"
   }

   Response: (Ver formato estándar en el documento del proyecto)
   ```
4. **WS /ws/chat**
   * WebSocket para streaming token-by-token

## 🛠️ Desarrollo

### Modificar Estilos

Los estilos están organizados por responsabilidad:

* `base.css`: Variables CSS, reset, componentes globales
* `auth.css`: Estilos específicos de login y registro
* `chat.css`: Estilos de la interfaz de chat

### Modificar JavaScript

El código JavaScript está dividido en módulos:

* `utils.js`: Funciones utilitarias (Storage, API, Validación, etc.)
* `auth.js`: Lógica de login y registro
* `chat.js`: Lógica del chat y WebSocket

### Agregar Nuevas Páginas

1. Crear template en `templates/`
2. Crear ruta en `routes/`
3. Agregar estilos específicos en `static/css/`
4. Agregar lógica en `static/js/`

## 🎨 Personalización

### Colores

Los colores principales se definen en `base.css` como variables CSS:

```css
:root {
    --primary-color: #4F46E5;
    --primary-hover: #4338CA;
    --success-color: #10B981;
    --error-color: #EF4444;
    /* ... más colores */
}
```

### Tipografía

La fuente principal se puede cambiar en `base.css`:

```css
:root {
    --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...;
}
```

## 📦 Despliegue

### Desarrollo Local

```bash
uvicorn app.main:app --reload
```

### Producción

1. **Render.com** (Recomendado para el proyecto)
   * Crear nuevo Web Service
   * Conectar repositorio GitHub
   * Build Command: `pip install -r requirements.txt`
   * Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
2. **Railway**
   * Similar a Render, detecta FastAPI automáticamente
3. **Vercel/Netlify**
   * Requiere configuración adicional para FastAPI

## 🐛 Solución de Problemas

### El servidor no inicia

```bash
# Verificar que las dependencias estén instaladas
pip install -r requirements.txt

# Verificar la versión de Python
python --version  # Debe ser 3.9+
```

### Errores de CORS

* Verificar configuración en `main.py`
* En producción, cambiar `allow_origins=["*"]` por dominios específicos

### Estilos no se cargan

* Verificar que la ruta de `static` esté correctamente montada
* Revisar la consola del navegador para errores 404

## 📝 Tareas Pendientes

* [ ] Conectar con endpoints reales del backend
* [ ] Implementar WebSocket para streaming
* [ ] Agregar persistencia de historial
* [ ] Implementar búsqueda en conversaciones
* [ ] Agregar tests unitarios
* [ ] Mejorar accesibilidad (ARIA labels)
* [ ] Implementar modo oscuro
* [ ] Agregar internacionalización (i18n)

## 👥 Contribución

Este es un proyecto académico. Para contribuir:

1. Crear una rama feature
2. Hacer cambios
3. Crear Pull Request con descripción detallada

## 📄 Licencia

Proyecto académico - Universidad

## 🔗 Enlaces Útiles

* [FastAPI Docs](https://fastapi.tiangolo.com/)
* [Jinja2 Templates](https://jinja.palletsprojects.com/)
* [MDN Web Docs](https://developer.mozilla.org/)
* [CSS Tricks](https://css-tricks.com/)

## 📞 Contacto

Para preguntas sobre el proyecto, contactar al equipo de desarrollo.

---

**Nota:** Este frontend está preparado para integrarse con el backend una vez que los endpoints estén implementados. Las funciones de simulación deben ser reemplazadas por llamadas reales a la API.
