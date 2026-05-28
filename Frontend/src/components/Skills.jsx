const Skills = () => {
  return (
    <section className="contacts-section" id="skill">
      <div className="work-title">Skill</div>
      <p className="skills-note">Some of my favorite technologies, projects, or tools that I worked with</p>

      <div style={{ marginTop: '1rem' }}>
        <div className="skill-group tech-card">
          <div className="skill-group-title">Front-end</div>
          <div className="skill-group-items">React.js / Next.js / TypeScript / JavaScript (ES6+) / Redux / Redux Toolkit / Micro-Frontend / Module Federation / StoryBook</div>
        </div>
        <div className="skill-group transparent tech-card">
          <div className="skill-group-title">Back-end &amp; DB</div>
          <div className="skill-group-items">Python / FastAPI / MongoDB Atlas / SQL / RESTful APIs</div>
        </div>
        <div className="skill-group tech-card">
          <div className="skill-group-title">Styles</div>
          <div className="skill-group-items">TailwindCSS / Material-UI / Bootstrap / HTML5 / CSS3 / Responsive Design</div>
        </div>
        <div className="skill-group transparent tech-card">
          <div className="skill-group-title">Testing &amp; Quality</div>
          <div className="skill-group-items">Jest / React Testing Library / Postman / ADA Accessibility / Automation Testing</div>
        </div>
        <div className="skill-group tech-card">
          <div className="skill-group-title">Others</div>
          <div className="skill-group-items">Git / GitHub / BitBucket / JIRA / Figma / Miro Board</div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
