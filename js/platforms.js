// Platform integration for HackerRank and CodeChef

// Platform API configurations
const PLATFORM_CONFIG = {
    hackerrank: {
        baseUrl: 'https://www.hackerrank.com',
        apiUrl: 'https://www.hackerrank.com/rest/hackers',
        profileUrl: 'https://www.hackerrank.com/profile'
    },
    codechef: {
        baseUrl: 'https://www.codechef.com',
        apiUrl: 'https://www.codechef.com/api/rankings',
        profileUrl: 'https://www.codechef.com/users'
    }
};

// Initialize platforms
document.addEventListener('DOMContentLoaded', function() {
    initializePlatforms();
});

function initializePlatforms() {
    const settings = JSON.parse(localStorage.getItem('portfolioSettings') || '{}');
    
    if (settings.hackerrankUsername) {
        fetchHackerRankData(settings.hackerrankUsername);
    }
    
    if (settings.codechefUsername) {
        fetchCodeChefData(settings.codechefUsername);
    }
}

// HackerRank Integration
async function fetchHackerRankData(username) {
    try {
        // Note: Direct API calls to HackerRank may be blocked by CORS
        // In production, you'd need a backend proxy or use scraping
        
        // For now, we'll use demo data and localStorage
        const hackerRankData = getHackerRankDemoData(username);
        updateHackerRankDisplay(hackerRankData);
        
        // Try to fetch badges
        const badges = await fetchHackerRankBadges(username);
        updateHackerRankBadges(badges);
        
    } catch (error) {
        console.error('Error fetching HackerRank data:', error);
        
        // Fallback to demo data
        const demoData = getHackerRankDemoData(username);
        updateHackerRankDisplay(demoData);
    }
}

function getHackerRankDemoData(username) {
    return {
        username: username,
        score: 1247,
        rank: 12543,
        problemsSolved: 89,
        badges: [
            { name: 'Problem Solving', level: 'Gold', icon: 'fas fa-trophy' },
            { name: 'Algorithms', level: 'Silver', icon: 'fas fa-code' },
            { name: 'Data Structures', level: 'Bronze', icon: 'fas fa-database' },
            { name: 'Mathematics', level: 'Silver', icon: 'fas fa-calculator' }
        ]
    };
}

function updateHackerRankDisplay(data) {
    const scoreElement = document.getElementById('hackerrank-score');
    if (scoreElement) {
        scoreElement.textContent = data.score;
    }
    
    // Update other HackerRank stats
    updateTotalProblems(data.problemsSolved);
}

async function fetchHackerRankBadges(username) {
    // In production, implement actual API call or scraping
    // For now, return demo badges
    return [
        { name: 'Problem Solving', level: 'Gold', icon: 'fas fa-trophy', color: '#FFD700' },
        { name: 'Algorithms', level: 'Silver', icon: 'fas fa-code', color: '#C0C0C0' },
        { name: 'Data Structures', level: 'Bronze', icon: 'fas fa-database', color: '#CD7F32' },
        { name: 'Mathematics', level: 'Silver', icon: 'fas fa-calculator', color: '#C0C0C0' },
        { name: 'Java', level: 'Bronze', icon: 'fab fa-java', color: '#CD7F32' },
        { name: 'Python', level: 'Gold', icon: 'fab fa-python', color: '#FFD700' }
    ];
}

function updateHackerRankBadges(badges) {
    const container = document.getElementById('hackerrank-badges');
    if (!container) return;
    
    container.innerHTML = '';
    
    badges.forEach(badge => {
        const badgeElement = document.createElement('div');
        badgeElement.className = 'badge-item';
        badgeElement.style.background = `linear-gradient(135deg, ${badge.color} 0%, ${adjustColorBrightness(badge.color, -20)} 100%)`;
        badgeElement.innerHTML = `
            <i class="${badge.icon}"></i>
            <h4>${badge.name}</h4>
            <p>${badge.level}</p>
        `;
        container.appendChild(badgeElement);
    });
}

// CodeChef Integration
async function fetchCodeChefData(username) {
    try {
        // Note: Direct API calls to CodeChef may be blocked by CORS
        // In production, you'd need a backend proxy or use scraping
        
        // For now, we'll use demo data and localStorage
        const codeChefData = getCodeChefDemoData(username);
        updateCodeChefDisplay(codeChefData);
        
        // Try to fetch badges
        const badges = await fetchCodeChefBadges(username);
        updateCodeChefBadges(badges);
        
    } catch (error) {
        console.error('Error fetching CodeChef data:', error);
        
        // Fallback to demo data
        const demoData = getCodeChefDemoData(username);
        updateCodeChefDisplay(demoData);
    }
}

