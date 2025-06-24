// DIU Connect - Homepage JavaScript Functions

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize all app functionality
function initializeApp() {
    initializeNavigation();
    initializeLikeButtons();
    initializePostModal();
    initializeStatusBar();
    initializeCommentSystem();
    initializeSearch();
    initializeInfiniteScroll();
}

// Navigation Tab Functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-tab]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the tab identifier
            const tab = this.getAttribute('data-tab');
            
            // Handle tab switching with animation
            switchTab(tab);
            
            // Update URL without page reload (for better UX)
            updateURL(tab);
        });
    });
}

// Switch between different tabs
function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Add fade out effect
    const mainContent = document.querySelector('.posts-feed');
    if (mainContent) {
        mainContent.style.opacity = '0.5';
        
        // Simulate content loading
        setTimeout(() => {
            mainContent.style.opacity = '1';
            
            // Here you would typically load different content based on the tab
            switch(tabName) {
                case 'home':
                    loadHomeFeed();
                    break;
                case 'jobs':
                    loadJobsFeed();
                    break;
                case 'higher-edu':
                    loadHigherEduFeed();
                    break;
                default:
                    loadHomeFeed();
            }
        }, 300);
    }
}

// Update URL for better navigation
function updateURL(tab) {
    const newURL = window.location.pathname + '?tab=' + tab;
    window.history.pushState({ tab: tab }, '', newURL);
}

// Load different feed content (placeholder functions)
function loadHomeFeed() {
    console.log('Loading home feed...');
    // This would typically fetch blog posts from an API
    updateFeedTitle('Latest Posts from DIU Community');
}

function loadJobsFeed() {
    console.log('Loading jobs feed...');
    // This would typically fetch job listings from an API
    updateFeedTitle('Available Job Opportunities');
}

function loadHigherEduFeed() {
    console.log('Loading higher education feed...');
    // This would typically fetch higher education posts from an API
    updateFeedTitle('Higher Studies & Opportunities');
}

function updateFeedTitle(title) {
    // You can add a title element to show current feed type
    console.log('Feed title updated to:', title);
}

// New Post Modal Functionality
function initializePostModal() {
    const postModal = document.getElementById('newPostModal');
    
    if (postModal) {
        // Handle modal show event
        postModal.addEventListener('show.bs.modal', function() {
            console.log('Post modal opened');
            // Clear previous form data
            clearPostForm();
        });
        
        // Handle form submission
        const publishButton = postModal.querySelector('.btn-primary');
        if (publishButton) {
            publishButton.addEventListener('click', handlePostSubmission);
        }
    }
}

// Show new post modal
function showPostModal() {
    const modal = new bootstrap.Modal(document.getElementById('newPostModal'));
    modal.show();
}

// Clear post form
function clearPostForm() {
    const form = document.querySelector('#newPostModal form');
    if (form) {
        form.reset();
    }
}

// Handle post submission
function handlePostSubmission(e) {
    e.preventDefault();
    
    // Get form data
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const tags = document.getElementById('postTags').value.trim();
    const imageFile = document.getElementById('postImage').files[0];
    
    // Validate form
    if (!title || !content) {
        showAlert('Please fill in both title and content fields.', 'warning');
        return;
    }
    
    // Create post object
    const newPost = {
        id: generatePostId(),
        title: title,
        content: content,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        image: imageFile,
        author: getCurrentUser(),
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        views: 0
    };
    
    // Submit post (in real app, this would be an API call)
    submitPost(newPost);
}

// Generate unique post ID
function generatePostId() {
    return 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get current user info (placeholder)
function getCurrentUser() {
    return {
        name: 'John Doe',
        department: 'CSE Dept',
        avatar: 'https://via.placeholder.com/45x45/4A90E2/FFFFFF?text=U'
    };
}

// Submit post (placeholder function)
function submitPost(postData) {
    console.log('Submitting post:', postData);
    
    // Show loading state
    showAlert('Publishing your post...', 'info');
    
    // Simulate API call
    setTimeout(() => {
        // Add post to feed
        addPostToFeed(postData);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('newPostModal'));
        modal.hide();
        
        // Show success message
        showAlert('Post published successfully!', 'success');
        
        // Update statistics
        updatePostStatistics();
        
    }, 1500);
}

// Add new post to feed
function addPostToFeed(postData) {
    const postsContainer = document.querySelector('.posts-feed');
    if (!postsContainer) return;
    
    const postHTML = createPostHTML(postData);
    postsContainer.insertAdjacentHTML('afterbegin', postHTML);
    
    // Add animation to new post
    const newPost = postsContainer.firstElementChild;
    newPost.style.opacity = '0';
    newPost.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        newPost.style.transition = 'all 0.5s ease';
        newPost.style.opacity = '1';
        newPost.style.transform = 'translateY(0)';
    }, 100);
}

