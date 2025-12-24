// ============================================
// NAVIGATION.JS - Mobile Menu & Navigation
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initStickyHeader();
});

// ==================== MOBILE MENU ====================
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-links a');
    
    if (!mobileToggle || !navLinks) {
        console.warn('Mobile menu elements not found');
        return;
    }
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', () => {
        toggleMobileMenu();
    });
    
    // Close menu when clicking on a link
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close menu on window resize to desktop size
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    console.log('📱 Mobile menu initialized');
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const body = document.body;
    
    if (!navLinks || !mobileToggle) return;
    
    const isActive = navLinks.classList.toggle('active');
    
    // Update toggle button icon
    mobileToggle.textContent = isActive ? '✕' : '☰';
    
    // Prevent body scroll when menu is open
    if (isActive) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = '';
    }
    
    // Update aria-expanded for accessibility
    mobileToggle.setAttribute('aria-expanded', isActive);
}

function openMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!navLinks || !mobileToggle) return;
    
    navLinks.classList.add('active');
    mobileToggle.textContent = '✕';
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!navLinks || !mobileToggle) return;
    
    navLinks.classList.remove('active');
    mobileToggle.textContent = '☰';
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// ==================== STICKY HEADER ====================
function initStickyHeader() {
    const header = document.querySelector('header');
    
    if (!header) {
        console.warn('Header element not found');
        return;
    }
    
    let lastScroll = 0;
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleHeaderScroll(header, lastScroll);
                lastScroll = window.pageYOffset;
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    console.log('📌 Sticky header initialized');
}

function handleHeaderScroll(header, lastScroll) {
    const currentScroll = window.pageYOffset;
    
    // Add shadow when scrolled
    if (currentScroll > 50) {
        header.style.boxShadow = 'var(--shadow-md)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    // Hide/show header on scroll (optional)
    // Uncomment to enable auto-hide on scroll down
    /*
    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }
    */
}

// ==================== ACTIVE PAGE DETECTION ====================
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Set active link on page load
document.addEventListener('DOMContentLoaded', setActiveNavLink);

// ==================== SCROLL TO TOP ====================
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Scroll to top');
    button.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--color-green-primary);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: var(--transition-base);
        z-index: 999;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(button);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', createScrollToTopButton);

// ==================== BREADCRUMBS ====================
function generateBreadcrumbs() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment);
    
    if (segments.length === 0) return null;
    
    const breadcrumbs = [
        { name: 'Home', url: '/' }
    ];
    
    let currentPath = '';
    segments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        breadcrumbs.push({
            name: segment.charAt(0).toUpperCase() + segment.slice(1),
            url: currentPath,
            isLast: index === segments.length - 1
        });
    });
    
    return breadcrumbs;
}

function renderBreadcrumbs() {
    const breadcrumbs = generateBreadcrumbs();
    if (!breadcrumbs) return;
    
    const breadcrumbContainer = document.querySelector('.breadcrumbs');
    if (!breadcrumbContainer) return;
    
    const breadcrumbHTML = breadcrumbs.map((crumb, index) => {
        if (crumb.isLast) {
            return `<span class="breadcrumb-item active">${crumb.name}</span>`;
        }
        return `<a href="${crumb.url}" class="breadcrumb-item">${crumb.name}</a>`;
    }).join('<span class="breadcrumb-separator">/</span>');
    
    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

// Initialize breadcrumbs if container exists
document.addEventListener('DOMContentLoaded', renderBreadcrumbs);

// ==================== EXPORT FUNCTIONS ====================
window.navigation = {
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,
    setActiveNavLink,
    generateBreadcrumbs,
    renderBreadcrumbs
};

console.log('🧭 Navigation script loaded');