// ============================================
// BLOG-DETAIL-LOADER.JS - Load Blog Detail Content
// ============================================

let allPosts = [];
let currentPost = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadBlogDetail();
});

// ==================== LOAD BLOG DETAIL ====================
async function loadBlogDetail() {
    try {
        // Get slug from URL
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        
        if (!slug) {
            showError('No blog post specified');
            return;
        }
        
        // Load posts data
        const response = await fetch('../data/blog-posts.json');
        
        if (!response.ok) {
            throw new Error('Failed to load blog data');
        }
        
        const data = await response.json();
        allPosts = data.posts || [];
        
        // Find post by slug
        currentPost = allPosts.find(post => post.slug === slug);
        
        if (!currentPost) {
            showError('Blog post not found');
            return;
        }
        
        // Render post
        renderBlogDetail(currentPost);
        
        // Load related posts
        loadRelatedPosts(currentPost);
        
    } catch (error) {
        console.error('Error loading blog detail:', error);
        showError('Failed to load blog post');
    }
}

// ==================== RENDER BLOG DETAIL ====================
function renderBlogDetail(post) {
    // Update page title
    document.title = `${post.title} - Huỳnh Xuân Quý`;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', post.excerpt);
    }
    
    // Render header
    renderHeader(post);
    
    // Render featured image
    renderFeaturedImage(post);
    
    // Render table of contents
    renderTableOfContents(post);
    
    // Render content
    renderContent(post);
}

// ==================== RENDER HEADER ====================
function renderHeader(post) {
    const header = document.querySelector('.blog-detail-header');
    
    if (!header) return;
    
    header.innerHTML = `
        <span class="blog-detail-tag">${post.category}</span>
        <h1 class="blog-detail-title">${post.title}</h1>
        <div class="blog-detail-meta">
            <span class="blog-detail-meta-item">
                📅 ${formatDate(post.date)}
            </span>
            <span class="blog-detail-meta-item">
                ⏱️ ${post.readTime}
            </span>
            <span class="blog-detail-meta-item">
                👁️ ${post.views.toLocaleString()} views
            </span>
        </div>
    `;
}

// ==================== RENDER FEATURED IMAGE ====================
function renderFeaturedImage(post) {
    const imageContainer = document.querySelector('.blog-detail-image');
    
    if (!imageContainer) return;
    
    imageContainer.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 5rem; color: white; background: linear-gradient(135deg, var(--color-green-primary) 0%, var(--color-green-600) 100%);">
            ${post.image}
        </div>
    `;
}

// ==================== RENDER TABLE OF CONTENTS ====================
function renderTableOfContents(post) {
    const tocContainer = document.querySelector('.toc ul');
    
    if (!tocContainer || !post.tableOfContents) return;
    
    tocContainer.innerHTML = '';
    
    post.tableOfContents.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#${item.id}">${item.title}</a>`;
        tocContainer.appendChild(li);
    });
    
    // Smooth scroll for TOC links
    document.querySelectorAll('.toc a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==================== RENDER CONTENT ====================
function renderContent(post) {
    const contentContainer = document.querySelector('.blog-content');
    
    if (!contentContainer) return;
    
    let html = '';
    
    // Intro
    if (post.content.intro) {
        html += `
            <div class="blog-intro">
                <p>${post.content.intro}</p>
            </div>
        `;
    }
    
    // Sections
    if (post.content.sections) {
        post.content.sections.forEach((section, index) => {
            const sectionId = post.tableOfContents?.[index + 1]?.id || `section-${index}`;
            
            html += `
                <h2 id="${sectionId}">${section.title}</h2>
                ${formatContent(section.content)}
            `;
        });
    }
    
    // Conclusion
    if (post.content.conclusion) {
        const conclusionId = post.tableOfContents?.[post.tableOfContents.length - 1]?.id || 'conclusion';
        html += `
            <h2 id="${conclusionId}">✨ Tổng kết</h2>
            <div class="blog-conclusion">
                ${formatContent(post.content.conclusion)}
            </div>
        `;
    }
    
    contentContainer.innerHTML = html;
    
    // Highlight code blocks
    highlightCodeBlocks();
}

// ==================== FORMAT CONTENT ====================
function formatContent(content) {
    // Convert markdown-like syntax to HTML
    let formatted = content;
    
    // Convert line breaks
    formatted = formatted.replace(/\n\n/g, '</p><p>');
    
    // Convert bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert bullet points
    formatted = formatted.replace(/^• (.*?)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*?<\/li>\n?)+/g, '<ul>$&</ul>');
    
    // Convert numbered lists
    formatted = formatted.replace(/^\d+\.\s(.*?)$/gm, '<li>$1</li>');
    
    // Convert code blocks
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'code';
        return `<pre><code class="language-${language}">${escapeHtml(code.trim())}</code></pre>`;
    });
    
    // Convert inline code
    formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Convert headings
    formatted = formatted.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    formatted = formatted.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    
    // Convert blockquotes
    formatted = formatted.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
    
    // Convert checkmarks and X marks
    formatted = formatted.replace(/✅/g, '<span class="icon-check">✅</span>');
    formatted = formatted.replace(/❌/g, '<span class="icon-cross">❌</span>');
    
    // Wrap in paragraphs if not already wrapped
    if (!formatted.startsWith('<')) {
        formatted = `<p>${formatted}</p>`;
    }
    
    return formatted;
}

