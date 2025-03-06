import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import styles from '@/styles/Profile.module.css';

export default function UserProfilePage() {
    const router = useRouter();
    const { userId } = router.query; 
    const auth = getAuth();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!userId) return; 

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (!firebaseUser) {
                router.replace('/login'); 
            } else if (firebaseUser.uid !== userId) {
                router.replace(`/profile/${firebaseUser.uid}`); 
            } else {
                setUser(firebaseUser);
            }
        });

        return () => unsubscribe();
    }, [userId, router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.replace('/login'); 
    };

    if (!user) {
        return <p>Loading...</p>; 
    }

    return (
        <div className={styles.content}>
            <h2>Your Profile</h2>
            <p>Welcome, {user.email}!</p>
            <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
            </button>
        </div>
    );
}
