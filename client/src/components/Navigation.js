import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navigation.css';

function Navigation({ user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    setLangMenuOpen(false);
  };

  const navItems = user.role === 'farmer' ? [
    { path: '/', label: t('dashboard') },
    { path: '/credit-score', label: t('creditScore') },
    { path: '/loan-application', label: t('loanApplication') }
  ] : user.role === 'fsp' ? [
    { path: '/', label: t('dashboard') },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/risk-analysis', label: 'Risk Analysis' }
  ] : [
    { path: '/', label: t('dashboard') },
    { path: '/analytics', label: 'Analytics' },
    { path: '/farmers', label: 'Farmers' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="nav-logo">🌱</span>
          <span className="nav-title">ARIP</span>
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="nav-links">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            <div className="language-selector">
              <button 
                className="lang-btn"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
              >
                🌍 {i18n.language.toUpperCase()}
              </button>
              {langMenuOpen && (
                <div className="lang-dropdown">
                  <button onClick={() => changeLang('en')}>English</button>
                  <button onClick={() => changeLang('lg')}>Luganda</button>
                  <button onClick={() => changeLang('rn')}>Runyankole</button>
                </div>
              )}
            </div>

            <div className="user-menu">
              <span className="user-name">{user.name}</span>
              <button className="logout-btn" onClick={onLogout}>
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
