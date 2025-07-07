// Advanced algorithms showcase and implementation

// Algorithm categories and their implementations
const ALGORITHM_CATEGORIES = {
    sorting: {
        name: 'Sorting Algorithms',
        icon: 'fas fa-sort',
        color: '#3b82f6'
    },
    graph: {
        name: 'Graph Algorithms',
        icon: 'fas fa-project-diagram',
        color: '#10b981'
    },
    dp: {
        name: 'Dynamic Programming',
        icon: 'fas fa-brain',
        color: '#8b5cf6'
    },
    string: {
        name: 'String Algorithms',
        icon: 'fas fa-font',
        color: '#f59e0b'
    },
    tree: {
        name: 'Tree Algorithms',
        icon: 'fas fa-tree',
        color: '#06b6d4'
    },
    array: {
        name: 'Array Algorithms',
        icon: 'fas fa-list',
        color: '#ef4444'
    }
};

// Advanced algorithm implementations
const ADVANCED_ALGORITHMS = [
    {
        id: 101,
        title: 'Merge Sort',
        description: 'Stable divide-and-conquer sorting algorithm with guaranteed O(n log n) time complexity.',
        category: 'sorting',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        tags: ['sorting', 'divide-conquer', 'stable'],
        difficulty: 'Medium',
        code: `
function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}

function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;
    
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] <= right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }
    
    return result
        .concat(left.slice(leftIndex))
        .concat(right.slice(rightIndex));
}

// Example usage
const unsortedArray = [64, 34, 25, 12, 22, 11, 90];
console.log('Original:', unsortedArray);
console.log('Sorted:', mergeSort(unsortedArray));
        `,
        visualization: true,
        interactive: true
    },
    {
        id: 102,
        title: 'Heap Sort',
        description: 'In-place sorting algorithm using binary heap data structure.',
        category: 'sorting',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
        tags: ['sorting', 'heap', 'in-place'],
        difficulty: 'Hard',
        code: `
function heapSort(arr) {
    const n = arr.length;
    
    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        [arr[0], arr[i]] = [arr[i], arr[0]];
        
        // Call max heapify on the reduced heap
        heapify(arr, i, 0);
    }
    
    return arr;
}

function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    // If left child is larger than root
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    
    // If right child is larger than largest so far
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    
    // If largest is not root
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        
        // Recursively heapify the affected sub-tree
        heapify(arr, n, largest);
    }
}

// Example usage
const unsortedArray = [12, 11, 13, 5, 6, 7];
console.log('Original:', [...unsortedArray]);
console.log('Sorted:', heapSort(unsortedArray));
        `,
        visualization: true
    },
    {
        id: 103,
        title: 'Bellman-Ford Algorithm',
        description: 'Single-source shortest path algorithm that handles negative edge weights.',
        category: 'graph',
        timeComplexity: 'O(V × E)',
        spaceComplexity: 'O(V)',
        tags: ['graph', 'shortest-path', 'negative-weights'],
        difficulty: 'Hard',
        code: `
function bellmanFord(graph, start) {
    const vertices = Object.keys(graph);
    const distances = {};
    const predecessor = {};
    
    // Initialize distances
    vertices.forEach(vertex => {
        distances[vertex] = vertex === start ? 0 : Infinity;
        predecessor[vertex] = null;
    });
    
    // Relax edges repeatedly
    for (let i = 0; i < vertices.length - 1; i++) {
        for (const u of vertices) {
            if (distances[u] === Infinity) continue;
            
            for (const v in graph[u]) {
                const weight = graph[u][v];
                const newDistance = distances[u] + weight;
                
                if (newDistance < distances[v]) {
                    distances[v] = newDistance;
                    predecessor[v] = u;
                }
            }
        }
    }
    
    // Check for negative cycles
    for (const u of vertices) {
        if (distances[u] === Infinity) continue;
        
        for (const v in graph[u]) {
            const weight = graph[u][v];
            if (distances[u] + weight < distances[v]) {
                throw new Error('Graph contains negative cycle');
            }
        }
    }
    
    return { distances, predecessor };
}

// Example usage
const graph = {
    'A': { 'B': 4, 'C': 2 },
    'B': { 'C': -3, 'D': 2 },
    'C': { 'D': 4 },
    'D': {}
};

try {
    const result = bellmanFord(graph, 'A');
    console.log('Shortest distances:', result.distances);
    console.log('Predecessors:', result.predecessor);
} catch (error) {
    console.error(error.message);
}
        `,
        visualization: true
    },
    {
        id: 104,
        title: 'Floyd-Warshall Algorithm',
        description: 'All-pairs shortest path algorithm using dynamic programming.',
        category: 'graph',
        timeComplexity: 'O(V³)',
        spaceComplexity: 'O(V²)',
        tags: ['graph', 'shortest-path', 'dynamic-programming', 'all-pairs'],
        difficulty: 'Hard',
        code: `
function floydWarshall(graph) {
    const vertices = Object.keys(graph);
    const n = vertices.length;
    const dist = {};
    const next = {};
    
    // Initialize distance matrix
    vertices.forEach(i => {
        dist[i] = {};
        next[i] = {};
        vertices.forEach(j => {
            if (i === j) {
                dist[i][j] = 0;
                next[i][j] = j;
            } else if (graph[i] && graph[i][j] !== undefined) {
                dist[i][j] = graph[i][j];
                next[i][j] = j;
            } else {
                dist[i][j] = Infinity;
                next[i][j] = null;
            }
        });
    });
    
    // Floyd-Warshall algorithm
    vertices.forEach(k => {
        vertices.forEach(i => {
            vertices.forEach(j => {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next[i][j] = next[i][k];
                }
            });
        });
    });
    
    return { distances: dist, next };
}

function getPath(next, start, end) {
    if (next[start][end] === null) return null;
    
    const path = [start];
    let current = start;
    
    while (current !== end) {
        current = next[current][end];
        path.push(current);
    }
    
    return path;
}

// Example usage
const graph = {
    'A': { 'B': 3, 'C': 8, 'E': -4 },
    'B': { 'D': 1, 'E': 7 },
    'C': { 'B': 4 },
    'D': { 'A': 2, 'C': -5 },
    'E': { 'D': 6 }
};

const result = floydWarshall(graph);
console.log('All-pairs shortest distances:', result.distances);
console.log('Path from A to C:', getPath(result.next, 'A', 'C'));
        `,
        visualization: true
    },
    {
        id: 105,
        title: 'Knapsack Problem (0/1)',
        description: 'Dynamic programming solution for the classic 0/1 knapsack problem.',
        category: 'dp',
        timeComplexity: 'O(n × W)',
        spaceComplexity: 'O(n × W)',
        tags: ['dynamic-programming', 'optimization', 'knapsack'],
        difficulty: 'Medium',
        code: `
function knapsack(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    
    // Build table dp[][] in bottom-up manner
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    // Backtrack to find which items to include
    const selectedItems = [];
    let w = capacity;
    
    for (let i = n; i > 0 && w > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            selectedItems.push(i - 1);
            w -= weights[i - 1];
        }
    }
    
    return {
        maxValue: dp[n][capacity],
        selectedItems: selectedItems.reverse(),
        dp: dp
    };
}

// Space-optimized version
function knapsackOptimized(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(capacity + 1).fill(0);
    
    for (let i = 0; i < n; i++) {
        for (let w = capacity; w >= weights[i]; w--) {
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    
    return dp[capacity];
}

// Example usage
const weights = [10, 20, 30];
const values = [60, 100, 120];
const capacity = 50;

const result = knapsack(weights, values, capacity);
console.log('Maximum value:', result.maxValue);
console.log('Selected items:', result.selectedItems);
console.log('Optimized result:', knapsackOptimized(weights, values, capacity));
        `,
        visualization: true,
        interactive: true
    },
    {
        id: 106,
        title: 'Edit Distance (Levenshtein)',
        description: 'Dynamic programming solution to find minimum edit distance between two strings.',
        category: 'dp',
        timeComplexity: 'O(m × n)',
        spaceComplexity: 'O(m × n)',
        tags: ['dynamic-programming', 'string-similarity', 'edit-distance'],
        difficulty: 'Medium',
        code: `
function editDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    // Initialize base cases
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }
    
    // Fill the dp table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],    // deletion
                    dp[i][j - 1],    // insertion
                    dp[i - 1][j - 1] // substitution
                );
            }
        }
    }
    
    return dp[m][n];
}

function editDistanceWithOperations(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    const operations = [];
    
    // Initialize base cases
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }
    
    // Fill the dp table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],    // deletion
                    dp[i][j - 1],    // insertion
                    dp[i - 1][j - 1] // substitution
                );
            }
        }
    }
    
    // Backtrack to find operations
    let i = m, j = n;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && str1[i - 1] === str2[j - 1]) {
            i--;
            j--;
        } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
            operations.push(\`Substitute '\${str1[i - 1]}' with '\${str2[j - 1]}' at position \${i - 1}\`);
            i--;
            j--;
        } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
            operations.push(\`Delete '\${str1[i - 1]}' at position \${i - 1}\`);
            i--;
        } else {
            operations.push(\`Insert '\${str2[j - 1]}' at position \${i}\`);
            j--;
        }
    }
    
    return {
        distance: dp[m][n],
        operations: operations.reverse()
    };
}

// Example usage
const str1 = "kitten";
const str2 = "sitting";
console.log('Edit distance:', editDistance(str1, str2));

const result = editDistanceWithOperations(str1, str2);
console.log('Distance with operations:', result.distance);
console.log('Operations:', result.operations);
        `,
        visualization: true,
        interactive: true
    },
    {
        id: 107,
        title: 'Rabin-Karp Algorithm',
        description: 'String matching algorithm using rolling hash technique.',
        category: 'string',
        timeComplexity: 'O(n + m)',
        spaceComplexity: 'O(1)',
        tags: ['string-matching', 'rolling-hash', 'pattern-search'],
        difficulty: 'Medium',
        code: `
function rabinKarp(text, pattern, prime = 101) {
    const textLen = text.length;
    const patternLen = pattern.length;
    const base = 256; // Number of characters in alphabet
    
    if (patternLen > textLen) return [];
    
    let patternHash = 0;
    let textHash = 0;
    let h = 1;
    const matches = [];
    
    // Calculate h = base^(patternLen-1) % prime
    for (let i = 0; i < patternLen - 1; i++) {
        h = (h * base) % prime;
    }
    
    // Calculate hash for pattern and first window of text
    for (let i = 0; i < patternLen; i++) {
        patternHash = (base * patternHash + pattern.charCodeAt(i)) % prime;
        textHash = (base * textHash + text.charCodeAt(i)) % prime;
    }
    
    // Slide the pattern over text one by one
    for (let i = 0; i <= textLen - patternLen; i++) {
        // Check if hash values match
        if (patternHash === textHash) {
            // Check characters one by one
            let match = true;
            for (let j = 0; j < patternLen; j++) {
                if (text[i + j] !== pattern[j]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                matches.push(i);
            }
        }
        
        // Calculate hash for next window
        if (i < textLen - patternLen) {
            textHash = (base * (textHash - text.charCodeAt(i) * h) + 
                       text.charCodeAt(i + patternLen)) % prime;
            
            // Make sure hash is positive
            if (textHash < 0) {
                textHash += prime;
            }
        }
    }
    
    return matches;
}

// Advanced version with multiple pattern search
function rabinKarpMultiple(text, patterns, prime = 101) {
    const results = {};
    const base = 256;
    
    patterns.forEach(pattern => {
        results[pattern] = rabinKarp(text, pattern, prime);
    });
    
    return results;
}

// Example usage
const text = "GEEKS FOR GEEKS";
const pattern = "GEEK";
console.log('Pattern found at positions:', rabinKarp(text, pattern));

const patterns = ["GEEK", "FOR", "EEK"];
console.log('Multiple patterns:', rabinKarpMultiple(text, patterns));
        `,
        visualization: true
    },
    {
        id: 108,
        title: 'Trie (Prefix Tree)',
        description: 'Efficient data structure for storing and searching strings with common prefixes.',
        category: 'string',
        timeComplexity: 'O(m)',
        spaceComplexity: 'O(ALPHABET_SIZE × N × M)',
        tags: ['data-structure', 'string-search', 'prefix-tree'],
        difficulty: 'Medium',
        code: `
class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.count = 0; // Number of words ending at this node
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    insert(word) {
        let current = this.root;
        
        for (const char of word) {
            if (!current.children[char]) {
                current.children[char] = new TrieNode();
            }
            current = current.children[char];
        }
        
        current.isEndOfWord = true;
        current.count++;
    }
    
    search(word) {
        let current = this.root;
        
        for (const char of word) {
            if (!current.children[char]) {
                return false;
            }
            current = current.children[char];
        }
        
        return current.isEndOfWord;
    }
    
    startsWith(prefix) {
        let current = this.root;
        
        for (const char of prefix) {
            if (!current.children[char]) {
                return false;
            }
            current = current.children[char];
        }
        
        return true;
    }
    
    delete(word) {
        return this.deleteHelper(this.root, word, 0);
    }
    
    deleteHelper(node, word, index) {
        if (index === word.length) {
            if (!node.isEndOfWord) {
                return false;
            }
            node.isEndOfWord = false;
            node.count--;
            return Object.keys(node.children).length === 0;
        }
        
        const char = word[index];
        const childNode = node.children[char];
        
        if (!childNode) {
            return false;
        }
        
        const shouldDeleteChild = this.deleteHelper(childNode, word, index + 1);
        
        if (shouldDeleteChild) {
            delete node.children[char];
            return !node.isEndOfWord && Object.keys(node.children).length === 0;
        }
        
        return false;
    }
    
    getAllWords() {
        const words = [];
        this.getAllWordsHelper(this.root, '', words);
        return words;
    }
    
    getAllWordsHelper(node, prefix, words) {
        if (node.isEndOfWord) {
            words.push(prefix);
        }
        
        for (const char in node.children) {
            this.getAllWordsHelper(node.children[char], prefix + char, words);
        }
    }
    
    getWordsWithPrefix(prefix) {
        let current = this.root;
        
        // Navigate to the end of prefix
        for (const char of prefix) {
            if (!current.children[char]) {
                return [];
            }
            current = current.children[char];
        }
        
        // Get all words from this point
        const words = [];
        this.getAllWordsHelper(current, prefix, words);
        return words;
    }
}

// Example usage
const trie = new Trie();

// Insert words
const words = ["cat", "car", "card", "care", "careful", "cars", "carry"];
words.forEach(word => trie.insert(word));

console.log('Search "car":', trie.search("car"));
console.log('Search "card":', trie.search("card"));
console.log('Search "cardboard":', trie.search("cardboard"));

console.log('Starts with "car":', trie.startsWith("car"));
console.log('Words with prefix "car":', trie.getWordsWithPrefix("car"));

console.log('All words:', trie.getAllWords());
        `,
        visualization: true,
        interactive: true
    },
    {
        id: 109,
        title: 'AVL Tree',
        description: 'Self-balancing binary search tree with guaranteed O(log n) operations.',
        category: 'tree',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(n)',
        tags: ['data-structure', 'balanced-tree', 'self-balancing'],
        difficulty: 'Hard',
        code: `
class AVLNode {
    constructor(key) {
        this.key = key;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
    }
    
    getHeight(node) {
        return node ? node.height : 0;
    }
    
    getBalance(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }
    
    updateHeight(node) {
        if (node) {
            node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        }
    }
    
    rotateRight(y) {
        const x = y.left;
        const T2 = x.right;
        
        // Perform rotation
        x.right = y;
        y.left = T2;
        
        // Update heights
        this.updateHeight(y);
        this.updateHeight(x);
        
        return x;
    }
    
    rotateLeft(x) {
        const y = x.right;
        const T2 = y.left;
        
        // Perform rotation
        y.left = x;
        x.right = T2;
        
        // Update heights
        this.updateHeight(x);
        this.updateHeight(y);
        
        return y;
    }
    
    insert(key) {
        this.root = this.insertHelper(this.root, key);
    }
    
    insertHelper(node, key) {
        // 1. Perform normal BST insertion
        if (!node) {
            return new AVLNode(key);
        }
        
        if (key < node.key) {
            node.left = this.insertHelper(node.left, key);
        } else if (key > node.key) {
            node.right = this.insertHelper(node.right, key);
        } else {
            return node; // Equal keys not allowed
        }
        
        // 2. Update height of current node
        this.updateHeight(node);
        
        // 3. Get balance factor
        const balance = this.getBalance(node);
        
        // 4. Perform rotations if needed
        
        // Left Left Case
        if (balance > 1 && key < node.left.key) {
            return this.rotateRight(node);
        }
        
        // Right Right Case
        if (balance < -1 && key > node.right.key) {
            return this.rotateLeft(node);
        }
        
        // Left Right Case
        if (balance > 1 && key > node.left.key) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }
        
        // Right Left Case
        if (balance < -1 && key < node.right.key) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }
        
        return node;
    }
    
    delete(key) {
        this.root = this.deleteHelper(this.root, key);
    }
    
    deleteHelper(node, key) {
        // 1. Perform normal BST deletion
        if (!node) {
            return node;
        }
        
        if (key < node.key) {
            node.left = this.deleteHelper(node.left, key);
        } else if (key > node.key) {
            node.right = this.deleteHelper(node.right, key);
        } else {
            // Node to be deleted found
            if (!node.left || !node.right) {
                const temp = node.left || node.right;
                
                if (!temp) {
                    // No child case
                    node = null;
                } else {
                    // One child case
                    node = temp;
                }
            } else {
                // Two children case
                const temp = this.getMinValueNode(node.right);
                node.key = temp.key;
                node.right = this.deleteHelper(node.right, temp.key);
            }
        }
        
        if (!node) {
            return node;
        }
        
        // 2. Update height
        this.updateHeight(node);
        
        // 3. Get balance factor
        const balance = this.getBalance(node);
        
        // 4. Perform rotations if needed
        
        // Left Left Case
        if (balance > 1 && this.getBalance(node.left) >= 0) {
            return this.rotateRight(node);
        }
        
        // Left Right Case
        if (balance > 1 && this.getBalance(node.left) < 0) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }
        
        // Right Right Case
        if (balance < -1 && this.getBalance(node.right) <= 0) {
            return this.rotateLeft(node);
        }
        
        // Right Left Case
        if (balance < -1 && this.getBalance(node.right) > 0) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }
        
        return node;
    }
    
    getMinValueNode(node) {
        let current = node;
        while (current.left) {
            current = current.left;
        }
        return current;
    }
    
    inorderTraversal() {
        const result = [];
        this.inorderHelper(this.root, result);
        return result;
    }
    
    inorderHelper(node, result) {
        if (node) {
            this.inorderHelper(node.left, result);
            result.push(node.key);
            this.inorderHelper(node.right, result);
        }
    }
    
    search(key) {
        return this.searchHelper(this.root, key);
    }
    
    searchHelper(node, key) {
        if (!node || node.key === key) {
            return node;
        }
        
        if (key < node.key) {
            return this.searchHelper(node.left, key);
        }
        
        return this.searchHelper(node.right, key);
    }
}

// Example usage
const avl = new AVLTree();

// Insert values
const values = [10, 20, 30, 40, 50, 25];
values.forEach(val => {
    avl.insert(val);
    console.log(\`Inserted \${val}, tree: \`, avl.inorderTraversal());
});

console.log('Search 30:', avl.search(30) ? 'Found' : 'Not found');
console.log('Search 35:', avl.search(35) ? 'Found' : 'Not found');

// Delete a value
avl.delete(30);
console.log('After deleting 30:', avl.inorderTraversal());
        `,
        visualization: true
    },
    {
        id: 110,
        title: 'Maximum Subarray (Kadane\'s Algorithm)',
        description: 'Find the contiguous subarray with the largest sum in O(n) time.',
        category: 'array',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        tags: ['dynamic-programming', 'array', 'optimization'],
        difficulty: 'Medium',
        code: `
function maxSubarraySum(arr) {
    if (arr.length === 0) return 0;
    
    let maxSoFar = arr[0];
    let maxEndingHere = arr[0];
    let start = 0;
    let end = 0;
    let tempStart = 0;
    
    for (let i = 1; i < arr.length; i++) {
        if (maxEndingHere < 0) {
            maxEndingHere = arr[i];
            tempStart = i;
        } else {
            maxEndingHere += arr[i];
        }
        
        if (maxSoFar < maxEndingHere) {
            maxSoFar = maxEndingHere;
            start = tempStart;
            end = i;
        }
    }
    
    return {
        maxSum: maxSoFar,
        startIndex: start,
        endIndex: end,
        subarray: arr.slice(start, end + 1)
    };
}

// Handle all negative numbers case
function maxSubarraySumAllNegative(arr) {
    if (arr.length === 0) return 0;
    
    let maxSoFar = -Infinity;
    let maxEndingHere = 0;
    let start = 0;
    let end = 0;
    let tempStart = 0;
    
    for (let i = 0; i < arr.length; i++) {
        maxEndingHere += arr[i];
        
        if (maxSoFar < maxEndingHere) {
            maxSoFar = maxEndingHere;
            start = tempStart;
            end = i;
        }
        
        if (maxEndingHere < 0) {
            maxEndingHere = 0;
            tempStart = i + 1;
        }
    }
    
    return {
        maxSum: maxSoFar,
        startIndex: start,
        endIndex: end,
        subarray: arr.slice(start, end + 1)
    };
}

// Maximum subarray of size k
function maxSubarrayOfSizeK(arr, k) {
    if (k > arr.length) return null;
    
    // Calculate sum of first k elements
    let windowSum = 0;
    for (let i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    
    let maxSum = windowSum;
    let maxStart = 0;
    
    // Use sliding window technique
    for (let i = k; i < arr.length; i++) {
        windowSum = windowSum - arr[i - k] + arr[i];
        if (windowSum > maxSum) {
            maxSum = windowSum;
            maxStart = i - k + 1;
        }
    }
    
    return {
        maxSum: maxSum,
        startIndex: maxStart,
        endIndex: maxStart + k - 1,
        subarray: arr.slice(maxStart, maxStart + k)
    };
}

// Example usage
const arr1 = [-2, -3, 4, -1, -2, 1, 5, -3];
console.log('Array:', arr1);
console.log('Max subarray:', maxSubarraySum(arr1));

const arr2 = [-2, -3, -1, -5];
console.log('All negative array:', arr2);
console.log('Max subarray:', maxSubarraySumAllNegative(arr2));

const arr3 = [1, 4, 2, 10, 23, 3, 1, 0, 20];
console.log('Max subarray of size 4:', maxSubarrayOfSizeK(arr3, 4));
        `,
        visualization: true,
        interactive: true
    }
];

