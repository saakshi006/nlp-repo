document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Dark Mode Toggle & Preference Caching
  // ==========================================
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';

  // Apply default cached theme
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.checked = true;
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeToggle) themeToggle.checked = false;
  }

  // Listen for changes on theme toggle checkbox
  if (themeToggle) {
    themeToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // ==========================================
  // 2. Mobile Drawer Navigation
  // ==========================================
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerLinks = document.querySelectorAll('.mobile-drawer a');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileNavToggle) mobileNavToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ==========================================
  // 3. Scroll Progress Indicator & Back-to-Top
  // ==========================================
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    // Scroll progress calculations
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    // Back to top button visibility threshold
    if (backToTopBtn) {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 4. Smooth Section Scrolling & Scrollspy (Active Sidebar)
  // ==========================================
  const sections = document.querySelectorAll('.section-wrapper');
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a, .mobile-drawer a');

  // Dynamic active navigation indicator via Intersection Observer
  const scrollspyOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Focus window matches the upper-middle of screen
    threshold: 0
  };

  const scrollspyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        sidebarLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, scrollspyOptions);

  sections.forEach(section => {
    scrollspyObserver.observe(section);
  });

  // ==========================================
  // 5. Concept Card Real-Time Filter / Search
  // ==========================================
  const searchInput = document.getElementById('concept-search');
  const conceptCards = document.querySelectorAll('.concept-card');
  const categories = document.querySelectorAll('.concepts-category-wrapper');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      conceptCards.forEach(card => {
        const title = card.querySelector('.concept-title').textContent.toLowerCase();
        const definition = card.querySelector('.concept-def').textContent.toLowerCase();
        const badge = card.querySelector('.concept-badge').textContent.toLowerCase();
        
        // Search matches title, description, or tag badge
        if (title.includes(query) || definition.includes(query) || badge.includes(query)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
          // Ensure it collapses when hidden to maintain nice spacing
          card.classList.remove('expanded');
        }
      });

      // Hide whole topic categories if all concepts inside them are filtered out
      categories.forEach(category => {
        const visibleCards = category.querySelectorAll('.concept-card[style=""]');
        const cardsCount = category.querySelectorAll('.concept-card').length;
        const hiddenCardsCount = category.querySelectorAll('.concept-card[style="display: none;"]').length;
        
        if (cardsCount === hiddenCardsCount) {
          category.style.display = 'none';
        } else {
          category.style.display = '';
        }
      });
    });
  }

  // ==========================================
  // 6. Interactive Expandable Cards (Accordion style)
  // ==========================================
  conceptCards.forEach(card => {
    const expandBtn = card.querySelector('.btn-card-expand');
    
    // Toggle card expansion on button click
    if (expandBtn) {
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop click from bubling up
        const isExpanded = card.classList.contains('expanded');
        
        // Close other expanded cards to save space
        conceptCards.forEach(otherCard => {
          if (otherCard !== card) {
            otherCard.classList.remove('expanded');
          }
        });
        
        card.classList.toggle('expanded');
        
        // Smoothly scroll expanded card into view
        if (!isExpanded) {
          setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 300);
        }
      });
    }
    
    // Click on card body also toggles expansion unless they select text
    card.addEventListener('click', (e) => {
      if (window.getSelection().toString()) return; // Don't trigger if selecting text
      if (e.target.closest('a') || e.target.closest('code') || e.target.closest('.expanded-content')) return; // Ignore clicks inside interactive items
      
      const expandBtn = card.querySelector('.btn-card-expand');
      if (expandBtn) expandBtn.click();
    });
  });

  // ==========================================
  // 7. Stats Counter Animation
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-info h3');
  
  const countUpOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
  };

  const countUpObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseInt(target.getAttribute('data-count'), 10);
        let currentCount = 0;
        const duration = 1500; // Total count duration in ms
        const increment = countTo / (duration / 16); // ~60fps frame rate
        
        const updateCount = () => {
          currentCount += increment;
          if (currentCount < countTo) {
            target.textContent = Math.floor(currentCount);
            requestAnimationFrame(updateCount);
          } else {
            target.textContent = countTo;
          }
        };
        
        updateCount();
        observer.unobserve(target); // Only count up once
      }
    });
  }, countUpOptions);

  statNumbers.forEach(stat => {
    countUpObserver.observe(stat);
  });

  // ==========================================
  // 8. Research Timeline Expansion
  // ==========================================
  const timelineCards = document.querySelectorAll('.timeline-card');
  
  timelineCards.forEach(card => {
    const toggleBtn = card.querySelector('.btn-timeline-toggle');
    
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isActive = card.classList.contains('active');
        
        // Close others
        timelineCards.forEach(otherCard => {
          otherCard.classList.remove('active');
        });
        
        if (!isActive) {
          card.classList.add('active');
        }
      });
    }
  });

  // ==========================================
  // 9. FAQ Accordions
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
        });
        
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ==========================================
  // 10. Fade-In animations while scrolling
  // ==========================================
  const fadeInItems = document.querySelectorAll('.fade-in-scroll');
  
  const fadeInOptions = {
    root: null,
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters screen
  };

  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, fadeInOptions);

  fadeInItems.forEach(item => {
    fadeInObserver.observe(item);
  });

  // ==========================================
  // 11. PDF Print UI Trigger
  // ==========================================
  const downloadPdfBtn = document.getElementById('download-pdf');
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      // Direct window.print() leverages the custom @media print rules written in style.css
      window.print();
    });
  }

  // ==========================================
  // 12. Contact Form Interactivity
  // ==========================================
  const contactForm = document.getElementById('submission-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Simulate form saving and state update
      submitBtn.innerHTML = `
        <svg class="btn-icon" style="animation: spin 1s linear infinite; width:16px; height:16px; fill:currentColor;" viewBox="0 0 24 24">
          <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
        </svg> Submitting...
      `;
      submitBtn.disabled = true;

      // Add a CSS animation for spinning inline if missing
      if (!document.getElementById('spin-style')) {
        const style = document.createElement('style');
        style.id = 'spin-style';
        style.innerHTML = '@keyframes spin { 100% { transform: rotate(360deg); } }';
        document.head.appendChild(style);
      }

      setTimeout(() => {
        submitBtn.innerHTML = '✓ Submitted Successfully';
        submitBtn.style.backgroundColor = '#4CAF50';
        submitBtn.style.borderColor = '#4CAF50';
        
        // Reset form
        contactForm.reset();
        
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.borderColor = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }
});
