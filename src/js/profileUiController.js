/**
 * @file profileUiController.js
 * Handles all DOM interaction and event listeners.
 */

import CanvasModel from './canvasModel.js';

const hiddenImageElement = document.getElementById('hiddenImage');
const canvasElement = document.getElementById('canvas');

export const canvasModel = new CanvasModel();

let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

// ==========================================
// IMAGE HANDLING
// ==========================================

function handleImageChange(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            setImageElement(e.target.result);

            // Save image separately for persistence
            localStorage.setItem('profileImage', e.target.result);
        };

        reader.readAsDataURL(file);
    }
}

// ==========================================
// TEXT CONTROLS
// ==========================================

function handleTopTextChange(event) {
    canvasModel.topText = event.target.value;
    updateCanvas();
}

function handleBottomTextChange(event) {
    canvasModel.bottomText = event.target.value;
    updateCanvas();
}

function handleTextColorChange(event) {
    canvasModel.textColor = event.target.value;
    updateCanvas();
}

function handleFontChange(event) {
    canvasModel.fontFamily = event.target.value;
    updateCanvas();
}

function handleFontSizeChange(event) {
    canvasModel.fontSize = event.target.value;
    updateCanvas();
}

function handleOutlineChange(event) {
    canvasModel.outlineColor = event.target.value;
    updateCanvas();
}

function handleFilterChange(event) {
    canvasModel.filter = event.target.value;
    updateCanvas();
}

function handleZoomChange(event) {
    canvasModel.zoom = Number(event.target.value);
    updateCanvas();
}

// ==========================================
// STICKERS
// ==========================================

function getMousePosition(event) {
    const rect = canvasElement.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function handleEmojiButtonClick(event) {
    document.getElementById('stickerText').value = event.target.textContent;
}

function handleCanvasMouseMove(event) {
    const mousePos = getMousePosition(event);

    // Sticker preview
    const stickerText = document.getElementById('stickerText').value;

    canvasModel.previewSticker = {
        text: stickerText,
        x: mousePos.x,
        y: mousePos.y
    };

    // Drag image position
    if (isDragging) {
        const dx = mousePos.x - lastMouseX;
        const dy = mousePos.y - lastMouseY;

        canvasModel.imageOffsetX += dx;
        canvasModel.imageOffsetY += dy;

        lastMouseX = mousePos.x;
        lastMouseY = mousePos.y;
    }

    updateCanvas();
}

function handleCanvasClick(event) {
    const mousePos = getMousePosition(event);

    const stickerText = document.getElementById('stickerText').value;

    canvasModel.stickers.push({
        text: stickerText,
        x: mousePos.x,
        y: mousePos.y
    });

    updateCanvas();
}

function handleMouseDown(event) {
    isDragging = true;

    const mousePos = getMousePosition(event);

    lastMouseX = mousePos.x;
    lastMouseY = mousePos.y;
}

function handleMouseUp() {
    isDragging = false;
}

function handleClearStickers() {
    canvasModel.stickers = [];
    updateCanvas();
}

// ==========================================
// DOWNLOAD
// ==========================================

function handleDownloadClick(event) {
    event.currentTarget.href = canvasElement.toDataURL('image/png');
}

// ==========================================
// LOCAL STORAGE
// ==========================================

function saveToLocalStorage() {
    const data = canvasModel.toStorageObject();

    localStorage.setItem('profileSettings', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const savedSettings = localStorage.getItem('profileSettings');

    if (savedSettings) {
        const parsed = JSON.parse(savedSettings);

        canvasModel.loadFromStorageObject(parsed);

        // Restore form controls
        document.getElementById('topText').value = canvasModel.topText;
        document.getElementById('bottomText').value = canvasModel.bottomText;
        document.getElementById('textColor').value = canvasModel.textColor;
        document.getElementById('fontSelect').value = canvasModel.fontFamily;
        document.getElementById('fontSize').value = canvasModel.fontSize;
        document.getElementById('textOutline').value = canvasModel.outlineColor;
        document.getElementById('filterSelect').value = canvasModel.filter;
        document.getElementById('zoomRange').value = canvasModel.zoom;
    }

    const savedImage = localStorage.getItem('profileImage');

    if (savedImage) {
        setImageElement(savedImage);
    }
}

// ==========================================
// CANVAS HELPERS
// ==========================================

function updateCanvas() {
    canvasModel.render(canvasElement);
    saveToLocalStorage();
}

function setImageElement(url) {
    hiddenImageElement.src = url;

    canvasModel.image = hiddenImageElement;

    hiddenImageElement.onload = () => {
        updateCanvas();
    };
}

function sizeCanvas() {
    canvasElement.height = Math.min(500, window.innerWidth - 30);
    canvasElement.width = Math.min(500, window.innerWidth - 30);
}

// ==========================================
// EVENT LISTENERS
// ==========================================

function setupEventListeners() {
    document.getElementById('image')
        .addEventListener('change', handleImageChange);

    document.getElementById('topText')
        .addEventListener('input', handleTopTextChange);

    document.getElementById('bottomText')
        .addEventListener('input', handleBottomTextChange);

    document.getElementById('downloadPic')
        .addEventListener('click', handleDownloadClick);

    document.getElementById('textColor')
        .addEventListener('input', handleTextColorChange);

    document.getElementById('fontSelect')
        .addEventListener('change', handleFontChange);

    document.getElementById('fontSize')
        .addEventListener('input', handleFontSizeChange);

    document.getElementById('textOutline')
        .addEventListener('change', handleOutlineChange);

    document.getElementById('filterSelect')
        .addEventListener('change', handleFilterChange);

    document.getElementById('zoomRange')
        .addEventListener('input', handleZoomChange);

    document.getElementById('clearStickers')
        .addEventListener('click', handleClearStickers);

    canvasElement.addEventListener('mousemove', handleCanvasMouseMove);
    canvasElement.addEventListener('click', handleCanvasClick);
    canvasElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    document.querySelectorAll('.emoji-btn').forEach((button) => {
    button.addEventListener('click', handleEmojiButtonClick);
});
}

// ==========================================
// INIT
// ==========================================

export function init() {
    const DEFAULT_IMAGE_FILE = '/images/defaultProfileImage.jpg';

    setupEventListeners();

    sizeCanvas();

    loadFromLocalStorage();

    if (!localStorage.getItem('profileImage')) {
        setImageElement(DEFAULT_IMAGE_FILE);
    }

    updateCanvas();
}