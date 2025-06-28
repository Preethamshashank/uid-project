// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check for notification permission
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    // Initialize features
    setupFilters();
    setupReminderSystem();
    setupTableEffects();
});

// Filter functionality
function setupFilters() {
    const formatFilters = document.querySelectorAll('.format-filter');
    const matchRows = document.querySelectorAll('.match-row');

    formatFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Remove active class from all filters
            formatFilters.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked filter
            filter.classList.add('active');
            
            const selectedFormat = filter.getAttribute('data-format');
            
            // Show/hide matches based on format
            matchRows.forEach(row => {
                const format = row.getAttribute('data-format');
                if (selectedFormat === 'all' || format === selectedFormat) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
}

// Table Effects
function setupTableEffects() {
    const rows = document.querySelectorAll('.match-row');
    rows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = '#f8f9fa';
        });
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = '';
        });
    });
}

// Reminder System
function setupReminderSystem() {
    const reminderButtons = document.querySelectorAll('.reminder-btn');
    
    reminderButtons.forEach(button => {
        const matchRow = button.closest('.match-row');
        if (!matchRow) return;

        const matchData = {
            id: generateMatchId(matchRow),
            teams: matchRow.querySelector('.teams').textContent,
            format: matchRow.querySelector('.match-format').textContent,
            date: matchRow.querySelector('.date').textContent,
            time: matchRow.querySelector('.time').textContent,
            venue: matchRow.querySelector('.venue').textContent
        };

        // Set initial state
        const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        const isReminderSet = reminders.some(r => r.id === matchData.id);
        if (isReminderSet) {
            button.classList.add('active');
            button.innerHTML = '<i class="fas fa-bell"></i>';
        }

        // Add click handler
        button.addEventListener('click', () => {
            const isActive = button.classList.toggle('active');
            if (isActive) {
                addReminder(matchData);
                button.innerHTML = '<i class="fas fa-bell"></i>';
                showNotification('Reminder set for match!');
            } else {
                removeReminder(matchData.id);
                button.innerHTML = '<i class="far fa-bell"></i>';
                showNotification('Reminder removed');
            }
        });
    });
}

function generateMatchId(matchRow) {
    const teams = matchRow.querySelector('.teams').textContent;
    const date = matchRow.querySelector('.date').textContent;
    return `${teams}-${date}`.replace(/\s+/g, '-').toLowerCase();
}

function addReminder(matchData) {
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders.push(matchData);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    scheduleReminder(matchData);
}

function removeReminder(matchId) {
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders = reminders.filter(r => r.id !== matchId);
    localStorage.setItem('reminders', JSON.stringify(reminders));

    // Update button state in match rows
    const matchRows = document.querySelectorAll('.match-row');
    matchRows.forEach(row => {
        if (generateMatchId(row) === matchId) {
            const button = row.querySelector('.reminder-btn');
            button.classList.remove('active');
            button.innerHTML = '<i class="far fa-bell"></i>';
        }
    });
}

function scheduleReminder(matchData) {
    // Convert match date and time to a Date object
    const [date, time] = [matchData.date, matchData.time];
    const matchDateTime = new Date(`${date} ${time}`);
    
    // Schedule reminder 1 hour before the match
    const reminderTime = new Date(matchDateTime.getTime() - 60 * 60 * 1000);
    
    // Only schedule if the reminder time is in the future
    if (reminderTime > new Date()) {
        setTimeout(() => {
            showNotification(`Reminder: ${matchData.teams} match starts in 1 hour!`);
        }, reminderTime - new Date());
    }
}

function showNotification(message) {
    // Browser notification
    if (Notification.permission === 'granted') {
        new Notification('CricRaze', { body: message });
    }

    // UI notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-info-circle"></i>${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
} 