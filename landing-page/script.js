/* ==========================================================================
   Smart Local Tour Guide — Landing Page Script
   Minimal, dependency-free JavaScript (no jQuery, no animation libraries)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  /* ----------------------------------------------------------------
     1. Sticky navbar shadow on scroll
  ---------------------------------------------------------------- */
  var navbar = document.getElementById("mainNavbar");
  var navCollapseEl = document.getElementById("navbarContent");
  var navToggler = document.querySelector('.navbar-toggler[data-bs-target="#navbarContent"]');
  var authModal = document.getElementById("authModal");
  var authOpenButtons = document.querySelectorAll('[data-bs-target="#authModal"]');
  var authCloseButtons = document.querySelectorAll('[data-bs-dismiss="modal"]');
  var authBackdrop = null;

  function handleNavbarScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  }

  function showNavCollapse() {
    if (!navCollapseEl) {
      return;
    }

    navCollapseEl.classList.add("show");
    navCollapseEl.style.display = "flex";
  }

  function hideNavCollapse() {
    if (!navCollapseEl) {
      return;
    }

    navCollapseEl.classList.remove("show");
    navCollapseEl.style.display = "none";
  }

  function isMobileNavOpen() {
    return Boolean(navCollapseEl && navCollapseEl.classList.contains("show"));
  }

  function ensureAuthBackdrop() {
    if (authBackdrop) {
      return authBackdrop;
    }

    authBackdrop = document.createElement("div");
    authBackdrop.className = "modal-backdrop fade show";
    document.body.appendChild(authBackdrop);
    authBackdrop.addEventListener("click", closeAuthModal);
    return authBackdrop;
  }

  function removeAuthBackdrop() {
    if (authBackdrop && authBackdrop.parentNode) {
      authBackdrop.parentNode.removeChild(authBackdrop);
    }

    authBackdrop = null;
  }

  function openAuthModal() {
    if (!authModal) {
      return;
    }

    authModal.style.display = "block";
    authModal.classList.add("show");
    authModal.removeAttribute("aria-hidden");
    document.body.classList.add("modal-open");
    ensureAuthBackdrop();
  }

  function closeAuthModal() {
    if (!authModal) {
      return;
    }

    authModal.classList.remove("show");
    authModal.style.display = "none";
    authModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    removeAuthBackdrop();
  }

  if (navbar) {
    handleNavbarScroll();
    window.addEventListener("scroll", handleNavbarScroll);
  }

  if (navToggler) {
    navToggler.addEventListener("click", function () {
      if (isMobileNavOpen()) {
        hideNavCollapse();
      } else {
        showNavCollapse();
      }
    });
  }

  /* ----------------------------------------------------------------
     2. Close mobile nav menu after a link is clicked
  ---------------------------------------------------------------- */
  var navLinks = document.querySelectorAll(".nav-link-custom");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (isMobileNavOpen()) {
        hideNavCollapse();
      }
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 992) {
      if (navCollapseEl) {
        navCollapseEl.style.display = "";
      }
    } else if (!isMobileNavOpen()) {
      hideNavCollapse();
    }
  });

  /* ----------------------------------------------------------------
     3. Fade-in sections as they enter the viewport
  ---------------------------------------------------------------- */
  var fadeElements = document.querySelectorAll(".fade-in");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Fallback for older browsers: just show everything */
    fadeElements.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ----------------------------------------------------------------
     4. Dynamic copyright year in footer
  ---------------------------------------------------------------- */
  var yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------------
     5. "Open Dashboard" button — redirect to the React dashboard
        Update DASHBOARD_URL to point to your deployed dashboard.
  ---------------------------------------------------------------- */
  var DASHBOARD_URL = "http://localhost:5173/dashboard";
  var dashboardButtons = document.querySelectorAll(".js-open-dashboard");

  dashboardButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      window.location.href = DASHBOARD_URL;
    });
  });

  /* ----------------------------------------------------------------
     6. Auth modal helpers & Login Validation
  ---------------------------------------------------------------- */
  var authForms = document.querySelectorAll(".auth-form");
  var authSwitchButtons = document.querySelectorAll(".js-auth-switch");

  // Keep signup form default prevention
  var signupForm = document.querySelector("#signupPane form");
  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();
      alert("Sign up is disabled for this prototype. Please use the Login tab with default credentials.");
    });
  }

  // Target the specific login form
  var loginForm = document.querySelector("#loginPane form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      
      var emailInput = document.getElementById("loginEmail");
      var passwordInput = document.getElementById("loginPassword");
      var submitButton = loginForm.querySelector("button[type='submit']");
      
      var email = emailInput ? emailInput.value.trim() : "";
      var password = passwordInput ? passwordInput.value.trim() : "";
      
      // Default credentials check
      if (email === "user@example.com" && password === "password") {
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Authorizing location...';
        }
        
        // Request geolocation
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            function (position) {
              var lat = position.coords.latitude;
              var lng = position.coords.longitude;
              // Redirect with extracted location
              window.location.href = DASHBOARD_URL + "?lat=" + lat + "&lng=" + lng;
            },
            function (error) {
              console.warn("Geolocation failed/denied, redirecting with default Visakhapatnam center.", error);
              // Fallback to Vizag center coordinates
              window.location.href = DASHBOARD_URL + "?lat=17.7200&lng=83.3150";
            },
            { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
          );
        } else {
          // Geolocation not supported, fallback to Vizag center coordinates
          window.location.href = DASHBOARD_URL + "?lat=17.7200&lng=83.3150";
        }
      } else {
        alert("Invalid credentials.\n\nUse the default prototype credentials:\nEmail: user@example.com\nPassword: password");
      }
    });
  }

  authSwitchButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var targetSelector = button.getAttribute("data-auth-target");
      var targetTab = targetSelector ? document.querySelector(targetSelector) : null;

      if (targetTab) {
        var tab = bootstrap.Tab.getOrCreateInstance(targetTab);
        tab.show();
      }
    });
  });

  // Re-insert modal action listeners so the modal opens and closes
  authOpenButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      openAuthModal();
    });
  });

  authCloseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      closeAuthModal();
    });
  });

  if (authModal) {
    authModal.addEventListener("click", function (event) {
      if (event.target === authModal) {
        closeAuthModal();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && authModal && authModal.classList.contains("show")) {
      closeAuthModal();
    }
  });

});

