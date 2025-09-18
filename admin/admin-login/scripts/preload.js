// Enhanced Preload Management JavaScript

// Sample student data for different classes
const classStudents = {
    'CS101': [
        { id: 'CS001', name: 'John Smith', email: 'john.smith@university.edu', status: 'Active' },
        { id: 'CS002', name: 'Emily Johnson', email: 'emily.johnson@university.edu', status: 'Active' },
        { id: 'CS003', name: 'Michael Brown', email: 'michael.brown@university.edu', status: 'Active' },
        { id: 'CS004', name: 'Sarah Davis', email: 'sarah.davis@university.edu', status: 'Active' },
        { id: 'CS005', name: 'David Wilson', email: 'david.wilson@university.edu', status: 'Inactive' },
        { id: 'CS006', name: 'Lisa Anderson', email: 'lisa.anderson@university.edu', status: 'Active' },
        { id: 'CS007', name: 'Robert Taylor', email: 'robert.taylor@university.edu', status: 'Active' },
        { id: 'CS008', name: 'Jennifer Martinez', email: 'jennifer.martinez@university.edu', status: 'Active' },
        { id: 'CS009', name: 'Christopher Lee', email: 'christopher.lee@university.edu', status: 'Active' },
        { id: 'CS010', name: 'Amanda Garcia', email: 'amanda.garcia@university.edu', status: 'Active' },
        { id: 'CS011', name: 'Matthew Rodriguez', email: 'matthew.rodriguez@university.edu', status: 'Active' },
        { id: 'CS012', name: 'Jessica White', email: 'jessica.white@university.edu', status: 'Active' },
        { id: 'CS013', name: 'Daniel Lewis', email: 'daniel.lewis@university.edu', status: 'Active' },
        { id: 'CS014', name: 'Ashley Walker', email: 'ashley.walker@university.edu', status: 'Active' },
        { id: 'CS015', name: 'Andrew Hall', email: 'andrew.hall@university.edu', status: 'Active' },
        { id: 'CS016', name: 'Megan Allen', email: 'megan.allen@university.edu', status: 'Active' },
        { id: 'CS017', name: 'Joshua Young', email: 'joshua.young@university.edu', status: 'Active' },
        { id: 'CS018', name: 'Stephanie King', email: 'stephanie.king@university.edu', status: 'Active' },
        { id: 'CS019', name: 'Ryan Wright', email: 'ryan.wright@university.edu', status: 'Active' },
        { id: 'CS020', name: 'Nicole Lopez', email: 'nicole.lopez@university.edu', status: 'Active' },
        { id: 'CS021', name: 'Brandon Hill', email: 'brandon.hill@university.edu', status: 'Active' },
        { id: 'CS022', name: 'Rachel Green', email: 'rachel.green@university.edu', status: 'Active' },
        { id: 'CS023', name: 'Kevin Adams', email: 'kevin.adams@university.edu', status: 'Active' },
        { id: 'CS024', name: 'Samantha Baker', email: 'samantha.baker@university.edu', status: 'Active' },
        { id: 'CS025', name: 'Tyler Nelson', email: 'tyler.nelson@university.edu', status: 'Active' }
    ],
    'MATH201': [
        { id: 'MA001', name: 'Alex Thompson', email: 'alex.thompson@university.edu', status: 'Active' },
        { id: 'MA002', name: 'Hannah Clark', email: 'hannah.clark@university.edu', status: 'Active' },
        { id: 'MA003', name: 'Ethan Lewis', email: 'ethan.lewis@university.edu', status: 'Active' },
        { id: 'MA004', name: 'Olivia Turner', email: 'olivia.turner@university.edu', status: 'Active' },
        { id: 'MA005', name: 'Noah Phillips', email: 'noah.phillips@university.edu', status: 'Active' },
        { id: 'MA006', name: 'Sophia Campbell', email: 'sophia.campbell@university.edu', status: 'Active' },
        { id: 'MA007', name: 'Mason Parker', email: 'mason.parker@university.edu', status: 'Active' },
        { id: 'MA008', name: 'Isabella Evans', email: 'isabella.evans@university.edu', status: 'Active' },
        { id: 'MA009', name: 'Lucas Edwards', email: 'lucas.edwards@university.edu', status: 'Active' },
        { id: 'MA010', name: 'Emma Collins', email: 'emma.collins@university.edu', status: 'Active' },
        { id: 'MA011', name: 'Logan Stewart', email: 'logan.stewart@university.edu', status: 'Active' },
        { id: 'MA012', name: 'Ava Sanchez', email: 'ava.sanchez@university.edu', status: 'Active' },
        { id: 'MA013', name: 'Jacob Morris', email: 'jacob.morris@university.edu', status: 'Active' },
        { id: 'MA014', name: 'Mia Rogers', email: 'mia.rogers@university.edu', status: 'Active' },
        { id: 'MA015', name: 'William Reed', email: 'william.reed@university.edu', status: 'Active' },
        { id: 'MA016', name: 'Charlotte Cook', email: 'charlotte.cook@university.edu', status: 'Active' },
        { id: 'MA017', name: 'James Bell', email: 'james.bell@university.edu', status: 'Active' },
        { id: 'MA018', name: 'Amelia Murphy', email: 'amelia.murphy@university.edu', status: 'Active' },
        { id: 'MA019', name: 'Benjamin Bailey', email: 'benjamin.bailey@university.edu', status: 'Active' },
        { id: 'MA020', name: 'Harper Rivera', email: 'harper.rivera@university.edu', status: 'Active' },
        { id: 'MA021', name: 'Samuel Cooper', email: 'samuel.cooper@university.edu', status: 'Active' },
        { id: 'MA022', name: 'Evelyn Richardson', email: 'evelyn.richardson@university.edu', status: 'Active' },
        { id: 'MA023', name: 'Henry Cox', email: 'henry.cox@university.edu', status: 'Active' },
        { id: 'MA024', name: 'Abigail Howard', email: 'abigail.howard@university.edu', status: 'Active' },
        { id: 'MA025', name: 'Alexander Ward', email: 'alexander.ward@university.edu', status: 'Active' },
        { id: 'MA026', name: 'Elizabeth Torres', email: 'elizabeth.torres@university.edu', status: 'Active' },
        { id: 'MA027', name: 'Sebastian Peterson', email: 'sebastian.peterson@university.edu', status: 'Active' },
        { id: 'MA028', name: 'Sofia Gray', email: 'sofia.gray@university.edu', status: 'Active' },
        { id: 'MA029', name: 'Owen Ramirez', email: 'owen.ramirez@university.edu', status: 'Active' },
        { id: 'MA030', name: 'Victoria James', email: 'victoria.james@university.edu', status: 'Active' }
    ],
    'ENG102': [
        { id: 'EN001', name: 'Grace Watson', email: 'grace.watson@university.edu', status: 'Active' },
        { id: 'EN002', name: 'Carter Brooks', email: 'carter.brooks@university.edu', status: 'Active' },
        { id: 'EN003', name: 'Chloe Kelly', email: 'chloe.kelly@university.edu', status: 'Active' },
        { id: 'EN004', name: 'Wyatt Sanders', email: 'wyatt.sanders@university.edu', status: 'Active' },
        { id: 'EN005', name: 'Zoe Price', email: 'zoe.price@university.edu', status: 'Active' },
        { id: 'EN006', name: 'Luke Bennett', email: 'luke.bennett@university.edu', status: 'Active' },
        { id: 'EN007', name: 'Natalie Wood', email: 'natalie.wood@university.edu', status: 'Active' },
        { id: 'EN008', name: 'Julian Barnes', email: 'julian.barnes@university.edu', status: 'Active' },
        { id: 'EN009', name: 'Layla Ross', email: 'layla.ross@university.edu', status: 'Active' },
        { id: 'EN010', name: 'Isaac Henderson', email: 'isaac.henderson@university.edu', status: 'Active' },
        { id: 'EN011', name: 'Stella Coleman', email: 'stella.coleman@university.edu', status: 'Active' },
        { id: 'EN012', name: 'Caleb Jenkins', email: 'caleb.jenkins@university.edu', status: 'Active' },
        { id: 'EN013', name: 'Aurora Perry', email: 'aurora.perry@university.edu', status: 'Active' },
        { id: 'EN014', name: 'Nathan Powell', email: 'nathan.powell@university.edu', status: 'Active' },
        { id: 'EN015', name: 'Violet Long', email: 'violet.long@university.edu', status: 'Active' },
        { id: 'EN016', name: 'Christian Patterson', email: 'christian.patterson@university.edu', status: 'Active' },
        { id: 'EN017', name: 'Savannah Hughes', email: 'savannah.hughes@university.edu', status: 'Active' },
        { id: 'EN018', name: 'Hunter Flores', email: 'hunter.flores@university.edu', status: 'Active' },
        { id: 'EN019', name: 'Brooklyn Washington', email: 'brooklyn.washington@university.edu', status: 'Active' },
        { id: 'EN020', name: 'Connor Butler', email: 'connor.butler@university.edu', status: 'Active' },
        { id: 'EN021', name: 'Skylar Simmons', email: 'skylar.simmons@university.edu', status: 'Active' },
        { id: 'EN022', name: 'Adrian Foster', email: 'adrian.foster@university.edu', status: 'Active' }
    ],
    'PHY301': [
        { id: 'PH001', name: 'Maria Gonzalez', email: 'maria.gonzalez@university.edu', status: 'Active' },
        { id: 'PH002', name: 'Thomas Bryant', email: 'thomas.bryant@university.edu', status: 'Active' },
        { id: 'PH003', name: 'Aria Alexander', email: 'aria.alexander@university.edu', status: 'Active' },
        { id: 'PH004', name: 'Jaxon Russell', email: 'jaxon.russell@university.edu', status: 'Active' },
        { id: 'PH005', name: 'Penelope Griffin', email: 'penelope.griffin@university.edu', status: 'Active' },
        { id: 'PH006', name: 'Grayson Diaz', email: 'grayson.diaz@university.edu', status: 'Active' },
        { id: 'PH007', name: 'Emery Hayes', email: 'emery.hayes@university.edu', status: 'Active' },
        { id: 'PH008', name: 'Levi Myers', email: 'levi.myers@university.edu', status: 'Active' },
        { id: 'PH009', name: 'Nova Ford', email: 'nova.ford@university.edu', status: 'Active' },
        { id: 'PH010', name: 'Asher Hamilton', email: 'asher.hamilton@university.edu', status: 'Active' },
        { id: 'PH011', name: 'Luna Graham', email: 'luna.graham@university.edu', status: 'Active' },
        { id: 'PH012', name: 'Mateo Sullivan', email: 'mateo.sullivan@university.edu', status: 'Active' },
        { id: 'PH013', name: 'Hazel Wallace', email: 'hazel.wallace@university.edu', status: 'Active' },
        { id: 'PH014', name: 'Leo Woods', email: 'leo.woods@university.edu', status: 'Active' },
        { id: 'PH015', name: 'Ivy Cole', email: 'ivy.cole@university.edu', status: 'Active' },
        { id: 'PH016', name: 'Kai West', email: 'kai.west@university.edu', status: 'Active' },
        { id: 'PH017', name: 'Willow Jordan', email: 'willow.jordan@university.edu', status: 'Active' },
        { id: 'PH018', name: 'Ezra Owens', email: 'ezra.owens@university.edu', status: 'Active' }
    ],
    'HIST150': [
        { id: 'HI001', name: 'Ruby Reynolds', email: 'ruby.reynolds@university.edu', status: 'Active' },
        { id: 'HI002', name: 'Miles Fisher', email: 'miles.fisher@university.edu', status: 'Active' },
        { id: 'HI003', name: 'Autumn Ellis', email: 'autumn.ellis@university.edu', status: 'Active' },
        { id: 'HI004', name: 'Axel Marshall', email: 'axel.marshall@university.edu', status: 'Active' },
        { id: 'HI005', name: 'Sage Romero', email: 'sage.romero@university.edu', status: 'Active' },
        { id: 'HI006', name: 'Silas McDonald', email: 'silas.mcdonald@university.edu', status: 'Active' },
        { id: 'HI007', name: 'Iris Guerrero', email: 'iris.guerrero@university.edu', status: 'Active' },
        { id: 'HI008', name: 'Felix Medina', email: 'felix.medina@university.edu', status: 'Active' },
        { id: 'HI009', name: 'Jade Elliott', email: 'jade.elliott@university.edu', status: 'Active' },
        { id: 'HI010', name: 'River Francis', email: 'river.francis@university.edu', status: 'Active' },
        { id: 'HI011', name: 'Ember Williamson', email: 'ember.williamson@university.edu', status: 'Active' },
        { id: 'HI012', name: 'Phoenix Lawson', email: 'phoenix.lawson@university.edu', status: 'Active' },
        { id: 'HI013', name: 'Scarlett Fields', email: 'scarlett.fields@university.edu', status: 'Active' },
        { id: 'HI014', name: 'Atlas Castillo', email: 'atlas.castillo@university.edu', status: 'Active' },
        { id: 'HI015', name: 'Coral Valdez', email: 'coral.valdez@university.edu', status: 'Active' },
        { id: 'HI016', name: 'Knox Norman', email: 'knox.norman@university.edu', status: 'Active' },
        { id: 'HI017', name: 'Poppy Mccoy', email: 'poppy.mccoy@university.edu', status: 'Active' },
        { id: 'HI018', name: 'Cruz Mann', email: 'cruz.mann@university.edu', status: 'Active' },
        { id: 'HI019', name: 'Wren Cardenas', email: 'wren.cardenas@university.edu', status: 'Active' },
        { id: 'HI020', name: 'Orion Nunez', email: 'orion.nunez@university.edu', status: 'Active' },
        { id: 'HI021', name: 'Dahlia Holt', email: 'dahlia.holt@university.edu', status: 'Active' },
        { id: 'HI022', name: 'Enzo Contreras', email: 'enzo.contreras@university.edu', status: 'Active' },
        { id: 'HI023', name: 'Magnolia Aguilar', email: 'magnolia.aguilar@university.edu', status: 'Active' },
        { id: 'HI024', name: 'Beckett Silva', email: 'beckett.silva@university.edu', status: 'Active' },
        { id: 'HI025', name: 'Clementine Pearson', email: 'clementine.pearson@university.edu', status: 'Active' },
        { id: 'HI026', name: 'Dante Lowe', email: 'dante.lowe@university.edu', status: 'Active' },
        { id: 'HI027', name: 'Marigold Moon', email: 'marigold.moon@university.edu', status: 'Active' },
        { id: 'HI028', name: 'Zane Galloway', email: 'zane.galloway@university.edu', status: 'Active' },
        { id: 'HI029', name: 'Celeste Espinoza', email: 'celeste.espinoza@university.edu', status: 'Active' },
        { id: 'HI030', name: 'Crew Vega', email: 'crew.vega@university.edu', status: 'Active' },
        { id: 'HI031', name: 'Juniper Santos', email: 'juniper.santos@university.edu', status: 'Active' },
        { id: 'HI032', name: 'Ryder Leon', email: 'ryder.leon@university.edu', status: 'Active' },
        { id: 'HI033', name: 'Blossom Garza', email: 'blossom.garza@university.edu', status: 'Active' },
        { id: 'HI034', name: 'Maverick Cross', email: 'maverick.cross@university.edu', status: 'Active' },
        { id: 'HI035', name: 'Rosie Caldwell', email: 'rosie.caldwell@university.edu', status: 'Active' }
    ],
    'ART200': [
        { id: 'AR001', name: 'Jasper Quinn', email: 'jasper.quinn@university.edu', status: 'Active' },
        { id: 'AR002', name: 'Indigo Stone', email: 'indigo.stone@university.edu', status: 'Active' },
        { id: 'AR003', name: 'Sage Palmer', email: 'sage.palmer@university.edu', status: 'Active' },
        { id: 'AR004', name: 'River Blake', email: 'river.blake@university.edu', status: 'Active' },
        { id: 'AR005', name: 'Phoenix Nash', email: 'phoenix.nash@university.edu', status: 'Active' },
        { id: 'AR006', name: 'Ocean Hart', email: 'ocean.hart@university.edu', status: 'Active' },
        { id: 'AR007', name: 'Storm Fox', email: 'storm.fox@university.edu', status: 'Active' },
        { id: 'AR008', name: 'Raven Pierce', email: 'raven.pierce@university.edu', status: 'Active' },
        { id: 'AR009', name: 'Aurora Lane', email: 'aurora.lane@university.edu', status: 'Active' },
        { id: 'AR010', name: 'Atlas Rose', email: 'atlas.rose@university.edu', status: 'Active' },
        { id: 'AR011', name: 'Echo Reid', email: 'echo.reid@university.edu', status: 'Active' },
        { id: 'AR012', name: 'Nova Sparks', email: 'nova.sparks@university.edu', status: 'Active' },
        { id: 'AR013', name: 'Onyx Webb', email: 'onyx.webb@university.edu', status: 'Active' },
        { id: 'AR014', name: 'Lyric Snow', email: 'lyric.snow@university.edu', status: 'Active' },
        { id: 'AR015', name: 'Vale Cross', email: 'vale.cross@university.edu', status: 'Active' }
    ]
};

