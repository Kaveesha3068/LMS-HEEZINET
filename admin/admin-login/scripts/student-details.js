// ===== STUDENT DETAILS PAGE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    sidebar.classList.remove('show');
                }
            }
        });
    }
    
    // Initialize Charts
    initializeCharts();
    
    // Search functionality
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', function() {
            // Implement global search functionality here
            console.log('Global search:', this.value);
        });
    }
    
    // Action button functionality
    const chatBtn = document.querySelector('.btn-message');
    const callBtn = document.querySelector('.btn-call');
    const emailBtn = document.querySelector('.btn-email');
    
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            console.log('Opening chat with Ava Mitchell...');
            // Implement chat functionality
        });
    }
    
    if (callBtn) {
        callBtn.addEventListener('click', function() {
            console.log('Calling Ava Mitchell...');
            // Implement call functionality
        });
    }
    
    if (emailBtn) {
        emailBtn.addEventListener('click', function() {
            console.log('Composing email to Ava Mitchell...');
            // Implement email functionality
        });
    }
    
    // Edit button functionality
    const editBtn = document.querySelector('.btn-edit');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            console.log('Editing social media links...');
            // Implement edit functionality
        });
    }
    
    // Upgrade button functionality
    const upgradeBtn = document.querySelector('.btn-upgrade');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', function() {
            console.log('Upgrading to Pro...');
            // Implement upgrade functionality
        });
    }
    
    // Sign out button functionality
    const signOutBtn = document.querySelector('.btn-sign-out');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', function() {
            console.log('Signing out...');
            // Implement sign out functionality
        });
    }
    
    // Course action buttons
    const courseActions = document.querySelectorAll('.course-action');
    courseActions.forEach(action => {
        action.addEventListener('click', function() {
            const courseItem = this.closest('.course-item');
            const courseName = courseItem.querySelector('.course-details h5').textContent;
            console.log('Course action clicked for:', courseName);
            // Implement course action menu
        });
    });
});

function initializeCharts() {
    // Learning Activity Bar Chart
    const learningCtx = document.getElementById('learningActivityChart');
    if (learningCtx) {
        new Chart(learningCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    data: [8, 12, 6, 15, 10, 8, 5],
                    backgroundColor: [
                        '#fbbf24', '#f59e0b', '#fbbf24', '#ec4899', 
                        '#f472b6', '#ec4899', '#a855f7'
                    ],
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { 
                        display: false,
                        grid: { display: false }
                    },
                    y: { 
                        display: false,
                        beginAtZero: true,
                        grid: { display: false }
                    }
                },
                elements: {
                    bar: {
                        borderRadius: 4
                    }
                }
            }
        });
    }
    
    // Performance Doughnut Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [65, 85, 75],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                    borderWidth: 0,
                    cutout: '70%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    // Performance Line Chart
    const performanceLineCtx = document.getElementById('performanceLineChart');
    if (performanceLineCtx) {
        new Chart(performanceLineCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    data: [75, 80, 78, 85, 82, 88],
                    borderColor: '#ec4899',
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false, beginAtZero: true }
                }
            }
        });
    }
}

// Utility Functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function updateProgress(elementId, percentage) {
    const progressFill = document.querySelector(`#${elementId} .progress-fill`);
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
}

function animateCounter(elementId, targetValue, duration = 1000) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = 0;
    const increment = targetValue / (duration / 16);
    let currentValue = startValue;
    
    const counter = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(counter);
        }
        element.textContent = Math.floor(currentValue);
    }, 16);
}

// Resize handler for responsive charts
window.addEventListener('resize', function() {
    // Force chart resize on window resize
    Chart.helpers.each(Chart.instances, function(instance) {
        instance.resize();
    });
});

// Navigation helper
function navigateToPage(page) {
    console.log('Navigating to:', page);
    // Implement navigation logic
}

// Course filter functionality
function filterCourses(status) {
    const courseItems = document.querySelectorAll('.course-item');
    courseItems.forEach(item => {
        const courseStatus = item.querySelector('.course-status').textContent.toLowerCase();
        if (status === 'all' || courseStatus.includes(status.toLowerCase())) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Export functions for external use
window.StudentDetails = {
    filterCourses,
    updateProgress,
    animateCounter,
    navigateToPage
};