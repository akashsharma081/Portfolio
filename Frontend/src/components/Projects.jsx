import { useState } from 'react';
import Discover1 from '../assets/images/Discover1.jpeg';
import Discover2 from '../assets/images/Discover2.jpeg';
import Guradian1 from '../assets/images/Guradian1.png';
import Guardian2 from '../assets/images/Guardian2.png';
import Guardian3 from '../assets/images/Guardian3.png';
import Guardian4 from '../assets/images/Guardian4.png';
import Guardian5 from '../assets/images/Guardian5.png';
import Guardian6 from '../assets/images/Guardian6.png';
import Guardian7 from '../assets/images/Guardian7.png';
import Guardian8 from '../assets/images/Guardian8.png';
import Guardian9 from '../assets/images/Guardian9.png';
import Guardian10 from '../assets/images/Guardian10.png';

const Projects = () => {
  const [curPage, setCurPage] = useState(0);
  const totalPages = 3;

  return (
    <section className="projects-section" id="projects">
      <div className="Project-title">Project</div>

      {/* Discover */}
      <div className="project-card">
        <div className="project-info">
          <div className="project-name">Discover Banking Platform</div>
          <div className="project-tags">
            <span className="tag tech-card">React.js</span><span className="tag tech-card">TypeScript</span><span className="tag tech-card">Micro-Frontend</span><span className="tag tech-card">Redux</span><span className="tag tech-card">Module Federation</span>
          </div>
          <p className="project-desc">Optimized interaction efficiency by <em>25%</em> using advanced React Hooks (useState, useEffect, useRef, useCallback) for superior component state handling.</p>
          <p className="project-desc">Architected a <em>Micro-Frontend solution</em> enabling independent deployment of modules, reducing release dependency. Integrated Loan Details (parent) with Account Activity (child) using Micro-Frontend principles, improving scalability and development speed.<br /><br />Reduced page load times by <strong>40%</strong> through codebase refactoring and lazy loading.</p>
          <p className="project-desc">Enhanced user satisfaction by <em>15%</em> by integrating bank names, logos, and conditionbased banners, delivering a personalized and visually engaging experience</p>
        </div>
        <div className="discover-grid">
          <div className="disc-img"><img src={Discover1} alt="Discover Banking 1" loading="lazy" /></div>
          <div className="disc-img"><img src={Discover2} alt="Discover Banking 2" loading="lazy" /></div>
        </div>
      </div>

      {/* Guardian */}
      <div className="project-card reverse">
        <div className="project-info">
          <div className="project-name">Guardian Insurance</div>
          <div className="project-tags">
            <span className="tag tech-card">React.js</span><span className="tag tech-card">Jest</span><span className="tag tech-card">ADA</span><span className="tag tech-card">TypeScript</span>
          </div>
          <p className="project-desc">Frontend modernization &amp; accessibility compliance for a major insurance platform. Implemented <strong>100+ unit test cases</strong> using Jest and React Testing Library, improving code reliability by <strong>60%</strong>.<br /><br />Addressed <em>180+ ADA compliance issues</em> ensuring adherence to accessibility standards and enterprise compliance requirements.</p>
        </div>
        <div className="guardian-carousel">
          <div className="carousel-pages" style={{ transform: `translateX(-${curPage * 100}%)` }}>
            <div className="carousel-page">
              <div className="c-img"><img src={Guradian1} alt="Guardian 1" /></div>
              <div className="c-img"><img src={Guardian2} alt="Guardian 2" /></div>
              <div className="c-img"><img src={Guardian3} alt="Guardian 3" /></div>
              <div className="c-img"><img src={Guardian4} alt="Guardian 4" /></div>
            </div>
            <div className="carousel-page">
              <div className="c-img"><img src={Guardian5} alt="Guardian 5" /></div>
              <div className="c-img"><img src={Guardian6} alt="Guardian 6" /></div>
              <div className="c-img"><img src={Guardian7} alt="Guardian 7" /></div>
              <div className="c-img"><img src={Guardian8} alt="Guardian 8" /></div>
            </div>
            <div className="carousel-page">
              <div className="c-img"><img src={Guardian9} alt="Guardian 9" /></div>
              <div className="c-img"><img src={Guardian10} alt="Guardian 10" /></div>
              {/* Invisible placeholders to maintain grid height */}
              <div className="c-img" style={{ visibility: 'hidden' }}></div>
              <div className="c-img" style={{ visibility: 'hidden' }}></div>
            </div>
          </div>
          <div className="carousel-controls">
            <button className="c-btn" disabled={curPage === 0} onClick={() => setCurPage(curPage - 1)}>←</button>
            <div className="c-dots">
              {[0, 1, 2].map(i => (
                <div key={i} className={`c-dot ${curPage === i ? 'active' : ''}`} onClick={() => setCurPage(i)}></div>
              ))}
            </div>
            <button className="c-btn" disabled={curPage === totalPages - 1} onClick={() => setCurPage(curPage + 1)}>→</button>
            <span className="c-count">{curPage + 1} / {totalPages}</span>
          </div>
        </div>
      </div>

      {/* Internal Platform */}
      <div className="project-card">
        <div className="project-info">
          <div className="project-name">Internal React Enterprise Platform</div>
          <div className="project-tags">
            <span className="tag tech-card">React.js</span><span className="tag tech-card">Python FastAPI</span>
          </div>
          <p className="project-desc">Architected a scalable <em>React-based internal platform</em> with reusable components and modular design patterns, accelerating development velocity across multiple teams.<br /><br />Consumed <strong>RESTful APIs</strong> built on Python FastAPI, reducing integration bugs by <strong>30%</strong>. Reduced post-deployment defects by <strong>50%</strong> through unit and automation testing.</p>
        </div>
        <div className="mock-grid">
          <div className="mock-blk tall">
            <div className="mock-screen">
              <div className="mock-bar"></div>
              <div className="mock-line" style={{ width: '90%' }}></div>
              <div className="mock-line" style={{ width: '65%' }}></div>
              <div className="mock-line" style={{ width: '80%' }}></div>
              <div className="mock-line" style={{ width: '100%' }}></div>
              <div className="mock-line" style={{ width: '50%' }}></div>
            </div>
          </div>
          <div className="mock-blk">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
          </div>
          <div className="mock-blk">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
