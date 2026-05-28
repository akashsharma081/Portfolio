import { useEffect, useState } from 'react';

const words = [
  { lines: ['Senior', 'Application'], senior: true },
  { lines: ['Full', 'Stack'], senior: false }
];

const Hero = () => {
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [isSenior, setIsSenior] = useState(true);

  useEffect(() => {
    let wIdx = 0;
    let char = 0;
    let deleting = false;
    let timeoutId;

    const tick = () => {
      const w = words[wIdx];
      const total = w.lines.join('').length;

      if (!deleting) {
        char++;
        let rem = char;
        const newLine1 = rem >= w.lines[0].length ? w.lines[0] : w.lines[0].slice(0, rem);
        rem -= newLine1.length;
        const newLine2 = rem > 0 ? w.lines[1].slice(0, rem) : '';

        setLine1(newLine1);
        setLine2(newLine2);

        if (char === total) {
          timeoutId = setTimeout(() => { deleting = true; tick(); }, 1800);
          return;
        }
        timeoutId = setTimeout(tick, 110);
      } else {
        char--;
        let rem = char;
        const newLine1 = rem >= w.lines[0].length ? w.lines[0] : w.lines[0].slice(0, rem);
        rem -= newLine1.length;
        const newLine2 = rem > 0 ? w.lines[1].slice(0, rem) : '';

        setLine1(newLine1);
        setLine2(newLine2);

        if (char === 0) {
          deleting = false;
          wIdx = (wIdx + 1) % words.length;
          setIsSenior(words[wIdx].senior);
          timeoutId = setTimeout(tick, 400);
          return;
        }
        timeoutId = setTimeout(tick, 60);
      }
    };

    timeoutId = setTimeout(tick, 800);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-meta">
        <div><div className="label">Role</div><div className="value">Senior Application Developer</div></div>
        <div><div className="label">Domain</div><div className="value">Banking &amp; Insurance</div></div>
        <div><div className="label">Experience</div><div className="value"><span className="yearexp">4+</span> Years</div></div>
      </div>
      <div className="hero-title">
        <span className="dots">.... </span>
        <span id="twLine1" className={`typewriter-green no-cursor ${isSenior ? 'white-text' : ''}`}>{line1}</span><br />
        <span className="typewriter-green">{line2}</span><br />
        Developer<span className="dots"> ....</span>
      </div>
      <p className="hero-subtitle">Are you looking for a developer who builds with clarity and purpose? Well, here’s mine.</p>
      <div className="hero-cta">
        <a href="#projects" className="btn-primary">Projects →</a>
      </div>
      <div className="social-links">
        <a href="mailto:akashsharma081@gmail.com" className="social-link tech-card">
          <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>E-mail
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-link tech-card">
          <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>LinkedIn
        </a>
        <a href="tel:+919413738478" className="social-link tech-card">
          <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>+91-9413738478
        </a>
      </div>
    </section>
  );
};

export default Hero;
