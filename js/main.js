// Main JavaScript file for the portfolio website

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeContactForm();
    loadPlatformData();
    initializeAlgorithms();
    
    // Initialize admin panel if accessed
    if (window.location.hash === '#admin') {
        showAdminSection();
    }
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#admin') {
                showAdminSection();
                return;
            }
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Highlight active navigation link based on scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Fade in animations for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Contact form handling
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Here you would typically send the form data to a server
        // For now, we'll just show a success message
        showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        contactForm.reset();
    });
}

// Load platform data (HackerRank, CodeChef)
function loadPlatformData() {
    // Load saved usernames from localStorage
    const settings = JSON.parse(localStorage.getItem('portfolioSettings') || '{}');
    const hackerrankUsername = settings.hackerrankUsername || 'demo_user';
    const codechefUsername = settings.codechefUsername || 'demo_user';
    
    // Update hero stats with demo data (replace with actual API calls)
    updateHeroStats();
    
    // Load badges
    loadBadges();
}

// Update hero statistics
function updateHeroStats() {
    // Demo data - replace with actual API calls
    const stats = {
        hackerrankScore: '1234',
        codechefRating: '1567',
        totalProblems: '523'
    };
    
    setTimeout(() => {
        document.getElementById('hackerrank-score').textContent = stats.hackerrankScore;
        document.getElementById('codechef-rating').textContent = stats.codechefRating;
        document.getElementById('total-problems').textContent = stats.totalProblems;
    }, 1000);
}

// Load badges from platforms
function loadBadges() {
    // Demo badges data
    const hackerrankBadges = [
        { name: 'Problem Solving', icon: 'fas fa-puzzle-piece', level: 'Gold' },
        { name: 'Algorithms', icon: 'fas fa-code', level: 'Silver' },
        { name: 'Data Structures', icon: 'fas fa-database', level: 'Bronze' },
        { name: 'Mathematics', icon: 'fas fa-calculator', level: 'Silver' }
    ];
    
    const codechefBadges = [
        { name: 'Long Challenge', icon: 'fas fa-trophy', level: 'Gold' },
        { name: 'Cook-Off', icon: 'fas fa-fire', level: 'Silver' },
        { name: 'Lunchtime', icon: 'fas fa-clock', level: 'Bronze' }
    ];
    
    const customBadges = [
        { name: 'Full Stack Developer', icon: 'fas fa-layer-group', level: 'Expert' },
        { name: 'Algorithm Enthusiast', icon: 'fas fa-brain', level: 'Advanced' },
        { name: 'Problem Solver', icon: 'fas fa-lightbulb', level: 'Expert' }
    ];
    
    // Populate badge sections
    populateBadgeSection('hackerrank-badges', hackerrankBadges);
    populateBadgeSection('codechef-badges', codechefBadges);
    populateBadgeSection('custom-badges', customBadges);
}

// Populate badge section with badges
function populateBadgeSection(containerId, badges) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    badges.forEach(badge => {
        const badgeElement = document.createElement('div');
        badgeElement.className = 'badge-item';
        badgeElement.innerHTML = `
            <i class="${badge.icon}"></i>
            <h4>${badge.name}</h4>
            <p>${badge.level}</p>
        `;
        container.appendChild(badgeElement);
    });
}

// Initialize algorithms section
function initializeAlgorithms() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const algorithmGrid = document.getElementById('algorithm-grid');
    
    // Load algorithms data
    const algorithms = getAlgorithmsData();
    
    // Populate algorithm grid
    populateAlgorithmGrid(algorithms);
    
    // Add filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter algorithms
            const filteredAlgorithms = filter === 'all' 
                ? algorithms 
                : algorithms.filter(algo => algo.category === filter);
            
            populateAlgorithmGrid(filteredAlgorithms);
        });
    });
}

