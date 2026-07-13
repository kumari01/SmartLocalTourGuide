import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Landmark,
  Coffee,
  Route,
  Ticket,
  MapPin,
  Search,
  Sparkles,
  Navigation,
  Mail,
  Phone,
  X
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import logoUrl from '../assets/logo.svg';
import heroUrl from '../assets/hero.svg';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  // Component States
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  // Preference Wizard States
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);
  const [prefStep, setPrefStep] = useState(1);
  const [locationMode, setLocationMode] = useState('manual'); // 'gps' | 'manual'
  const [manualLoc, setManualLoc] = useState('Visakhapatnam');
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('2000');
  const [timeAvailable, setTimeAvailable] = useState('Full day');
  const [selectedInterests, setSelectedInterests] = useState(['Nature', 'Historical Places']);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handlePreferenceSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('lat', '17.7200'); // default Visakhapatnam center
    params.set('lng', '83.3150');
    params.set('location', locationMode === 'gps' ? 'My Location (GPS)' : manualLoc);
    if (destination.trim()) params.set('destination', destination.trim());
    params.set('budget', budget);
    params.set('interests', selectedInterests.join(','));
    params.set('time', timeAvailable);

    setIsPrefModalOpen(false);
    navigate(`/dashboard?${params.toString()}`);
  };

  // Signup Form States (Display Only)
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Sticky Navbar Effect on Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Check initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fade-in Elements on Scroll Effect
  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      fadeElements.forEach((el) => observer.observe(el));

      return () => {
        fadeElements.forEach((el) => {
          try {
            observer.unobserve(el);
          } catch (e) {
            // ignore if already clean
          }
        });
      };
    } else {
      // Fallback for older browsers
      fadeElements.forEach((el) => el.classList.add('is-visible'));
    }
  }, []);

  // Form Handlers
  const handleLoginSubmit = (e) => {
    e.preventDefault();

    const email = loginEmail.trim();
    const password = loginPassword.trim();

    if (email === 'user@example.com' && password === 'password') {
      setLoadingLocation(true);

      const proceedToDashboard = (lat, lng) => {
        setLoadingLocation(false);
        setIsAuthOpen(false);
        navigate(`/dashboard?lat=${lat}&lng=${lng}`);
      };

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            proceedToDashboard(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.warn('Geolocation failed/denied, using default Visakhapatnam center.', error);
            proceedToDashboard(17.7200, 83.3150); // Default to Vizag center coords
          },
          { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
        );
      } else {
        proceedToDashboard(17.7200, 83.3150); // Default coordinates if Geolocation API missing
      }
    } else {
      alert('Invalid credentials.\n\nUse the default prototype credentials:\nEmail: user@example.com\nPassword: password');
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    alert('Sign up is disabled for this prototype. Please use the Login tab with default credentials.');
  };

  const handleModalOverlayClick = (e) => {
    if (e.target.classList.contains('auth-modal')) {
      setIsAuthOpen(false);
    }
  };

  return (
    <div className="landing-page-container">

      {/* ============================== NAVBAR ============================== */}
      <header>
        <nav className={`navbar-custom fixed top-0 left-0 right-0 z-50 w-full ${isScrolled ? 'navbar-scrolled' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 navbar-shell h-20">
            <a className="navbar-brand-custom" href="#home" onClick={() => setIsNavOpen(false)}>
              <img src={logoUrl} alt="Smart Local Tour Guide logo" />
              <span>Smart Local Tour Guide</span>
            </a>

            <button
              className="lg:hidden p-2 text-white border border-white/20 rounded-md focus:outline-none"
              type="button"
              onClick={() => setIsNavOpen(!isNavOpen)}
              aria-label="Toggle navigation"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isNavOpen ? (
                  <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
                ) : (
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                )}
              </svg>
            </button>

            {/* Mobile / Desktop Nav Links */}
            <div className={`
              ${isNavOpen ? 'flex' : 'hidden'} 
              lg:flex flex-col lg:flex-row items-stretch lg:items-center 
              absolute lg:relative top-20 lg:top-0 left-4 lg:left-0 right-4 lg:right-0
              p-6 lg:p-0 rounded-2xl lg:rounded-none bg-[#0f0f0f]/98 lg:bg-transparent
              border border-white/10 lg:border-none shadow-2xl lg:shadow-none
              gap-4 lg:gap-8 z-50 lg:w-auto
            `}>
              <ul className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                <li><a className="nav-link-custom block py-2" href="#home" onClick={() => setIsNavOpen(false)}>Home</a></li>
                <li><a className="nav-link-custom block py-2" href="#features" onClick={() => setIsNavOpen(false)}>Features</a></li>
                <li><a className="nav-link-custom block py-2" href="#about" onClick={() => setIsNavOpen(false)}>About</a></li>
                <li><a className="nav-link-custom block py-2" href="#contact" onClick={() => setIsNavOpen(false)}>Contact</a></li>
              </ul>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:ml-8 border-t border-white/10 lg:border-none pt-4 lg:pt-0">
                <button
                  type="button"
                  className="btn btn-navbar-secondary btn-sm px-4 py-2 block text-center cursor-pointer"
                  onClick={() => {
                    setIsPrefModalOpen(true);
                    setPrefStep(1);
                    setIsNavOpen(false);
                  }}
                >
                  Explore
                </button>
                <button
                  type="button"
                  className="btn btn-navbar-login btn-sm px-4 py-2 block w-full sm:w-auto"
                  onClick={() => {
                    setIsAuthOpen(true);
                    setIsNavOpen(false);
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* ============================== AUTH MODAL ============================== */}
      {isAuthOpen && (
        <div className="auth-modal" onClick={handleModalOverlayClick}>
          <div className="auth-modal-content p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="auth-kicker mb-1">Welcome back</p>
                <h2 className="text-2xl font-bold mb-0 text-white">Access your account</h2>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => setIsAuthOpen(false)}
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-4">
              {/* Tab Toggles */}
              <div className="auth-tabs flex mb-6">
                <button
                  className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
                  type="button"
                  onClick={() => setActiveTab('login')}
                >
                  Login
                </button>
                <button
                  className={`nav-link ${activeTab === 'signup' ? 'active' : ''}`}
                  type="button"
                  onClick={() => setActiveTab('signup')}
                >
                  Sign up
                </button>
              </div>

              {/* Tab Panes */}
              {activeTab === 'login' ? (
                <form className="space-y-4" onSubmit={handleLoginSubmit}>
                  {/* Alert banner */}
                  <div className="flex items-start gap-2.5 p-3 rounded-lg border text-sm text-[#0f766e] bg-[#14b8a6]/10 border-[#14b8a6]/20">
                    <Compass className="h-5 w-5 mt-0.5 text-[#0f766e] shrink-0" />
                    <div>
                      Use default credentials:<br />
                      <strong>Email:</strong> <code className="text-[#0f766e]">user@example.com</code> | <strong>Password:</strong> <code className="text-[#0f766e]">password</code>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-white/90">Email address</label>
                    <input
                      type="email"
                      className="auth-input text-white"
                      placeholder="name@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-white/90">Password</label>
                    <input
                      type="password"
                      className="auth-input text-white"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex justify-between items-center text-sm mb-4">
                    <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-white/20 text-[#ff7a18] focus:ring-[#ff7a18]"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span>Remember me</span>
                    </label>
                    <a href="#" className="auth-link text-xs hover:underline" onClick={(e) => e.preventDefault()}>
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-navbar-login w-full py-3 flex items-center justify-center gap-2"
                    disabled={loadingLocation}
                  >
                    {loadingLocation ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Authorizing location...
                      </>
                    ) : 'Login'}
                  </button>

                  <p className="auth-switch-text text-center mt-4 mb-0">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="auth-switch-link"
                      onClick={() => setActiveTab('signup')}
                    >
                      Sign up
                    </button>
                  </p>
                </form>
              ) : (
                <form className="space-y-4" onSubmit={handleSignupSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-white/90">Full name</label>
                      <input
                        type="text"
                        className="auth-input text-white"
                        placeholder="Your name"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-white/90">Email address</label>
                      <input
                        type="email"
                        className="auth-input text-white"
                        placeholder="name@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-white/90">Password</label>
                      <input
                        type="password"
                        className="auth-input text-white"
                        placeholder="Create a password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-white/90">Confirm password</label>
                      <input
                        type="password"
                        className="auth-input text-white"
                        placeholder="Repeat password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-white/20 text-[#ff7a18] focus:ring-[#ff7a18]"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        required
                      />
                      <span>I agree to the terms and privacy policy</span>
                    </label>
                  </div>

                  <button type="submit" className="btn btn-navbar-secondary w-full py-3 mt-4">
                    Create account
                  </button>

                  <p className="auth-switch-text text-center mt-4 mb-0">
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="auth-switch-link"
                      onClick={() => setActiveTab('login')}
                    >
                      Login
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <main>
        {/* ============================== HERO ============================== */}
        <section id="home" className="hero-section flex items-center min-h-[90vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

              {/* Left text content */}
              <div className="w-full lg:w-1/2 text-left space-y-6">
                <span className="section-eyebrow">AI-Powered Travel Companion</span>
                <h1 className="hero-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white">
                  Explore Smarter. <span className="text-gradient">Travel Better.</span>
                </h1>
                <p className="hero-description text-gray-300 text-lg leading-relaxed">
                  Discover nearby attractions, restaurants, local events, and navigate with the
                  shortest route using intelligent AI agents.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPrefModalOpen(true);
                      setPrefStep(1);
                    }}
                    className="btn btn-brand-primary text-center font-medium cursor-pointer"
                  >
                    Start Exploring
                  </button>
                  <a href="#features" className="btn btn-brand-outline text-center font-medium">
                    Learn More
                  </a>
                </div>

                <div className="hero-stats flex flex-wrap gap-8 sm:gap-12 pt-6">
                  <div>
                    <div className="hero-stat-number text-2xl sm:text-3xl font-extrabold text-[#ff7a18]">10k+</div>
                    <div className="hero-stat-label text-sm text-gray-400">Places mapped</div>
                  </div>
                  <div>
                    <div className="hero-stat-number text-2xl sm:text-3xl font-extrabold text-[#ff7a18]">4.8/5</div>
                    <div className="hero-stat-label text-sm text-gray-400">Average rating</div>
                  </div>
                  <div>
                    <div className="hero-stat-number text-2xl sm:text-3xl font-extrabold text-[#ff7a18]">24/7</div>
                    <div className="hero-stat-label text-sm text-gray-400">AI availability</div>
                  </div>
                </div>
              </div>

              {/* Right illustration */}
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="hero-image-wrapper max-w-lg lg:max-w-none w-full">
                  <img src={heroUrl} alt="Map navigation illustration" className="w-full h-auto" />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================== FEATURES ============================== */}
        <section id="features" className="section-padding">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 fade-in space-y-3">
              <span className="section-eyebrow">Features</span>
              <h2 className="section-title text-3xl sm:text-4xl font-bold text-white max-w-2xl mx-auto-text">
                Everything you need to explore a city
              </h2>
              <p className="section-subtitle text-gray-400 text-base max-w-xl mx-auto-text leading-relaxed">
                One assistant for finding places, eating well, getting there, and catching what's happening nearby.
              </p>
            </div>

            {/* Grid structure mapped from Bootstrap cols */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              <div className="fade-in">
                <div className="feature-card">
                  <div className="feature-icon-circle">
                    <Landmark className="h-7 w-7" />
                  </div>
                  <h3 className="feature-title text-xl font-semibold text-white">Attraction Search</h3>
                  <p className="feature-description text-gray-400">Discover nearby tourist attractions.</p>
                </div>
              </div>

              <div className="fade-in">
                <div className="feature-card icon-alt-1">
                  <div className="feature-icon-circle">
                    <Coffee className="h-7 w-7" />
                  </div>
                  <h3 className="feature-title text-xl font-semibold text-white">Restaurant Recommendation</h3>
                  <p className="feature-description text-gray-400">Find restaurants based on ratings and distance.</p>
                </div>
              </div>

              <div className="fade-in">
                <div className="feature-card">
                  <div className="feature-icon-circle">
                    <Route className="h-7 w-7" />
                  </div>
                  <h3 className="feature-title text-xl font-semibold text-white">Navigation</h3>
                  <p className="feature-description text-gray-400">Get distance, ETA, and the best route.</p>
                </div>
              </div>

              <div className="fade-in">
                <div className="feature-card icon-alt-2">
                  <div className="feature-icon-circle">
                    <Ticket className="h-7 w-7" />
                  </div>
                  <h3 className="feature-title text-xl font-semibold text-white">Event Recommendation</h3>
                  <p className="feature-description text-gray-400">Explore nearby festivals, concerts, and local events.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================== HOW IT WORKS ============================== */}
        <section id="about" className="section-padding section-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 fade-in space-y-3">
              <span className="section-eyebrow">How It Works</span>
              <h2 className="section-title text-3xl sm:text-4xl font-bold max-w-2xl mx-auto-text">
                Four steps to your next stop
              </h2>
              <p className="section-subtitle text-base max-w-xl mx-auto-text leading-relaxed">
                From granting location access to arriving at your destination — the AI agent handles the rest.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch justify-between fade-in gap-8 lg:gap-4">

              <div className="step-item">
                <span className="step-number">1</span>
                <div className="step-icon-circle">
                  <MapPin className="h-7 w-7" />
                </div>
                <div className="step-title text-lg font-semibold">Allow Location Access</div>
                <p className="step-description">Grant access so the agent knows where you are.</p>
              </div>

              <div className="step-connector hidden lg:block"></div>

              <div className="step-item">
                <span className="step-number">2</span>
                <div className="step-icon-circle">
                  <Search className="h-7 w-7" />
                </div>
                <div className="step-title text-lg font-semibold">Search Nearby Places</div>
                <p className="step-description">Look up attractions, food, and events around you.</p>
              </div>

              <div className="step-connector hidden lg:block"></div>

              <div className="step-item">
                <span className="step-number">3</span>
                <div className="step-icon-circle">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div className="step-title text-lg font-semibold">AI Finds Recommendations</div>
                <p className="step-description">Get ranked suggestions tailored to your preferences.</p>
              </div>

              <div className="step-connector hidden lg:block"></div>

              <div className="step-item">
                <span className="step-number">4</span>
                <div className="step-icon-circle">
                  <Navigation className="h-7 w-7" />
                </div>
                <div className="step-title text-lg font-semibold">Navigate to Your Destination</div>
                <p className="step-description">Follow the shortest route straight to your pick.</p>
              </div>

            </div>
          </div>
        </section>

        {/* ============================== CALL TO ACTION ============================== */}
        <section id="cta" className="section-padding">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="cta-section fade-in p-8 sm:p-16 flex flex-col items-center justify-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Start Exploring Today</h2>
              <p className="text-white/85 text-base sm:text-lg max-w-lg leading-relaxed">
                Let the AI agent plan your next trip around the city — one recommendation at a time.
              </p>
              <button
                type="button"
                className="btn btn-brand-accent flex items-center gap-2 font-semibold cursor-pointer"
                onClick={() => {
                  setIsPrefModalOpen(true);
                  setPrefStep(1);
                }}
              >
                Start Exploring <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ============================== FOOTER ============================== */}
      <footer id="contact" className="footer-custom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="space-y-4">
              <div className="footer-brand">
                <img src={logoUrl} alt="Smart Local Tour Guide logo" />
                <span>Smart Local Tour Guide</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed text-left">
                An AI-powered assistant for discovering attractions, restaurants, events, and routes nearby.
              </p>
            </div>

            <div className="space-y-3">
              <div className="footer-heading font-semibold text-white">Quick Links</div>
              <a className="footer-link hover:underline" href="#home">Home</a>
              <a className="footer-link hover:underline" href="#features">Features</a>
              <a className="footer-link hover:underline" href="#about">About</a>
              <a className="footer-link hover:underline" href="#contact">Contact</a>
            </div>

            <div className="space-y-3">
              <div className="footer-heading font-semibold text-white">Contact</div>
              <a className="footer-link hover:underline flex items-center gap-2" href="mailto:hello@smartlocaltourguide.com">
                <Mail className="h-4.5 w-4.5" /> hello@smartlocaltourguide.com
              </a>
              <a className="footer-link hover:underline flex items-center gap-2" href="tel:+910000000000">
                <Phone className="h-4.5 w-4.5" /> +91 00000 00000
              </a>
            </div>

            <div className="space-y-4 text-left">
              <div className="footer-heading font-semibold text-white">Follow the project</div>
              <a className="footer-social" href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
                <FaGithub className="h-5 w-5" />
              </a>
            </div>

          </div>

          <hr className="footer-divider" />

          <div className="flex flex-col md:flex-row justify-between align-items-center footer-bottom gap-2 text-sm text-gray-500">
            <span>&copy; {new Date().getFullYear()} Smart Local Tour Guide. All rights reserved.</span>
            <span>Built as a college project.</span>
          </div>
        </div>
      </footer>

      {/* ============================== PREFERENCE WIZARD MODAL ============================== */}
      {isPrefModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 text-slate-800 shadow-2xl relative">
            
            {/* Close Button */}
      <button
        type="button"
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
        onClick={() => setIsPrefModalOpen(false)}
      >
        <X className="h-6 w-6" />
      </button>

      {/* Header */}
      <div className="mb-6">
        <span className="text-[10px] uppercase tracking-widest font-extrabold text-blue-600">Smart Local Tour Guide</span>
        <h2 className="text-2xl font-bold mt-1 text-slate-900 flex items-center gap-2">
          <Compass className="h-6 w-6 text-blue-600 animate-spin" style={{ animationDuration: '12s' }} />
          Plan Your Exploration
        </h2>
        <p className="text-slate-500 text-xs mt-1">Configure your destination, budget, and interests to start.</p>
      </div>

      {/* Stepper Indicator */}
      <div className="flex items-center justify-between mb-8 text-xs font-bold px-2">
        <div className={`flex items-center gap-1.5 ${prefStep >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${prefStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>1</span>
          Location
        </div>
        <div className="flex-1 h-0.5 bg-slate-200 mx-2"></div>
        <div className={`flex items-center gap-1.5 ${prefStep >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${prefStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>2</span>
          Budget & Time
        </div>
        <div className="flex-1 h-0.5 bg-slate-200 mx-2"></div>
        <div className={`flex items-center gap-1.5 ${prefStep >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${prefStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>3</span>
          Interests
        </div>
      </div>

      {/* Step Content */}
      <form onSubmit={handlePreferenceSubmit}>
        {prefStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">Starting Location</label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setLocationMode('gps')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${locationMode === 'gps'
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                >
                  📍 GPS Location
                </button>
                <button
                  type="button"
                  onClick={() => setLocationMode('manual')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${locationMode === 'manual'
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                >
                  ✍️ Enter Manually
                </button>
              </div>

              {locationMode === 'manual' ? (
                <input
                  type="text"
                  className="text-slate-800 w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-hidden"
                  value={manualLoc}
                  onChange={(e) => setManualLoc(e.target.value)}
                  placeholder="e.g. Visakhapatnam"
                  required
                />
              ) : (
                <div className="text-xs bg-teal-50 border border-teal-200/60 text-teal-600 p-3 rounded-lg flex items-center gap-2">
                  <Compass className="h-4 w-4 animate-pulse text-teal-600" />
                  <span>GPS locked on <strong>Visakhapatnam</strong> coordinates.</span>
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">Destination <span className="text-slate-400 text-[11px] font-normal">(Optional)</span></label>
              <input
                type="text"
                className="text-slate-800 w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-hidden"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Rushikonda Beach"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setPrefStep(2)}
                className="btn btn-navbar-secondary py-2.5 px-5 font-bold text-xs cursor-pointer"
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        {prefStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">Budget (INR)</label>
              <div className="flex gap-2 mb-3">
                {['500', '1500', '3000', '5000'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBudget(val)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${budget === val
                        ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-450 text-sm">₹</span>
                <input
                  type="number"
                  className="text-slate-800 w-full pl-7 border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-hidden"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Enter custom budget"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">Time Available</label>
              <div className="grid grid-cols-3 gap-2">
                {['2 hours', 'Half day', 'Full day'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setTimeAvailable(time)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${timeAvailable === time
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setPrefStep(1)}
                className="btn btn-brand-outline py-2.5 px-5 font-bold text-xs cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setPrefStep(3)}
                className="btn btn-navbar-secondary py-2.5 px-5 font-bold text-xs cursor-pointer"
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        {prefStep === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block mb-3 text-sm font-semibold text-slate-700">Select Your Interests</label>
              <div className="grid grid-cols-2 gap-3">
                {['Nature', 'Historical Places', 'Food', 'Adventure', 'Shopping', 'Nightlife'].map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedInterests(selectedInterests.filter(i => i !== interest));
                        } else {
                          setSelectedInterests([...selectedInterests, interest]);
                        }
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${isSelected
                          ? 'bg-blue-50 text-blue-600 border-blue-300 shadow-xs'
                          : 'bg-slate-50 text-slate-650 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      <span>{interest}</span>
                      <span>{isSelected ? '✓' : '+'}</span>
                    </button>
                  );
                })}
              </div>
              {selectedInterests.length === 0 && (
                <p className="text-xs text-rose-500 mt-2 font-medium">Please select at least one interest to customize recommendations.</p>
              )}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setPrefStep(2)}
                className="btn btn-brand-outline py-2.5 px-5 font-bold text-xs cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={selectedInterests.length === 0}
                className="btn btn-brand-accent py-2.5 px-5 font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                Generate Plan 🚀
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  </div>
)}

    </div>
  );
}


