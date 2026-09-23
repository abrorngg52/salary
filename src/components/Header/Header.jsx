import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  const location = useLocation();
  
  // Функция для проверки активного маршрута
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        💰 Salary Tracker
      </div>
      <nav className={styles.nav}>
        <Link 
          to="/" 
          className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}
        >
          Главная
        </Link>
        <Link 
          to="/history" 
          className={`${styles.navLink} ${isActive('/history') ? styles.navLinkActive : ''}`}
        >
          История
        </Link>
        <Link 
          to="/analytics" 
          className={`${styles.navLink} ${isActive('/analytics') ? styles.navLinkActive : ''}`}
        >
          Аналитика
        </Link>
      </nav>
    </header>
  );
}

export default Header;