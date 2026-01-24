// API Configuration
const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');

// Axios instance with JWT authentication
const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use(config => {
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Canvas Setup
let canvas, ctx;
let isDrawing = false;
let currentTool = 'brush';
let currentColor = '#000000';
let currentBrushSize = 5;
let drawingHistory = [];

// DOM Elements
const authContainer = document.getElementById('authContainer');
const appContainer = document.getElementById('appContainer');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const navHome = document.getElementById('navHome');
const navGallery = document.getElementById('navGallery');
const navLogout = document.getElementById('navLogout');
const drawingView = document.getElementById('drawingView');
const galleryView = document.getElementById('galleryView');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initializeEventListeners();
});

function checkAuth() {
    if (token) {
        showApp();
        initializeCanvas();
        loadDailyPrompt();
    } else {
        showAuth();
    }
}

function showAuth() {
    authContainer.style.display = 'flex';
    appContainer.style.display = 'none';
}

function showApp() {
    authContainer.style.display = 'none';
    appContainer.style.display = 'block';
}

// Authentication Event Listeners
function initializeEventListeners() {
    // Auth forms
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);

    // Navigation
    navHome.addEventListener('click', (e) => {
        e.preventDefault();
        showDrawingView();
    });

    navGallery.addEventListener('click', (e) => {
        e.preventDefault();
        showGalleryView();
    });

    navLogout.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });

    // Drawing controls
    document.getElementById('brushTool').addEventListener('click', () => setTool('brush'));
    document.getElementById('eraserTool').addEventListener('click', () => setTool('eraser'));
    document.getElementById('clearCanvas').addEventListener('click', clearCanvas);
    document.getElementById('colorPicker').addEventListener('change', (e) => {
        currentColor = e.target.value;
    });
    document.getElementById('brushSize').addEventListener('input', (e) => {
        currentBrushSize = e.target.value;
        document.getElementById('brushSizeValue').textContent = e.target.value;
    });
    document.getElementById('saveDrawing').addEventListener('click', saveDrawing);

    // Gallery
    document.getElementById('startDrawing').addEventListener('click', () => {
        showDrawingView();
    });

    // Modal
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('deleteDrawing').addEventListener('click', deleteDrawing);
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        token = response.data.token;
        localStorage.setItem('token', token);
        showNotification('Login successful!', 'success');
        showApp();
        initializeCanvas();
        loadDailyPrompt();
    } catch (error) {
        showNotification(error.response?.data?.error || 'Login failed', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await axios.post(`${API_URL}/register`, { username, email, password });
        token = response.data.token;
        localStorage.setItem('token', token);
        showNotification('Registration successful!', 'success');
        showApp();
        initializeCanvas();
        loadDailyPrompt();
    } catch (error) {
        showNotification(error.response?.data?.error || 'Registration failed', 'error');
    }
}

function handleLogout() {
    token = null;
    localStorage.removeItem('token');
    showNotification('Logged out successfully', 'success');
    showAuth();
}

// Canvas Functions
function initializeCanvas() {
    canvas = document.getElementById('drawingCanvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Canvas event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch support
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = currentBrushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (currentTool === 'brush') {
        ctx.strokeStyle = currentColor;
        ctx.globalCompositeOperation = 'source-over';
    } else if (currentTool === 'eraser') {
        ctx.strokeStyle = '#ffffff';
        ctx.globalCompositeOperation = 'destination-out';
    }

    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function setTool(tool) {
    currentTool = tool;
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    if (tool === 'brush') {
        document.getElementById('brushTool').classList.add('active');
    } else if (tool === 'eraser') {
        document.getElementById('eraserTool').classList.add('active');
    }
}

function clearCanvas() {
    if (confirm('Are you sure you want to clear the canvas?')) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        showNotification('Canvas cleared', 'warning');
    }
}

// API Functions
async function loadDailyPrompt() {
    try {
        const response = await axios.get(`${API_URL}/daily-prompt`);
        document.getElementById('promptText').textContent = response.data.prompt;
        const date = new Date(response.data.date);
        document.getElementById('promptDate').textContent = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Check if user has already drawn today
        const today = new Date().toISOString().split('T')[0];
        checkTodayDrawing(today);
    } catch (error) {
        console.error('Failed to load prompt:', error);
        showNotification('Failed to load daily prompt', 'error');
    }
}

async function checkTodayDrawing(date) {
    try {
        const response = await api.get(`/drawings/today/${date}`);
        if (response.data.drawing) {
            const confirmed = confirm('You already have a drawing for today. Load it?');
            if (confirmed) {
                loadDrawingToCanvas(response.data.drawing);
            }
        }
    } catch (error) {
        console.error('Failed to check today\'s drawing:', error);
    }
}

function loadDrawingToCanvas(drawing) {
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
    };
    img.src = drawing.drawing_data;
    document.getElementById('drawingTitle').value = drawing.title;
}

