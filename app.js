// ClearCity Application JavaScript

// Application Data
const appData = {
  cities: [
    {"name": "Bangalore", "code": "BLR", "events": 45, "issues": 12, "volunteers": 234},
    {"name": "Delhi", "code": "DEL", "events": 67, "issues": 8, "volunteers": 445},
    {"name": "Mumbai", "code": "BOM", "events": 89, "issues": 15, "volunteers": 567},
    {"name": "Indore", "code": "IDR", "events": 23, "issues": 5, "volunteers": 123},
    {"name": "Kolkata", "code": "CCU", "events": 34, "issues": 7, "volunteers": 289}
  ],
  events: [
    {"id": 1, "title": "Tech Conference 2024", "city": "bangalore", "date": "2024-11-15", "category": "corporate", "price": "₹500", "description": "Leading technology conference featuring industry experts"},
    {"id": 2, "title": "Cultural Festival", "city": "delhi", "date": "2024-11-20", "category": "students", "price": "Free", "description": "Celebrating diverse cultures with music, dance, and food"},
    {"id": 3, "title": "Startup Meetup", "city": "mumbai", "date": "2024-11-25", "category": "corporate", "price": "₹300", "description": "Networking event for entrepreneurs and investors"},
    {"id": 4, "title": "College Fest", "city": "bangalore", "date": "2024-11-30", "category": "students", "price": "₹150", "description": "Inter-college cultural and technical competitions"},
    {"id": 5, "title": "Government Workshop", "city": "indore", "date": "2024-12-05", "category": "government", "price": "Free", "description": "Digital governance and citizen services workshop"},
    {"id": 6, "title": "Art Exhibition", "city": "kolkata", "date": "2024-12-10", "category": "students", "price": "₹100", "description": "Local artists showcasing contemporary artwork"},
    {"id": 7, "title": "Business Summit", "city": "delhi", "date": "2024-12-15", "category": "corporate", "price": "₹800", "description": "Annual business leadership summit"},
    {"id": 8, "title": "Music Concert", "city": "mumbai", "date": "2024-12-20", "category": "students", "price": "₹400", "description": "Live music concert featuring popular bands"}
  ],
  issues: [
    {"id": 1, "title": "Pothole on MG Road", "city": "bangalore", "status": "reported", "priority": "high", "reports": 15, "description": "Large pothole causing traffic disruption"},
    {"id": 2, "title": "Traffic Light Malfunction", "city": "delhi", "status": "in-progress", "priority": "critical", "reports": 8, "description": "Traffic signal not working at busy intersection"},
    {"id": 3, "title": "Water Logging", "city": "mumbai", "status": "resolved", "priority": "medium", "reports": 23, "description": "Street flooding during monsoon"},
    {"id": 4, "title": "Broken Streetlight", "city": "indore", "status": "reported", "priority": "medium", "reports": 5, "description": "Multiple streetlights not working in residential area"},
    {"id": 5, "title": "Garbage Collection Delay", "city": "kolkata", "status": "in-progress", "priority": "high", "reports": 12, "description": "Waste not collected for over a week"},
    {"id": 6, "title": "Road Construction Delay", "city": "bangalore", "status": "reported", "priority": "low", "reports": 7, "description": "Construction work blocking main road"}
  ],
  rewards: [
    {"type": "Event Reporter", "points": 50, "description": "Report 5 local events"},
    {"type": "Issue Solver", "points": 100, "description": "Report and track civic issues"},
    {"type": "Community Helper", "points": 75, "description": "Volunteer for social service"}
  ],
  userProfile: {
    name: "Demo User",
    points: 1250,
    level: "Community Champion",
    contributions: 23
  }
};

// Application State
let currentSection = 'home';
let selectedCity = '';
let isLoggedIn = false;
let map;
let routingControl;

// Predefined coordinates for cities
const cityCoordinates = {
    "bangalore": [12.9716, 77.5946],
    "delhi": [28.7041, 77.1025],
    "mumbai": [19.0760, 72.8777],
    "indore": [22.7196, 75.8577],
    "kolkata": [22.5726, 88.3639]
};


// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section, .hero-section');
const loginBtn = document.getElementById('login-btn');
const loginModal = document.getElementById('login-modal');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');
const successMessage = document.getElementById('success-message');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  initializeMaps();
  setupEventListeners();
  populateCityDropdowns();
  renderEvents();
  renderIssues();
  setupTrafficChart();
  animateStats();
});

// Initialize Application
function initializeApp() {
  // Remove loading screen after 3 seconds
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
  }, 3000);

  // Set initial active section
  showSection('home');
}

// Map Initialization
function initializeMaps() {
    // Traffic map
    if (document.getElementById('map')) {
        if (!map) { // Initialize map only once
            map = L.map('map').setView([22.3511148, 78.6677428], 5); // Centered on India
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);
        }
    }

    // Report map
    if (document.getElementById('report-map')) {
        var reportMap = L.map('report-map').setView([12.9716, 77.5946], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(reportMap);
        L.marker([12.9716, 77.5946]).addTo(reportMap);
    }
}


// Setup Event Listeners
function setupEventListeners() {
  // Navigation
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      if (section) {
        showSection(section);
        updateActiveNavLink(link);
      }
    });
  });

  // City Cards
  const cityCards = document.querySelectorAll('.city-card');
  cityCards.forEach(card => {
    card.addEventListener('click', () => {
      const city = card.getAttribute('data-city');
      selectedCity = city;
      showSection('events');
      updateActiveNavLink(document.querySelector('[data-section="events"]'));
      filterEventsByCity(city);
      showSuccessMessage(`Showing events for ${city.charAt(0).toUpperCase() + city.slice(1)}`);
    });
  });

  // Hero Buttons
  const exploreBtn = document.getElementById('explore-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      document.querySelector('.cities-grid').scrollIntoView({ behavior: 'smooth' });
    });
  }

  const joinBtn = document.getElementById('join-btn');
  if (joinBtn) {
    joinBtn.addEventListener('click', () => {
      showSection('social');
      updateActiveNavLink(document.querySelector('[data-section="social"]'));
    });
  }

  // Login Modal
  if (loginBtn) {
    loginBtn.addEventListener('click', showLoginModal);
  }
  
  if (modalClose) {
    modalClose.addEventListener('click', hideLoginModal);
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', hideLoginModal);
  }

  // Login Form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Tab Buttons
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // Issue Form
  const issueForm = document.getElementById('issue-form');
  if (issueForm) {
    issueForm.addEventListener('submit', handleIssueSubmission);
  }

  // Event Filters
  const cityFilter = document.getElementById('city-filter');
  const categoryFilter = document.getElementById('category-filter');
  
  if (cityFilter) {
    cityFilter.addEventListener('change', handleEventFilters);
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', handleEventFilters);
  }

  // Service Cards
  const serviceCards = document.querySelectorAll('.service-card .btn');
  serviceCards.forEach(btn => {
    btn.addEventListener('click', () => {
      showSuccessMessage('Successfully joined the initiative! We will contact you soon.');
    });
  });

  // Mobile Navigation
  const navToggle = document.querySelector('.nav-mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Routing form button
  const findRouteBtn = document.getElementById('find-route-btn');
  if(findRouteBtn){
      findRouteBtn.addEventListener('click', handleFindRoute);
  }
}

// Navigation Functions
function showSection(sectionId) {
  sections.forEach(section => {
    section.classList.remove('active-section');
    if (section.id === sectionId) {
      section.classList.add('active-section');
    }
  });
  currentSection = sectionId;
}

