import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const today = new Date();
  const greetingHour = today.getHours();
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 18 ? 'Good afternoon' : 'Good evening';

  const formattedDate = today.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="home">
      <header className="home-hero">
        <p className="home-date">{formattedDate}</p>
        <h1 className="home-title">{greeting}, Scholar!</h1>
        <p className="home-subtitle">
          Welcome to CS Study Buddy — your space to organise tasks, capture revision notes, and
          stay on top of your study schedule.
        </p>
        <div className="home-actions">
          <Link className="primary" to="/todos">Start With Tasks</Link>
          <Link className="secondary" to="/schedule">Plan My Week</Link>
        </div>
      </header>

      <section className="home-panels">
        <article className="home-card">
          <h2>Stay Focused</h2>
          <p>Break down assignments and revision targets into actionable todo items.</p>
        </article>
        <article className="home-card">
          <h2>Capture Insights</h2>
          <p>Store quick notes, concepts, and questions to revisit during study sessions.</p>
        </article>
        <article className="home-card">
          <h2>Own Your Calendar</h2>
          <p>Schedule deadlines and study blocks so you never miss an important milestone.</p>
        </article>
      </section>
    </section>
  );
};

export default Home;
