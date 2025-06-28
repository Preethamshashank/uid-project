// Node class for the linked list
class NewsNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

// Category Node for managing categories
class CategoryNode {
    constructor(name) {
        this.name = name;
        this.newsHead = null; // Head of the news linked list for this category
        this.next = null;     // Next category in the list
    }
}

// Enhanced News Management System
class NewsSystem {
    constructor() {
        this.categoryHead = null;  // Head of categories linked list
        this.allNewsHead = null;   // Head of all news linked list
        this.nextId = 1;          // Auto-incrementing ID for news
        
        // Initialize default categories
        this.initializeCategories([
            'International',
            'Domestic',
            'T20',
            'Test Cricket',
            'ODI',
            'Player News'
        ]);
    }

    // Initialize categories
    initializeCategories(categoryNames) {
        categoryNames.forEach(name => this.addCategory(name));
    }

    // Add a new category
    addCategory(name) {
        const newCategory = new CategoryNode(name);
        if (!this.categoryHead) {
            this.categoryHead = newCategory;
            return;
        }

        let current = this.categoryHead;
        while (current.next) {
            if (current.name === name) return; // Category already exists
            current = current.next;
        }
        if (current.name !== name) {
            current.next = newCategory;
        }
    }

    // Get all categories
    getCategories() {
        const categories = [];
        let current = this.categoryHead;
        while (current) {
            categories.push(current.name);
            current = current.next;
        }
        return categories;
    }

    // Add news to specific category
    addNews(newsData) {
        // Ensure required fields
        if (!newsData.title || !newsData.content || !newsData.category) {
            throw new Error('News must have title, content, and category');
        }

        // Add ID and timestamp if not present
        const news = {
            ...newsData,
            id: this.nextId++,
            timestamp: newsData.timestamp || new Date().toISOString(),
            views: 0,
            comments: []
        };

        // Create news node
        const newsNode = new NewsNode(news);

        // Add to all news list
        newsNode.next = this.allNewsHead;
        this.allNewsHead = newsNode;

        // Add to category-specific list
        let categoryNode = this.findCategory(news.category);
        if (!categoryNode) {
            this.addCategory(news.category);
            categoryNode = this.findCategory(news.category);
        }

        const categoryNewsNode = new NewsNode(news);
        categoryNewsNode.next = categoryNode.newsHead;
        categoryNode.newsHead = categoryNewsNode;

        return news;
    }

    // Find a category node
    findCategory(categoryName) {
        let current = this.categoryHead;
        while (current) {
            if (current.name.toLowerCase() === categoryName.toLowerCase()) {
                return current;
            }
            current = current.next;
        }
        return null;
    }

    // Get news by category
    getNewsByCategory(categoryName) {
        if (categoryName.toLowerCase() === 'all') {
            return this.getAllNews();
        }

        const category = this.findCategory(categoryName);
        if (!category) return [];

        const news = [];
        let current = category.newsHead;
        while (current) {
            news.push(current.data);
            current = current.next;
        }
        return news;
    }

    // Get all news
    getAllNews() {
        const news = [];
        let current = this.allNewsHead;
        while (current) {
            news.push(current.data);
            current = current.next;
        }
        return news;
    }

    // Search news
    searchNews(query) {
        if (!query) return this.getAllNews();

        const results = [];
        let current = this.allNewsHead;
        const searchTerm = query.toLowerCase();

        while (current) {
            const { title, content, category } = current.data;
            if (
                title.toLowerCase().includes(searchTerm) ||
                content.toLowerCase().includes(searchTerm) ||
                category.toLowerCase().includes(searchTerm)
            ) {
                results.push(current.data);
            }
            current = current.next;
        }
        return results;
    }

