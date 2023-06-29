import { Outlet } from 'react-router-dom';
import Logo from '../Logo/Logo';
import AppNav from '../Nav/AppNav';
import styles from './Sidebar.module.css';

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      
      <Outlet />

      <footer className={styles.footer}>
        <p className={styles.copyright}>
        &copy; Copyright {new Date().getFullYear()} by Worldwise Inc.
          </p></footer> 
    </div>
  )
}

export default Sidebar