// Global state for preloaded students
let currentPreloadedStudents = [];
let currentPreloadedClass = '';

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializePreloadPage();
});

// Initialize the preload page
function initializePreloadPage() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Add event listeners for preload buttons
    addPreloadButtonListeners();
    
    // Add event listeners for custom preload
    addCustomPreloadListeners();
    
    // Add event listeners for action buttons
    addActionButtonListeners();
    
    // Initialize search functionality
    initializeSearch();
    
    // Load any existing preloaded data from sessionStorage
    loadExistingPreloadData();
}

// Add event listeners for quick preload buttons
function addPreloadButtonListeners() {
    const preloadButtons = document.querySelectorAll('.preload-btn');
    
    preloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const classCode = this.getAttribute('data-class');
            preloadClass(classCode, this);
        });
    });
}

// Add event listeners for custom preload
function addCustomPreloadListeners() {
    const customPreloadBtn = document.getElementById('customPreloadBtn');
    const preloadToAttendanceBtn = document.getElementById('preloadToAttendanceBtn');
    
    if (customPreloadBtn) {
        customPreloadBtn.addEventListener('click', function() {
            const classSelect = document.getElementById('classSelect');
            const sectionSelect = document.getElementById('sectionSelect');
            
            if (classSelect.value) {
                preloadClass(classSelect.value, this);
            } else {
                showToast('Please select a class first', 'error');
            }
        });
    }
    
    if (preloadToAttendanceBtn) {
        preloadToAttendanceBtn.addEventListener('click', function() {
            const classSelect = document.getElementById('classSelect');
            
            if (classSelect.value) {
                preloadClass(classSelect.value, this, true);
            } else {
                showToast('Please select a class first', 'error');
            }
        });
    }
}

