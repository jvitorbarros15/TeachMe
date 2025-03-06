import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import '@/styles/App.css';
import '@/styles/Home.module.css';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbtABCn7lejIHeyeXPxOsHq1AVcHMHqKM",
  authDomain: "teachme-cd76f.firebaseapp.com",
  projectId: "teachme-cd76f",
  storageBucket: "teachme-cd76f.appspot.com",
  messagingSenderId: "679010402558",
  appId: "1:679010402558:web:uniqueId" // Replace with your Firebase appId
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(() => {
        return typeof window !== "undefined" ? localStorage.getItem('darkMode') === 'true' : false;
    });

    // Listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);

            if (!firebaseUser && router.pathname !== '/login') {
                router.replace('/login'); 
            }
        });

        return () => unsubscribe();
    }, [router.pathname]);

    // Handle Logout
    const handleLogout = async () => {
        await signOut(auth);
        router.replace('/login'); 
    };

    // Dark Mode Toggle & Save to LocalStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem('darkMode', darkMode);
            document.body.classList.toggle('dark-mode', darkMode);
        }
    }, [darkMode]);

    return (
        <>
            {router.pathname !== '/login' && (
                <Navbar user={user} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
            )}
            <Component {...pageProps} user={user} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
        </>
    );
    
}

export default MyApp;
