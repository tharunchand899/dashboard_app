import React from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBucketList } from '../context/BucketListContext';
import SearchBar from './SearchBar';
import { Compass, LogOut, Sun, Moon, MapPin, CheckCircle } from 'lucide-react';

/**
 * Main application navigation bar.
 * Implements the brand layout, global search input, and profile actions from the mockup.
 */
const Navbar = () => {
  const { isAuthenticated, logout, theme, toggleTheme, searchQuery, setSearchQuery } = useAuth();
  const { bucketList, visited } = useBucketList();
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDashboard = location.pathname === '/dashboard';

  // Unsplash female portrait matching mockup avatar style
  const avatarUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80';

  return (
    <nav className="app-navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/login'} className="navbar-logo">
          <Compass className="logo-icon animate-pulse" size={28} />
          <span className="logo-text">Wander<span className="accent-text">Log</span></span>
        </Link>

        {/* Dynamic Search Bar in Navbar Center */}
        {isAuthenticated && isDashboard && (
          <div className="navbar-search-wrapper">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder="Search countries..." 
            />
          </div>
        )}

        {/* Actions & Links */}
        <div className="navbar-actions">
          {isAuthenticated && (
            <div className="navbar-links">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span>Dashboard</span>
              </NavLink>
              
              <NavLink 
                to="/bucket-list" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span>Bucket List</span>
                <div className="nav-badges">
                  {bucketList.length > 0 && (
                    <span className="badge badge-bucket" title="Bucket list count">
                      <MapPin size={10} />
                      {bucketList.length}
                    </span>
                  )}
                  {visited.length > 0 && (
                    <span className="badge badge-visited" title="Visited count">
                      <CheckCircle size={10} />
                      {visited.length}
                    </span>
                  )}
                </div>
              </NavLink>
            </div>
          )}

          <div className="navbar-buttons">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Profile Avatar & Logout */}
            {isAuthenticated && (
              <div className="profile-group-wrapper">
                <img 
                  src={avatarUrl} 
                  alt="User profile" 
                  className="navbar-profile-avatar" 
                  title="Signed in"
                />
                
                <button 
                  onClick={handleLogout} 
                  className="logout-btn" 
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                  <span className="logout-text">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
