/* ==========================================================================
   WeStay4U — Premium Student Living JavaScript
   ========================================================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. STICKY HEADER & RESPONSIVE MENU
     ========================================================================== */
  const header = document.getElementById('header');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header on scroll
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Hamburger Toggle
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const active = navMenu.classList.toggle('active');
      hamburgerBtn.classList.toggle('active', active);
      hamburgerBtn.setAttribute('aria-expanded', active);
      document.body.style.overflow = active ? 'hidden' : '';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active navigation link highlighter based on scroll spy
  const handleNavHighlight = () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    document.querySelectorAll('section[id]').forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };
  window.addEventListener('scroll', handleNavHighlight, { passive: true });
  handleNavHighlight();


  /* ==========================================================================
     2. DYNAMIC PRICING CONFIGURATOR
     ========================================================================== */
  const sharingBoxes = document.querySelectorAll('.sharing-box');
  const durationBoxes = document.querySelectorAll('.duration-box');
  const addonRows = document.querySelectorAll('.addon-row');
  
  // Output Elements
  const calcBaseLabel = document.getElementById('calcBaseLabel');
  const calcBaseVal = document.getElementById('calcBaseVal');
  const calcAddonsVal = document.getElementById('calcAddonsVal');
  const calcMonthlyVal = document.getElementById('calcMonthlyVal');
  const calcTotalVal = document.getElementById('calcTotalVal');
  const billingAmountDisplay = document.getElementById('billingAmountDisplay');

  const updateConfiguratorValues = () => {
    // 1. Get active sharing base cost
    const activeSharing = document.querySelector('.sharing-box.active');
    const baseRate = parseInt(activeSharing.dataset.base, 10);
    const sharingName = activeSharing.querySelector('.sharing-title').textContent;

    // 2. Sum selected add-ons
    let addonsTotal = 0;
    addonRows.forEach(row => {
      const checkbox = row.querySelector('.addon-checkbox');
      if (checkbox.checked) {
        addonsTotal += parseInt(checkbox.dataset.cost, 10);
      }
    });

    // 3. Get active duration multiplier and months
    const activeDuration = document.querySelector('.duration-box.active');
    const durationMonths = parseInt(activeDuration.dataset.duration, 10);

    // Calculate monthly equivalent and total packages
    const monthlyRateEquivalent = baseRate + addonsTotal;
    const totalPackageValue = monthlyRateEquivalent * durationMonths;

    // Format outputs
    if (calcBaseLabel) {
      const sharingTypeString = sharingName.split(' ')[0]; // "Single", "Double", "Triple"
      calcBaseLabel.textContent = `Calculated Base (${sharingTypeString}):`;
    }
    calcBaseVal.textContent = `₹${baseRate.toLocaleString('en-IN')}/m`;
    calcAddonsVal.textContent = `+₹${addonsTotal.toLocaleString('en-IN')}/m`;
    calcMonthlyVal.textContent = `₹${monthlyRateEquivalent.toLocaleString('en-IN')}/month`;
    
    // Total lock-in styling
    if (durationMonths === 1) {
      calcTotalVal.textContent = `₹${totalPackageValue.toLocaleString('en-IN')}`;
    } else {
      const lakhs = totalPackageValue / 100000;
      calcTotalVal.textContent = `₹${lakhs.toFixed(2)} Lakh`;
    }

    billingAmountDisplay.textContent = `₹${monthlyRateEquivalent.toLocaleString('en-IN')}`;
  };

  // Add event listeners to sharing selections
  sharingBoxes.forEach(box => {
    box.addEventListener('click', () => {
      sharingBoxes.forEach(b => b.classList.remove('active'));
      box.classList.add('active');
      updateConfiguratorValues();
    });
  });

  // Add event listeners to duration selections
  durationBoxes.forEach(box => {
    box.addEventListener('click', () => {
      durationBoxes.forEach(b => b.classList.remove('active'));
      box.classList.add('active');
      updateConfiguratorValues();
    });
  });

  // Add event listeners to add-on togglers
  addonRows.forEach(row => {
    const checkbox = row.querySelector('.addon-checkbox');
    if (checkbox) {
      checkbox.addEventListener('change', () => {
        row.classList.toggle('active', checkbox.checked);
        updateConfiguratorValues();
      });
    }
  });

  // Initial calculation
  if (calcMonthlyVal) {
    updateConfiguratorValues();
  }


  /* ==========================================================================
     3. FILTERABLE RESIDENT GALLERY
     ========================================================================== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const galleryPhotos = document.querySelectorAll('.gallery-photo-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.dataset.filter;

      galleryPhotos.forEach(photo => {
        // Fade effect during transitions
        photo.style.opacity = '0';
        setTimeout(() => {
          if (filterVal === 'all' || photo.dataset.category === filterVal) {
            photo.classList.remove('hidden');
            photo.style.opacity = '1';
          } else {
            photo.classList.add('hidden');
          }
        }, 150);
      });
    });
  });


  /* ==========================================================================
     4. FAQ ACCORDION TOGGLE
     ========================================================================== */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const parentItem = q.parentElement;
      const isActive = parentItem.classList.contains('active');

      // Close all other FAQs
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      if (!isActive) {
        parentItem.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     5. PRICING TAB SWITCHER
     ========================================================================== */
  const tabStudents = document.getElementById('tabStudents');
  const tabOwners = document.getElementById('tabOwners');
  const pricingContentStudents = document.getElementById('pricingContentStudents');
  const pricingContentOwners = document.getElementById('pricingContentOwners');

  if (tabStudents && tabOwners) {
    tabStudents.addEventListener('click', () => {
      tabOwners.classList.remove('active');
      tabStudents.classList.add('active');
      if (pricingContentStudents && pricingContentOwners) {
        pricingContentOwners.classList.add('hidden');
        pricingContentStudents.classList.remove('hidden');
      }
    });

    tabOwners.addEventListener('click', () => {
      tabStudents.classList.remove('active');
      tabOwners.classList.add('active');
      if (pricingContentStudents && pricingContentOwners) {
        pricingContentStudents.classList.add('hidden');
        pricingContentOwners.classList.remove('hidden');
      }
    });
  }

  /* ==========================================================================
     6. INTERACTIVE MAP HIGHLIGHTING
     ========================================================================== */
  const distanceCards = document.querySelectorAll('.distance-card');
  const mapNodes = document.querySelectorAll('.map-node[data-college]');

  const highlightCollegeRoute = (collegeName) => {
    // 1. Toggle active classes on distance cards
    distanceCards.forEach(card => {
      card.classList.toggle('active', card.dataset.targetCollege === collegeName);
    });

    // 2. Toggle active classes on map nodes
    mapNodes.forEach(node => {
      node.classList.toggle('active', node.dataset.college === collegeName);
    });

    // 3. Toggle active classes on SVG path routes
    const amityRoute = document.querySelector('.route-line-amity');
    const gitamRoute = document.querySelector('.route-line-gitam');
    if (amityRoute && gitamRoute) {
      amityRoute.classList.toggle('active', collegeName === 'amity');
      gitamRoute.classList.toggle('active', collegeName === 'gitam');
    }
  };

  distanceCards.forEach(card => {
    card.addEventListener('click', () => {
      const college = card.dataset.targetCollege;
      highlightCollegeRoute(college);
    });
  });

  // Highlight Amity by default on load
  if (distanceCards.length > 0) {
    highlightCollegeRoute('amity');
  }

});
