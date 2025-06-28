// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check for notification permission
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    // Initialize features
    setupNavbarEffects();
    setupMatchCardEffects();
    setupNewsCardEffects();
    setupReminderSystem();
});

// UI Effects
function setupNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.style.backgroundColor = 'rgba(26, 71, 42, 0.95)';
        } else {
            navbar.style.backgroundColor = 'var(--primary-color)';
        }

        if (currentScroll > lastScroll && currentScroll > 300) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

function setupMatchCardEffects() {
    const matchCards = document.querySelectorAll('.match-card');
    matchCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--card-shadow)';
        });
    });
}

function setupNewsCardEffects() {
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Reminder System
function setupReminderSystem() {
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    const reminderButtons = document.querySelectorAll('.reminder-btn');

    reminderButtons.forEach(button => {
        const matchCard = button.closest('.match-card');
        if (!matchCard) return;

        const matchData = {
            id: generateMatchId(matchCard),
            teams: matchCard.querySelector('h3').textContent,
            date: matchCard.querySelector('.date').textContent,
            time: matchCard.querySelector('.time').textContent
        };

        // Set initial state
        const hasReminder = reminders.some(r => r.id === matchData.id);
        if (hasReminder) {
            button.classList.add('active');
            button.innerHTML = '<i class="fas fa-bell"></i>';
        }

        // Add click handler
        button.addEventListener('click', () => {
            const isActive = button.classList.toggle('active');
            if (isActive) {
                addReminder(matchData);
                button.innerHTML = '<i class="fas fa-bell"></i>';
                showNotification('Reminder set for 24 hours before the match');
            } else {
                removeReminder(matchData.id);
                button.innerHTML = '<i class="far fa-bell"></i>';
                showNotification('Reminder removed');
            }
        });
    });

    // Schedule existing reminders
    reminders.forEach(reminder => {
        scheduleReminder(reminder);
    });
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
}

function scheduleReminder(matchData) {
    const matchDateTime = parseDateTime(matchData.date, matchData.time);
    const reminderTime = new Date(matchDateTime.getTime() - (24 * 60 * 60 * 1000));

    if (reminderTime > new Date()) {
        const timeUntilReminder = reminderTime.getTime() - new Date().getTime();
        setTimeout(() => {
            showNotification(`Reminder: ${matchData.teams} match starts in 24 hours!`);
        }, timeUntilReminder);
    }
}

// Utility Functions
function generateMatchId(matchCard) {
    const teams = matchCard.querySelector('h3').textContent;
    const date = matchCard.querySelector('.date').textContent;
    return `${teams}-${date}`.replace(/\s+/g, '-');
}

function parseDateTime(dateStr, timeStr) {
    const [month, day, year] = dateStr.split(' ');
    const [time, period] = timeStr.split(' ');
    return new Date(`${month} ${day.replace(',', '')} ${year} ${time} ${period}`);
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
