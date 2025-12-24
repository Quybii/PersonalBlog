// ============================================
// BLOG-FILTER.JS - Blog Filtering Logic
// ============================================

let allPosts = [];
let currentFilter = 'all';

// Initialize blog filter on page load
document.addEventListener('DOMContentLoaded', () => {
    initBlogFilter();
    loadBlogPosts();
});

// ==================== INITIALIZE FILTER ====================
function initBlogFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length === 0) {
        console.log('No filter buttons found on this page');
        return;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            setActiveFilter(filter);
            filterPosts(filter);
        });
    });
    
    console.log('🔍 Blog filter initialized');
}

// ==================== SET ACTIVE FILTER ====================
function setActiveFilter(filter) {
    currentFilter = filter;
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        if (button.dataset.filter === filter) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update URL without reload (optional)
    const url = new URL(window.location);
    if (filter === 'all') {
        url.searchParams.delete('filter');
    } else {
        url.searchParams.set('filter', filter);
    }
    window.history.pushState({}, '', url);
}

// ==================== FILTER POSTS ====================
function filterPosts(filter) {
    const blogGrid = document.querySelector('.blog-grid');
    
    if (!blogGrid) {
        console.warn('Blog grid not found');
        return;
    }
    
    // Show loading state
    showLoadingState(blogGrid);
    
    // Simulate filtering delay for smooth animation
    setTimeout(() => {
        let filteredPosts = allPosts;
        
        if (filter !== 'all') {
            filteredPosts = allPosts.filter(post => 
                post.category.toLowerCase() === filter.toLowerCase()
            );
        }
        
        renderBlogPosts(filteredPosts);
        
        // Show no results message if needed
        if (filteredPosts.length === 0) {
            showNoResults(blogGrid);
        }
    }, 300);
}

// ==================== LOAD BLOG POSTS ====================
async function loadBlogPosts() {
    const blogGrid = document.querySelector('.blog-grid');
    
    if (!blogGrid) {
        return;
    }
    
    try {
        // Try to load from JSON file
        const response = await fetch('../data/blog-posts.json');
        
        if (response.ok) {
            const data = await response.json();
            allPosts = data.posts || [];
            
            // Check URL for initial filter
            const urlParams = new URLSearchParams(window.location.search);
            const initialFilter = urlParams.get('filter') || 'all';
            
            setActiveFilter(initialFilter);
            filterPosts(initialFilter);
        } else {
            // Use fallback demo data
            loadDemoData();
        }
    } catch (error) {
        console.warn('Could not load blog posts from JSON, using demo data');
        loadDemoData();
    }
}

// ==================== DEMO DATA ====================
function loadDemoData() {
    allPosts = [
        {
            id: 1,
            title: 'Xây dựng Blog với Next.js 14 và TypeScript',
            excerpt: 'Hướng dẫn chi tiết cách tạo blog cá nhân hiện đại với Next.js App Router, MDX và Tailwind CSS từ đầu...',
            category: 'Web',
            date: '2025-12-15',
            readTime: '8 min read',
            image: '💻',
            slug: 'xay-dung-blog-voi-nextjs-14'
        },
        {
            id: 2,
            title: 'REST API Best Practices cho Developer',
            excerpt: 'Những kinh nghiệm và pattern tôi học được khi xây dựng RESTful API production-ready cho dự án thực tế...',
            category: 'Backend',
            date: '2025-12-10',
            readTime: '10 min read',
            image: '🚀',
            slug: 'rest-api-best-practices'
        },
        {
            id: 3,
            title: 'React Native: Từ Zero đến Hero',
            excerpt: 'Câu chuyện và bài học của tôi khi học React Native từ con số 0, những sai lầm cần tránh và tips hữu ích...',
            category: 'Mobile',
            date: '2025-12-05',
            readTime: '12 min read',
            image: '📱',
            slug: 'react-native-tu-zero-den-hero'
        },
        {
            id: 4,
            title: 'Dự án E-commerce Full-stack với MERN',
            excerpt: 'Xây dựng một website thương mại điện tử hoàn chỉnh sử dụng MongoDB, Express, React và Node.js...',
            category: 'Project',
            date: '2025-12-01',
            readTime: '15 min read',
            image: '🛒',
            slug: 'du-an-ecommerce-fullstack-mern'
        },
        {
            id: 5,
            title: 'TypeScript: Tại sao bạn nên học?',
            excerpt: 'Lợi ích của TypeScript trong dự án thực tế và cách migrate từ JavaScript sang TypeScript hiệu quả...',
            category: 'Web',
            date: '2025-11-28',
            readTime: '7 min read',
            image: '📘',
            slug: 'typescript-tai-sao-ban-nen-hoc'
        },
        {
            id: 6,
            title: 'Microservices Architecture cho Beginners',
            excerpt: 'Giới thiệu kiến trúc Microservices, khi nào nên dùng và những thách thức khi triển khai...',
            category: 'Backend',
            date: '2025-11-25',
            readTime: '11 min read',
            image: '⚡',
            slug: 'microservices-architecture-cho-beginners'
        }
    ];
    
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilter = urlParams.get('filter') || 'all';
    
    setActiveFilter(initialFilter);
    filterPosts(initialFilter);
}