// Create HTML for new post
function createPostHTML(postData) {
    const tagsHTML = postData.tags.map(tag => `<span class="tag">#${tag}</span>`).join('');
    const imageHTML = postData.image ? `
        <div class="post-image">
            <img src="${URL.createObjectURL(postData.image)}" alt="Post Image" class="img-fluid rounded">
        </div>
    ` : '';
    
    return `
        <div class="post-card" data-post-id="${postData.id}">
            <div class="post-header">
                <img src="${postData.author.avatar}" alt="Author" class="rounded-circle me-3">
                <div class="post-author-info">
                    <h6 class="author-name">${postData.author.name}</h6>
                    <p class="post-meta">
                        <span class="department">${postData.author.department}</span> • 
                        <span class="time">Just now</span>
                    </p>
                </div>
                <div class="post-options ms-auto">
                    <button class="btn btn-sm btn-ghost" data-bs-toggle="dropdown">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" onclick="savePost('${postData.id}')">Save Post</a></li>
                        <li><a class="dropdown-item" href="#" onclick="reportPost('${postData.id}')">Report</a></li>
                    </ul>
                </div>
            </div>
            <div class="post-content">
                <h5 class="post-title">${postData.title}</h5>
                <p class="post-text">${postData.content}</p>
                ${imageHTML}
                <div class="post-tags">${tagsHTML}</div>
            </div>
            <div class="post-stats">
                <span class="stat"><i class="fas fa-eye"></i> ${postData.views} views</span>
                <span class="stat"><i class="fas fa-heart"></i> ${postData.likes} likes</span>
                <span class="stat"><i class="fas fa-comment"></i> ${postData.comments} comments</span>
            </div>
            <div class="post-actions-bottom">
                <button class="btn btn-ghost btn-sm" onclick="toggleLike('${postData.id}')">
                    <i class="far fa-heart"></i> Like
                </button>
                <button class="btn btn-ghost btn-sm" onclick="showComments('${postData.id}')">
                    <i class="far fa-comment"></i> Comment
                </button>
                <button class="btn btn-ghost btn-sm" onclick="sharePost('${postData.id}')">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        </div>
    `;
}

// Like Button Functionality
function initializeLikeButtons() {
    const likeButtons = document.querySelectorAll('.post-actions-bottom .btn:first-child');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postCard = this.closest('.post-card');
            const postId = postCard ? postCard.dataset.postId : null;
            
            if (postId) {
                toggleLike(postId);
            } else {
                // For existing posts without IDs
                toggleLikeButton(this);
            }
        });
    });
}

// Toggle like for specific post
function toggleLike(postId) {
    const postCard = document.querySelector(`[data-post-id="${postId}"]`);
    if (!postCard) return;
    
    const likeButton = postCard.querySelector('.post-actions-bottom .btn:first-child');
    const likesStat = postCard.querySelector('.post-stats .stat:nth-child(2)');
    
    toggleLikeButton(likeButton);
    updateLikeCount(likesStat);
}

// Toggle like button appearance
function toggleLikeButton(button) {
    const icon = button.querySelector('i');
    const text = button.childNodes[button.childNodes.length - 1];
    
    if (icon.classList.contains('far')) {
        // Like the post
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.style.color = '#dc3545';
        if (text.textContent) text.textContent = ' Liked';
        
        // Add heart animation
        animateHeart(icon);
        
    } else {
        // Unlike the post
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.style.color = '';
        if (text.textContent) text.textContent = ' Like';
    }
}

// Animate heart icon
function animateHeart(icon) {
    icon.style.transform = 'scale(1.3)';
    setTimeout(() => {
        icon.style.transform = 'scale(1)';
    }, 200);
}

// Update like count
function updateLikeCount(likeStat) {
    if (!likeStat) return;
    
    const countMatch = likeStat.textContent.match(/(\d+)/);
    if (countMatch) {
        const currentCount = parseInt(countMatch[1]);
        const newCount = currentCount + (likeStat.textContent.includes('fas fa-heart') ? 1 : -1);
        likeStat.innerHTML = `<i class="fas fa-heart"></i> ${newCount} likes`;
    }
}

// Comment System
function initializeCommentSystem() {
    // Initialize comment functionality
    console.log('Comment system initialized');
}

// Show comments for a post
function showComments(postId) {
    console.log('Showing comments for post:', postId);
    // This would typically open a comments modal or expand comments section
    showAlert('Comments feature will be implemented soon!', 'info');
}

// Share post functionality
function sharePost(postId) {
    if (navigator.share) {
        navigator.share({
            title: 'DIU Connect Post',
            text: 'Check out this post from DIU Connect',
            url: window.location.href + '#post-' + postId
        }).then(() => {
            console.log('Post shared successfully');
        }).catch(console.error);
    } else {
        // Fallback for browsers that don't support Web Share API
        copyToClipboard(window.location.href + '#post-' + postId);
        showAlert('Post link copied to clipboard!', 'success');
    }
}

// Save post functionality
function savePost(postId) {
    console.log('Saving post:', postId);
    // This would typically save the post to user's saved posts
    showAlert('Post saved to your bookmarks!', 'success');
}