// Add event listeners for action buttons
function addActionButtonListeners() {
    const clearPreloadBtn = document.getElementById('clearPreloadBtn');
    const goToAttendanceBtn = document.getElementById('goToAttendanceBtn');
    
    if (clearPreloadBtn) {
        clearPreloadBtn.addEventListener('click', clearPreloadedStudents);
    }
    
    if (goToAttendanceBtn) {
        goToAttendanceBtn.addEventListener('click', goToAttendancePage);
    }
}

// Initialize search functionality
function initializeSearch() {
    const globalSearch = document.getElementById('globalSearch');
    
    if (globalSearch) {
        globalSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterPreloadedStudents(searchTerm);
        });
    }
}

// Preload a specific class
function preloadClass(classCode, buttonElement, redirectToAttendance = false) {
    if (!classStudents[classCode]) {
        showToast('Class not found', 'error');
        return;
    }
    
    // Add loading state to button
    if (buttonElement) {
        buttonElement.classList.add('loading');
        buttonElement.disabled = true;
    }
    
    // Simulate loading delay
    setTimeout(() => {
        try {
            currentPreloadedStudents = [...classStudents[classCode]];
            currentPreloadedClass = classCode;
            
            // Store in sessionStorage for attendance page
            sessionStorage.setItem('preloadedStudents', JSON.stringify(currentPreloadedStudents));
            sessionStorage.setItem('preloadedClass', classCode);
            
            // Update UI
            displayPreloadedStudents();
            showPreloadedStudentsCard();
            
            // Show success message
            showToast(`Successfully preloaded ${currentPreloadedStudents.length} students from ${classCode}`, 'success');
            
            // Remove loading state
            if (buttonElement) {
                buttonElement.classList.remove('loading');
                buttonElement.disabled = false;
            }
            
            // Redirect to attendance if requested
            if (redirectToAttendance) {
                setTimeout(() => {
                    window.location.href = 'attendance.html';
                }, 1000);
            }
            
        } catch (error) {
            console.error('Error preloading students:', error);
            showToast('Error preloading students', 'error');
            
            if (buttonElement) {
                buttonElement.classList.remove('loading');
                buttonElement.disabled = false;
            }
        }
    }, 1000);
}

