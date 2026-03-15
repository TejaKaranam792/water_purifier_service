document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle Logic Update
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMenu() {
    if (!mobileMenu || !mobileMenuOverlay) return;
    mobileMenu.classList.remove('translate-x-full');
    mobileMenuOverlay.classList.remove('hidden');
    // slight delay for opacity transition
    setTimeout(() => {
      mobileMenuOverlay.classList.remove('opacity-0');
      mobileMenuOverlay.classList.add('opacity-100');
    }, 10);
    document.body.style.overflow = 'hidden'; // prevent scrolling behind
  }

  function closeMenu() {
    if (!mobileMenu || !mobileMenuOverlay) return;
    mobileMenu.classList.add('translate-x-full');
    mobileMenuOverlay.classList.remove('opacity-100');
    mobileMenuOverlay.classList.add('opacity-0');
    setTimeout(() => {
      mobileMenuOverlay.classList.add('hidden');
    }, 300);
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMenu);
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMenu);
  if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMenu);
  if (mobileLinks) {
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Smooth Scrolling for Anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        if (typeof closeMenu === 'function') closeMenu();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // Scroll Animations (Intersection Observer - now acting as fallback if AOS not loaded)
  const fadeElements = document.querySelectorAll('.fade-in-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeElements.forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });

  // --- NEW PREMIUM UI FEATURES ---

  // 1. Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic'
    });
  }

  // 2. Initialize Vanilla Tilt
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".service-card"), {
      max: 5,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
    });
  }

  // 3. Scroll Progress Indicator & Sticky Glass Header
  const scrollProgress = document.getElementById('scroll-progress');
  const header = document.querySelector('header');

  window.addEventListener('scroll', () => {
    // Progress Bar
    if (scrollProgress) {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight * 100}%`;
      scrollProgress.style.width = scroll;
    }

    // Glass Header
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    }
  });

  // 4. Dark Mode Toggle
  const themeToggleBtn = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Check saved local storage preference
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme == "dark") {
    document.body.classList.add("dark-mode");
  } else if (currentTheme == "light") {
    document.body.classList.remove("dark-mode");
  }
  
  function updateThemeIcon() {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        icon.classList.remove('text-primary');
        icon.classList.add('text-yellow-400');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        icon.classList.remove('text-yellow-400');
        icon.classList.add('text-primary');
    }
  }
  
  updateThemeIcon();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      let theme = "light";
      if (document.body.classList.contains("dark-mode")) {
        theme = "dark";
      }
      localStorage.setItem("theme", theme);

      // Toggle icon
      updateThemeIcon();
    });
  }

  // 5. Magnetic Buttons
  const magneticElements = document.querySelectorAll('.magnetic');
  magneticElements.forEach((elem) => {
    elem.addEventListener('mousemove', (e) => {
      const rect = elem.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      elem.style.transform = `translate(${(x - rect.width / 2) * 0.2}px, ${(y - rect.height / 2) * 0.2}px)`;
    });

    elem.addEventListener('mouseleave', () => {
      elem.style.transform = `translate(0px, 0px)`;
    });
  });

});
