import { useState } from 'react';
import '../styles/base.css';
import { Link } from 'react-router-dom';

const collections = [
  {
    name: 'Urban Explorer',
    desc: 'Designed for city adventurers',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=500&q=80',
    href: '#',
  },
  {
    name: 'Executive Pro',
    desc: 'For the modern professional',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80',
    href: '#',
  },
  {
    name: 'Weekend Voyager',
    desc: 'Perfect short trip companion',
    image: 'https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=500&q=80',
    href: '#',
  },
];

const testimonials = [
  {
    rating: 5,
    text: "The quality exceeded all my expectations. After daily use for two years, my BagHub looks better than ever.",
    author: "Michael T., Designer",
  },
  {
    rating: 5,
    text: "This is the first bag that's stood up to weekly travel abuse while still looking professional.",
    author: "Sarah K., Consultant",
  },
  {
    rating: 5,
    text: "The perfect balance of style and function. I constantly get compliments while enjoying all the smart features.",
    author: "David R., Photographer",
  },
  {
    rating: 5,
    text: "Worth every penny. The craftsmanship is evident in every stitch. I'll never buy from another brand again.",
    author: "Jessica L., Executive",
  },
];

export default function ProfessionalLanding() {
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState('design');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="professional-landing">
      {/* Navigation */}
      
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="logo">BAGHUB</div>

          {/* Hamburger icon for mobile */}
          <div
            className="hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Desktop menu */}
          <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <a href="#collections" onClick={() => setIsMenuOpen(false)}>Collections</a>
            <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#materials" onClick={() => setIsMenuOpen(false)}>Materials</a>
            <a href="#testimonials" onClick={() => setIsMenuOpen(false)}>Testimonials</a>
            <a href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <button className="nav-cta">Sign In</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Redefine Your Carry Experience</h1>
          <p className="hero-subtext">
            Premium bags designed for the modern lifestyle.
            Where functionality meets exceptional craftsmanship.
          </p>
          <div className="hero-cta">
            <Link to="/shop"><button className="primary-cta">Shop Collection</button></Link>
            <Link to="/register"><button className="secondary-cta">Get Started</button></Link>
          </div>
          <div className="trust-badges">
            <span>✓ Premium Materials</span>
            <span>✓ Lifetime Warranty</span>
            <span>✓ Eco-Friendly</span>
            <span>✓ Free Shipping Worldwide</span>
          </div>
        </div>
        {/* Hero with stunning background image set from CSS */}
      </section>

      {/* Brand Showcase */}
      

      {/* Collections Preview */}
     

      {/* USP Section */}
      <section className="usp-section">
        <div className="section-header">
          <h2>Why Choose BagHub</h2>
          <p>We're redefining what premium bags should be</p>
        </div>
        <div className="usp-container">
          <div className="usp-card">
            <div className="usp-icon">✧</div>
            <h3>Timeless Design</h3>
            <p>Classic aesthetics that never go out of style, crafted to complement any outfit or occasion.</p>
          </div>
          <div className="usp-card">
            <div className="usp-icon">♻</div>
            <h3>Sustainable Materials</h3>
            <p>Ethically sourced and environmentally responsible materials with minimal ecological footprint.</p>
          </div>
          <div className="usp-card">
            <div className="usp-icon">⚙</div>
            <h3>Smart Features</h3>
            <p>Innovative organization systems designed for modern needs and digital lifestyles.</p>
          </div>
          <div className="usp-card">
            <div className="usp-icon">✋</div>
            <h3>Artisan Crafted</h3>
            <p>Each piece handmade with precision by master craftsmen with decades of experience.</p>
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2>Thoughtful Features</h2>
          <p>Every detail meticulously considered</p>
        </div>
        <div className="features-tabs">
          <button
            className={activeTab === 'design' ? 'active' : ''}
            onClick={() => setActiveTab('design')}
          >
            Design Philosophy
          </button>
          <button
            className={activeTab === 'functionality' ? 'active' : ''}
            onClick={() => setActiveTab('functionality')}
          >
            Functionality
          </button>
          <button
            className={activeTab === 'materials' ? 'active' : ''}
            onClick={() => setActiveTab('materials')}
          >
            Material Innovation
          </button>
        </div>
        <div className="features-content">
          {activeTab === 'design' && (
            <div className="tab-content">
              <h3>Human-Centered Design</h3>
              <p>Our design process begins with research into how people actually use their bags in daily life. We blend ergonomic principles with aesthetic excellence for pieces that feel as good as they look.</p>
              <ul>
                <li>Weight distribution analysis</li>
                <li>Streamlined silhouettes</li>
                <li>Customizable elements</li>
              </ul>
            </div>
          )}
          {activeTab === 'functionality' && (
            <div className="tab-content">
              <h3>Engineered for Real Life</h3>
              <p>Our bags are packed with innovative features that solve real problems for modern carry needs.</p>
              <ul>
                <li>RFID-protected pockets</li>
                <li>Quick-access compartments</li>
                <li>Weather-resistant zippers</li>
                <li>Modular attachments</li>
              </ul>
            </div>
          )}
          {activeTab === 'materials' && (
            <div className="tab-content">
              <h3>Material Excellence</h3>
              <p>We source only the finest, most sustainable materials that meet our rigorous standards for durability and feel.</p>
              <ul>
                <li>Vegetable-tanned full-grain leathers</li>
                <li>Recycled high-tenacity nylon</li>
                <li>Organic cotton canvas</li>
                <li>Responsibly sourced hardware</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-header">
          <h2>What Our Customers Say</h2>
          <p>Join thousands of satisfied customers worldwide</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="rating">{'★★★★★'.slice(0, t.rating)}</div>
              <p>"{t.text}"</p>
              <div className="author">- {t.author}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" id="faq">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know</p>
        </div>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>What makes BagHub bags different?</h3>
            <p>Our bags combine heritage craftsmanship with modern innovation. Only premium materials, timeless design, and rigorous quality control.</p>
          </div>
          <div className="faq-item">
            <h3>How do I care for my bag?</h3>
            <p>Use leather conditioner for leathers; spot clean fabric bags. Avoid prolonged sun exposure.</p>
          </div>
          <div className="faq-item">
            <h3>What is your return policy?</h3>
            <p>30-day return policy for unused items. Lifetime warranty against manufacturing defects on premium lines.</p>
          </div>
          <div className="faq-item">
            <h3>Do you offer international shipping?</h3>
            <p>Yes—worldwide shipping, free on orders over $200. Most orders arrive within 7–10 business days.</p>
          </div>
          <div className="faq-item">
            <h3>Can I customize my bag?</h3>
            <p>We offer monogramming on select styles, with a full customization program launching soon.</p>
          </div>
          <div className="faq-item">
            <h3>How do I know which size is right?</h3>
            <p>Check product pages for dimensions and fit guides, or contact support for personal help.</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="cta-content">
          <h2>Ready to Elevate Your Everyday Carry?</h2>
          <p>Join thousands of satisfied customers. Experience the BagHub difference.</p>
          <Link to="/shop"><button className="primary-cta">Shop Now</button></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-col">
            <h4>Shop</h4>
            <a href="#">Backpacks</a>
            <a href="#">Briefcases</a>
            <a href="#">Weekenders</a>
            <a href="#">Totes</a>
            <a href="#">Accessories</a>
            <a href="#">New Arrivals</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">Our Story</a>
            <a href="#">Sustainability</a>
            <a href="#">Craftsmanship</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
            <a href="#">Blog</a>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="#">Contact Us</a>
            <a href="#">FAQs</a>
            <a href="#">Shipping</a>
            <a href="#">Returns</a>
            <a href="#">Warranty</a>
            <a href="#">Size Guide</a>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="#">Instagram</a>
              <a href="#">Twitter</a>
              <a href="#">Pinterest</a>
              <a href="#">Facebook</a>
              <a href="#">YouTube</a>
            </div>
            <div className="newsletter">
              <h4>Newsletter</h4>
              <p>Subscribe for updates and exclusive offers</p>
              <div className="email-capture">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button>→</button>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2023 BagHub. All rights reserved.</p>
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Accessibility</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
