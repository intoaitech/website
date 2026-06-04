/* ==========================================================================
   MARITY STATIC - JAVASCRIPT INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // Initialize Custom Cursor Trailer
  initCustomCursor();
  
  // Initialize Hero Slider
  initHeroSlider();
  
  // Initialize About & Mission Tabs
  initInteractiveTabs();
  
  // Initialize Accordions
  initAccordions();
  
  // Initialize Horizontal Carousels (News & Team list)
  initCarousels();
  
  // Initialize HTML5 Canvas Charts with IBM Blue Gradients
  initCanvasCharts();
  
  // Initialize Mobile Menu Drawer
  initMobileMenu();

  // Smooth Scroll to Top
  initBackToTop();
});

/* ==========================================================================
   Custom Interactive Cursor Trailer
   ========================================================================== */
function initCustomCursor() {
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  
  dot.className = 'custom-cursor-dot';
  ring.className = 'custom-cursor-ring';
  
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  
  let mouse = { x: 0, y: 0 };
  let ringPos = { x: 0, y: 0 };
  let dotPos = { x: 0, y: 0 };
  
  // Target position en route
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  
  // Smooth Interpolation loop (Lerp)
  function renderCursor() {
    // Lerp dot
    dotPos.x += (mouse.x - dotPos.x) * 0.3;
    dotPos.y += (mouse.y - dotPos.y) * 0.3;
    dot.style.left = `${dotPos.x}px`;
    dot.style.top = `${dotPos.y}px`;
    
    // Lerp ring (slower for dragging trail effect)
    ringPos.x += (mouse.x - ringPos.x) * 0.12;
    ringPos.y += (mouse.y - ringPos.y) * 0.12;
    ring.style.left = `${ringPos.x}px`;
    ring.style.top = `${ringPos.y}px`;
    
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);
  
  // Interactive Elements Hover effects
  const hoverElements = document.querySelectorAll('a, button, .slider-arrow, .tab-anchor, .accordion-header, .project-card, .team-card, .news-card, input, select');
  
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hovering');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hovering');
    });
  });
}

/* ==========================================================================
   Hero Slider
   ========================================================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slider-section .slide');
  const dots = document.querySelectorAll('.hero-slider-section .slider-dot');
  const prevBtn = document.querySelector('.hero-slider-section .slider-arrow-prev');
  const nextBtn = document.querySelector('.hero-slider-section .slider-arrow-next');
  
  if (!slides.length) return;
  
  let currentSlide = 0;
  let slideInterval;
  
  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }
  
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }
  
  function prevSlide() {
    goToSlide(currentSlide - 1);
  }
  
  // Bind Actions
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoplay();
    });
  });
  
  // Autoplay
  function startAutoplay() {
    slideInterval = setInterval(nextSlide, 6000);
  }
  
  function resetAutoplay() {
    clearInterval(slideInterval);
    startAutoplay();
  }
  
  startAutoplay();
}

/* ==========================================================================
   Interactive Tabs
   ========================================================================== */
function initInteractiveTabs() {
  const anchors = document.querySelectorAll('.tab-anchor');
  const panes = document.querySelectorAll('.tab-pane');
  
  anchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = anchor.getAttribute('href');
      const targetPane = document.querySelector(targetId);
      
      if (!targetPane) return;
      
      // Remove actives
      anchors.forEach(a => a.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      
      // Set active
      anchor.classList.add('active');
      targetPane.classList.add('active');
    });
  });
}

/* ==========================================================================
   Accordions
   ========================================================================== */
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');
  
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = header.nextElementSibling;
      const isActive = item.classList.contains('active');
      
      // Close all other accordions in this group
      const parentGroup = item.parentElement;
      const siblingItems = parentGroup.querySelectorAll('.accordion-item');
      siblingItems.forEach(sibling => {
        sibling.classList.remove('active');
        sibling.querySelector('.accordion-content').style.maxHeight = null;
      });
      
      if (!isActive) {
        item.classList.add('active');
        // Scrollheight gives the exact content size for smooth expansion
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });
}

/* ==========================================================================
   Horizontal Carousels (News & Team Lists)
   ========================================================================== */
