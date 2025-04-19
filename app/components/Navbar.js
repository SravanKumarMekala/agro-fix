// app/components/Navbar.js
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.link}>
        Home
      </Link>
      <Link href="/orders/track" className={styles.link}>
        Track Order
      </Link>
    </nav>
  );
}