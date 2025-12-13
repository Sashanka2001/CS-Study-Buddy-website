import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import lottieWeb from 'lottie-web';
import kittyAnimation from '../assets/cat.json';

const Home = () => {
  const today = new Date();
  const greetingHour = today.getHours();
  const greeting = greetingHour < 12 ? 'Good morning 🌞' : greetingHour < 18 ? 'Good afternoon 🌤️' : 'Good evening 🌆';

  const formattedDate = today.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const mascotRef = useRef(null);

  useEffect(() => {
    if (!mascotRef.current) {
      return undefined;
    }

    const animationInstance = lottieWeb.loadAnimation({
      container: mascotRef.current,
      animationData: kittyAnimation,
      renderer: 'svg',
      loop: true,
      autoplay: true,
    });

    return () => {
      animationInstance.destroy();
    };
  }, []);

  return (
    <section className="home">
      <header className="home-hero">
        <p className="home-date">{formattedDate}</p>
        <h1 className="home-title">{greeting}Bro!</h1>
        <p className="home-subtitle">
          Welcome to CS Study Buddy - your space to organise tasks, capture revision notes, and
          stay on top of your study schedule.
        </p>
        <div className="home-actions">
          <Link className="primary" to="/todos">Start With Tasks</Link>
          <Link className="secondary" to="/schedule">Plan My Week</Link>
        </div>
        <div className="home-mascot" ref={mascotRef} aria-hidden="true" />
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
