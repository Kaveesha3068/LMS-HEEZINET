// Calendar functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }

    // Calendar date selection
    const calendarCells = document.querySelectorAll('.calendar-cell:not(.other-month)');
    
    calendarCells.forEach(cell => {
        cell.addEventListener('click', function() {
            // Remove previous selection
            calendarCells.forEach(c => c.classList.remove('selected'));
            // Add selection to clicked cell
            this.classList.add('selected');
            
            // Update details panel if needed
            updateDetailsPanel(this);
        });
    });

    // View toggle functionality
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Here you could implement view switching logic
            console.log('Switched to:', this.textContent, 'view');
        });
    });

    // Filter toggle
    const filterBtn = document.querySelector('.filter-btn');
    const filterSidebar = document.querySelector('.filter-sidebar');
    
    if (filterBtn && filterSidebar) {
        filterBtn.addEventListener('click', function() {
            filterSidebar.classList.toggle('show');
        });
    }

    // Filter checkboxes
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            this.classList.toggle('checked');
            
            // Here you could implement filtering logic
            const filterLabel = this.nextElementSibling.textContent;
            console.log('Toggled filter:', filterLabel);
        });
    });

    // Event item clicks
    const eventItems = document.querySelectorAll('.event-item');
    
    eventItems.forEach(event => {
        event.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Highlight the event
            eventItems.forEach(e => e.classList.remove('active'));
            this.classList.add('active');
            
            // Update details panel
            updateEventDetails(this);
        });
    });

    // New agenda button
    const newAgendaBtn = document.querySelector('.new-agenda-btn');
    
    if (newAgendaBtn) {
        newAgendaBtn.addEventListener('click', function() {
            // Here you could open a modal or form for creating new events
            console.log('Opening new agenda form...');
            alert('New Agenda functionality would be implemented here');
        });
    }
});

function updateDetailsPanel(cell) {
    const dateNumber = cell.querySelector('.date-number').textContent;
    const events = cell.querySelectorAll('.event-item');
    
    // Here you could update a details panel with the selected date's information
    console.log('Selected date:', dateNumber);
    console.log('Events on this date:', events.length);
}

function updateEventDetails(eventElement) {
    const eventText = eventElement.textContent;
    
    // Here you could update the details panel with specific event information
    console.log('Selected event:', eventText);
    
    // You could also show a modal or update a side panel with event details
}

// Calendar navigation (previous/next month)
function changeMonth(direction) {
    const calendarTitle = document.querySelector('.calendar-title');
    
    if (calendarTitle) {
        // Here you could implement month navigation logic
        console.log('Changing month:', direction);
    }
}

// Filter events by category
function filterEventsByCategory(category) {
    const events = document.querySelectorAll('.event-item');
    
    events.forEach(event => {
        if (category === 'all' || event.classList.contains(`event-${category}`)) {
            event.style.display = 'block';
        } else {
            event.style.display = 'none';
        }
    });
}
