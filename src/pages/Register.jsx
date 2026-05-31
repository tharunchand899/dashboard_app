import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { UserPlus, Mail, Lock, AlertCircle, Compass, Key } from 'lucide-react';

/**
 * Register Page Component.
 * Registers users using Reqres API with mockup visual parity.
 */
const Register = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('wanderlog_reqres_api_key') || '';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // If already authenticated, redirect away
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.register(email, password, apiKey);

      if (apiKey.trim()) {
        localStorage.setItem('wanderlog_reqres_api_key', apiKey.trim());
      } else {
        localStorage.removeItem('wanderlog_reqres_api_key');
      }

      setSuccess(response.isMock
        ? 'Using offline demo account. Redirecting...'
        : 'Account created successfully! Redirecting...'
      );
      
      // Auto login and redirect
      setTimeout(() => {
        login(response.token);
        navigate('/dashboard', { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Check details.');
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('eve.holt@reqres.in');
    setPassword('pistol');
    setConfirmPassword('pistol');
  };

  const handleGoogleSignUp = () => {
    setIsLoading(true);
    setSuccess('Connecting with Google Account...');
    setTimeout(() => {
      login('google_simulated_token');
      navigate('/dashboard', { replace: true });
    }, 1500);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Mockup Brand Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Compass size={36} className="auth-logo-icon" />
          </div>
          <h2 className="auth-title">WanderLog</h2>
          <p className="auth-subtitle" style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--brand-teal)' }}>
            Your journey. Your bucket list.
          </p>
        </div>

        {/* Welcome Text */}
        <div style={{ marginBottom: '24px', textAlign: 'left' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Create account</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Sign up to start planning your global journey.</p>
        </div>

        {error && (
          <div className="auth-alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-alert alert-success">
            <div className="circle-check-spinner"></div>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-with-aside">
              <label htmlFor="apiKey">Reqres API Key</label>
              <span className="aside-text">Optional</span>
            </div>
            <div className="input-with-icon">
              <Key size={16} className="input-icon" />
              <input
                id="apiKey"
                type="text"
                placeholder="Leave blank for offline demo fallback"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="button-spinner-container">
                <span className="btn-spinner"></span>
                <span>Signing Up...</span>
              </span>
            ) : (
              <>
                <span>Sign Up</span>
                <UserPlus size={18} />
              </>
            )}
          </button>
        </form>

        {/* Divider matching screen 1 mockup */}
        <div className="auth-divider-or">or</div>

        {/* Continue with Google button */}
        <button 
          type="button" 
          onClick={handleGoogleSignUp} 
          className="google-sign-in-btn"
          disabled={isLoading}
        >
          <svg className="google-icon-svg" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.358-2.848-6.358-6.358s2.848-6.358 6.358-6.358c1.603 0 3.06.595 4.184 1.574l3.072-3.072C19.066.865 15.82 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.91 0 12.012-4.856 12.012-12.24 0-.795-.08-1.57-.216-2.285H12.24z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="auth-demo-tip">
          <button 
            type="button" 
            onClick={fillDemoCredentials} 
            className="demo-credentials-btn"
            disabled={isLoading}
          >
            Use Demo Account (eve.holt@reqres.in)
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