// Get algorithms data
function getAlgorithmsData() {
    // Demo algorithms data - this would typically come from a database
    return [
        {
            id: 1,
            title: 'Quick Sort',
            description: 'Efficient divide-and-conquer sorting algorithm with average O(n log n) time complexity.',
            category: 'sorting',
            timeComplexity: 'O(n log n)',
            spaceComplexity: 'O(log n)',
            tags: ['sorting', 'divide-conquer', 'recursive'],
            code: `
function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}
            `
        },
        {
            id: 2,
            title: 'Dijkstra\'s Algorithm',
            description: 'Find shortest paths from source vertex to all other vertices in weighted graph.',
            category: 'graph',
            timeComplexity: 'O(V² + E)',
            spaceComplexity: 'O(V)',
            tags: ['graph', 'shortest-path', 'greedy'],
            code: `
function dijkstra(graph, start) {
    const distances = {};
    const visited = new Set();
    const previous = {};
    
    // Initialize distances
    for (let vertex in graph) {
        distances[vertex] = Infinity;
        previous[vertex] = null;
    }
    distances[start] = 0;
    
    while (visited.size < Object.keys(graph).length) {
        // Find unvisited vertex with minimum distance
        let minVertex = null;
        for (let vertex in distances) {
            if (!visited.has(vertex) && 
                (minVertex === null || distances[vertex] < distances[minVertex])) {
                minVertex = vertex;
            }
        }
        
        visited.add(minVertex);
        
        // Update distances to neighbors
        for (let neighbor in graph[minVertex]) {
            const newDist = distances[minVertex] + graph[minVertex][neighbor];
            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                previous[neighbor] = minVertex;
            }
        }
    }
    
    return { distances, previous };
}
            `
        },
        {
            id: 3,
            title: 'Longest Common Subsequence',
            description: 'Dynamic programming solution to find LCS of two sequences.',
            category: 'dp',
            timeComplexity: 'O(m × n)',
            spaceComplexity: 'O(m × n)',
            tags: ['dynamic-programming', 'sequences', 'optimization'],
            code: `
function longestCommonSubsequence(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}

function getLCS(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    // Fill dp table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    // Reconstruct LCS
    let lcs = '';
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (text1[i - 1] === text2[j - 1]) {
            lcs = text1[i - 1] + lcs;
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    
    return lcs;
}
            `
        },
        {
            id: 4,
            title: 'KMP String Matching',
            description: 'Efficient string pattern matching algorithm using failure function.',
            category: 'string',
            timeComplexity: 'O(n + m)',
            spaceComplexity: 'O(m)',
            tags: ['string-matching', 'pattern-search', 'preprocessing'],
            code: `
function kmpSearch(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    const lps = computeLPSArray(pattern);
    const result = [];
    
    let i = 0; // index for text
    let j = 0; // index for pattern
    
    while (i < n) {
        if (pattern[j] === text[i]) {
            i++;
            j++;
        }
        
        if (j === m) {
            result.push(i - j);
            j = lps[j - 1];
        } else if (i < n && pattern[j] !== text[i]) {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return result;
}

function computeLPSArray(pattern) {
    const m = pattern.length;
    const lps = Array(m).fill(0);
    let len = 0;
    let i = 1;
    
    while (i < m) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    
    return lps;
}
            `
        }
    ];
}

// Populate algorithm grid
function populateAlgorithmGrid(algorithms) {
    const algorithmGrid = document.getElementById('algorithm-grid');
    algorithmGrid.innerHTML = '';
    
    algorithms.forEach(algorithm => {
        const algorithmCard = document.createElement('div');
        algorithmCard.className = 'algorithm-card';
        algorithmCard.innerHTML = `
            <h3>${algorithm.title}</h3>
            <p>${algorithm.description}</p>
            <div class="algorithm-meta">
                <span class="complexity">Time: ${algorithm.timeComplexity}</span>
                <span class="complexity">Space: ${algorithm.spaceComplexity}</span>
            </div>
            <div class="algorithm-tags">
                ${algorithm.tags.map(tag => `<span class="algorithm-tag">${tag}</span>`).join('')}
            </div>
            <div class="algorithm-actions">
                <button class="btn btn-primary btn-small" onclick="viewAlgorithm(${algorithm.id})">
                    View Code
                </button>
                <button class="btn btn-secondary btn-small" onclick="copyAlgorithm(${algorithm.id})">
                    Copy
                </button>
            </div>
        `;
        algorithmGrid.appendChild(algorithmCard);
    });
}

// View algorithm code
function viewAlgorithm(algorithmId) {
    const algorithms = getAlgorithmsData();
    const algorithm = algorithms.find(algo => algo.id === algorithmId);
    
    if (algorithm) {
        // Create modal to display code
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${algorithm.title}</h2>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <pre><code>${algorithm.code}</code></pre>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add modal styles if not present
        if (!document.getElementById('modal-styles')) {
            const modalStyles = document.createElement('style');
            modalStyles.id = 'modal-styles';
            modalStyles.textContent = `
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                }
                .modal-content {
                    background: white;
                    border-radius: 15px;
                    max-width: 800px;
                    max-height: 80vh;
                    overflow-y: auto;
                    width: 90%;
                }
                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 2rem;
                    cursor: pointer;
                    color: #64748b;
                }
                .modal-body {
                    padding: 1.5rem;
                }
                .modal-body pre {
                    background: #f8fafc;
                    padding: 1rem;
                    border-radius: 8px;
                    overflow-x: auto;
                }
                .modal-body code {
                    font-family: 'Fira Code', monospace;
                    font-size: 0.9rem;
                    line-height: 1.5;
                }
            `;
            document.head.appendChild(modalStyles);
        }
    }
}

// Copy algorithm code
function copyAlgorithm(algorithmId) {
    const algorithms = getAlgorithmsData();
    const algorithm = algorithms.find(algo => algo.id === algorithmId);
    
    if (algorithm) {
        navigator.clipboard.writeText(algorithm.code).then(() => {
            showNotification('Code copied to clipboard!', 'success');
        });
    }
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Show admin section
function showAdminSection() {
    const adminSection = document.getElementById('admin');
    adminSection.style.display = 'block';
    adminSection.scrollIntoView({ behavior: 'smooth' });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add notification styles if not present
    if (!document.getElementById('notification-styles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.id = 'notification-styles';
        notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
            }
            .notification.success {
                background: #10b981;
            }
            .notification.error {
                background: #ef4444;
            }
            .notification.info {
                background: #3b82f6;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(notificationStyles);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Export functions for use in other files
window.portfolioApp = {
    showNotification,
    viewAlgorithm,
    copyAlgorithm,
    closeModal,
    showAdminSection
};