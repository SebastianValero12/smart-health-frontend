/**
 * SmartHealth - Lógica del Chat
 */

// Estado global del chat
const ChatState = {
    currentSessionId: null,
    sequenceChatId: 0,
    messages: [],
    websocket: null,
    isConnected: false
};

// ============ Inicialización del Chat ============
function initChat() {
    // Verificar autenticación
    if (!Auth.isAuthenticated()) {
        window.location.href = '/login';
        return;
    }

    // Cargar información del usuario
    loadUserInfo();

    // Inicializar elementos del DOM
    initChatElements();

    // Inicializar WebSocket (cuando esté disponible)
    // initWebSocket();

    // Crear nueva sesión
    createNewSession();
}

// ============ Cargar Información del Usuario ============
function loadUserInfo() {
    const user = Auth.getUser();
    if (!user) return;

    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    const userInitialsElement = document.getElementById('userInitials');

    if (userNameElement) userNameElement.textContent = user.full_name || 'Usuario';
    if (userEmailElement) userEmailElement.textContent = user.email || 'usuario@ejemplo.com';
    if (userInitialsElement) userInitialsElement.textContent = Utils.getInitials(user.full_name);
}

// ============ Inicializar Elementos del Chat ============
function initChatElements() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const documentNumber = document.getElementById('documentNumber');
    const newChatBtn = document.getElementById('newChatBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Auto-resize del textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        
        // Habilitar/deshabilitar botón de envío
        updateSendButton();
    });

    // Enviar con Enter (Shift+Enter para nueva línea)
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendBtn.disabled) {
                sendMessage();
            }
        }
    });

    // Validar número de documento
    documentNumber.addEventListener('input', updateSendButton);

    // Evento de envío
    sendBtn.addEventListener('click', sendMessage);

    // Nueva consulta
    newChatBtn.addEventListener('click', createNewSession);

    // Logout
    logoutBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            Auth.logout();
        }
    });
}

// ============ Actualizar Estado del Botón de Envío ============
function updateSendButton() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const documentNumber = document.getElementById('documentNumber');

    const hasMessage = chatInput.value.trim().length > 0;
    const hasDocument = documentNumber.value.trim().length > 0;

    sendBtn.disabled = !(hasMessage && hasDocument);
}

// ============ Crear Nueva Sesión ============
function createNewSession() {
    ChatState.currentSessionId = Utils.generateUUID();
    ChatState.sequenceChatId = 0;
    ChatState.messages = [];

    // Limpiar el área de mensajes
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `
        <div class="welcome-message">
            <div class="welcome-icon">
                <svg width="60" height="60" viewBox="0 0 50 50" fill="none">
                    <path d="M25 5C14.5 5 6 13.5 6 24C6 34.5 14.5 43 25 43C35.5 43 44 34.5 44 24C44 13.5 35.5 5 25 5Z" stroke="#4F46E5" stroke-width="2"/>
                    <path d="M25 15V33M17 24H33" stroke="#4F46E5" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
            <h2>¡Nueva Consulta!</h2>
            <p>Proporciona la información del paciente y tu pregunta.</p>
        </div>
    `;

    // Limpiar inputs
    document.getElementById('chatInput').value = '';
    document.getElementById('documentNumber').value = '';
    document.getElementById('documentType').value = '1';

    console.log('Nueva sesión creada:', ChatState.currentSessionId);
}

// ============ Enviar Mensaje ============
async function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const documentType = document.getElementById('documentType');
    const documentNumber = document.getElementById('documentNumber');
    const sendBtn = document.getElementById('sendBtn');

    const question = chatInput.value.trim();
    const docTypeId = parseInt(documentType.value);
    const docNumber = documentNumber.value.trim();

    if (!question || !docNumber) return;

    // Incrementar secuencia
    ChatState.sequenceChatId++;

    // Preparar el mensaje
    const messageData = {
        user_id: Auth.getUser().user_id,
        token: Auth.getToken(),
        session_id: ChatState.currentSessionId,
        document_type_id: docTypeId,
        document_number: docNumber,
        question: question
    };

    // Agregar mensaje del usuario al chat
    addMessageToChat('user', question, {
        documentType: getDocumentTypeName(docTypeId),
        documentNumber: docNumber
    });

    // Limpiar input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    sendBtn.disabled = true;

    // Mostrar indicador de escritura
    showTypingIndicator();

    try {
        // NOTA: Reemplazar con llamada real al backend cuando esté disponible
        // Por ahora, usamos una simulación
        
        // Simulación temporal
        const response = await simulateQueryResponse(messageData);
        
        // Llamada real (descomentar cuando el backend esté listo):
        /*
        const response = await API.post('/query', messageData);
        */

        // Ocultar indicador de escritura
        hideTypingIndicator();

        // Agregar respuesta del asistente
        addAssistantResponse(response);

        // Guardar en historial
        saveToHistory(question, response);

    } catch (error) {
        hideTypingIndicator();
        addMessageToChat('assistant', 'Lo siento, ocurrió un error al procesar tu consulta. Por favor, intenta nuevamente.');
        console.error('Error enviando mensaje:', error);
    }
}

