const Work = () => {
  const calculateExperience = (startDate, endDate = new Date()) => {
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    return { years, months };
  };

  const addExperience = (exp1, exp2) => {
    let totalMonths = exp1.months + exp2.months;
    let totalYears = exp1.years + exp2.years + Math.floor(totalMonths / 12);
    return { years: totalYears, months: totalMonths % 12 };
  };

  const formatExp = ({ years, months }) => {
    const y = years > 0 ? `${years} year${years !== 1 ? "s" : ""}` : "";
    const m = months > 0 ? `${months} month${months !== 1 ? "s" : ""}` : "";
    return [y, m].filter(Boolean).join(" ");
  };

  const job1Start = new Date(2022, 0);  // Jan 2022
  const job1End = new Date(2025, 10); // Nov 2025
  const job2Start = new Date(2025, 10); // Nov 2025

  const exp1 = calculateExperience(job1Start, job1End); // fixed: 3y 10m
  const exp2 = calculateExperience(job2Start);           // dynamic: Nov 2025 → today
  const total = addExperience(exp1, exp2);

  return (
    <section className="work-section" id="work">
      <div className="work-title">Work</div>
      <div className="work-row">
        <div className="work-date">
          Nov 2025 – Present
          <span className="period">~{formatExp(exp2)}</span>
        </div>
        <div className="work-role">
          Senior Associate Consultant <span className="pipe">|</span> React &amp; JavaScript | Pydantic &amp; FastAPI
        </div>
      </div>
      <div className="work-row">
        <div className="work-date">
          Jan 2022 – Nov 2025
          <span className="period">3 years 10 months</span>
        </div>
        <div className="work-role">
          Senior Software Engineer <span className="pipe">|</span> React &amp; JavaScript
        </div>
      </div>
      <div className="work-total">Total experience: {formatExp(total)}</div>
    </section>
  );
};

export default Work;