async function saveDrawing() {
    const title = document.getElementById('drawingTitle').value.trim();
    if (!title) {
        showNotification('Please give your drawing a title', 'warning');
        return;
    }

    const drawingData = canvas.toDataURL('image/png');
    const date = new Date().toISOString().split('T')[0];

    try {
        await api.post('/drawings', {
            title,
            drawingData,
            date
        });
        showNotification('Drawing saved successfully! 🎉', 'success');
        document.getElementById('drawingTitle').value = '';
    } catch (error) {
        showNotification(error.response?.data?.error || 'Failed to save drawing', 'error');
    }
}

// View Functions
function showDrawingView() {
    drawingView.style.display = 'block';
    galleryView.style.display = 'none';
    if (canvas) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

async function showGalleryView() {
    drawingView.style.display = 'none';
    galleryView.style.display = 'block';
    await loadGallery();
}

async function loadGallery() {
    try {
        const response = await api.get('/drawings');
        const drawings = response.data.drawings;
        const galleryGrid = document.getElementById('galleryGrid');
        const emptyGallery = document.getElementById('emptyGallery');

        if (drawings.length === 0) {
            galleryGrid.style.display = 'none';
            emptyGallery.style.display = 'block';
        } else {
            galleryGrid.style.display = 'grid';
            emptyGallery.style.display = 'none';
            galleryGrid.innerHTML = drawings.map(drawing => `
                <div class="gallery-item" data-id="${drawing.id}">
                    <div class="gallery-item-image">
                        <span>🎨</span>
                    </div>
                    <div class="gallery-item-info">
                        <div class="gallery-item-title">${escapeHtml(drawing.title)}</div>
                        <div class="gallery-item-date">${new Date(drawing.date).toLocaleDateString()}</div>
                    </div>
                </div>
            `).join('');

            // Add click listeners
            document.querySelectorAll('.gallery-item').forEach(item => {
                item.addEventListener('click', () => {
                    viewDrawing(item.dataset.id);
                });
            });
        }
    } catch (error) {
        showNotification('Failed to load gallery', 'error');
    }
}

async function viewDrawing(id) {
    try {
        const response = await api.get(`/drawings/${id}`);
        const drawing = response.data.drawing;

        document.getElementById('modalTitle').textContent = drawing.title;
        document.getElementById('modalDate').textContent = new Date(drawing.date).toLocaleDateString();

        const modalCanvas = document.getElementById('modalCanvas');
        const modalCtx = modalCanvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            modalCtx.drawImage(img, 0, 0);
        };
        img.src = drawing.drawing_data;

        document.getElementById('drawingModal').style.display = 'flex';
        document.getElementById('drawingModal').dataset.currentId = id;
    } catch (error) {
        showNotification('Failed to load drawing', 'error');
    }
}

async function deleteDrawing() {
    const modal = document.getElementById('drawingModal');
    const id = modal.dataset.currentId;

    if (!confirm('Are you sure you want to delete this drawing?')) {
        return;
    }

    try {
        await api.delete(`/drawings/${id}`);
        showNotification('Drawing deleted successfully', 'success');
        closeModal();
        loadGallery();
    } catch (error) {
        showNotification('Failed to delete drawing', 'error');
    }
}

function closeModal() {
    document.getElementById('drawingModal').style.display = 'none';
}

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('drawingModal');
    if (e.target === modal) {
        closeModal();
    }
});
