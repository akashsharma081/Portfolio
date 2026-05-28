import { useState } from 'react';
import { api } from '../api';

const Contact = () => {
  const [formData, setFormData] = useState({ fName: '', fEmail: '', fWA: '', fDesc: '' });
  const [errors, setErrors] = useState({ fName: '', fEmail: '', fWA: '', fDesc: '' });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validateField = (id, value) => {
    switch (id) {
      case 'fName': {
        const val = value.trim();
        if (!val) return 'Name is required.';
        if (val.length < 2) return 'Name must be at least 2 characters.';
        if (val.length > 100) return 'Name must not exceed 100 characters.';
        return '';
      }
      case 'fEmail': {
        const val = value.trim();
        if (!val) return 'Email ID is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) return 'Please enter a valid email address.';
        return '';
      }
      case 'fWA': {
        const val = value.trim();
        if (!val) return 'WhatsApp number is required.';
        const pattern = /^\+?[\d\s\-()]{10,20}$/;
        if (!pattern.test(val)) {
          return 'WhatsApp number must contain between 10 to 20 valid characters (digits, spaces, -, +, and parentheses).';
        }
        const digitCount = val.replace(/\D/g, '').length;
        if (digitCount < 10) {
          return 'WhatsApp number must contain at least 10 digits.';
        }
        return '';
      }
      case 'fDesc': {
        const val = value.trim();
        if (!val) return 'Description is required.';
        if (val.length < 10) return 'Description must be at least 10 characters.';
        if (val.length > 1000) return 'Description must not exceed 1000 characters.';
        if (!/[a-zA-Z]/.test(val)) return 'Description must contain descriptive letters/words.';
        return '';
      }
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    const errorMsg = validateField(id, value);
    setErrors(prev => ({ ...prev, [id]: errorMsg }));
  };

  const handleSend = async () => {
    setApiError(null);
    const newErrors = {
      fName: validateField('fName', formData.fName),
      fEmail: validateField('fEmail', formData.fEmail),
      fWA: validateField('fWA', formData.fWA),
      fDesc: validateField('fDesc', formData.fDesc)
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(err => err !== '');
    if (hasErrors) {
      return;
    }

    setIsSending(true);
    try {
      await api.submitContactForm(formData);
      setIsSuccess(true);
    } catch (err) {
      console.error("Submission failed:", err);
      // Detailed Pydantic validation errors from backend
      if (err.errors) {
        const errorState = { fName: '', fEmail: '', fWA: '', fDesc: '' };
        if (err.errors.name) errorState.fName = err.errors.name;
        if (err.errors.email) errorState.fEmail = err.errors.email;
        if (err.errors.phone) errorState.fWA = err.errors.phone;
        if (err.errors.description) errorState.fDesc = err.errors.description;
        setErrors(errorState);

        const errorMsg = Object.values(err.errors).join(' ');
        setApiError(errorMsg || "Form validation failed. Please check your entries.");
      } else {
        setApiError(err.detail || "Unable to send message. Server might be offline.");
        setTimeout(() => setApiError(null), 5000);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="contacts-section" id="contacts">
      <div className="Project-title">Contacts</div>
      <div className="contacts-inner">
        <div>
          <div className="contacts-socials">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-link tech-card">
              <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>LinkedIn
            </a>
            <a href="mailto:akashsharma081@gmail.com" className="social-link tech-card">
              <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>E-mail
            </a>
            <a href="tel:+919413738478" className="social-link tech-card">
              <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>+91-9413738478
            </a>
          </div>
          <div className="info-box tech-card" style={{ marginTop: '0.75rem' }}>
            <div className="info-box-title">Availability</div>
            <div className="info-box-text">Open to: <span>Full-time / Part-time / Contract</span></div>
          </div>
        </div>

        <div className="form-card tech-card">
          {!isSuccess ? (
            <div id="formBody">
              <div className="form-title">Get In Touch</div>
              <div className="form-sub">Have a project in mind or want to collaborate? Fill in the details below — I'll get back to you soon.</div>
              
              {apiError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#f87171', padding: '10px 14px', fontSize: '13px', marginBottom: '1.25rem', fontFamily: 'monospace' }}>
                  ⚡ Validation Error: {apiError}
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="fName">Name</label>
                  <input className={`form-input tech-card ${errors.fName ? 'err' : ''}`} type="text" id="fName" placeholder="Your full name" autoComplete="off" value={formData.fName} onChange={handleChange} disabled={isSending} />
                  {errors.fName && (
                    <span className="field-error-msg" style={{ color: '#f87171', fontSize: '11px', marginTop: '2px', display: 'block', fontFamily: 'sans-serif' }}>
                      {errors.fName}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="fEmail">Email ID</label>
                  <input className={`form-input tech-card ${errors.fEmail ? 'err' : ''}`} type="email" id="fEmail" placeholder="you@email.com" autoComplete="off" value={formData.fEmail} onChange={handleChange} disabled={isSending} />
                  {errors.fEmail && (
                    <span className="field-error-msg" style={{ color: '#f87171', fontSize: '11px', marginTop: '2px', display: 'block', fontFamily: 'sans-serif' }}>
                      {errors.fEmail}
                    </span>
                  )}
                </div>
                <div className="form-group span2">
                  <label className="form-label" htmlFor="fWA">WhatsApp No.</label>
                  <input className={`form-input tech-card ${errors.fWA ? 'err' : ''}`} type="tel" id="fWA" placeholder="+91 XXXXX XXXXX" autoComplete="off" value={formData.fWA} onChange={handleChange} disabled={isSending} />
                  {errors.fWA && (
                    <span className="field-error-msg" style={{ color: '#f87171', fontSize: '11px', marginTop: '2px', display: 'block', fontFamily: 'sans-serif' }}>
                      {errors.fWA}
                    </span>
                  )}
                </div>
                <div className="form-group span2">
                  <label className="form-label" htmlFor="fDesc">Description</label>
                  <textarea className={`form-textarea tech-card ${errors.fDesc ? 'err' : ''}`} id="fDesc" placeholder="Describe your project, idea, or how I can help you…" value={formData.fDesc} onChange={handleChange} disabled={isSending}></textarea>
                  {errors.fDesc && (
                    <span className="field-error-msg" style={{ color: '#f87171', fontSize: '11px', marginTop: '2px', display: 'block', fontFamily: 'sans-serif' }}>
                      {errors.fDesc}
                    </span>
                  )}
                </div>
              </div>
              <button className="form-btn" id="formSendBtn" onClick={handleSend} disabled={isSending}>
                {isSending ? 'Sending Message...' : 'Send Message →'}
              </button>
            </div>
          ) : (
            <div className="form-success" id="formSuccess" style={{ display: 'block' }}>
              <span className="check-icon">✓</span>
              <div className="s-title">Message Sent!</div>
              <div className="s-sub">Thanks for reaching out. I'll be in touch with you soon.</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;

