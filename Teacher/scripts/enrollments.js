// ===== ENROLLMENTS PAGE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    
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
    
    // Search functionality
    const globalSearch = document.getElementById('globalSearch');
    const tableSearch = document.getElementById('tableSearch');
    const tableBody = document.getElementById('enrollmentsTableBody');
    
    if (tableSearch && tableBody) {
        tableSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = tableBody.querySelectorAll('tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            updateResultsCount();
        });
    }
    
    // Filter functionality
    const filterLinks = document.querySelectorAll('[data-filter]');
    
    filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.getAttribute('data-filter');
            const rows = tableBody.querySelectorAll('tr');
            
            rows.forEach(row => {
                if (filter === 'all') {
                    row.style.display = '';
                } else {
                    const status = row.getAttribute('data-status');
                    if (status === filter) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
            
            updateResultsCount();
            
            // Update filter button text
            const filterBtn = document.querySelector('.filter-dropdown .btn');
            if (filterBtn) {
                const filterText = filter === 'all' ? 'Filter' : this.textContent;
                filterBtn.innerHTML = `<span class="material-symbols-outlined">filter_alt</span> ${filterText}`;
            }
        });
    });
    
    // Sort functionality
    const sortIcons = document.querySelectorAll('.sort-icon');
    
    sortIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const header = this.closest('th');
            const table = header.closest('table');
            const columnIndex = Array.from(header.parentNode.children).indexOf(header);
            const rows = Array.from(tableBody.querySelectorAll('tr'));
            
            // Determine sort direction
            const currentDirection = header.getAttribute('data-sort') || 'asc';
            const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
            
            // Clear all sort indicators
            sortIcons.forEach(ic => {
                ic.textContent = 'unfold_more';
                ic.closest('th').removeAttribute('data-sort');
            });
            
            // Set new sort indicator
            header.setAttribute('data-sort', newDirection);
            this.textContent = newDirection === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
            
            // Sort rows
            rows.sort((a, b) => {
                const aText = a.cells[columnIndex].textContent.trim();
                const bText = b.cells[columnIndex].textContent.trim();
                
                // Handle different data types
                let aValue, bValue;
                
                if (columnIndex === 0) { // Date column
                    aValue = new Date(aText);
                    bValue = new Date(bText);
                } else if (columnIndex === 6) { // Amount column
                    aValue = parseFloat(aText.replace('$', ''));
                    bValue = parseFloat(bText.replace('$', ''));
                } else {
                    aValue = aText.toLowerCase();
                    bValue = bText.toLowerCase();
                }
                
                if (aValue < bValue) return newDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return newDirection === 'asc' ? 1 : -1;
                return 0;
            });
            
            // Re-append sorted rows
            rows.forEach(row => tableBody.appendChild(row));
        });
    });
    
    // Action buttons functionality
    const actionButtons = document.querySelectorAll('.enrollments-table .btn-outline-secondary');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const studentName = row.querySelector('.student-info strong').textContent;
            
            // Create dropdown menu
            const dropdown = document.createElement('div');
            dropdown.className = 'position-absolute bg-white border rounded shadow-sm';
            dropdown.style.cssText = 'right: 0; top: 100%; z-index: 1000; min-width: 150px;';
            dropdown.innerHTML = `
                <div class="py-1">
                    <a href="#" class="dropdown-item px-3 py-2 text-decoration-none d-block">View Details</a>
                    <a href="#" class="dropdown-item px-3 py-2 text-decoration-none d-block">Edit</a>
                    <a href="#" class="dropdown-item px-3 py-2 text-decoration-none d-block">Send Message</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item px-3 py-2 text-decoration-none d-block text-danger">Remove</a>
                </div>
            `;
            
            // Remove existing dropdowns
            document.querySelectorAll('.position-absolute.bg-white').forEach(el => el.remove());
            
            // Position and show dropdown
            this.parentElement.style.position = 'relative';
            this.parentElement.appendChild(dropdown);
            
            // Close dropdown when clicking outside
            setTimeout(() => {
                document.addEventListener('click', function closeDropdown(e) {
                    if (!dropdown.contains(e.target)) {
                        dropdown.remove();
                        document.removeEventListener('click', closeDropdown);
                    }
                });
            }, 100);
        });
    });
    
    // Pagination functionality
    const paginationLinks = document.querySelectorAll('.pagination .page-link');
    
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.getAttribute('aria-label') === 'Previous' || 
                this.getAttribute('aria-label') === 'Next') {
                // Handle prev/next logic here
                console.log('Navigate to', this.getAttribute('aria-label'));
            } else if (this.textContent !== '...') {
                // Handle page number selection
                const currentActive = document.querySelector('.pagination .page-item.active');
                if (currentActive) {
                    currentActive.classList.remove('active');
                }
                this.closest('.page-item').classList.add('active');
                
                // Update results for pagination (mock)
                updateResultsCount();
            }
        });
    });
    
    // Update statistics animation
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-content h3');
        
        statNumbers.forEach(stat => {
            const finalNumber = parseInt(stat.textContent);
            const increment = finalNumber / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= finalNumber) {
                    stat.textContent = finalNumber.toLocaleString();
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current).toLocaleString();
                }
            }, 20);
        });
    }
    
    // Trigger stats animation on page load
    setTimeout(animateStats, 500);
    
    // Update results count
    function updateResultsCount() {
        const visibleRows = tableBody.querySelectorAll('tr[style=""], tr:not([style])').length;
        const totalRows = tableBody.querySelectorAll('tr').length;
        const resultText = document.querySelector('.table-pagination .text-muted');
        
        if (resultText) {
            resultText.textContent = `Showing 1-${visibleRows} of ${totalRows} students`;
        }
    }
    
    // Export functionality
    function exportToCSV() {
        const table = document.querySelector('.enrollments-table');
        const rows = table.querySelectorAll('tr');
        let csv = [];
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('th, td');
            const rowData = [];
            
            cells.forEach(cell => {
                // Clean up the cell text
                let text = cell.textContent.trim();
                // Remove extra whitespace and newlines
                text = text.replace(/\s+/g, ' ');
                // Escape quotes
                text = text.replace(/"/g, '""');
                rowData.push(`"${text}"`);
            });
            
            csv.push(rowData.join(','));
        });
        
        // Create and download file
        const csvContent = csv.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'enrollments.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (tableSearch) {
                tableSearch.focus();
            }
        }
        
        // Ctrl/Cmd + E for export
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportToCSV();
        }
        
        // Escape to close mobile menu
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    });
    
    // Sign out functionality
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to sign out?')) {
                // Add sign out logic here
                console.log('Signing out...');
                // window.location.href = 'login.html';
            }
        });
    }
    
    // Upgrade button functionality
    const upgradeBtn = document.getElementById('upgradeBtn');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', function() {
            // Add upgrade logic here
            console.log('Upgrade clicked');
            alert('Upgrade feature coming soon!');
        });
    }
    
    // Resize handler for responsive behavior
    function handleResize() {
        if (window.innerWidth > 992) {
            if (sidebar) {
                sidebar.classList.remove('show');
            }
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Initialize tooltips if needed
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    if (window.bootstrap && bootstrap.Tooltip) {
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Auto-refresh data every 30 seconds (mock)
    function autoRefresh() {
        // Add real-time data fetching logic here
        console.log('Auto-refreshing data...');
        
        // Update timestamps, stats, etc.
        updateResultsCount();
    }
    
    // Set up auto-refresh interval
    setInterval(autoRefresh, 30000);
    
    // Initial setup
    updateResultsCount();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    console.log('Enrollments page initialized successfully!');
});

// Utility functions
function showNotification(message, type = 'info') {
    // Create a simple notification system
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// API simulation functions (replace with real API calls)
async function fetchEnrollments(page = 1, search = '', filter = 'all') {
    // Simulate API call
    return new Promise(resolve => {
        setTimeout(() => {
            // Mock data would be returned here
            resolve({
                data: [],
                total: 2341,
                page: page,
                limit: 10
            });
        }, 500);
    });
}

async function updateEnrollmentStatus(enrollmentId, newStatus) {
    // Simulate API call
    return new Promise(resolve => {
        setTimeout(() => {
            showNotification(`Enrollment status updated to ${newStatus}`, 'success');
            resolve({ success: true });
        }, 1000);
    });
}
