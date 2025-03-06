import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FaUserCircle, FaMoon, FaSun } from 'react-icons/fa'; // Import dark mode icons
import styles from '@/styles/Navbar.module.css';
import PropTypes from 'prop-types';

function Navbar({ user, onLogout, darkMode, setDarkMode }) {
    const router = useRouter();

    return (
        <nav className={styles.navbar}>
            {/* Logo */}
            <div className={styles.logoContainer} onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
                <Image src="/logo.png" alt="Company Logo" width={300} height={60} style={{ objectFit: 'contain' }} priority />
            </div>

            {/* Navigation Links */}
            <div className={styles.navButtons}>
                <div onClick={() => router.push('/')} className={styles.navLink}>Homepage</div>
                <div onClick={() => router.push('/tracking')} className={styles.navLink}>Learning Track</div>
                
                {/* Dark Mode Toggle */}
                <div onClick={() => setDarkMode(!darkMode)} className={styles.darkModeToggle}>
                    {darkMode ? <FaSun size={20} color="yellow" /> : <FaMoon size={20} color="white" />}
                </div>

                {user && (
                    <div onClick={() => router.push(`/profile/${user.uid}`)} className={styles.profileButton}>
                        <FaUserCircle size={24} />
                    </div>
                )}
            </div>
        </nav>
    );
}

Navbar.propTypes = {
    user: PropTypes.object,
    onLogout: PropTypes.func,
    darkMode: PropTypes.bool,
    setDarkMode: PropTypes.func
};

export default Navbar;