function getCodeChefDemoData(username) {
    return {
        username: username,
        rating: 1567,
        maxRating: 1689,
        globalRank: 8932,
        countryRank: 2145,
        problemsSolved: 134,
        badges: [
            { name: 'Long Challenge', level: 'Gold', icon: 'fas fa-trophy' },
            { name: 'Cook-Off', level: 'Silver', icon: 'fas fa-fire' },
            { name: 'Lunchtime', level: 'Bronze', icon: 'fas fa-clock' }
        ]
    };
}

function updateCodeChefDisplay(data) {
    const ratingElement = document.getElementById('codechef-rating');
    if (ratingElement) {
        ratingElement.textContent = data.rating;
    }
    
    // Update other CodeChef stats
    updateTotalProblems(data.problemsSolved);
}

async function fetchCodeChefBadges(username) {
    // In production, implement actual API call or scraping
    // For now, return demo badges
    return [
        { name: 'Long Challenge', level: 'Gold', icon: 'fas fa-trophy', color: '#FFD700' },
        { name: 'Cook-Off', level: 'Silver', icon: 'fas fa-fire', color: '#C0C0C0' },
        { name: 'Lunchtime', level: 'Bronze', icon: 'fas fa-clock', color: '#CD7F32' },
        { name: 'Beginner', level: 'Completed', icon: 'fas fa-graduation-cap', color: '#4CAF50' },
        { name: 'Easy', level: 'Completed', icon: 'fas fa-check-circle', color: '#2196F3' },
        { name: 'Medium', level: 'In Progress', icon: 'fas fa-spinner', color: '#FF9800' }
    ];
}

function updateCodeChefBadges(badges) {
    const container = document.getElementById('codechef-badges');
    if (!container) return;
    
    container.innerHTML = '';
    
    badges.forEach(badge => {
        const badgeElement = document.createElement('div');
        badgeElement.className = 'badge-item';
        badgeElement.style.background = `linear-gradient(135deg, ${badge.color} 0%, ${adjustColorBrightness(badge.color, -20)} 100%)`;
        badgeElement.innerHTML = `
            <i class="${badge.icon}"></i>
            <h4>${badge.name}</h4>
            <p>${badge.level}</p>
        `;
        container.appendChild(badgeElement);
    });
}

// Helper function to update total problems solved
function updateTotalProblems(count) {
    const totalElement = document.getElementById('total-problems');
    if (totalElement) {
        const currentCount = parseInt(totalElement.textContent) || 0;
        totalElement.textContent = Math.max(currentCount, count);
    }
}

// Advanced platform data fetching (using web scraping approach)
async function fetchPlatformDataAdvanced(platform, username) {
    try {
        // This would require a backend service or proxy to handle CORS
        // For demonstration, we'll simulate the API call
        
        const response = await fetch(`/api/platforms/${platform}/${username}`);
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error(`Error fetching ${platform} data:`, error);
        return null;
    }
}

// GitHub Integration (bonus feature)
async function fetchGitHubData(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const userData = await response.json();
        
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
        const reposData = await reposResponse.json();
        
        return {
            user: userData,
            repos: reposData
        };
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        return null;
    }
}

// LeetCode Integration (bonus feature)
async function fetchLeetCodeData(username) {
    try {
        // LeetCode doesn't have a public API, so this would require web scraping
        // or a third-party service
        
        // For demo purposes, return mock data
        return {
            username: username,
            problemsSolved: 245,
            acceptanceRate: 78.5,
            ranking: 12543,
            badges: [
                { name: 'Problem Solver', level: 'Bronze', icon: 'fas fa-puzzle-piece' },
                { name: 'Daily Challenger', level: 'Silver', icon: 'fas fa-calendar-check' }
            ]
        };
    } catch (error) {
        console.error('Error fetching LeetCode data:', error);
        return null;
    }
}

