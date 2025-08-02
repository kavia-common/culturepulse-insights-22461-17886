import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

/**
 * Sidebar: navigation, role-based (extra for admins)
 * Also simple settings, onboarding, logout.
 */
const Sidebar = ({ isAdmin, profile }) => {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">🌈</div>
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        {isAdmin && (
          <li>
            <Link to="/admin">Admin</Link>
          </li>
        )}
        <li>
          <Link to="/subscription">Subscription</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
