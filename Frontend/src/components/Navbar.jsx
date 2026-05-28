import { useState } from 'react';

const Navbar = ({ onLoginClick, isLoggedIn, onLogout, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  return (
    <nav id="mainNav">
      <div className="nav-top-row">
        <button
          className="hamburger"
          id="hamburger"
          aria-label="Toggle menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span><span></span><span></span>
        </button>
        <div className="nav-name">Akash Sharma</div>
      </div>
      <ul className={`nav-links ${isOpen ? 'open' : ''}`} id="navLinks">
        {isLoggedIn ? (
          <>
            <li><a href="#dashboard" className={currentView === 'dashboard' ? 'nav-active' : ''} onClick={close}>Dashboard</a></li>
            <li><a href="#portfolio" className={currentView === 'portfolio' ? 'nav-active' : ''} onClick={close}>Portfolio</a></li>
          </>
        ) : (
          <>
            <li><a href="#About" onClick={close}>About</a></li>
            <li><a href="#work" onClick={close}>Work</a></li>
            <li><a href="#skill" onClick={close}>Skills</a></li>
            <li><a href="#contacts" onClick={close}>Contacts</a></li>
          </>
        )}
        <li>
          {isLoggedIn ? (
            <a href="#logout" id="navLoginBtn" onClick={() => { close(); onLogout(); }}>Logout</a>
          ) : (
            <a href="#login" id="navLoginBtn" onClick={() => { close(); onLoginClick(); }}>Login</a>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
