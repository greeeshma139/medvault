import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <nav className="home-navbar">
        <h1>MedVault</h1>
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <span>Welcome, {user?.firstName}!</span>
              <button onClick={() => navigate(user?.role === 'patient' ? '/patient-dashboard' : '/professional-dashboard')}>
                Go to Dashboard
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}>Sign In</button>
              <button onClick={() => navigate('/signup')} className="signup-btn">Sign Up</button>
            </>
          )}
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <h2>Your Health, In Your Hands</h2>
          <p>Secure, reliable Electronic Health Record management for patients and healthcare professionals</p>
          {!isAuthenticated ? (
            <div className="hero-buttons">
              <button onClick={() => navigate('/signup')} className="hero-btn primary">Get Started</button>
              <button onClick={() => navigate('/login')} className="hero-btn secondary">Sign In</button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="features-section">
        <h3>Why Choose MedVault?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <h4>🔒 Secure Storage</h4>
            <p>Your medical records are encrypted and securely stored</p>
          </div>
          <div className="feature-card">
            <h4>⚕️ Healthcare Professionals</h4>
            <p>Connect with verified doctors and healthcare providers</p>
          </div>
          <div className="feature-card">
            <h4>📅 Easy Appointments</h4>
            <p>Book and manage appointments with healthcare professionals</p>
          </div>
          <div className="feature-card">
            <h4>📊 Health Tracking</h4>
            <p>Track your medical history and health information</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