// Algorithm visualization helpers
function createAlgorithmVisualization(algorithmId) {
    const algorithm = ADVANCED_ALGORITHMS.find(algo => algo.id === algorithmId);
    if (!algorithm || !algorithm.visualization) return null;
    
    const visualizationContainer = document.createElement('div');
    visualizationContainer.className = 'algorithm-visualization';
    visualizationContainer.innerHTML = `
        <h4>Algorithm Visualization</h4>
        <div class="visualization-controls">
            <button class="btn btn-primary" onclick="startVisualization(${algorithmId})">Start</button>
            <button class="btn btn-secondary" onclick="resetVisualization(${algorithmId})">Reset</button>
            <button class="btn btn-secondary" onclick="stepVisualization(${algorithmId})">Step</button>
        </div>
        <div class="visualization-canvas" id="canvas-${algorithmId}">
            <p>Click "Start" to begin visualization</p>
        </div>
    `;
    
    return visualizationContainer;
}

// Interactive algorithm playground
function createInteractivePlayground(algorithmId) {
    const algorithm = ADVANCED_ALGORITHMS.find(algo => algo.id === algorithmId);
    if (!algorithm || !algorithm.interactive) return null;
    
    const playgroundContainer = document.createElement('div');
    playgroundContainer.className = 'algorithm-playground';
    playgroundContainer.innerHTML = `
        <h4>Interactive Playground</h4>
        <div class="playground-controls">
            <div class="form-group">
                <label>Input Data:</label>
                <input type="text" id="input-${algorithmId}" placeholder="Enter input data">
            </div>
            <button class="btn btn-primary" onclick="runAlgorithm(${algorithmId})">Run Algorithm</button>
        </div>
        <div class="playground-output" id="output-${algorithmId}">
            <p>Enter input data and click "Run Algorithm" to see results</p>
        </div>
    `;
    
    return playgroundContainer;
}

