// Admin dashboard functionality

// Admin state
let isAdminLoggedIn = false;
const ADMIN_PASSWORD = 'admin123'; // In production, use proper authentication

// Initialize admin functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    const adminLoginForm = document.getElementById('admin-login-form');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const profileForm = document.getElementById('profile-form');
    const settingsForm = document.getElementById('settings-form');
    const syncBadgesBtn = document.getElementById('sync-badges');
    const addAlgorithmBtn = document.getElementById('add-algorithm');
    
    // Admin login
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('admin-password').value;
        
        if (password === ADMIN_PASSWORD) {
            isAdminLoggedIn = true;
            showAdminDashboard();
            loadAdminData();
            showNotification('Welcome to admin dashboard!', 'success');
        } else {
            showNotification('Invalid password!', 'error');
        }
    });
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // Profile form
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updateProfile();
    });
    
    // Settings form
    settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updateSettings();
    });
    
    // Sync badges
    syncBadgesBtn.addEventListener('click', function() {
        syncBadges();
    });
    
    // Add algorithm
    addAlgorithmBtn.addEventListener('click', function() {
        showAddAlgorithmModal();
    });
    
    // Load saved admin state
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        isAdminLoggedIn = true;
        showAdminDashboard();
        loadAdminData();
    }
}

function showAdminDashboard() {
    const adminLogin = document.getElementById('admin-login');
    const adminDashboard = document.getElementById('admin-dashboard');
    
    adminLogin.style.display = 'none';
    adminDashboard.style.display = 'block';
    
    // Save admin state
    localStorage.setItem('adminLoggedIn', 'true');
}

