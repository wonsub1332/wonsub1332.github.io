import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Terminal } from 'lucide-react';
import '../styles/Layout.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="layout">
      <header className="header">
        <div className="container header-content">
          <Link to="/" className="logo">
            Dev.log
          </Link>
          <nav className="nav">
            <Link to="/">Posts</Link>
            <Link to="/about">About</Link>
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="container">{children}</div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Dev.log. All rights reserved.</p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Terminal size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
