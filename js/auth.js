// Authentication System for CodeJudge

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.loadUserSession();
    }

    loadUserSession() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUI();
        }
    }

    saveUserSession() {
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }

    register(username, email, password) {
        // Check if user already exists
        const users = this.getUsers();
        if (users.find(u => u.username === username || u.email === email)) {
            throw new Error('Username or email already exists');
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            username,
            email,
            password: this.hashPassword(password),
            joinDate: new Date().toISOString(),
            solvedProblems: [],
            submissions: [],
            rating: 1200,
            rank: 'Newbie'
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto login after registration
        this.currentUser = { ...newUser };
        delete this.currentUser.password; // Don't store password in session
        this.saveUserSession();
        this.updateUI();
        
        return true;
    }

    login(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username);
        
        if (!user || user.password !== this.hashPassword(password)) {
            throw new Error('Invalid username or password');
        }

        this.currentUser = { ...user };
        delete this.currentUser.password; // Don't store password in session
        this.saveUserSession();
        this.updateUI();
        
        return true;
    }

    logout() {
        this.currentUser = null;
        this.saveUserSession();
        this.updateUI();
        window.location.href = 'index.html';
    }

    getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    hashPassword(password) {
        // Simple hash function for demo purposes
        // In a real application, use proper hashing
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    }

    updateUI() {
        const loginLink = document.querySelector('[onclick="showLogin()"]');
        const registerLink = document.querySelector('[onclick="showRegister()"]');
        const userMenu = document.getElementById('user-menu');
        const usernameSpan = document.getElementById('username');

        if (this.currentUser) {
            // User is logged in
            if (loginLink) loginLink.parentElement.classList.add('d-none');
            if (registerLink) registerLink.parentElement.classList.add('d-none');
            if (userMenu) userMenu.classList.remove('d-none');
            if (usernameSpan) usernameSpan.textContent = this.currentUser.username;
        } else {
            // User is not logged in
            if (loginLink) loginLink.parentElement.classList.remove('d-none');
            if (registerLink) registerLink.parentElement.classList.remove('d-none');
            if (userMenu) userMenu.classList.add('d-none');
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    updateUserStats(problemId, status) {
        if (!this.isLoggedIn()) return;

        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            const submission = {
                problemId,
                status,
                timestamp: new Date().toISOString(),
                language: 'cpp' // Default for now
            };

            users[userIndex].submissions.push(submission);
            
            // If accepted and not already solved
            if (status === 'Accepted' && !users[userIndex].solvedProblems.includes(problemId)) {
                users[userIndex].solvedProblems.push(problemId);
                users[userIndex].rating += 25; // Simple rating increase
            }

            localStorage.setItem('users', JSON.stringify(users));
            
            // Update current user session
            this.currentUser = { ...users[userIndex] };
            delete this.currentUser.password;
            this.saveUserSession();
        }
    }
}

// Initialize auth system
const auth = new AuthSystem();

// Modal functions
function showLogin() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
}

function showRegister() {
    const modal = new bootstrap.Modal(document.getElementById('registerModal'));
    modal.show();
}

function logout() {
    auth.logout();
}

// Form handlers
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                auth.login(username, password);
                bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
                showAlert('Login successful!', 'success');
            } catch (error) {
                showAlert(error.message, 'danger');
            }
        });
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                showAlert('Passwords do not match', 'danger');
                return;
            }
            
            try {
                auth.register(username, email, password);
                bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
                showAlert('Registration successful! You are now logged in.', 'success');
            } catch (error) {
                showAlert(error.message, 'danger');
            }
        });
    }
});

// Utility function to show alerts
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}