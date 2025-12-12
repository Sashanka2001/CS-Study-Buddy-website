import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Sidebar = () => {
  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <aside className="sidebar">
      <Link to="/home" className="app-title-link">
        <h1 className="app-title">CS Study Buddy</h1>
      </Link>
      <nav className="nav">
        <NavLink to="/home" className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/todos" className={linkClass}>
          Todo List
        </NavLink>
        <NavLink to="/notes" className={linkClass}>
          Notes
        </NavLink>
        <NavLink to="/schedule" className={linkClass}>
          Schedule
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
