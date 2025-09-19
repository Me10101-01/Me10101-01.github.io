// Main JavaScript for Strategickhaos Portfolio Site

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollProgress();
    initEvidenceGrid();
    initAnimations();
    initScrollSpy();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offset = document.querySelector('.navbar').offsetHeight + 20;
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hide/show navbar on scroll
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Scroll progress indicator
function initScrollProgress() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Evidence grid functionality
function initEvidenceGrid() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Load content for the selected tab
            loadEvidenceContent(targetTab);
        });
    });
    
    // Load initial content
    loadEvidenceContent('repos');
}

// Load evidence content from JSON data
async function loadEvidenceContent(tabType) {
    try {
        const response = await fetch('data/evidence.json');
        const data = await response.json();
        const container = document.getElementById(`${tabType}-grid`);
        
        if (data[tabType] && container) {
            container.innerHTML = '';
            
            data[tabType].forEach(item => {
                const evidenceItem = createEvidenceItem(item);
                container.appendChild(evidenceItem);
            });
        }
    } catch (error) {
        console.warn('Could not load evidence data:', error);
        // Fallback to static content
        loadFallbackContent(tabType);
    }
}

// Create evidence item element
function createEvidenceItem(item) {
    const div = document.createElement('div');
    div.className = 'evidence-item fade-in-up';
    
    div.innerHTML = `
        <h4>${item.title}</h4>
        <p>${item.description}</p>
        <a href="${item.url}" target="_blank" rel="noopener noreferrer">
            ${item.linkText || 'View →'}
        </a>
    `;
    
    return div;
}

// Fallback content when JSON is not available
function loadFallbackContent(tabType) {
    const fallbackData = {
        repos: [
            {
                title: 'Portfolio Repository',
                description: 'Main GitHub Pages portfolio site showcasing projects and capabilities.',
                url: 'https://github.com/Me10101-01/Me10101-01.github.io',
                linkText: 'View Repository →'
            },
            {
                title: 'Automation Framework',
                description: 'AI-driven automation solutions for process optimization.',
                url: 'https://github.com/Me10101-01',
                linkText: 'View Profile →'
            },
            {
                title: 'Cybersecurity Tools',
                description: 'Security assessment and monitoring tools repository.',
                url: 'https://github.com/Me10101-01',
                linkText: 'View Profile →'
            },
            {
                title: 'Compliance System',
                description: 'Automated compliance monitoring and reporting framework.',
                url: 'https://github.com/Me10101-01',
                linkText: 'View Profile →'
            }
        ],
        sites: [
            {
                title: 'Portfolio Site',
                description: 'Live GitHub Pages site demonstrating responsive design and functionality.',
                url: 'https://me10101-01.github.io',
                linkText: 'Visit Site →'
            },
            {
                title: 'Project Dashboard',
                description: 'Interactive dashboard showcasing project metrics and progress.',
                url: '#',
                linkText: 'Coming Soon →'
            },
            {
                title: 'Documentation Hub',
                description: 'Comprehensive documentation for all projects and frameworks.',
                url: '#',
                linkText: 'Coming Soon →'
            }
        ],
        artifacts: [
            {
                title: 'CI/CD Pipeline',
                description: 'Automated build and deployment pipeline for GitHub Pages.',
                url: 'https://github.com/Me10101-01/Me10101-01.github.io/actions',
                linkText: 'View Actions →'
            },
            {
                title: 'Security Scans',
                description: 'Automated security scanning and vulnerability assessment reports.',
                url: '#',
                linkText: 'Coming Soon →'
            },
            {
                title: 'Performance Metrics',
                description: 'Site performance monitoring and optimization reports.',
                url: '#',
                linkText: 'Coming Soon →'
            },
            {
                title: 'Code Quality',
                description: 'Automated code quality analysis and improvement recommendations.',
                url: '#',
                linkText: 'Coming Soon →'
            }
        ]
    };
    
    const container = document.getElementById(`${tabType}-grid`);
    if (container && fallbackData[tabType]) {
        container.innerHTML = '';
        
        fallbackData[tabType].forEach(item => {
            const evidenceItem = createEvidenceItem(item);
            container.appendChild(evidenceItem);
        });
    }
}

// Scroll-triggered animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.highlight-card, .evidence-item, .timeline-item, .outcome-card'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Active navigation link based on scroll position
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const offset = document.querySelector('.navbar').offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - offset;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced scroll handling with debouncing
const debouncedScrollHandler = debounce(() => {
    // Additional scroll-based functionality can be added here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden - pause any animations or timers
        console.log('Page hidden');
    } else {
        // Page is visible - resume functionality
        console.log('Page visible');
    }
});

// Error handling for failed resource loads
window.addEventListener('error', function(e) {
    console.warn('Resource failed to load:', e.target.src || e.target.href);
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Support for keyboard navigation
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Print styles support
window.addEventListener('beforeprint', function() {
    // Expand all collapsed sections for printing
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', function() {
    document.body.classList.remove('printing');
});