function updateActiveNavLink(activeLink) {
  navLinks.forEach(link => link.classList.remove('active'));
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

// Modal Functions
function showLoginModal() {
  if (loginModal) {
    loginModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function hideLoginModal() {
  if (loginModal) {
    loginModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

function handleLogin(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  // Simulate login process
  setTimeout(() => {
    isLoggedIn = true;
    hideLoginModal();
    showSuccessMessage('Successfully logged in!');
    
    // Update login button
    if (loginBtn) {
      loginBtn.textContent = 'Profile';
      loginBtn.onclick = () => {
        showSection('rewards');
        updateActiveNavLink(document.querySelector('[data-section="rewards"]'));
      };
    }
  }, 1000);
}

// Events Functions
function renderEvents() {
  const eventsGrid = document.getElementById('events-grid');
  if (!eventsGrid) return;

  eventsGrid.innerHTML = '';
  
  appData.events.forEach(event => {
    const eventCard = createEventCard(event);
    eventsGrid.appendChild(eventCard);
  });
}

function createEventCard(event) {
  const card = document.createElement('div');
  card.className = 'event-card';
  card.innerHTML = `
    <div class="event-image">
      ${event.title}
    </div>
    <div class="event-content">
      <h3 class="event-title">${event.title}</h3>
      <div class="event-meta">
        <span>${event.city.charAt(0).toUpperCase() + event.city.slice(1)}</span>
        <span>${formatDate(event.date)}</span>
        <span class="event-price">${event.price}</span>
      </div>
      <p>${event.description}</p>
      <button class="btn btn--primary" onclick="bookEvent(${event.id})">
        ${event.price === 'Free' ? 'Register' : 'Book Ticket'}
      </button>
    </div>
  `;
  return card;
}

function filterEventsByCity(city) {
  const cityFilter = document.getElementById('city-filter');
  if (cityFilter) {
    cityFilter.value = city;
    handleEventFilters();
  }
}

function handleEventFilters() {
  const cityFilter = document.getElementById('city-filter');
  const categoryFilter = document.getElementById('category-filter');
  const eventsGrid = document.getElementById('events-grid');
  
  if (!eventsGrid) return;

  const selectedCity = cityFilter ? cityFilter.value : '';
  const selectedCategory = categoryFilter ? categoryFilter.value : '';

  const filteredEvents = appData.events.filter(event => {
    const cityMatch = !selectedCity || event.city === selectedCity;
    const categoryMatch = !selectedCategory || event.category === selectedCategory;
    return cityMatch && categoryMatch;
  });

  eventsGrid.innerHTML = '';
  filteredEvents.forEach(event => {
    const eventCard = createEventCard(event);
    eventsGrid.appendChild(eventCard);
  });
}

function bookEvent(eventId) {
  const event = appData.events.find(e => e.id === eventId);
  if (event) {
    showSuccessMessage(`Successfully booked: ${event.title}`);
  }
}

// Issues Functions
function renderIssues() {
  const issuesList = document.getElementById('issues-list');
  if (!issuesList) return;

  issuesList.innerHTML = '';
  
  appData.issues.forEach(issue => {
    const issueItem = createIssueItem(issue);
    issuesList.appendChild(issueItem);
  });
}

function createIssueItem(issue) {
  const item = document.createElement('div');
  item.className = 'issue-item';
  item.innerHTML = `
    <div class="issue-header">
      <span class="issue-title">${issue.title}</span>
      <span class="issue-status ${issue.status}">${issue.status.replace('-', ' ').toUpperCase()}</span>
    </div>
    <div class="issue-meta">
      <span>${issue.city.charAt(0).toUpperCase() + issue.city.slice(1)}</span>
      <span>Priority: ${issue.priority.toUpperCase()}</span>
      <span>${issue.reports} reports</span>
    </div>
    <p>${issue.description}</p>
  `;
  return item;
}

function handleIssueSubmission(e) {
  e.preventDefault();
  
  const title = document.getElementById('issue-title').value;
  const city = document.getElementById('issue-city').value;
  const priority = document.getElementById('issue-priority').value;
  const description = document.getElementById('issue-description').value;

  // Create new issue
  const newIssue = {
    id: appData.issues.length + 1,
    title: title,
    city: city,
    status: 'reported',
    priority: priority,
    reports: 1,
    description: description
  };

  // Add to data
  appData.issues.unshift(newIssue);
  
  // Re-render issues
  renderIssues();
  
  // Reset form
  e.target.reset();
  
  // Show success message
  showSuccessMessage('Issue reported successfully! Thank you for helping improve the city.');
}

// Traffic & Routing Functions
function populateCityDropdowns() {
    const startLocationSelect = document.getElementById('start-location');
    const endLocationSelect = document.getElementById('end-location');

    if (!startLocationSelect || !endLocationSelect) return;

    appData.cities.forEach(city => {
        const option1 = document.createElement('option');
        option1.value = city.name.toLowerCase();
        option1.textContent = city.name;
        startLocationSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = city.name.toLowerCase();
        option2.textContent = city.name;
        endLocationSelect.appendChild(option2);
    });
}

function handleFindRoute() {
    const startCity = document.getElementById('start-location').value;
    const endCity = document.getElementById('end-location').value;

    if (!startCity || !endCity) {
        showSuccessMessage("Please select both a start and end destination.");
        return;
    }

    if (startCity === endCity) {
        showSuccessMessage("Start and end destinations cannot be the same.");
        return;
    }

    const startCoords = cityCoordinates[startCity];
    const endCoords = cityCoordinates[endCity];

    if (!startCoords || !endCoords) {
        showSuccessMessage("Could not find coordinates for the selected cities.");
        return;
    }

    // Remove previous route if it exists
    if (routingControl) {
        map.removeControl(routingControl);
    }

    // Create and add new routing control
    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(startCoords[0], startCoords[1]),
            L.latLng(endCoords[0], endCoords[1])
        ],
        routeWhileDragging: true,
    }).addTo(map);

    showSuccessMessage(`Calculating route from ${startCity.charAt(0).toUpperCase() + startCity.slice(1)} to ${endCity.charAt(0).toUpperCase() + endCity.slice(1)}.`);
}


function setupTrafficChart() {
  const ctx = document.getElementById('trafficChart');
  if (!ctx) return;

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
      datasets: [{
        label: 'Traffic Density',
        data: [30, 85, 45, 60, 90, 40],
        borderColor: '#008080',
        backgroundColor: 'rgba(0, 128, 128, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#ffffff'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#ffffff'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        y: {
          ticks: {
            color: '#ffffff'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      }
    }
  });
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  });
}