function switchTab(tabName) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    const activeTab = document.getElementById(`${tabName}-tab`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

function loadAdminData() {
    // Load profile data
    const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
    document.getElementById('profile-name').value = profileData.name || 'Nahin Ur Roshid Durjoy';
    document.getElementById('profile-title').value = profileData.title || 'Full Stack Developer & Algorithm Enthusiast';
    document.getElementById('profile-bio').value = profileData.bio || '';
    
    // Load settings
    const settings = JSON.parse(localStorage.getItem('portfolioSettings') || '{}');
    document.getElementById('hackerrank-username').value = settings.hackerrankUsername || '';
    document.getElementById('codechef-username').value = settings.codechefUsername || '';
    
    // Load algorithm list
    loadAlgorithmList();
}

function updateProfile() {
    const profileData = {
        name: document.getElementById('profile-name').value,
        title: document.getElementById('profile-title').value,
        bio: document.getElementById('profile-bio').value
    };
    
    // Save to localStorage
    localStorage.setItem('profileData', JSON.stringify(profileData));
    
    // Update the main site
    updateMainSiteProfile(profileData);
    
    showNotification('Profile updated successfully!', 'success');
}

function updateMainSiteProfile(profileData) {
    // Update hero section
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    if (heroTitle) heroTitle.textContent = profileData.name;
    if (heroSubtitle) heroSubtitle.textContent = profileData.title;
    
    // Update about section if bio is provided
    if (profileData.bio) {
        const aboutText = document.querySelector('.about-text p');
        if (aboutText) aboutText.textContent = profileData.bio;
    }
}

function updateSettings() {
    const settings = {
        hackerrankUsername: document.getElementById('hackerrank-username').value,
        codechefUsername: document.getElementById('codechef-username').value
    };
    
    // Save to localStorage
    localStorage.setItem('portfolioSettings', JSON.stringify(settings));
    
    showNotification('Settings saved successfully!', 'success');
}

function syncBadges() {
    const statusDiv = document.getElementById('badge-sync-status');
    statusDiv.innerHTML = '<div class="loading-spinner">Syncing badges...</div>';
    
    // Simulate badge sync (in production, this would make API calls)
    setTimeout(() => {
        const settings = JSON.parse(localStorage.getItem('portfolioSettings') || '{}');
        const hackerrankUsername = settings.hackerrankUsername;
        const codechefUsername = settings.codechefUsername;
        
        if (!hackerrankUsername || !codechefUsername) {
            statusDiv.innerHTML = '<div class="error">Please set usernames in settings first.</div>';
            return;
        }
        
        // Mock successful sync
        statusDiv.innerHTML = '<div class="success">Badges synced successfully!</div>';
        
        // Refresh badge display
        loadBadges();
        
        // Clear status after 5 seconds
        setTimeout(() => {
            statusDiv.innerHTML = '';
        }, 5000);
    }, 2000);
}

function loadAlgorithmList() {
    const algorithmList = document.getElementById('algorithm-list');
    const algorithms = getAlgorithmsData();
    
    algorithmList.innerHTML = '';
    
    algorithms.forEach(algorithm => {
        const algorithmItem = document.createElement('div');
        algorithmItem.className = 'algorithm-item';
        algorithmItem.innerHTML = `
            <div class="algorithm-item-header">
                <h4>${algorithm.title}</h4>
                <div class="algorithm-item-actions">
                    <button class="btn btn-small btn-secondary" onclick="editAlgorithm(${algorithm.id})">
                        Edit
                    </button>
                    <button class="btn btn-small btn-danger" onclick="deleteAlgorithm(${algorithm.id})">
                        Delete
                    </button>
                </div>
            </div>
            <p>${algorithm.description}</p>
            <div class="algorithm-item-meta">
                <span>Category: ${algorithm.category}</span>
                <span>Time: ${algorithm.timeComplexity}</span>
            </div>
        `;
        algorithmList.appendChild(algorithmItem);
    });
    
    // Add algorithm item styles if not present
    if (!document.getElementById('algorithm-item-styles')) {
        const algorithmItemStyles = document.createElement('style');
        algorithmItemStyles.id = 'algorithm-item-styles';
        algorithmItemStyles.textContent = `
            .algorithm-item {
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
                background: #f8fafc;
            }
            .algorithm-item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }
            .algorithm-item-header h4 {
                margin: 0;
                color: #1f2937;
            }
            .algorithm-item-actions {
                display: flex;
                gap: 0.5rem;
            }
            .algorithm-item-meta {
                display: flex;
                gap: 1rem;
                margin-top: 0.5rem;
                font-size: 0.9rem;
                color: #64748b;
            }
            .btn-danger {
                background: #ef4444;
                color: white;
            }
            .btn-danger:hover {
                background: #dc2626;
            }
        `;
        document.head.appendChild(algorithmItemStyles);
    }
}

function showAddAlgorithmModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add New Algorithm</h2>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="add-algorithm-form">
                    <div class="form-group">
                        <label for="algorithm-title">Title</label>
                        <input type="text" id="algorithm-title" name="title" required>
                    </div>
                    <div class="form-group">
                        <label for="algorithm-description">Description</label>
                        <textarea id="algorithm-description" name="description" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="algorithm-category">Category</label>
                        <select id="algorithm-category" name="category" required>
                            <option value="">Select category</option>
                            <option value="sorting">Sorting</option>
                            <option value="graph">Graph</option>
                            <option value="dp">Dynamic Programming</option>
                            <option value="string">String</option>
                            <option value="tree">Tree</option>
                            <option value="array">Array</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="algorithm-time-complexity">Time Complexity</label>
                        <input type="text" id="algorithm-time-complexity" name="timeComplexity" placeholder="e.g., O(n log n)" required>
                    </div>
                    <div class="form-group">
                        <label for="algorithm-space-complexity">Space Complexity</label>
                        <input type="text" id="algorithm-space-complexity" name="spaceComplexity" placeholder="e.g., O(log n)" required>
                    </div>
                    <div class="form-group">
                        <label for="algorithm-tags">Tags (comma-separated)</label>
                        <input type="text" id="algorithm-tags" name="tags" placeholder="e.g., sorting, recursive, divide-conquer">
                    </div>
                    <div class="form-group">
                        <label for="algorithm-code">Code</label>
                        <textarea id="algorithm-code" name="code" rows="10" required></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Add Algorithm</button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add form handler
    const form = document.getElementById('add-algorithm-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewAlgorithm();
    });
}

function addNewAlgorithm() {
    const form = document.getElementById('add-algorithm-form');
    const formData = new FormData(form);
    
    const newAlgorithm = {
        id: Date.now(), // Simple ID generation
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        timeComplexity: formData.get('timeComplexity'),
        spaceComplexity: formData.get('spaceComplexity'),
        tags: formData.get('tags').split(',').map(tag => tag.trim()),
        code: formData.get('code')
    };
    
    // Get existing algorithms
    const algorithms = getAlgorithmsData();
    algorithms.push(newAlgorithm);
    
    // Save to localStorage (in production, save to database)
    localStorage.setItem('customAlgorithms', JSON.stringify(algorithms));
    
    showNotification('Algorithm added successfully!', 'success');
    closeModal();
    loadAlgorithmList();
    
    // Refresh the main algorithms section
    initializeAlgorithms();
}

