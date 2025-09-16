// EduLMS Dashboard JavaScript

// Initialize Charts and Activity Grid
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard scripts loaded');

    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded!');
        return;
    }
    console.log('Chart.js is available');

    // Generate Activity Grid
    generateActivityGrid();

    // Initialize Charts
    console.log('Initializing charts...');
    initializeRevenueChart();
    initializeEnrollmentChart();
    initializeTopCoursesChart();
    console.log('Charts initialization complete');
}); // Generate Activity Grid Function
function generateActivityGrid() {
    const activityGrid = document.querySelector('.activity-grid');
    if (!activityGrid) return;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const times = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm'];

    days.forEach(day => {
        const dayLabel = document.createElement('div');
        dayLabel.textContent = day;
        dayLabel.style.textAlign = 'center';
        dayLabel.style.fontSize = '0.75rem';
        dayLabel.style.color = '#64748b';
        activityGrid.appendChild(dayLabel);
    });

    times.forEach(time => {
        const timeLabel = document.createElement('div');
        timeLabel.textContent = time;
        timeLabel.style.fontSize = '0.75rem';
        timeLabel.style.color = '#64748b';
        timeLabel.style.textAlign = 'right';
        timeLabel.style.marginRight = '8px';
        activityGrid.appendChild(timeLabel);

        for (let i = 0; i < 6; i++) {
            const cell = document.createElement('div');
            cell.className = 'activity-cell';
            const level = Math.floor(Math.random() * 5);
            if (level > 0) cell.classList.add(`level-${level}`);
            activityGrid.appendChild(cell);
        }
    });
}

// Revenue Chart
function initializeRevenueChart() {
    console.log('Initializing Revenue Chart...');
    const revenueCtx = document.getElementById('revenueChart');
    if (!revenueCtx) {
        console.error('Revenue chart canvas not found!');
        return;
    }
    console.log('Revenue chart canvas found, creating chart...');

    new Chart(revenueCtx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Income',
                data: [3000, 5000, 4000, 7000, 6000, 8000, 10548],
                borderColor: '#ec4899',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Expense',
                data: [2000, 3000, 3500, 4000, 4500, 5000, 6000],
                borderColor: '#64748b',
                backgroundColor: 'rgba(100, 116, 139, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Enrollment Chart
function initializeEnrollmentChart() {
    console.log('Initializing Enrollment Chart...');
    const enrollmentCtx = document.getElementById('enrollmentChart');
    if (!enrollmentCtx) {
        console.error('Enrollment chart canvas not found!');
        return;
    }
    console.log('Enrollment chart canvas found, creating chart...');

    new Chart(enrollmentCtx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Enrollments',
                data: [400, 500, 600, 800, 700, 650, 850],
                backgroundColor: [
                    '#ec4899',
                    '#ec4899',
                    '#ec4899',
                    '#f59e0b',
                    '#ec4899',
                    '#ec4899',
                    '#ec4899'
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Top Courses Doughnut Chart
function initializeTopCoursesChart() {
    const topCoursesCtx = document.getElementById('topCoursesChart');
    if (!topCoursesCtx) return;

    new Chart(topCoursesCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Graphic Design', 'Digital Marketing', 'Python'],
            datasets: [{
                data: [36, 30, 25],
                backgroundColor: ['#ec4899', '#8b5cf6', '#f59e0b'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            cutout: '70%'
        }
    });
}

// Additional utility functions
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('show');
    }
}

// Calendar navigation functions
function previousMonth() {
    // Calendar navigation logic here
    console.log('Previous month clicked');
}

function nextMonth() {
    // Calendar navigation logic here
    console.log('Next month clicked');
}

// Search functionality
function handleSearch(event) {
    const searchTerm = event.target.value;
    console.log('Searching for:', searchTerm);
    // Add search logic here
}

// Notification handling
function handleNotificationClick() {
    console.log('Notifications clicked');
    // Add notification logic here
}