function showSuccessMessage(message) {
  if (successMessage) {
    const textElement = successMessage.querySelector('.success-text');
    if (textElement) {
      textElement.textContent = message;
    }
    
    successMessage.classList.remove('hidden');
    
    setTimeout(() => {
      successMessage.classList.add('hidden');
    }, 3000);
  }
}

// Animation Functions
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
      }
    });
  });

  statNumbers.forEach(stat => {
    observer.observe(stat);
  });
}

function animateNumber(element) {
  const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    
    let displayValue = Math.floor(current);
    if (displayValue >= 1000) {
      displayValue = (displayValue / 1000).toFixed(1) + 'K';
    }
    
    element.textContent = displayValue;
  }, 16);
}

// Scroll Animations
function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll('.city-card, .event-card, .service-card, .reward-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1
  });

  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });
}

// Real-time Notifications
function setupNotifications() {
  // Simulate real-time notifications
  setInterval(() => {
    if (Math.random() > 0.8) { // 20% chance every 10 seconds
      const notifications = [
        'New event added in your city!',
        'Traffic issue resolved on your route',
        'New volunteer opportunity available',
        'You earned reward points!'
      ];
      
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      showSuccessMessage(randomNotification);
    }
  }, 10000);
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
  setupScrollAnimations();
  setupNotifications();
  
  // Add smooth scrolling to all anchor links
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
});

// Export functions for global access
window.ClearCity = {
  showSection,
  bookEvent,
  showSuccessMessage,
  appData
};
