import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userAPI } from "../services/api";
import "../styles/auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      await userAPI.forgotPassword({ email });
      setEmailSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset email",
      );
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="auth-container">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="auth-card">
          <div className="auth-header">
            <h1>Check Your Email</h1>
            <p>We've sent a password reset link to {email}</p>
          </div>
          <div className="auth-footer">
            <p>
              <Link to="/login">Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="auth-card">
        <div className="auth-header">
          <h1>Forgot Password</h1>
          <p>
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
