import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/auth.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmailToken();
    }
  }, [token]);

  const verifyEmailToken = async () => {
    try {
      setLoading(true);
      await userAPI.verifyEmail(token);
      setVerified(true);
      toast.success('Email verified successfully!');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Email verification failed');
      setVerified(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="auth-card">
        <div className="auth-header">
          <h1>MedVault</h1>
          <p>Email Verification</p>
        </div>

        <div className="verify-content">
          {loading ? (
            <div className="loading-spinner">
              <p>Verifying your email...</p>
            </div>
          ) : verified ? (
            <div className="verify-success">
              <p>✓ Your email has been verified successfully!</p>
              <p>Redirecting to login...</p>
            </div>
          ) : (
            <div className="verify-info">
              <p>Check your email for the verification link.</p>
              <p>Click the link to verify your account.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