function initCarousels() {
  const carousels = [
    {
      track: document.querySelector('.news-carousel .carousel-inner-track'),
      prev: document.querySelector('.news-carousel-prev'),
      next: document.querySelector('.news-carousel-next'),
      getCardWidth: () => document.querySelector('.news-card').offsetWidth + 20
    },
    {
      track: document.querySelector('.team-carousel .carousel-inner-track'),
      prev: document.querySelector('.team-carousel-prev'),
      next: document.querySelector('.team-carousel-next'),
      getCardWidth: () => document.querySelector('.team-card').offsetWidth + 20
    }
  ];

  carousels.forEach(c => {
    if (!c.track) return;
    
    let position = 0;
    
    // Slide Right
    c.next.addEventListener('click', () => {
      const maxScroll = c.track.scrollWidth - c.track.parentElement.offsetWidth;
      const step = c.getCardWidth();
      
      position = Math.min(position + step, maxScroll);
      c.track.style.transform = `translateX(-${position}px)`;
    });
    
    // Slide Left
    c.prev.addEventListener('click', () => {
      const step = c.getCardWidth();
      
      position = Math.max(position - step, 0);
      c.track.style.transform = `translateX(-${position}px)`;
    });
    
    // Resize reset
    window.addEventListener('resize', () => {
      position = 0;
      c.track.style.transform = `translateX(0px)`;
    });
  });
}

/* ==========================================================================
   Canvas Charts using HTML5 Graphics API
   ========================================================================== */
function initCanvasCharts() {
  
  // 1. Doughnut Chart (Neural, Precision, Medical)
  const doughnutCanvas = document.getElementById('qodef-charts-canvas-1033367381');
  if (doughnutCanvas) {
    drawDoughnutChart(doughnutCanvas);
  }
  
  // 2. Bar Chart (Data Science)
  const barCanvas = document.getElementById('qodef-charts-canvas-1679423142');
  if (barCanvas) {
    drawBarChart(barCanvas);
  }
}

// Doughnut Chart Implementation
function drawDoughnutChart(canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  // Solve blur on Retina screens
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  
  const width = rect.width;
  const height = rect.height;
  const cx = width / 2;
  const cy = height / 2;
  const outerRadius = Math.min(width, height) / 2.3;
  const innerRadius = outerRadius * 0.68;
  
  const data = [40, 50, 20];
  const colors = ['#0f62fe', '#7baecf', '#d0e2ff']; // IBM Blue 60, Theme Light Blue, IBM Blue 10
  
  const total = data.reduce((sum, val) => sum + val, 0);
  let startAngle = -Math.PI / 2; // Start from top
  
  // Animation state
  let currentPercentage = 0;
  
  function animate() {
    if (currentPercentage < 100) {
      currentPercentage += 1.5;
      
      // Clear
      ctx.clearRect(0, 0, width, height);
      
      // Background track ring
      ctx.beginPath();
      ctx.arc(cx, cy, (outerRadius + innerRadius) / 2, 0, Math.PI * 2);
      ctx.lineWidth = outerRadius - innerRadius;
      ctx.strokeStyle = 'rgba(14, 32, 42, 0.06)';
      ctx.stroke();
      
      startAngle = -Math.PI / 2;
      
      data.forEach((val, i) => {
        const sliceAngle = (val / total) * (currentPercentage / 100) * (Math.PI * 2);
        
        ctx.beginPath();
        ctx.arc(cx, cy, (outerRadius + innerRadius) / 2, startAngle, startAngle + sliceAngle);
        ctx.lineWidth = outerRadius - innerRadius;
        ctx.strokeStyle = colors[i];
        ctx.lineCap = 'round';
        ctx.stroke();
        
        startAngle += sliceAngle;
      });
      
      // Center Text label
      ctx.fillStyle = '#0e202a';
      ctx.font = "bold 18px 'DM Sans', sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("110+", cx, cy - 8);
      
      ctx.fillStyle = '#9a9a9a';
      ctx.font = "10px 'DM Sans', sans-serif";
      ctx.fillText("DATASETS", cx, cy + 12);
      
      requestAnimationFrame(animate);
    }
  }
  
  // Trigger animation when visible
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animate();
      observer.disconnect();
    }
  }, { threshold: 0.1 });
  
  observer.observe(canvas);
}

