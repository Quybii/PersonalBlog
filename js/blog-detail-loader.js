// ============================================
// BLOG-DETAIL-LOADER.JS - Load Blog Detail Content
// ============================================

let allPosts = [];
let currentPost = null;

document.addEventListener('DOMContentLoaded', () => {
    loadBlogDetail();
});

// Hàm tạo ID dùng chung để đảm bảo tính nhất quán
function generateId(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Xóa ký tự đặc biệt
        .replace(/\s+/g, '-')      // Thay khoảng trắng bằng dấu gạch ngang
        .replace(/--+/g, '-')      // Tránh nhiều dấu gạch ngang liên tiếp
        .trim();
}

async function loadBlogDetail() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        
        if (!slug) {
            showError('No blog post specified');
            return;
        }
        
        const response = await fetch('../data/blog-posts.json');
        if (!response.ok) throw new Error('Failed to load blog data');
        
        const data = await response.json();
        allPosts = data.posts || [];
        currentPost = allPosts.find(post => post.slug === slug);
        
        if (!currentPost) {
            showError('Blog post not found');
            return;
        }
        
        // 1. Render nội dung trước
        renderBlogDetail(currentPost);
        
        // 2. Chờ DOM cập nhật rồi mới gán sự kiện cho TOC
        setTimeout(() => {
            setupTOCBehavior();
            setupScrollSpy();
            initReadingProgress();
        }, 100);
        
        loadRelatedPosts(currentPost);
        
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to load blog post');
    }
}

function renderBlogDetail(post) {
    document.title = `${post.title} - Huỳnh Xuân Quý`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', post.excerpt);
    
    renderHeader(post);
    renderFeaturedImage(post);
    renderTableOfContents(post); // Render danh sách link
    renderContent(post);         // Render nội dung bài viết (có ID khớp với link)
}

function renderHeader(post) {
    const header = document.querySelector('.blog-detail-header');
    if (!header) return;
    header.innerHTML = `
        <span class="blog-detail-tag">${post.category}</span>
        <h1 class="blog-detail-title">${post.title}</h1>
        <div class="blog-detail-meta">
            <span class="blog-detail-meta-item">📅 ${formatDate(post.date)}</span>
            <span class="blog-detail-meta-item">⏱️ ${post.readTime}</span>
            <span class="blog-detail-meta-item">👁️ ${post.views.toLocaleString()} views</span>
        </div>
    `;
}

function renderFeaturedImage(post) {
    const imageContainer = document.querySelector('.blog-detail-image');
    if (!imageContainer) return;
    imageContainer.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 5rem; color: white; background: linear-gradient(135deg, var(--color-green-primary) 0%, var(--color-green-600) 100%);">
            ${post.image}
        </div>
    `;
}

// ==================== RENDER MỤC LỤC ====================
function renderTableOfContents(post) {
    const tocContainer = document.querySelector('.toc ul');
    if (!tocContainer) return;
    tocContainer.innerHTML = '';
    
    if (post.content && post.content.sections) {
        post.content.sections.forEach((section) => {
            const id = generateId(section.title); // Tạo ID từ title
            const li = document.createElement('li');
            li.innerHTML = `<a href="#${id}" data-target="${id}">${section.title}</a>`;
            tocContainer.appendChild(li);
        });
        
        // Luôn thêm mục Tổng kết vào TOC nếu có
        if (post.content.conclusion) {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#tong-ket" data-target="tong-ket">✨ Tổng kết</a>`;
            tocContainer.appendChild(li);
        }
    }
}

// ==================== RENDER NỘI DUNG (ID KHỚP TOC) ====================
function renderContent(post) {
    const contentContainer = document.querySelector('.blog-content');
    if (!contentContainer) return;
    
    let html = post.content.intro ? `<div class="blog-intro"><p>${post.content.intro}</p></div>` : '';
    
    if (post.content.sections) {
        post.content.sections.forEach((section) => {
            const sectionId = generateId(section.title); // Đảm bảo ID này giống hệt trong TOC
            html += `
                <h2 id="${sectionId}">${section.title}</h2>
                ${formatContent(section.content)}
            `;
        });
    }
    
    if (post.content.conclusion) {
        html += `
            <h2 id="tong-ket">✨ Tổng kết</h2>
            <div class="blog-conclusion">${formatContent(post.content.conclusion)}</div>
        `;
    }
    
    contentContainer.innerHTML = html;
    highlightCodeBlocks();
}

// ==================== XỬ LÝ CLICK MỤC LỤC ====================
function setupTOCBehavior() {
    const tocLinks = document.querySelectorAll('.toc a');
    
    tocLinks.forEach(link => {
        link.onclick = (e) => { // Dùng onclick trực tiếp để tránh gán chồng chéo
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = 90; // Điều chỉnh theo thực tế header của bạn
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: elementPosition - headerHeight,
                    behavior: 'smooth'
                });
                
                // Update active ngay lập tức
                updateActiveTOCLink(targetId);
                // Cập nhật URL mà không reload
                history.pushState(null, null, `#${targetId}`);
            }
        };
    });
}

function setupScrollSpy() {
    const sections = document.querySelectorAll('.blog-content h2[id]');
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveTOCLink(entry.target.id);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

function updateActiveTOCLink(activeId) {
    document.querySelectorAll('.toc a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-target') === activeId);
    });
}

// ==================== CÁC HÀM TRỢ GIÚP (GIỮ NGUYÊN) ====================
function formatContent(content) {
    let formatted = content;
    formatted = formatted.replace(/\n\n/g, '</p><p>');
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/^• (.*?)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*?<\/li>\n?)+/g, '<ul>$&</ul>');
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang || 'code'}">${escapeHtml(code.trim())}</code></pre>`;
    });
    formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
    if (!formatted.startsWith('<')) formatted = `<p>${formatted}</p>`;
    return formatted;
}

function escapeHtml(text) {
    const map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'};
    return text.replace(/[&<>"']/g, m => map[m]);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function highlightCodeBlocks() {
    // Logic highlight nếu cần
}

function loadRelatedPosts(currentPost) {
    const relatedGrid = document.querySelector('.related-posts-grid');
    if (!relatedGrid) return;
    const relatedPosts = allPosts.filter(p => p.category === currentPost.category && p.id !== currentPost.id).slice(0, 2);
    relatedGrid.innerHTML = '';
    relatedPosts.forEach(post => {
        const card = createBlogCard(post);
        relatedGrid.appendChild(card);
    });
}

function createBlogCard(post) {
    const card = document.createElement('article');
    card.className = 'blog-card';
    card.innerHTML = `
        <div class="blog-card-image">${post.image || '📝'}</div>
        <div class="blog-card-content">
            <div class="blog-card-meta"><span class="blog-card-tag">${post.category}</span></div>
            <h3 class="blog-card-title">${post.title}</h3>
            <a href="blog-detail.html?slug=${post.slug}" class="blog-read-more">Read More →</a>
        </div>
    `;
    return card;
}

function initReadingProgress() {
    let progressBar = document.querySelector('.reading-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `position:fixed; top:0; left:0; width:0%; height:3px; background:var(--color-green-primary); z-index:9999; transition:width 0.1s;`;
        document.body.appendChild(progressBar);
    }
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${Math.min(scrolled, 100)}%`;
    });
}

function showError(message) {
    const article = document.querySelector('.blog-detail');
    if (article) article.innerHTML = `<div style="text-align:center; padding:4rem;"><h2>${message}</h2><a href="blog.html">← Back to Blog</a></div>`;
}

window.blogDetail = {
    shareOnTwitter: () => {}, 
    shareOnFacebook: () => {},
    copyLink: () => {}
};