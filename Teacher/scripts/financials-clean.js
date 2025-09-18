// EduLMS Teacher Financial Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeMobileMenu();
    initializeRevenueChart();
    initializeSearchFunctionality();
    initializeInteractiveElements();
    initializeQuickActions();
    updateDashboardData();
});

// Mobile Menu Toggle
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }
}

// Revenue Analytics Chart
function initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    const revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            datasets: [
                {
                    label: 'Total Revenue',
                    data: [8200, 9100, 8800, 10500, 11200, 10800, 12100, 11800, 12450],
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: '#3b82f6',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                },
                {
                    label: 'Payments Received',
                    data: [6800, 7500, 7200, 8200, 8900, 8500, 9300, 9100, 8920],
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderColor: '#10b981',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                },
                {
                    label: 'Pending Payments',
                    data: [1400, 1600, 1600, 2300, 2300, 2300, 2800, 2700, 3530],
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderColor: '#f59e0b',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#f59e0b',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: '#e2e8f0',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        color: '#64748b'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9',
                        drawBorder: false
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        color: '#64748b',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Search Functionality
function initializeSearchFunctionality() {
    const searchInput = document.querySelector('input[placeholder="Search transactions..."]');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const tableRows = document.querySelectorAll('.payment-analysis-section tbody tr');
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
}

// Interactive Elements
function initializeInteractiveElements() {
    // Chart period controls
    const chartControls = document.querySelectorAll('.chart-controls .btn');
    chartControls.forEach(button => {
        button.addEventListener('click', function() {
            chartControls.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Here you would typically update the chart data based on the selected period
            console.log('Chart period changed to:', this.textContent);
        });
    });
    
    // Table action buttons
    const actionButtons = document.querySelectorAll('table .btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            const row = this.closest('tr');
            const studentName = row.querySelector('.student-name').textContent;
            
            switch(action) {
                case 'View':
                    showPaymentDetails(studentName);
                    break;
                case 'Follow Up':
                    sendFollowUpReminder(studentName);
                    break;
                case 'Remind':
                    sendPaymentReminder(studentName);
                    break;
            }
        });
    });
    
    // Stat cards hover effects
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Quick Actions
function initializeQuickActions() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            
            switch(action) {
                case 'Generate Invoice':
                    generateInvoice();
                    break;
                case 'Send Reminders':
                    sendBulkReminders();
                    break;
                case 'Export Report':
                    exportFinancialReport();
                    break;
                case 'Payment Settings':
                    openPaymentSettings();
                    break;
            }
        });
    });
}

// Update Dashboard Data
function updateDashboardData() {
    // Simulate real-time data updates
    setInterval(() => {
        // Update last updated time
        const timeElements = document.querySelectorAll('.last-updated');
        timeElements.forEach(element => {
            element.textContent = 'Last updated: ' + new Date().toLocaleTimeString();
        });
    }, 30000); // Update every 30 seconds
}

// Helper Functions
function showPaymentDetails(studentName) {
    alert(`Viewing payment details for ${studentName}`);
    // In a real application, you would open a modal or navigate to a detail page
}

function sendFollowUpReminder(studentName) {
    alert(`Follow-up reminder sent to ${studentName}`);
    // In a real application, you would make an API call to send the reminder
}

function sendPaymentReminder(studentName) {
    alert(`Payment reminder sent to ${studentName}`);
    // In a real application, you would make an API call to send the reminder
}

function generateInvoice() {
    alert('Generating invoice...');
    // In a real application, you would generate and download an invoice
}

function sendBulkReminders() {
    alert('Sending bulk payment reminders...');
    // In a real application, you would send reminders to all students with pending payments
}

function exportFinancialReport() {
    alert('Exporting financial report...');
    // In a real application, you would generate and download a financial report
}

function openPaymentSettings() {
    alert('Opening payment settings...');
    // In a real application, you would navigate to payment settings page
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

function calculatePercentageChange(current, previous) {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}

// Animation for number counting
function animateValue(element, start, end, duration) {
    if (!element) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = formatCurrency(value);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize number animations when the page loads
function initializeNumberAnimations() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach((element, index) => {
        const finalValue = parseInt(element.textContent.replace(/[^\d]/g, ''));
        setTimeout(() => {
            animateValue(element, 0, finalValue, 2000);
        }, index * 200);
    });
}

// Call number animations after a short delay
setTimeout(initializeNumberAnimations, 500);