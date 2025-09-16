// Financial Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeMobileMenu();
    initializeCashflowChart();
    initializeIncomeBreakdownChart();
    initializeExpenseBreakdownChart();
    initializeSearchFunctionality();
    initializeInteractiveElements();
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

// Cashflow Chart
function initializeCashflowChart() {
    const ctx = document.getElementById('cashflowChart');
    if (!ctx) return;
    
    const cashflowChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Income',
                    data: [50000, 45000, 55000, 60000, 52000, 58000, 65000, 70000, 62000, 67000, 55000, 60000],
                    backgroundColor: '#f59e0b',
                    borderRadius: 8,
                    borderSkipped: false,
                },
                {
                    label: 'Expenses',
                    data: [30000, 32000, 28000, 35000, 30000, 33000, 38000, 40000, 35000, 37000, 32000, 35000],
                    backgroundColor: '#ec4899',
                    borderRadius: 8,
                    borderSkipped: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    cornerRadius: 8,
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
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    grid: {
                        color: '#f3f4f6',
                        borderDash: [5, 5]
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return '$' + (value / 1000) + 'K';
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Income Breakdown Doughnut Chart
function initializeIncomeBreakdownChart() {
    const ctx = document.getElementById('incomeBreakdownChart');
    if (!ctx) return;
    
    const incomeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Course Sales', 'Subscriptions/Memberships', 'Consultations & Services'],
            datasets: [{
                data: [45, 30, 25],
                backgroundColor: [
                    '#ec4899',
                    '#f59e0b',
                    '#8b5cf6'
                ],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Expense Breakdown Doughnut Chart
function initializeExpenseBreakdownChart() {
    const ctx = document.getElementById('expenseBreakdownChart');
    if (!ctx) return;
    
    const expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Marketing & Ads', 'Software & Tools', 'Platform Maintenance', 'Miscellaneous'],
            datasets: [{
                data: [40, 25, 25, 10],
                backgroundColor: [
                    '#ec4899',
                    '#f59e0b',
                    '#6366f1',
                    '#10b981'
                ],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Search Functionality
function initializeSearchFunctionality() {
    const globalSearch = document.getElementById('globalSearch');
    
    if (globalSearch) {
        globalSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            // Filter transaction rows
            const transactionRows = document.querySelectorAll('.transaction-row');
            transactionRows.forEach(row => {
                const transactionText = row.textContent.toLowerCase();
                if (transactionText.includes(searchTerm)) {
                    row.style.display = 'grid';
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Show "No results" message if no transactions match
            const visibleRows = document.querySelectorAll('.transaction-row[style="display: grid;"], .transaction-row:not([style*="display: none"])');
            const noResultsMessage = document.getElementById('noResultsMessage');
            
            if (visibleRows.length === 0 && searchTerm !== '') {
                if (!noResultsMessage) {
                    const message = document.createElement('div');
                    message.id = 'noResultsMessage';
                    message.className = 'no-results-message';
                    message.innerHTML = `
                        <div style="text-align: center; padding: 40px; color: #6b7280;">
                            <span class="material-symbols-outlined" style="font-size: 48px; opacity: 0.5;">search_off</span>
                            <p style="margin: 16px 0 0 0;">No transactions found for "${searchTerm}"</p>
                        </div>
                    `;
                    document.querySelector('.transactions-table').appendChild(message);
                }
            } else if (noResultsMessage) {
                noResultsMessage.remove();
            }
        });
    }
}

// Interactive Elements
function initializeInteractiveElements() {
    // Sign out button
    const signOutBtn = document.querySelector('.sign-out-btn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to sign out?')) {
                window.location.href = 'login.html';
            }
        });
    }
    
    // Upgrade button
    const upgradeBtn = document.querySelector('.upgrade-btn');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', function() {
            alert('Redirecting to upgrade page...');
        });
    }
    
    // Transaction action buttons
    const moreOptionsButtons = document.querySelectorAll('.more-options');
    moreOptionsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Create dropdown menu
            const existingDropdown = document.querySelector('.options-dropdown');
            if (existingDropdown) {
                existingDropdown.remove();
                return;
            }
            
            const dropdown = document.createElement('div');
            dropdown.className = 'options-dropdown';
            dropdown.innerHTML = `
                <div class="dropdown-item" onclick="viewTransaction()">View Details</div>
                <div class="dropdown-item" onclick="editTransaction()">Edit</div>
                <div class="dropdown-item" onclick="deleteTransaction()">Delete</div>
            `;
            
            // Position dropdown
            const rect = button.getBoundingClientRect();
            dropdown.style.cssText = `
                position: fixed;
                top: ${rect.bottom + 5}px;
                left: ${rect.left - 120}px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                min-width: 140px;
                border: 1px solid #e5e7eb;
            `;
            
            document.body.appendChild(dropdown);
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        const dropdown = document.querySelector('.options-dropdown');
        if (dropdown) {
            dropdown.remove();
        }
    });
    
    // Back arrow functionality
    const backArrow = document.querySelector('.back-arrow');
    if (backArrow) {
        backArrow.addEventListener('click', function() {
            window.history.back();
        });
    }
    
    // Filter controls
    const filterControls = document.querySelectorAll('.time-filter');
    filterControls.forEach(control => {
        control.addEventListener('click', function() {
            // Add filter functionality here
            console.log('Filter clicked:', this.textContent);
        });
    });
}

// Transaction action functions
function viewTransaction() {
    alert('View transaction details');
    document.querySelector('.options-dropdown').remove();
}

function editTransaction() {
    alert('Edit transaction');
    document.querySelector('.options-dropdown').remove();
}

function deleteTransaction() {
    if (confirm('Are you sure you want to delete this transaction?')) {
        alert('Transaction deleted');
    }
    document.querySelector('.options-dropdown').remove();
}

// Window resize handler
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
    }
});

// Add dropdown styles to document
const dropdownStyles = `
    .options-dropdown {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        border: 1px solid #e5e7eb;
        overflow: hidden;
    }
    
    .dropdown-item {
        padding: 12px 16px;
        font-size: 14px;
        color: #374151;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    
    .dropdown-item:hover {
        background-color: #f9fafb;
    }
    
    .dropdown-item:last-child {
        color: #ef4444;
    }
    
    .dropdown-item:last-child:hover {
        background-color: #fef2f2;
    }
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = dropdownStyles;
document.head.appendChild(styleSheet);