import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackgroundAnimation from './components/BackgroundAnimation';
import Lightbox from './components/Lightbox';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [currentView, setCurrentView] = useState('portfolio'); // 'portfolio' or 'dashboard'

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#dashboard' && isLoggedIn) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('portfolio');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
    window.location.hash = '#dashboard';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.hash = '';
  };

  return (
    <>
      <BackgroundAnimation />
      <Navbar 
        onLoginClick={() => setShowLogin(true)} 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        currentView={currentView}
      />
      
      {currentView === 'dashboard' ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <>
          <Hero />
          <About />
          <Work />
          <Projects />
          <Skills />
          <Contact />
        </>
      )}

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      <Footer />
      <Lightbox />
    </>
  );
}

export default App;
