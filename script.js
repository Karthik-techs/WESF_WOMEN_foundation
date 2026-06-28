/* 
   Women's Empowerment and Sports Foundation (WESF)
   Client-Side Interactivity Logic
*/

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Mobile Menu Toggle
  // =========================================================================
  const burgerMenu = document.querySelector('.burger-menu');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const burgerBars = document.querySelectorAll('.burger-bar');

  const toggleMenu = () => {
    navMenu.classList.toggle('open');
    const isOpen = navMenu.classList.contains('open');
    burgerMenu.setAttribute('aria-expanded', isOpen);
    
    // Burger Animation
    if (isOpen) {
      burgerBars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      burgerBars[1].style.opacity = '0';
      burgerBars[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      document.body.style.overflow = 'hidden'; // Lock background scroll
    } else {
      burgerBars[0].style.transform = 'none';
      burgerBars[1].style.opacity = '1';
      burgerBars[2].style.transform = 'none';
      document.body.style.overflow = 'initial';
    }
  };

  burgerMenu.addEventListener('click', toggleMenu);

  // Close mobile menu when clicking links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // =========================================================================
  // 2. Sticky Header and Active Link Tracking on Scroll
  // =========================================================================
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section');

  const handleScroll = () => {
    // Header background toggle
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Section Link Highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger immediately to set correct states

  // =========================================================================
  // 3. Reveal on Scroll (Intersection Observer)
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop observing once revealed
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // =========================================================================
  // 4. Animated Stats Counters
  // =========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target.toLocaleString('en-IN') + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString('en-IN') + suffix;
      }
    }, stepTime);
  };

  const statsSection = document.querySelector('.stats-banner');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(num => animateCounter(num));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    statsObserver.observe(statsSection);
  }

  // =========================================================================
  // 5. About Tabs Interaction
  // =========================================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-content-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // =========================================================================
  // 6. Testimonial Slider / Carousel
  // =========================================================================
  const track = document.querySelector('.slides-track');
  const slides = Array.from(document.querySelectorAll('.slide-item'));
  const nextBtn = document.querySelector('.slider-btn.next');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const dotsContainer = document.querySelector('.slider-dots');
  
  if (track && slides.length > 0) {
    let currentIndex = 0;
    let autoplayInterval;

    // Create Navigation Dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => moveToSlide(idx));
      dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(dotsContainer.querySelectorAll('.dot'));

    const updateSliderUI = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    const moveToSlide = (index) => {
      currentIndex = index;
      updateSliderUI();
      resetAutoplay();
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSliderUI();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSliderUI();
    };

    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
    
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });

    // Touch Swipe Gestures
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const diffX = e.touches[0].clientX - startX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
        isDragging = false;
        resetAutoplay();
      }
    });

    track.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Autoplay Loop
    const startAutoplay = () => {
      autoplayInterval = setInterval(nextSlide, 6000);
    };

    const resetAutoplay = () => {
      clearInterval(autoplayInterval);
      startAutoplay();
    };

    startAutoplay();
  }

  // =========================================================================
  // 7. Gallery Filter and Lightbox Popup
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        if (filterVal === 'all' || item.getAttribute('data-category') === filterVal) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  // Lightbox functionality
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-item-title').textContent;
      lightboxImg.src = img.src;
      lightboxCaption.textContent = title;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'initial';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // =========================================================================
  // 8. Toggling Volunteer & Membership Forms
  // =========================================================================
  const formTabBtns = document.querySelectorAll('.join-tab-btn');
  const formPanels = document.querySelectorAll('.form-panel');

  formTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      formTabBtns.forEach(b => b.classList.remove('active'));
      formPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = btn.getAttribute('data-form');
      document.getElementById(targetPanel).classList.add('active');
    });
  });

  // =========================================================================
  // 9. Toast Notification Handler
  // =========================================================================
  const toast = document.getElementById('toast-notification');
  const toastMessage = toast.querySelector('.toast-message');

  const showToast = (message) => {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  };

  // =========================================================================
  // 10. Form Submissions Simulation with Toast Feedback
  // =========================================================================
  const volunteerForm = document.getElementById('volunteer-form');
  const memberForm = document.getElementById('member-form');
  const contactForm = document.getElementById('contact-form-el');
  const newsletterForm = document.getElementById('newsletter-form-el');

  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = volunteerForm.querySelector('input[type="text"]').value.trim();
      showToast(`Thank you, ${name}! Your volunteering application has been submitted successfully.`);
      volunteerForm.reset();
    });
  }

  if (memberForm) {
    memberForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = memberForm.querySelector('input[type="text"]').value.trim();
      showToast(`Thank you, ${name}! Your WESF membership application is received.`);
      memberForm.reset();
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('input[type="text"]').value.trim();
      showToast(`Thank you, ${name}! We have received your message and will respond shortly.`);
      contactForm.reset();
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value.trim();
      showToast(`Successfully subscribed! Newsletter updates will be sent to ${email}.`);
      newsletterForm.reset();
    });
  }

  // =========================================================================
  // 11. Donation Modal System
  // =========================================================================
  const donateModal = document.getElementById('donate-modal');
  const donateClose = document.querySelector('.donate-modal-close');
  const donateAmtBtns = document.querySelectorAll('.donate-amt-btn');
  const customAmtInput = document.getElementById('custom-donation-amount');
  const donationSubmitForm = document.getElementById('donation-submit-form');
  
  // Open Donation Modal buttons
  const openDonateBtns = document.querySelectorAll('.open-donate-modal');
  
  openDonateBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      donateModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeDonationModal = () => {
    donateModal.classList.remove('show');
    document.body.style.overflow = 'initial';
  };

  donateClose.addEventListener('click', closeDonationModal);
  donateModal.addEventListener('click', (e) => {
    if (e.target === donateModal) {
      closeDonationModal();
    }
  });

  // Selection of Preset Amounts
  donateAmtBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      donateAmtBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      customAmtInput.value = btn.getAttribute('data-value');
    });
  });

  customAmtInput.addEventListener('input', () => {
    // De-select presets if user types a custom amount
    donateAmtBtns.forEach(b => b.classList.remove('active'));
  });

  if (donationSubmitForm) {
    donationSubmitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = customAmtInput.value;
      const donorName = document.getElementById('donor-name').value.trim();
      if (!amount || amount <= 0) {
        showToast('Please enter or select a valid donation amount.');
        return;
      }
      closeDonationModal();
      showToast(`Thank you, ${donorName || 'generous donor'}, for supporting WESF with ₹${parseFloat(amount).toLocaleString('en-IN')}!`);
      donationSubmitForm.reset();
      donateAmtBtns.forEach(b => b.classList.remove('active'));
    });
  }
});