// ============ Agregar Mensaje al Chat ============
function addMessageToChat(role, content, metadata = null) {
    const chatMessages = document.getElementById('chatMessages');
    
    // Remover mensaje de bienvenida si existe
    const welcomeMsg = chatMessages.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? Utils.getInitials(Auth.getUser().full_name) : 'SA';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = content;

    // Si es mensaje del usuario y tiene metadata, agregar info del paciente
    if (role === 'user' && metadata) {
        const patientInfo = document.createElement('div');
        patientInfo.className = 'patient-info-display';
        patientInfo.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
            </svg>
            <span>${metadata.documentType}: ${metadata.documentNumber}</span>
        `;
        contentDiv.appendChild(patientInfo);
    }

    const timeSpan = document.createElement('div');
    timeSpan.className = 'message-time';
    timeSpan.textContent = DateFormatter.toTime(new Date().toISOString());

    contentDiv.appendChild(bubble);
    contentDiv.appendChild(timeSpan);

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);

    chatMessages.appendChild(messageDiv);

    // Scroll al final
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Guardar mensaje en el estado
    ChatState.messages.push({
        role,
        content,
        timestamp: new Date().toISOString(),
        metadata
    });
}

// ============ Agregar Respuesta del Asistente ============
function addAssistantResponse(response) {
    if (response.status === 'success') {
        const answerText = response.answer.text;
        addMessageToChat('assistant', answerText);
    } else if (response.status === 'error') {
        addMessageToChat('assistant', `Error: ${response.error.message}`);
    }
}

// ============ Indicador de Escritura ============
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'message assistant';
    typingDiv.innerHTML = `
        <div class="message-avatar">SA</div>
        <div class="message-content">
            <div class="message-bubble">
                <div class="typing-indicator">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// ============ Guardar en Historial ============
function saveToHistory(question, response) {
    // Aquí se podría implementar persistencia local o sincronización con el backend
    console.log('Guardando en historial:', { question, response });
}

// ============ Utilidades ============
function getDocumentTypeName(typeId) {
    const types = {
        1: 'CC',
        2: 'TI',
        3: 'CE',
        4: 'PA'
    };
    return types[typeId] || 'CC';
}

// ============ Simulación de Respuesta (TEMPORAL) ============
// Esta función simula la respuesta del backend con RAG
// DEBE SER ELIMINADA cuando el backend esté implementado

async function simulateQueryResponse(messageData) {
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Respuesta simulada basada en el formato del proyecto
    return {
        status: "success",
        session_id: messageData.session_id,
        sequence_chat_id: ChatState.sequenceChatId,
        timestamp: new Date().toISOString(),
        patient_info: {
            patient_id: 123,
            full_name: "Juan Pérez García",
            document_type: getDocumentTypeName(messageData.document_type_id),
            document_number: messageData.document_number
        },
        answer: {
            text: `Basado en la información disponible para el paciente ${messageData.document_number}, puedo informarte que:\n\n` +
                  `El paciente ha tenido 2 citas médicas recientes:\n\n` +
                  `1. **15/11/2024** - Consulta de Cardiología\n` +
                  `   - Diagnóstico: Hipertensión arterial grado 2 (CIE-10: I10)\n` +
                  `   - Tratamiento prescrito: Losartán 50mg c/24h\n\n` +
                  `2. **20/10/2024** - Control General\n` +
                  `   - Diagnóstico secundario: Dislipidemia (CIE-10: E78.5)\n` +
                  `   - Indicaciones: Dieta baja en grasas, ejercicio moderado\n\n` +
                  `*Esta información es provisional hasta que se conecte con la base de datos real.*`,
            confidence: 0.94,
            model_used: "claude-sonnet-4.5"
        },
        sources: [
            {
                source_id: 1,
                type: "appointment",
                appointment_id: 458,
                date: "2024-11-15",
                relevance_score: 0.98
            }
        ],
        metadata: {
            total_records_analyzed: 15,
            query_time_ms: 342,
            sources_used: 3,
            context_tokens: 2456
        }
    };
}

// ============ WebSocket (Para implementación futura) ============
function initWebSocket() {
    // Esta función se implementará cuando el backend tenga WebSocket configurado
    /*
    const wsUrl = `ws://${window.location.host}/ws/chat`;
    ChatState.websocket = new WebSocket(wsUrl);

    ChatState.websocket.onopen = () => {
        console.log('WebSocket conectado');
        ChatState.isConnected = true;
    };

    ChatState.websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
    };

    ChatState.websocket.onerror = (error) => {
        console.error('Error en WebSocket:', error);
        ChatState.isConnected = false;
    };

    ChatState.websocket.onclose = () => {
        console.log('WebSocket desconectado');
        ChatState.isConnected = false;
    };
    */
}