// Report post functionality
function reportPost(postId) {
    console.log('Reporting post:', postId);
    if (confirm('Are you sure you want to report this post?')) {
        showAlert('Post reported. Our team will review it shortly.', 'info');
    }
}

// Status Bar Functionality
function initializeStatusBar() {
    // Auto-refresh status bar every 30 seconds
    setInterval(updateStatusBar, 30000);
    
    // Initial update
    updateStatusBar();
}

// Update status bar with real-time data
function updateStatusBar() {
    // In a real application, this would fetch data from an API
    const statusItems = document.querySelectorAll('.status-item span');
    
    // Simulate real-time updates
    if (statusItems.length >= 4) {
        const activeUsers = Math.floor(Math.random() * 100) + 1200;
        const newPosts = Math.floor(Math.random() * 50) + 400;
        const newJobs = Math.floor(Math.random() * 10) + 20;
        const studyOps = Math.floor(Math.random() * 5) + 10;
        
        statusItems[0].textContent = `${activeUsers} Active Users`;
        statusItems[1].textContent = `${newPosts} New Posts Today`;
        statusItems[2].textContent = `${newJobs} New Jobs`;
        statusItems[3].textContent = `${studyOps} Study Opportunities`;
    }
}

// Search Functionality
function initializeSearch() {
    // This will be expanded when Jobs and Higher Education pages are created
    console.log('Search functionality initialized');
}

// Infinite Scroll
function initializeInfiniteScroll() {
    let loading = false;
    let page = 1;
    
    window.addEventListener('scroll', () => {
        if (loading) return;
        
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        
        if (scrollTop + clientHeight >= scrollHeight - 1000) {
            loading = true;
            loadMorePosts(++page);
        }
    });
}

// Load more posts (infinite scroll)
function loadMorePosts(page) {
    console.log('Loading more posts, page:', page);
    
    // Show loading indicator
    showLoadingIndicator();
    
    // Simulate API call
    setTimeout(() => {
        const mockPosts = generateMockPosts(5);
        appendPostsToFeed(mockPosts);
        hideLoadingIndicator();
        loading = false;
    }, 1500);
}

// Generate mock posts for demonstration
function generateMockPosts(count) {
    const posts = [];
    const authors = [
        { name: 'Maria Ahmed', dept: 'EEE Dept', avatar: 'https://via.placeholder.com/45x45/20C997/FFFFFF?text=M' },
        { name: 'Karim Rahman', dept: 'BBA Dept', avatar: 'https://via.placeholder.com/45x45/FD7E14/FFFFFF?text=K' },
        { name: 'Dr. Fatima Khan', dept: 'Faculty - CSE', avatar: 'https://via.placeholder.com/45x45/6F42C1/FFFFFF?text=F' }
    ];
    
    const topics = [
        { title: 'Tips for Effective Time Management', content: 'As students, managing time effectively is crucial for academic success...' },
        { title: 'Industry Insights: Latest Tech Trends', content: 'The technology landscape is constantly evolving. Here are some trends to watch...' },
        { title: 'Study Group Formation for Final Exams', content: 'Looking to form study groups for upcoming final examinations...' }
    ];
    
    for (let i = 0; i < count; i++) {
        const author = authors[Math.floor(Math.random() * authors.length)];
        const topic = topics[Math.floor(Math.random() * topics.length)];
        
        posts.push({
            id: generatePostId(),
            title: topic.title,
            content: topic.content,
            author: author,
            timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(), // Random time in last 7 days
            likes: Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 25),
            views: Math.floor(Math.random() * 500) + 50,
            tags: ['DIU', 'Students', 'Academic']
        });
    }
    
    return posts;
}

// Append posts to feed
function appendPostsToFeed(posts) {
    const postsContainer = document.querySelector('.posts-feed');
    if (!postsContainer) return;
    
    posts.forEach(post => {
        const postHTML = createPostHTML(post);
        postsContainer.insertAdjacentHTML('beforeend', postHTML);
    });
}

// Show/Hide loading indicator
function showLoadingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'loading-indicator text-center py-4';
    indicator.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading more posts...</p>
    `;
    document.querySelector('.posts-feed').appendChild(indicator);
}

function hideLoadingIndicator() {
    const indicator = document.querySelector('.loading-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Utility Functions
function showAlert(message, type = 'info') {
    // Create and show Bootstrap alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

function updatePostStatistics() {
    // Update the status bar with new post count
    const newPostsStat = document.querySelector('.status-item:nth-child(2) span');
    if (newPostsStat) {
        const match = newPostsStat.textContent.match(/(\d+)/);
        if (match) {
            const count = parseInt(match[1]) + 1;
            newPostsStat.textContent = `${count} New Posts Today`;
        }
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.tab) {
        const tabLink = document.querySelector(`[data-tab="${event.state.tab}"]`);
        if (tabLink) {
            tabLink.click();
        }
    }
});

// Initialize based on URL parameters
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    
    if (tab) {
        const tabLink = document.querySelector(`[data-tab="${tab}"]`);
        if (tabLink) {
            tabLink.click();
        }
    }
});