// Portfolio statistics aggregation
function aggregatePortfolioStats() {
    const settings = JSON.parse(localStorage.getItem('portfolioSettings') || '{}');
    
    // Aggregate stats from all platforms
    const stats = {
        totalProblems: 0,
        totalRating: 0,
        totalBadges: 0,
        platforms: []
    };
    
    // Add HackerRank stats
    if (settings.hackerrankUsername) {
        const hrData = getHackerRankDemoData(settings.hackerrankUsername);
        stats.totalProblems += hrData.problemsSolved;
        stats.totalRating += hrData.score;
        stats.totalBadges += hrData.badges.length;
        stats.platforms.push('HackerRank');
    }
    
    // Add CodeChef stats
    if (settings.codechefUsername) {
        const ccData = getCodeChefDemoData(settings.codechefUsername);
        stats.totalProblems += ccData.problemsSolved;
        stats.totalRating += ccData.rating;
        stats.totalBadges += ccData.badges.length;
        stats.platforms.push('CodeChef');
    }
    
    return stats;
}

// Update portfolio dashboard with aggregated stats
function updatePortfolioDashboard() {
    const stats = aggregatePortfolioStats();
    
    // Update hero section stats
    const totalProblemsElement = document.getElementById('total-problems');
    if (totalProblemsElement) {
        totalProblemsElement.textContent = stats.totalProblems;
    }
    
    // Create or update portfolio stats section
    createPortfolioStatsSection(stats);
}

function createPortfolioStatsSection(stats) {
    // This could be added to the about section or as a separate section
    const aboutSection = document.querySelector('.about-content');
    if (aboutSection) {
        const statsElement = document.createElement('div');
        statsElement.className = 'portfolio-stats';
        statsElement.innerHTML = `
            <h3>Portfolio Statistics</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <i class="fas fa-code"></i>
                    <h4>${stats.totalProblems}</h4>
                    <p>Problems Solved</p>
                </div>
                <div class="stat-item">
                    <i class="fas fa-trophy"></i>
                    <h4>${stats.totalBadges}</h4>
                    <p>Badges Earned</p>
                </div>
                <div class="stat-item">
                    <i class="fas fa-chart-line"></i>
                    <h4>${stats.platforms.length}</h4>
                    <p>Platforms</p>
                </div>
            </div>
        `;
        
        // Add stats styles if not present
        if (!document.getElementById('portfolio-stats-styles')) {
            const statsStyles = document.createElement('style');
            statsStyles.id = 'portfolio-stats-styles';
            statsStyles.textContent = `
                .portfolio-stats {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 2rem;
                    border-radius: 15px;
                    margin-top: 2rem;
                }
                .portfolio-stats h3 {
                    margin-bottom: 1.5rem;
                    text-align: center;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1.5rem;
                }
                .stat-item {
                    text-align: center;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 1.5rem;
                    border-radius: 10px;
                    backdrop-filter: blur(10px);
                }
                .stat-item i {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                    color: #fbbf24;
                }
                .stat-item h4 {
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 0.25rem;
                }
                .stat-item p {
                    font-size: 0.9rem;
                    opacity: 0.9;
                }
            `;
            document.head.appendChild(statsStyles);
        }
        
        // Remove existing stats if present
        const existingStats = aboutSection.querySelector('.portfolio-stats');
        if (existingStats) {
            existingStats.remove();
        }
        
        aboutSection.appendChild(statsElement);
    }
}

// Utility functions
function adjustColorBrightness(color, percent) {
    const usePound = color[0] === '#';
    const col = usePound ? color.slice(1) : color;
    const num = parseInt(col, 16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00FF) + percent;
    let b = (num & 0x0000FF) + percent;
    
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    
    return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16);
}

// Platform data refresh
function refreshPlatformData() {
    const settings = JSON.parse(localStorage.getItem('portfolioSettings') || '{}');
    
    showNotification('Refreshing platform data...', 'info');
    
    // Refresh all platform data
    if (settings.hackerrankUsername) {
        fetchHackerRankData(settings.hackerrankUsername);
    }
    
    if (settings.codechefUsername) {
        fetchCodeChefData(settings.codechefUsername);
    }
    
    // Update portfolio dashboard
    setTimeout(() => {
        updatePortfolioDashboard();
        showNotification('Platform data refreshed successfully!', 'success');
    }, 2000);
}

// Export platform functions
window.platformsApp = {
    fetchHackerRankData,
    fetchCodeChefData,
    fetchGitHubData,
    fetchLeetCodeData,
    refreshPlatformData,
    updatePortfolioDashboard
};

// Initialize platform data refresh on load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updatePortfolioDashboard, 1000);
});