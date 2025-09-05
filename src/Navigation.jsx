import React from 'react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'movies', label: 'Movies', icon: '🎬' },
    { id: 'tvseries', label: 'TV Series', icon: '📺' },
    { id: 'watchlist', label: 'Watchlist', icon: '📋' },
    { id: 'more', label: 'More', icon: '⚙️' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
