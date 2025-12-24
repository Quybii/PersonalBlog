// ============================================
// LIGHTBOX.JS - Image Lightbox Viewer
// ============================================

let currentImageIndex = 0;
let imageGallery = [];

// Initialize lightbox on page load
document.addEventListener('DOMContentLoaded', () => {
    initLightbox();
    createLightboxHTML();
});

// ==================== INITIALIZE LIGHTBOX ====================
function initLightbox() {
    const lightboxImages = document.querySelectorAll('[data-lightbox]');
    
    if (lightboxImages.length === 0) {
        console.log('No lightbox images found on this page');
        return;
    }
    
    // Collect all images in gallery
    imageGallery = Array.from(lightboxImages).map((img, index) => {
        img.style.cursor = 'pointer';
        img.dataset.index = index;
        
        img.addEventListener('click', () => {
            openLightbox(index);
        });
        
        return {
            src: img.src || img.dataset.src,
            alt: img.alt || 'Image',
            title: img.dataset.title || ''
        };
    });
    
    console.log(`🖼️ Lightbox initialized with ${imageGallery.length} images`);
}

// ==================== CREATE LIGHTBOX HTML ====================
function createLightboxHTML() {
    const lightboxHTML = `
        <div id="lightbox" class="lightbox" style="display: none;">
            <div class="lightbox-backdrop"></div>
            <div class="lightbox-container">
                <button class="lightbox-close" aria-label="Close lightbox">✕</button>
                <button class="lightbox-prev" aria-label="Previous image">‹</button>
                <button class="lightbox-next" aria-label="Next image">›</button>
                <div class="lightbox-content">
                    <img src="" alt="" class="lightbox-image">
                    <div class="lightbox-caption"></div>
                    <div class="lightbox-counter"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    addLightboxStyles();
    attachLightboxEvents();
}

// ==================== ADD LIGHTBOX STYLES ====================
function addLightboxStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .lightbox-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
        }
        
        .lightbox-container {
            position: relative;
            width: 90%;
            max-width: 1200px;
            height: 90vh;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 100%;
            max-height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .lightbox-image {
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            animation: zoomIn 0.3s ease-out;
        }
        
        @keyframes zoomIn {
            from {
                transform: scale(0.8);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        .lightbox-caption {
            margin-top: 1rem;
            color: white;
            font-size: 1.125rem;
            text-align: center;
            padding: 0 2rem;
        }
        
        .lightbox-counter {
            margin-top: 0.5rem;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.875rem;
        }
        
        .lightbox-close,
        .lightbox-prev,
        .lightbox-next {
            position: absolute;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            font-size: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .lightbox-close:hover,
        .lightbox-prev:hover,
        .lightbox-next:hover {
            background: rgba(16, 185, 129, 0.9);
            border-color: rgba(16, 185, 129, 1);
            transform: scale(1.1);
        }
        
        .lightbox-close {
            top: 2rem;
            right: 2rem;
        }
        
        .lightbox-prev {
            left: 2rem;
            top: 50%;
            transform: translateY(-50%);
        }
        
        .lightbox-next {
            right: 2rem;
            top: 50%;
            transform: translateY(-50%);
        }
        
        @media (max-width: 768px) {
            .lightbox-close {
                top: 1rem;
                right: 1rem;
                width: 40px;
                height: 40px;
                font-size: 1.5rem;
            }
            
            .lightbox-prev,
            .lightbox-next {
                width: 40px;
                height: 40px;
                font-size: 1.5rem;
            }
            
            .lightbox-prev {
                left: 1rem;
            }
            
            .lightbox-next {
                right: 1rem;
            }
            
            .lightbox-image {
                max-height: 70vh;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// ==================== ATTACH EVENTS ====================
function attachLightboxEvents() {
    const lightbox = document.getElementById('lightbox');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    // Close lightbox
    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    
    // Navigation
    prevBtn.addEventListener('click', showPreviousImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    // Prevent closing when clicking on image
    lightbox.querySelector('.lightbox-image').addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// ==================== OPEN LIGHTBOX ====================
function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    
    if (!lightbox || imageGallery.length === 0) return;
    
    currentImageIndex = index;
    updateLightboxImage();
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Animation
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);
}

// ==================== CLOSE LIGHTBOX ====================
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    
    if (!lightbox) return;
    
    lightbox.style.opacity = '0';
    
    setTimeout(() => {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

// ==================== UPDATE IMAGE ====================
function updateLightboxImage() {
    const lightbox = document.getElementById('lightbox');
    const image = lightbox.querySelector('.lightbox-image');
    const caption = lightbox.querySelector('.lightbox-caption');
    const counter = lightbox.querySelector('.lightbox-counter');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    const currentImage = imageGallery[currentImageIndex];
    
    // Update image
    image.src = currentImage.src;
    image.alt = currentImage.alt;
    
    // Update caption
    caption.textContent = currentImage.title || currentImage.alt;
    
    // Update counter
    counter.textContent = `${currentImageIndex + 1} / ${imageGallery.length}`;
    
    // Show/hide navigation buttons
    prevBtn.style.display = imageGallery.length > 1 ? 'flex' : 'none';
    nextBtn.style.display = imageGallery.length > 1 ? 'flex' : 'none';
}

// ==================== NAVIGATION ====================
function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % imageGallery.length;
    updateLightboxImage();
}

function showPreviousImage() {
    currentImageIndex = (currentImageIndex - 1 + imageGallery.length) % imageGallery.length;
    updateLightboxImage();
}

// ==================== KEYBOARD CONTROLS ====================
function handleKeyboard(e) {
    const lightbox = document.getElementById('lightbox');
    
    if (!lightbox || lightbox.style.display === 'none') return;
    
    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            showPreviousImage();
            break;
        case 'ArrowRight':
            showNextImage();
            break;
    }
}

// ==================== TOUCH SUPPORT ====================
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    
    if (!lightbox) return;
    
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            showNextImage();
        } else {
            showPreviousImage();
        }
    }
}

// ==================== EXPORT FUNCTIONS ====================
window.lightbox = {
    open: openLightbox,
    close: closeLightbox,
    next: showNextImage,
    prev: showPreviousImage
};

console.log('🖼️ Lightbox script loaded');