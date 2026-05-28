import { useState } from 'react';
import { api } from '../api';

const Login = ({ onClose, onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async () => {
    setApiError(null);
    const newErrors = {
      email: !formData.email.trim(),
      password: !formData.password.trim(),
    };
    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      setTimeout(() => setErrors({ email: false, password: false }), 2500);
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await api.login(formData.email, formData.password);
      // Save JWT access token in localStorage
      localStorage.setItem('token', response.access_token);
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ email: '', password: '' });
        onLoginSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Login failed:", err);
      setApiError(err.detail || "Authentication failed. Invalid email or password.");
      setTimeout(() => setApiError(null), 5000);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('login-overlay')) onClose();
  };

  return (
    <div className="login-overlay" role="dialog" aria-modal="true" onClick={handleOverlayClick}>
      <div className="login-box">
        <button className="login-close" aria-label="Close login" onClick={onClose}>✕</button>
 
        <div className="login-header">
          <div className="login-logo">AS</div>
          <div className="login-title">Welcome back Akash!!</div>
          <div className="login-sub">Sign in to your account</div>
        </div>

        {!isSuccess ? (
          <div className="login-form">
            {apiError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#f87171', padding: '10px 14px', fontSize: '13px', marginBottom: '1.25rem', fontFamily: 'monospace' }}>
                ⚡ {apiError}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                className={`tech-card form-input ${errors.email ? 'err' : ''}`}
                type="email"
                id="email"
                placeholder="you@email.com"
                autoComplete="off"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoggingIn}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="login-password-wrap">
                <input
                  className={`tech-card form-input ${errors.password ? 'err' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  autoComplete="off"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoggingIn}
                />
                <button
                  className="login-eye"
                  type="button"
                  aria-label="Toggle password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoggingIn}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button className="form-btn login-btn" id="loginSubmitBtn" onClick={handleLogin} disabled={isLoggingIn}>
              {isLoggingIn ? 'Signing In...' : 'Sign In →'}
            </button>

          </div>
        ) : (
          <div className="login-success">
            <span className="check-icon">✓</span>
            <div className="s-title">Login Successful!</div>
            <div className="s-sub">Redirecting you now…</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
