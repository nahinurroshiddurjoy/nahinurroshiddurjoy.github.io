// Main JavaScript for CodeJudge

class CodeJudge {
    constructor() {
        this.problems = [];
        this.contests = [];
        this.initializeData();
    }

    initializeData() {
        // Initialize sample problems if not exists
        if (!localStorage.getItem('problems')) {
            this.problems = [
                {
                    id: 1,
                    title: "Two Sum",
                    difficulty: "easy",
                    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                    constraints: "2 ≤ nums.length ≤ 10⁴\n-10⁹ ≤ nums[i] ≤ 10⁹\n-10⁹ ≤ target ≤ 10⁹",
                    examples: [
                        {
                            input: "[2,7,11,15]\n9",
                            output: "[0,1]",
                            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
                        }
                    ],
                    tags: ["array", "hash-table"],
                    timeLimit: 1000,
                    memoryLimit: 256,
                    solvedBy: 1532,
                    attempts: 3421
                },
                {
                    id: 2,
                    title: "Reverse String",
                    difficulty: "easy",
                    description: "Write a function that reverses a string. The input string is given as an array of characters s.",
                    constraints: "1 ≤ s.length ≤ 10⁵\ns[i] is a printable ascii character.",
                    examples: [
                        {
                            input: "['h','e','l','l','o']",
                            output: "['o','l','l','e','h']",
                            explanation: "Reverse the array in-place."
                        }
                    ],
                    tags: ["string", "two-pointers"],
                    timeLimit: 1000,
                    memoryLimit: 256,
                    solvedBy: 2341,
                    attempts: 2987
                },
                {
                    id: 3,
                    title: "Binary Search",
                    difficulty: "medium",
                    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.",
                    constraints: "1 ≤ nums.length ≤ 10⁴\n-10⁴ < nums[i], target < 10⁴",
                    examples: [
                        {
                            input: "[-1,0,3,5,9,12]\n9",
                            output: "4",
                            explanation: "9 exists in nums and its index is 4"
                        }
                    ],
                    tags: ["array", "binary-search"],
                    timeLimit: 1000,
                    memoryLimit: 256,
                    solvedBy: 891,
                    attempts: 1432
                },
                {
                    id: 4,
                    title: "Longest Palindromic Substring",
                    difficulty: "hard",
                    description: "Given a string s, return the longest palindromic substring in s.",
                    constraints: "1 ≤ s.length ≤ 1000\ns consist of only digits and English letters.",
                    examples: [
                        {
                            input: "\"babad\"",
                            output: "\"bab\"",
                            explanation: "\"aba\" is also a valid answer."
                        }
                    ],
                    tags: ["string", "dynamic-programming"],
                    timeLimit: 2000,
                    memoryLimit: 512,
                    solvedBy: 234,
                    attempts: 1876
                },
                {
                    id: 5,
                    title: "Maximum Subarray",
                    difficulty: "medium",
                    description: "Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.",
                    constraints: "1 ≤ nums.length ≤ 10⁵\n-10⁴ ≤ nums[i] ≤ 10⁴",
                    examples: [
                        {
                            input: "[-2,1,-3,4,-1,2,1,-5,4]",
                            output: "6",
                            explanation: "[4,-1,2,1] has the largest sum = 6."
                        }
                    ],
                    tags: ["array", "divide-and-conquer", "dynamic-programming"],
                    timeLimit: 1000,
                    memoryLimit: 256,
                    solvedBy: 567,
                    attempts: 1123
                }
            ];
            localStorage.setItem('problems', JSON.stringify(this.problems));
        } else {
            this.problems = JSON.parse(localStorage.getItem('problems'));
        }

        // Initialize sample contests if not exists
        if (!localStorage.getItem('contests')) {
            this.contests = [
                {
                    id: 1,
                    title: "Weekly Contest 1",
                    description: "Practice contest for beginners",
                    startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                    endTime: new Date(Date.now() + 86400000 + 7200000).toISOString(), // Tomorrow + 2 hours
                    problems: [1, 2, 3],
                    participants: 156,
                    status: "upcoming"
                },
                {
                    id: 2,
                    title: "Algorithm Masters",
                    description: "Advanced algorithmic problems",
                    startTime: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                    endTime: new Date(Date.now() - 86400000 + 10800000).toISOString(), // Yesterday + 3 hours
                    problems: [3, 4, 5],
                    participants: 89,
                    status: "finished"
                }
            ];
            localStorage.setItem('contests', JSON.stringify(this.contests));
        } else {
            this.contests = JSON.parse(localStorage.getItem('contests'));
        }
    }