function editAlgorithm(algorithmId) {
    const algorithms = getAlgorithmsData();
    const algorithm = algorithms.find(algo => algo.id === algorithmId);
    
    if (!algorithm) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Edit Algorithm</h2>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="edit-algorithm-form">
                    <div class="form-group">
                        <label for="edit-algorithm-title">Title</label>
                        <input type="text" id="edit-algorithm-title" name="title" value="${algorithm.title}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-algorithm-description">Description</label>
                        <textarea id="edit-algorithm-description" name="description" rows="3" required>${algorithm.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit-algorithm-category">Category</label>
                        <select id="edit-algorithm-category" name="category" required>
                            <option value="sorting" ${algorithm.category === 'sorting' ? 'selected' : ''}>Sorting</option>
                            <option value="graph" ${algorithm.category === 'graph' ? 'selected' : ''}>Graph</option>
                            <option value="dp" ${algorithm.category === 'dp' ? 'selected' : ''}>Dynamic Programming</option>
                            <option value="string" ${algorithm.category === 'string' ? 'selected' : ''}>String</option>
                            <option value="tree" ${algorithm.category === 'tree' ? 'selected' : ''}>Tree</option>
                            <option value="array" ${algorithm.category === 'array' ? 'selected' : ''}>Array</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit-algorithm-time-complexity">Time Complexity</label>
                        <input type="text" id="edit-algorithm-time-complexity" name="timeComplexity" value="${algorithm.timeComplexity}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-algorithm-space-complexity">Space Complexity</label>
                        <input type="text" id="edit-algorithm-space-complexity" name="spaceComplexity" value="${algorithm.spaceComplexity}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-algorithm-tags">Tags (comma-separated)</label>
                        <input type="text" id="edit-algorithm-tags" name="tags" value="${algorithm.tags.join(', ')}">
                    </div>
                    <div class="form-group">
                        <label for="edit-algorithm-code">Code</label>
                        <textarea id="edit-algorithm-code" name="code" rows="10" required>${algorithm.code}</textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Update Algorithm</button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add form handler
    const form = document.getElementById('edit-algorithm-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        updateAlgorithm(algorithmId);
    });
}

function updateAlgorithm(algorithmId) {
    const form = document.getElementById('edit-algorithm-form');
    const formData = new FormData(form);
    
    const updatedAlgorithm = {
        id: algorithmId,
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        timeComplexity: formData.get('timeComplexity'),
        spaceComplexity: formData.get('spaceComplexity'),
        tags: formData.get('tags').split(',').map(tag => tag.trim()),
        code: formData.get('code')
    };
    
    // Get existing algorithms
    const algorithms = getAlgorithmsData();
    const algorithmIndex = algorithms.findIndex(algo => algo.id === algorithmId);
    
    if (algorithmIndex !== -1) {
        algorithms[algorithmIndex] = updatedAlgorithm;
        
        // Save to localStorage
        localStorage.setItem('customAlgorithms', JSON.stringify(algorithms));
        
        showNotification('Algorithm updated successfully!', 'success');
        closeModal();
        loadAlgorithmList();
        
        // Refresh the main algorithms section
        initializeAlgorithms();
    }
}

function deleteAlgorithm(algorithmId) {
    if (confirm('Are you sure you want to delete this algorithm?')) {
        const algorithms = getAlgorithmsData();
        const filteredAlgorithms = algorithms.filter(algo => algo.id !== algorithmId);
        
        // Save to localStorage
        localStorage.setItem('customAlgorithms', JSON.stringify(filteredAlgorithms));
        
        showNotification('Algorithm deleted successfully!', 'success');
        loadAlgorithmList();
        
        // Refresh the main algorithms section
        initializeAlgorithms();
    }
}

// Override the original getAlgorithmsData to include custom algorithms
function getAlgorithmsData() {
    // Default algorithms
    const defaultAlgorithms = [
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
    
    // Get custom algorithms from localStorage
    const customAlgorithms = JSON.parse(localStorage.getItem('customAlgorithms') || '[]');
    
    return [...defaultAlgorithms, ...customAlgorithms];
}

// Admin logout function
function adminLogout() {
    isAdminLoggedIn = false;
    localStorage.removeItem('adminLoggedIn');
    
    const adminLogin = document.getElementById('admin-login');
    const adminDashboard = document.getElementById('admin-dashboard');
    
    adminLogin.style.display = 'block';
    adminDashboard.style.display = 'none';
    
    // Clear password field
    document.getElementById('admin-password').value = '';
    
    showNotification('Logged out successfully!', 'success');
}

// Export admin functions
window.adminApp = {
    showAddAlgorithmModal,
    editAlgorithm,
    deleteAlgorithm,
    adminLogout
};