// Display preloaded students in the table
function displayPreloadedStudents() {
    const tableBody = document.getElementById('preloadedStudentsTable');
    const studentCount = document.getElementById('studentCount');
    
    if (!tableBody || !studentCount) return;
    
    // Update student count
    studentCount.textContent = currentPreloadedStudents.length;
    
    // Clear existing table content
    tableBody.innerHTML = '';
    
    // Populate table with students
    currentPreloadedStudents.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="fw-medium">${student.id}</td>
            <td>${student.name}</td>
            <td class="text-muted">${student.email}</td>
            <td>
                <span class="badge ${student.status === 'Active' ? 'bg-success' : 'bg-secondary'}">
                    ${student.status}
                </span>
            </td>
            <td class="d-flex gap-2">
                <button class="btn btn-sm ${student.status === 'Active' ? 'btn-outline-secondary' : 'btn-outline-success'} toggle-status-btn" data-index="${index}">
                    <span class="material-symbols-outlined align-middle">${student.status === 'Active' ? 'toggle_off' : 'toggle_on'}</span>
                    ${student.status === 'Active' ? 'Set Inactive' : 'Set Active'}
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="removeStudent(${index})">
                    <span class="material-symbols-outlined">person_remove</span>
                    Remove
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners for status toggle buttons
    const toggleBtns = tableBody.querySelectorAll('.toggle-status-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-index'));
            if (currentPreloadedStudents[idx]) {
                currentPreloadedStudents[idx].status = currentPreloadedStudents[idx].status === 'Active' ? 'Inactive' : 'Active';
                sessionStorage.setItem('preloadedStudents', JSON.stringify(currentPreloadedStudents));
                displayPreloadedStudents();
            }
        });
    });
}