    // Delete news by ID
    deleteNews(id) {
        // Delete from all news list
        if (this.allNewsHead && this.allNewsHead.data.id === id) {
            this.allNewsHead = this.allNewsHead.next;
        } else {
            let current = this.allNewsHead;
            while (current && current.next) {
                if (current.next.data.id === id) {
                    current.next = current.next.next;
                    break;
                }
                current = current.next;
            }
        }

        // Delete from category list
        let categoryNode = this.categoryHead;
        while (categoryNode) {
            if (categoryNode.newsHead && categoryNode.newsHead.data.id === id) {
                categoryNode.newsHead = categoryNode.newsHead.next;
            } else {
                let current = categoryNode.newsHead;
                while (current && current.next) {
                    if (current.next.data.id === id) {
                        current.next = current.next.next;
                        break;
                    }
                    current = current.next;
                }
            }
            categoryNode = categoryNode.next;
        }
    }
}

// Initialize the news system
const newsSystem = new NewsSystem();

// Sample news data
const sampleNews = [
    {
        title: "ICC T20 World Cup 2024 Schedule Announced",
        content: "The International Cricket Council has released the complete schedule for T20 World Cup 2024...",
        category: "T20",
        author: "John Smith",
        imageUrl: "path/to/image1.jpg"
    },
    {
        title: "Test Series Victory for India",
        content: "India secures historic test series win against Australia at the Gabba...",
        category: "Test Cricket",
        author: "Sarah Johnson",
        imageUrl: "path/to/image2.jpg"
    },
    {
        title: "Indian Premier League Updates",
        content: "RCB WON the 18TH season of IPL",
        category: "Domestic",
        author: "Me",
        imageUrl: "trophy.jpg"
    }
];

// Add sample news to the system
sampleNews.forEach(news => newsSystem.addNews(news));

// DOM-dependent code
document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('search-input');
    
    // Modal elements
    const addNewsBtn = document.getElementById('add-news-btn');
    const modal = document.getElementById('add-news-modal');
    const closeModal = document.querySelector('.close-modal');
    const addNewsForm = document.getElementById('add-news-form');
    const cancelBtn = document.querySelector('.cancel-btn');

    // Modal functions
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModalHandler() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        addNewsForm.reset();
    }

    // Event listeners for modal
    addNewsBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModalHandler);
    cancelBtn.addEventListener('click', closeModalHandler);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModalHandler();
    });

    // Form submission
    addNewsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newNews = {
            title: document.getElementById('news-title').value,
            content: document.getElementById('news-content').value,
            category: document.getElementById('news-category').value,
            author: document.getElementById('news-author').value,
            imageUrl: document.getElementById('news-image').value
        };

        try {
            newsSystem.addNews(newNews);
            showNotification('News article added successfully!');
            closeModalHandler();
            renderNews(newsSystem.getAllNews());
        } catch (error) {
            showNotification(error.message, 'error');
        }
    });

    // Function to show notifications
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Function to render news
    function renderNews(newsArray) {
        if (!newsContainer) return;
        
        newsContainer.innerHTML = '';
        
        if (newsArray.length === 0) {
            newsContainer.innerHTML = '<p class="no-news">No news found</p>';
            return;
        }

        newsArray.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';
            newsCard.innerHTML = `
                <img src="${news.imageUrl}" alt="${news.title}">
                <div class="news-content">
                    <h3>${news.title}</h3>
                    <p>${news.content}</p>
                    <div class="news-meta">
                        <span class="author">${news.author}</span>
                        <span class="date">${new Date(news.timestamp).toLocaleDateString()}</span>
                        <span class="category">${news.category}</span>
                    </div>
                </div>
            `;
            newsContainer.appendChild(newsCard);
        });
    }

    // Event listener for category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            const filteredNews = newsSystem.getNewsByCategory(category);
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            renderNews(filteredNews);
        });
    });

    // Event listener for search
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            const searchResults = newsSystem.searchNews(searchTerm);
            renderNews(searchResults);
        });
    }

    // Initial render
    renderNews(newsSystem.getAllNews());
}); 