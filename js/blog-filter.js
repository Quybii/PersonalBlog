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
            title: 'Phát triển Đồ án chuyên ngành với Flutter & Supabase',
            excerpt: 'Hành trình xây dựng ứng dụng di động đa nền tảng, từ việc thiết kế giao diện Material Design đến cách quản lý luồng dữ liệu thời gian thực và tối ưu hóa mã nguồn Dart...',
            category: 'Project',
            date: '2025-12-20',
            readTime: '12 min read',
            image: '🎓',
            slug: 'phat-trien-do-an-chuyen-nganh-flutter-firebase'
        },
        {
            id: 2,
            title: 'Giải quyết lỗi "Invalid constant value" trong Flutter',
            excerpt: 'Tại sao không nên dùng static const cho màu có opacity? Cách dùng Getter function để ép giá trị tính toán tại runtime cực hiệu quả...',
            category: 'Mobile',
            date: '2025-12-15',
            readTime: '7 min read',
            image: '📱',
            slug: 'flutter-invalid-constant-value-opacity-fix'
        },
        {
            id: 3,
            title: 'Kinh nghiệm phỏng vấn thực tập sinh Frontend',
            excerpt: 'Tổng hợp bộ câu hỏi về ES6+, React Hooks và cách mình thuyết phục nhà tuyển dụng thông qua tư duy giải quyết vấn đề...',
            category: 'Web',
            date: '2025-12-05',
            readTime: '9 min read',
            image: '💼',
            slug: 'kinh-nghiem-phong-van-intern-frontend'
        },
        {
            id: 4,
            title: 'Tư duy hướng đối tượng (OOP) trong Java Spring Boot',
            excerpt: 'Áp dụng các nguyên lý SOLID và Design Patterns vào dự án Backend để mã nguồn dễ bảo trì và mở rộng hơn cho đồ án chuyên ngành...',
            category: 'Backend',
            date: '2025-11-28',
            readTime: '11 min read',
            image: '⚙️',
            slug: 'tu-duy-oop-java-spring-boot'
        },
        {
            id: 5,
            title: 'Làm việc nhóm hiệu quả với quy trình Agile/Scrum',
            excerpt: 'Cách mình và team điều phối dự án, phân chia task trên Trello và giải quyết xung đột khi cùng tham gia code một sản phẩm...',
            category: 'Project',
            date: '2025-11-15',
            readTime: '8 min read',
            image: '🤝',
            slug: 'lam-viec-nhom-voi-agile-scrum'
        },
        {
            id: 6,
            title: 'Master Git: Quy trình Git Flow cho dự án sinh viên',
            excerpt: 'Hướng dẫn sử dụng Branch, Pull Request và giải quyết Conflict khi làm việc nhóm để tránh mất mát mã nguồn...',
            category: 'Backend',
            date: '2025-10-30',
            readTime: '6 min read',
            image: '🌿',
            slug: 'master-git-flow-du-an-sinh-vien'
        },
        {
            id: 7,
            title: 'Tối ưu UI/UX: Từ bản vẽ Figma đến mã nguồn React',
            excerpt: 'Hành trình chuyển đổi từ bản thiết kế Design sang giao diện Responsive, Pixel-Perfect sử dụng Tailwind CSS và Framer Motion...',
            category: 'Web',
            date: '2025-10-12',
            readTime: '10 min read',
            image: '🎨',
            slug: 'toi-uu-ui-ux-figma-to-react'
        },
        {
            id: 8,
            title: 'Thiết kế Database SQL Server cho hệ thống E-commerce',
            excerpt: 'Cách chuẩn hóa cơ sở dữ liệu (3NF) và viết Store Procedure để xử lý các truy vấn bán hàng phức tạp trong bài tập lớn...',
            category: 'Backend',
            date: '2025-09-25',
            readTime: '13 min read',
            image: '💾',
            slug: 'thiet-ke-database-sql-server-ecommerce'
        },
        {
            id: 9,
            title: 'Quản lý State trong Flutter: Tại sao mình chọn Bloc?',
            excerpt: 'So sánh ưu nhược điểm của Provider và Bloc trong quá trình xây dựng ứng dụng Mobile đa nền tảng cho dự án cá nhân...',
            category: 'Mobile',
            date: '2025-09-05',
            readTime: '15 min read',
            image: '🚀',
            slug: 'flutter-state-management-bloc-vs-provider'
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