// ==================== ESCAPE HTML ====================
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

// ==================== HIGHLIGHT CODE BLOCKS ====================
function highlightCodeBlocks() {
    // Simple syntax highlighting for code blocks
    document.querySelectorAll('pre code').forEach(block => {
        // Add line numbers
        const lines = block.textContent.split('\n');
        const numberedLines = lines.map((line, i) => {
            return `<span class="line-number">${i + 1}</span>${line}`;
        }).join('\n');
        
        // You can add more sophisticated highlighting here
        // For now, just add the line numbers
    });
}

// ==================== LOAD RELATED POSTS ====================
function loadRelatedPosts(currentPost) {
    const relatedGrid = document.querySelector('.related-posts-grid');
    
    if (!relatedGrid) return;
    
    // Find posts in same category, excluding current post
    const relatedPosts = allPosts
        .filter(post => 
            post.category === currentPost.category && 
            post.id !== currentPost.id
        )
        .slice(0, 2); // Get 2 related posts
    
    // If not enough posts in same category, get random posts
    if (relatedPosts.length < 2) {
        const otherPosts = allPosts
            .filter(post => post.id !== currentPost.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 2 - relatedPosts.length);
        
        relatedPosts.push(...otherPosts);
    }
    
    relatedGrid.innerHTML = '';
    
    relatedPosts.forEach(post => {
        const card = createBlogCard(post);
        relatedGrid.appendChild(card);
    });
}

// ==================== CREATE BLOG CARD ====================
function createBlogCard(post) {
    const card = document.createElement('article');
    card.className = 'blog-card';
    
    card.innerHTML = `
        <div class="blog-card-image">
            ${post.image || '📝'}
        </div>
        <div class="blog-card-content">
            <div class="blog-card-meta">
                <span class="blog-card-tag">${post.category}</span>
                <span>${formatDate(post.date)}</span>
            </div>
            <h3 class="blog-card-title">${post.title}</h3>
            <p class="blog-card-excerpt">${post.excerpt}</p>
            <a href="blog-detail.html?slug=${post.slug}" class="blog-read-more">
                Read More →
            </a>
        </div>
    `;
    
    return card;
}

// ==================== FORMAT DATE ====================
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// ==================== SHOW ERROR ====================
function showError(message) {
    const article = document.querySelector('.blog-detail');
    
    if (!article) return;
    
    article.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">😕</div>
            <h2 style="font-size: 2rem; margin-bottom: 1rem;">${message}</h2>
            <p style="color: var(--color-gray-600); margin-bottom: 2rem;">
                The blog post you're looking for doesn't exist or has been removed.
            </p>
            <a href="blog.html" class="btn btn-primary" style="display: inline-block; padding: 1rem 2rem; background: var(--color-green-primary); color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">
                ← Back to Blog
            </a>
        </div>
    `;
}

// ==================== SHARE FUNCTIONS ====================
function shareOnTwitter() {
    if (!currentPost) return;
    
    const url = window.location.href;
    const text = `${currentPost.title} - ${currentPost.excerpt}`;
    
    window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        '_blank',
        'width=550,height=420'
    );
}

function shareOnFacebook() {
    if (!currentPost) return;
    
    const url = window.location.href;
    
    window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        '_blank',
        'width=550,height=420'
    );
}

function shareOnLinkedIn() {
    if (!currentPost) return;
    
    const url = window.location.href;
    
    window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        '_blank',
        'width=550,height=420'
    );
}

function copyLink() {
    const url = window.location.href;
    
    navigator.clipboard.writeText(url).then(() => {
        // Show success message
        const message = document.createElement('div');
        message.textContent = 'Link copied to clipboard!';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-green-primary);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    });
}

// ==================== READING PROGRESS BAR ====================
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--color-green-primary);
        z-index: 9999;
        transition: width 0.1s ease-out;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
}

// Initialize reading progress bar
document.addEventListener('DOMContentLoaded', initReadingProgress);

// ==================== EXPORT FUNCTIONS ====================
window.blogDetail = {
    shareOnTwitter,
    shareOnFacebook,
    shareOnLinkedIn,
    copyLink
};

console.log('📝 Blog detail loader initialized');