// Show the preloaded students card
function showPreloadedStudentsCard() {
    const card = document.getElementById('preloadedStudentsCard');
    if (card) {
        card.classList.remove('preloaded-students-card-hidden');
        card.style.display = 'block';
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Hide the preloaded students card
function hidePreloadedStudentsCard() {
    const card = document.getElementById('preloadedStudentsCard');
    if (card) {
        card.classList.add('preloaded-students-card-hidden');
        card.style.display = 'none';
    }
}

// Remove a specific student from preloaded list
function removeStudent(index) {
    if (index >= 0 && index < currentPreloadedStudents.length) {
        const removedStudent = currentPreloadedStudents.splice(index, 1)[0];
        
        // Update sessionStorage
        sessionStorage.setItem('preloadedStudents', JSON.stringify(currentPreloadedStudents));
        
        // Update UI
        displayPreloadedStudents();
        
        // Hide card if no students left
        if (currentPreloadedStudents.length === 0) {
            hidePreloadedStudentsCard();
            currentPreloadedClass = '';
            sessionStorage.removeItem('preloadedClass');
        }
        
        showToast(`Removed ${removedStudent.name} from preloaded students`, 'success');
    }
}

// Clear all preloaded students
function clearPreloadedStudents() {
    currentPreloadedStudents = [];
    currentPreloadedClass = '';
    
    // Clear sessionStorage
    sessionStorage.removeItem('preloadedStudents');
    sessionStorage.removeItem('preloadedClass');
    
    // Update UI
    hidePreloadedStudentsCard();
    
    showToast('Cleared all preloaded students', 'success');
}

// Navigate to attendance page with preloaded data
function goToAttendancePage() {
    if (currentPreloadedStudents.length > 0) {
        // Ensure data is stored in sessionStorage
        sessionStorage.setItem('preloadedStudents', JSON.stringify(currentPreloadedStudents));
        sessionStorage.setItem('preloadedClass', currentPreloadedClass);
        
        // Navigate to attendance page
        window.location.href = 'attendance.html';
    } else {
        showToast('No students preloaded. Please preload students first.', 'error');
    }
}

// Filter preloaded students based on search term
function filterPreloadedStudents(searchTerm) {
    const tableBody = document.getElementById('preloadedStudentsTable');
    if (!tableBody) return;
    
    const rows = tableBody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const matches = text.includes(searchTerm);
        row.style.display = matches ? '' : 'none';
    });
}