// Bar Chart Implementation
function drawBarChart(canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  
  const width = rect.width;
  const height = rect.height;
  
  // Padding & bounds
  const paddingLeft = 40;
  const paddingBottom = 40;
  const paddingTop = 20;
  const paddingRight = 20;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  // Data sets
  const categories = ["Q1", "Q2", "Q3", "Q4"];
  const dataset1 = [25, 41, 58, 62]; // IBM Blue gradient bars
  const dataset2 = [44, 36, 25, 61]; // Slate/Teal gradient bars
  
  const maxValue = 70;
  let progress = 0;
  
  function animate() {
    if (progress < 1) {
      progress += 0.02;
      
      ctx.clearRect(0, 0, width, height);
      
      // Grid lines
      const gridCount = 5;
      ctx.strokeStyle = 'rgba(14, 32, 42, 0.06)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= gridCount; i++) {
        const y = paddingTop + (chartHeight * i) / gridCount;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(width - paddingRight, y);
        ctx.stroke();
        
        // Y-axis value labels
        ctx.fillStyle = '#9a9a9a';
        ctx.font = "10px 'DM Sans', sans-serif";
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const labelVal = Math.round(maxValue * (gridCount - i) / gridCount);
        ctx.fillText(labelVal, paddingLeft - 10, y);
      }
      
      // Draw Bars
      const groupCount = categories.length;
      const groupWidth = chartWidth / groupCount;
      const barSpacing = 6;
      const barWidth = (groupWidth - 30) / 2;
      
      for (let i = 0; i < groupCount; i++) {
        const groupX = paddingLeft + (i * groupWidth) + 15;
        
        // --- Bar 1 (Dataset 1) ---
        const val1 = dataset1[i] * progress;
        const barHeight1 = (val1 / maxValue) * chartHeight;
        const x1 = groupX;
        const y1 = height - paddingBottom - barHeight1;
        
        // Draw Bar 1 with rounded corners and IBM Blue gradient
        const grad1 = ctx.createLinearGradient(x1, y1, x1, height - paddingBottom);
        grad1.addColorStop(0, '#0f62fe');
        grad1.addColorStop(1, 'rgba(15, 98, 254, 0.2)');
        
        ctx.fillStyle = grad1;
        drawRoundedRect(ctx, x1, y1, barWidth, barHeight1, 4);
        ctx.fill();
        
        // --- Bar 2 (Dataset 2) ---
        const val2 = dataset2[i] * progress;
        const barHeight2 = (val2 / maxValue) * chartHeight;
        const x2 = groupX + barWidth + barSpacing;
        const y2 = height - paddingBottom - barHeight2;
        
        // Draw Bar 2 with slate gradient
        const grad2 = ctx.createLinearGradient(x2, y2, x2, height - paddingBottom);
        grad2.addColorStop(0, '#7baecf');
        grad2.addColorStop(1, 'rgba(123, 174, 207, 0.2)');
        
        ctx.fillStyle = grad2;
        drawRoundedRect(ctx, x2, y2, barWidth, barHeight2, 4);
        ctx.fill();
        
        // X-axis text labels
        ctx.fillStyle = '#9a9a9a';
        ctx.font = "10px 'DM Sans', sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(categories[i], groupX + barWidth + barSpacing / 2, height - paddingBottom + 12);
      }
      
      requestAnimationFrame(animate);
    }
  }
  
  // Rounded rectangle helper
  function drawRoundedRect(ctx, x, y, width, height, radius) {
    if (height < radius) height = radius; // Avoid errors with super tiny bars
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
  
  // Trigger animation when visible
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animate();
      observer.disconnect();
    }
  }, { threshold: 0.1 });
  
  observer.observe(canvas);
}

/* ==========================================================================
   Mobile Menu Drawer Toggle
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const sidebar = document.querySelector('.sidebar-header');
  
  if (!toggle || !sidebar) return;
  
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('mobile-drawer-open');
    
    // Toggle icon text or design if needed
    if (sidebar.classList.contains('mobile-drawer-open')) {
      toggle.innerHTML = '&#10005;'; // Close symbol
    } else {
      toggle.innerHTML = '&#9776;'; // Hamburger symbol
    }
  });
  
  // Close drawer if clicking outside
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('mobile-drawer-open') && !sidebar.contains(e.target) && e.target !== toggle) {
      sidebar.classList.remove('mobile-drawer-open');
      toggle.innerHTML = '&#9776;';
    }
  });
}

/* ==========================================================================
   Back To Top Action
   ========================================================================== */
function initBackToTop() {
  const backBtn = document.querySelector('.back-to-top-btn');
  if (!backBtn) return;
  
  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