    getProblems() {
        return this.problems;
    }

    getProblem(id) {
        return this.problems.find(p => p.id === parseInt(id));
    }

    getContests() {
        return this.contests;
    }

    getContest(id) {
        return this.contests.find(c => c.id === parseInt(id));
    }

    submitCode(problemId, code, language) {
        // Simulate code submission and judging
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                // Random result for demo purposes
                const results = ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'];
                const weights = [0.6, 0.2, 0.1, 0.05, 0.05]; // Higher chance of acceptance
                
                let random = Math.random();
                let result = results[0];
                
                for (let i = 0; i < weights.length; i++) {
                    if (random < weights[i]) {
                        result = results[i];
                        break;
                    }
                    random -= weights[i];
                }

                const submission = {
                    id: Date.now(),
                    problemId: parseInt(problemId),
                    code,
                    language,
                    status: result,
                    time: Math.floor(Math.random() * 1000) + 'ms',
                    memory: Math.floor(Math.random() * 50) + 'MB',
                    timestamp: new Date().toISOString()
                };

                // Save submission to localStorage
                const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
                submissions.push(submission);
                localStorage.setItem('submissions', JSON.stringify(submissions));

                // Update user stats if logged in
                if (auth.isLoggedIn()) {
                    auth.updateUserStats(problemId, result);
                }

                resolve(submission);
            }, 2000);
        });
    }

    getSubmissions(userId = null) {
        const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
        if (userId) {
            return submissions.filter(s => s.userId === userId);
        }
        return submissions;
    }

    getLeaderboard() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users
            .map(user => ({
                id: user.id,
                username: user.username,
                solvedProblems: user.solvedProblems.length,
                rating: user.rating,
                rank: user.rank
            }))
            .sort((a, b) => b.rating - a.rating);
    }
}

// Initialize CodeJudge instance
const codeJudge = new CodeJudge();

// Load recent problems on homepage
document.addEventListener('DOMContentLoaded', function() {
    const recentProblemsContainer = document.getElementById('recent-problems');
    
    if (recentProblemsContainer) {
        const problems = codeJudge.getProblems().slice(0, 3);
        
        problems.forEach(problem => {
            const problemCard = document.createElement('div');
            problemCard.className = 'col-md-4 mb-4';
            problemCard.innerHTML = `
                <div class="problem-card">
                    <h5 class="mb-3">${problem.title}</h5>
                    <p class="text-muted mb-3">${problem.description.substring(0, 100)}...</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="problem-difficulty difficulty-${problem.difficulty}">
                            ${problem.difficulty}
                        </span>
                        <a href="problem.html?id=${problem.id}" class="btn btn-primary btn-sm">
                            Solve
                        </a>
                    </div>
                </div>
            `;
            recentProblemsContainer.appendChild(problemCard);
        });
    }
});

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function formatTime(timeString) {
    if (timeString.includes('ms')) return timeString;
    return parseInt(timeString) + 'ms';
}

function formatMemory(memoryString) {
    if (memoryString.includes('MB')) return memoryString;
    return parseInt(memoryString) + 'MB';
}

function getDifficultyColor(difficulty) {
    switch(difficulty) {
        case 'easy': return 'success';
        case 'medium': return 'warning';
        case 'hard': return 'danger';
        default: return 'secondary';
    }
}

function getStatusColor(status) {
    switch(status) {
        case 'Accepted': return 'success';
        case 'Wrong Answer': return 'danger';
        case 'Time Limit Exceeded': return 'warning';
        case 'Runtime Error': return 'danger';
        case 'Compilation Error': return 'secondary';
        default: return 'secondary';
    }
}

// Export for use in other files
window.codeJudge = codeJudge;