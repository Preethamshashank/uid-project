// Rankings Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize rankings
    initializeRankings();
    setupEventListeners();
});

function initializeRankings() {
    // Show default rankings (Test format, Teams category)
    showRankings('test', 'teams');
}

function setupEventListeners() {
    // Format selector buttons
    document.querySelectorAll('.format-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all format buttons
            document.querySelectorAll('.format-btn').forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Show rankings for selected format
            const format = button.dataset.format;
            const activeCategory = document.querySelector('.category-btn.active').dataset.category;
            showRankings(format, activeCategory);
        });
    });

    // Category selector buttons
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all category buttons
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Show rankings for selected category
            const category = button.dataset.category;
            const activeFormat = document.querySelector('.format-btn.active').dataset.format;
            showRankings(activeFormat, category);
        });
    });

    // Add click event to team names for shopping integration
    document.querySelectorAll('.team-flag').forEach(flag => {
        flag.addEventListener('click', (e) => {
            const teamName = e.target.parentElement.textContent.trim();
            navigateToTeamShop(teamName);
        });
    });
}

function showRankings(format, category) {
    // Hide all rankings sections
    document.querySelectorAll('.rankings-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected format section
    const formatSection = document.getElementById(`${format}-rankings`);
    if (formatSection) {
        formatSection.classList.add('active');
    }

    // Hide all tables in the active section
    formatSection.querySelectorAll('.rankings-table').forEach(table => {
        table.classList.remove('active');
    });

    // Show selected category table
    const categoryTable = formatSection.querySelector(`.${category}-table`);
    if (categoryTable) {
        categoryTable.classList.add('active');
    }
}

function navigateToTeamShop(teamName) {
    // Store the selected team in localStorage
    localStorage.setItem('selectedTeam', teamName);
    // Navigate to shopping page
    window.location.href = 'shopping.html';
}

// Add animation to rankings changes
function animateRankingChange(element) {
    element.classList.add('ranking-change');
    setTimeout(() => {
        element.classList.remove('ranking-change');
    }, 1000);
}

// Add hover effect to player names
document.querySelectorAll('tbody tr').forEach(row => {
    row.addEventListener('mouseenter', () => {
        row.style.backgroundColor = '#f0f0f0';
    });
    row.addEventListener('mouseleave', () => {
        row.style.backgroundColor = '';
    });
}); 