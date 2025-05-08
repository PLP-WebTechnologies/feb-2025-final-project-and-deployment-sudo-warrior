// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Mindful Musings blog website loaded successfully!');
  
  // Get DOM elements
  const themeToggle = document.querySelector('.theme-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const contactForm = document.getElementById('contact-form');
  
  // Theme Toggle Functionality
  function initThemeToggle() {
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Add click event to theme toggle button
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
  }
  
  // Theme toggle function
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Apply theme transition animation
    document.documentElement.classList.add('theme-transition');
    
    // Set new theme
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save theme preference
    localStorage.setItem('theme', newTheme);
    
    // Remove transition class
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);
  }
  
  // Mobile Menu Toggle
  function initMobileMenu() {
    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Toggle aria-expanded attribute for accessibility
        const isExpanded = menuToggle.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        
        // Prevent scrolling when menu is open
        document.body.style.overflow = isExpanded ? 'hidden' : '';
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', function(event) {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(event.target) && 
            !menuToggle.contains(event.target)) {
          menuToggle.classList.remove('active');
          navLinks.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', false);
          document.body.style.overflow = '';
        }
      });
      
      // Close menu when pressing escape key
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navLinks.classList.contains('active')) {
          menuToggle.classList.remove('active');
          navLinks.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', false);
          document.body.style.overflow = '';
        }
      });
    }
  }
  
  // Form Validation
  function initFormValidation() {
    if (contactForm) {
      contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Reset previous error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.classList.remove('show'));
        
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => input.classList.remove('error'));
        
        // Hide previous form response message
        const formResponse = document.getElementById('form-response');
        formResponse.classList.remove('success', 'error');
        formResponse.style.display = 'none';
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validate inputs
        let isValid = true;
        
        // Name validation
        if (name === '') {
          showError('name', 'Please enter your name');
          isValid = false;
        }
        
        // Email validation
        if (email === '') {
          showError('email', 'Please enter your email address');
          isValid = false;
        } else if (!isValidEmail(email)) {
          showError('email', 'Please enter a valid email address');
          isValid = false;
        }
        
        // Message validation
        if (message === '') {
          showError('message', 'Please enter your message');
          isValid = false;
        }
        
        // If form is valid, simulate form submission
        if (isValid) {
          // Show loading state
          const submitButton = contactForm.querySelector('button[type="submit"]');
          const originalButtonText = submitButton.textContent;
          submitButton.textContent = 'Sending...';
          submitButton.disabled = true;
          
          // Simulate API call with timeout
          setTimeout(function() {
            // Reset form
            contactForm.reset();
            
            // Show success message
            formResponse.textContent = 'Thank you! Your message has been sent successfully.';
            formResponse.classList.add('success');
            formResponse.style.display = 'block';
            
            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            
            // Scroll to response message
            formResponse.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 1500);
        }
      });
      
      // Add input event listeners for real-time validation
      const requiredInputs = contactForm.querySelectorAll('input[required], textarea[required]');
      requiredInputs.forEach(input => {
        input.addEventListener('input', function() {
          // Reset error state when user types
          const errorElement = document.getElementById(`${input.id}-error`);
          if (errorElement) {
            errorElement.classList.remove('show');
          }
          input.classList.remove('error');
        });
      });
    }
  }
  
  // Helper function to show validation errors
  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field && errorElement) {
      field.classList.add('error');
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  }
  
  // Helper function to validate email format
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Initialize Animations
  function initAnimations() {
    // Add entrance animations to elements when they come into view
    const animateElements = document.querySelectorAll('.hero, .post-card, .about-grid, .testimonial');
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      animateElements.forEach(el => {
        observer.observe(el);
      });
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      animateElements.forEach(el => {
        el.classList.add('animated');
      });
    }
  }
  
  // Category filter click handler (for blog listing page)
  function initCategoryFilters() {
    const categoryLinks = document.querySelectorAll('.category-filters a');
    
    if (categoryLinks.length > 0) {
      categoryLinks.forEach(link => {
        link.addEventListener('click', function(event) {
          event.preventDefault();
          
          // Remove active class from all links
          categoryLinks.forEach(l => l.classList.remove('active'));
          
          // Add active class to clicked link
          this.classList.add('active');
          
          // In a real implementation, this would filter the posts
          // For this demo, we'll just log the category
          const category = this.textContent.trim();
          console.log(`Filtering by category: ${category}`);
        });
      });
    }
  }
  
  // Initialize all functionality
  initThemeToggle();
  initMobileMenu();
  initFormValidation();
  initAnimations();
  initCategoryFilters();
});