// Load existing preload data from sessionStorage
function loadExistingPreloadData() {
    const storedStudents = sessionStorage.getItem('preloadedStudents');
    const storedClass = sessionStorage.getItem('preloadedClass');
    
    if (storedStudents && storedClass) {
        try {
            currentPreloadedStudents = JSON.parse(storedStudents);
            currentPreloadedClass = storedClass;
            
            if (currentPreloadedStudents.length > 0) {
                displayPreloadedStudents();
                showPreloadedStudentsCard();
            }
        } catch (error) {
            console.error('Error loading existing preload data:', error);
            // Clear corrupted data
            sessionStorage.removeItem('preloadedStudents');
            sessionStorage.removeItem('preloadedClass');
        }
    }
}

// Show toast notifications
function showToast(message, type = 'success') {
    const toast = document.getElementById('successToast');
    const toastBody = document.getElementById('successToastBody');
    const toastHeader = toast.querySelector('.toast-header');
    
    if (!toast || !toastBody) return;
    
    // Update message
    toastBody.textContent = message;
    
    // Update header based on type
    if (type === 'error') {
        toastHeader.className = 'toast-header bg-danger text-white';
        toastHeader.querySelector('.material-symbols-outlined').textContent = 'error';
        toastHeader.querySelector('strong').textContent = 'Error';
    } else {
        toastHeader.className = 'toast-header bg-success text-white';
        toastHeader.querySelector('.material-symbols-outlined').textContent = 'check_circle';
        toastHeader.querySelector('strong').textContent = 'Success';
    }
    
    // Show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// Handle sign out (from global-signout.js)
function handleSignOut() {
    // Clear any preloaded data
    sessionStorage.removeItem('preloadedStudents');
    sessionStorage.removeItem('preloadedClass');
    
    // Redirect to login page
    window.location.href = '../../frontend/views/index.html';
}

// Export functions for use in attendance page
window.preloadFunctions = {
    getPreloadedStudents: () => currentPreloadedStudents,
    getPreloadedClass: () => currentPreloadedClass,
    clearPreloadedData: clearPreloadedStudents
};