// ==================== RENDER BLOG POSTS ====================
function renderBlogPosts(posts) {
    const blogGrid = document.querySelector('.blog-grid');
    
    if (!blogGrid) return;
    
    // Clear existing content
    blogGrid.innerHTML = '';
    
    // Render each post
    posts.forEach((post, index) => {
        const postCard = createBlogCard(post);
        postCard.style.animationDelay = `${index * 0.1}s`;
        blogGrid.appendChild(postCard);
    });
}

// ==================== CREATE BLOG CARD ====================
function createBlogCard(post) {
    const card = document.createElement('article');
    card.className = 'blog-card fade-in-up';
    card.style.opacity = '0';
    card.style.animation = 'fadeInUp 0.6s ease-out forwards';
    
    card.innerHTML = `
        <div class="blog-card-image">
            ${post.image || '📝'}
        </div>
        <div class="blog-card-content">
            <div class="blog-card-meta">
                <span class="blog-card-tag">${post.category}</span>
                <span class="blog-card-date">
                    📅 ${formatDate(post.date)}
                </span>
            </div>
            <h3 class="blog-card-title">${post.title}</h3>
            <p class="blog-card-excerpt">${post.excerpt}</p>
            <div class="blog-card-footer">
                <span class="blog-read-time">⏱️ ${post.readTime}</span>
                <a href="blog-detail.html?slug=${post.slug}" class="blog-read-more">
                    Read More →
                </a>
            </div>
        </div>
    `;
    
    // Make entire card clickable
    card.addEventListener('click', (e) => {
        if (!e.target.closest('a')) {
            window.location.href = `blog-detail.html?slug=${post.slug}`;
        }
    });
    
    return card;
}

// ==================== HELPER FUNCTIONS ====================
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function showLoadingState(container) {
    container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <div class="loading-spinner" style="margin: 0 auto;"></div>
            <p style="margin-top: 1rem; color: var(--color-gray-600);">Loading posts...</p>
        </div>
    `;
}

function showNoResults(container) {
    container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">📭</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">No posts found</h3>
            <p style="color: var(--color-gray-600);">Try selecting a different category</p>
        </div>
    `;
}

// ==================== SEARCH FUNCTIONALITY ====================
function initBlogSearch() {
    const searchInput = document.querySelector('.blog-search-input');
    
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            searchPosts(query);
        }, 300);
    });
}

function searchPosts(query) {
    if (query === '') {
        filterPosts(currentFilter);
        return;
    }
    
    const filteredPosts = allPosts.filter(post => {
        const matchesCategory = currentFilter === 'all' || 
                               post.category.toLowerCase() === currentFilter.toLowerCase();
        const matchesSearch = post.title.toLowerCase().includes(query) ||
                            post.excerpt.toLowerCase().includes(query);
        
        return matchesCategory && matchesSearch;
    });
    
    renderBlogPosts(filteredPosts);
    
    if (filteredPosts.length === 0) {
        const blogGrid = document.querySelector('.blog-grid');
        showNoResults(blogGrid);
    }
}

// Initialize search if available
document.addEventListener('DOMContentLoaded', initBlogSearch);

// ==================== EXPORT FUNCTIONS ====================
window.blogFilter = {
    filterPosts,
    setActiveFilter,
    loadBlogPosts,
    searchPosts
};

console.log('🔍 Blog filter script loaded');