// Enhanced algorithm display
function displayAlgorithmDetails(algorithmId) {
    const algorithm = ADVANCED_ALGORITHMS.find(algo => algo.id === algorithmId);
    if (!algorithm) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal algorithm-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${algorithm.title}</h2>
                <div class="algorithm-badges">
                    <span class="badge badge-${algorithm.difficulty.toLowerCase()}">${algorithm.difficulty}</span>
                    <span class="badge badge-category">${ALGORITHM_CATEGORIES[algorithm.category].name}</span>
                </div>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="algorithm-info">
                    <p class="algorithm-description">${algorithm.description}</p>
                    <div class="complexity-info">
                        <div class="complexity-item">
                            <strong>Time Complexity:</strong> ${algorithm.timeComplexity}
                        </div>
                        <div class="complexity-item">
                            <strong>Space Complexity:</strong> ${algorithm.spaceComplexity}
                        </div>
                    </div>
                    <div class="algorithm-tags">
                        ${algorithm.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="algorithm-code">
                    <h3>Implementation</h3>
                    <pre><code class="language-javascript">${algorithm.code}</code></pre>
                </div>
                <div class="algorithm-extras">
                    ${algorithm.visualization ? '<div id="visualization-container"></div>' : ''}
                    ${algorithm.interactive ? '<div id="playground-container"></div>' : ''}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add visualization if available
    if (algorithm.visualization) {
        const visualizationContainer = document.getElementById('visualization-container');
        const visualization = createAlgorithmVisualization(algorithmId);
        if (visualization) {
            visualizationContainer.appendChild(visualization);
        }
    }
    
    // Add interactive playground if available
    if (algorithm.interactive) {
        const playgroundContainer = document.getElementById('playground-container');
        const playground = createInteractivePlayground(algorithmId);
        if (playground) {
            playgroundContainer.appendChild(playground);
        }
    }
    
    // Add enhanced modal styles
    if (!document.getElementById('algorithm-modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'algorithm-modal-styles';
        modalStyles.textContent = `
            .algorithm-modal .modal-content {
                max-width: 900px;
                max-height: 90vh;
                overflow-y: auto;
            }
            .algorithm-badges {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }
            .badge-easy { background: #10b981; color: white; }
            .badge-medium { background: #f59e0b; color: white; }
            .badge-hard { background: #ef4444; color: white; }
            .badge-category { background: #6366f1; color: white; }
            .algorithm-info {
                margin-bottom: 2rem;
            }
            .algorithm-description {
                font-size: 1.1rem;
                margin-bottom: 1rem;
                color: #4b5563;
            }
            .complexity-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-bottom: 1rem;
                padding: 1rem;
                background: #f9fafb;
                border-radius: 8px;
            }
            .complexity-item {
                font-size: 0.9rem;
            }
            .algorithm-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            .tag {
                background: #e5e7eb;
                color: #374151;
                padding: 0.25rem 0.75rem;
                border-radius: 15px;
                font-size: 0.8rem;
            }
            .algorithm-code {
                margin-bottom: 2rem;
            }
            .algorithm-code pre {
                background: #1f2937;
                color: #f9fafb;
                padding: 1.5rem;
                border-radius: 8px;
                overflow-x: auto;
                font-size: 0.9rem;
                line-height: 1.6;
            }
            .algorithm-visualization, .algorithm-playground {
                margin-top: 2rem;
                padding: 1.5rem;
                background: #f9fafb;
                border-radius: 8px;
            }
            .visualization-controls, .playground-controls {
                display: flex;
                gap: 1rem;
                margin-bottom: 1rem;
                align-items: center;
            }
            .visualization-canvas, .playground-output {
                min-height: 200px;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 1rem;
                font-family: monospace;
            }
        `;
        document.head.appendChild(modalStyles);
    }
}

// Placeholder functions for visualization and interactivity
function startVisualization(algorithmId) {
    const canvas = document.getElementById(`canvas-${algorithmId}`);
    canvas.innerHTML = '<p>Visualization starting... (This would show algorithm steps)</p>';
}

function resetVisualization(algorithmId) {
    const canvas = document.getElementById(`canvas-${algorithmId}`);
    canvas.innerHTML = '<p>Visualization reset. Click "Start" to begin.</p>';
}

function stepVisualization(algorithmId) {
    const canvas = document.getElementById(`canvas-${algorithmId}`);
    canvas.innerHTML = '<p>Stepping through algorithm... (This would show next step)</p>';
}

function runAlgorithm(algorithmId) {
    const input = document.getElementById(`input-${algorithmId}`).value;
    const output = document.getElementById(`output-${algorithmId}`);
    
    if (!input.trim()) {
        output.innerHTML = '<p style="color: red;">Please enter input data.</p>';
        return;
    }
    
    // This would actually run the algorithm with the input
    output.innerHTML = `<p>Running algorithm with input: "${input}"</p><p>Result: (This would show actual algorithm output)</p>`;
}

// Override the original getAlgorithmsData to include advanced algorithms
function getAlgorithmsData() {
    // Get the original algorithms
    const originalAlgorithms = [
        {
            id: 1,
            title: 'Quick Sort',
            description: 'Efficient divide-and-conquer sorting algorithm with average O(n log n) time complexity.',
            category: 'sorting',
            timeComplexity: 'O(n log n)',
            spaceComplexity: 'O(log n)',
            tags: ['sorting', 'divide-conquer', 'recursive'],
            difficulty: 'Medium',
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
            difficulty: 'Hard',
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
            difficulty: 'Medium',
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
            difficulty: 'Medium',
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
    
    // Combine with advanced algorithms
    const allAlgorithms = [...originalAlgorithms, ...ADVANCED_ALGORITHMS];
    
    // Get custom algorithms from localStorage
    const customAlgorithms = JSON.parse(localStorage.getItem('customAlgorithms') || '[]');
    
    return [...allAlgorithms, ...customAlgorithms];
}

// Enhanced algorithm view function
function viewAlgorithm(algorithmId) {
    displayAlgorithmDetails(algorithmId);
}

// Export advanced algorithms functions
window.advancedAlgorithmsApp = {
    displayAlgorithmDetails,
    startVisualization,
    resetVisualization,
    stepVisualization,
    runAlgorithm,
    ADVANCED_ALGORITHMS,
    ALGORITHM_CATEGORIES
};