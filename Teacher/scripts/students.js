// Students Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Header checkbox functionality
    const headerCheckbox = document.querySelector('thead input[type="checkbox"]');
    const rowCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    
    if (headerCheckbox && rowCheckboxes.length > 0) {
        headerCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = headerCheckbox.checked;
            });
        });
        
        // Update header checkbox based on individual checkboxes
        rowCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const checkedCount = Array.from(rowCheckboxes).filter(cb => cb.checked).length;
                headerCheckbox.indeterminate = checkedCount > 0 && checkedCount < rowCheckboxes.length;
                headerCheckbox.checked = checkedCount === rowCheckboxes.length;
            });
        });
    }
    
    // Search functionality
    const searchInputs = document.querySelectorAll('input[type="text"]');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Add search functionality here if needed
            console.log('Searching for:', this.value);
        });
    });
    
    // Filter button functionality
    const filterBtn = document.querySelector('.btn-outline-secondary');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            console.log('Filter button clicked');
            // Add filter functionality here
        });
    }
    
    // Sort functionality
    const sortSelect = document.querySelector('.sort-by select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            console.log('Sort by:', this.value);
            // Add sorting functionality here
        });
    }
    
    // Pagination functionality
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                // Remove active class from all buttons
                paginationBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button (if it has a number)
                if (this.textContent.trim() && !isNaN(this.textContent.trim())) {
                    this.classList.add('active');
                }
                console.log('Page clicked:', this.textContent.trim());
            }
        });
    });
    
    // Table row hover effects and interactions
    const tableRows = document.querySelectorAll('.students-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // Don't trigger if clicking on checkbox
            if (e.target.type !== 'checkbox') {
                console.log('Row clicked:', this);
                // Add row click functionality here (e.g., navigate to student details)
            }
        });
    });
    
    // Mobile menu toggle (if exists)
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-hidden');
        });
    }
    
    // Upgrade button functionality
    const upgradeBtn = document.querySelector('.upgrade-btn');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', function() {
            console.log('Upgrade button clicked');
            // Add upgrade functionality here
        });
    }
});
