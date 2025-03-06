import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import styles from '@/styles/Profile.module.css'; 

export default function UserProfilePage() {
    const router = useRouter();
    const { userId } = router.query; 
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return; 

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (!firebaseUser) {
                router.replace('/login'); 
            } else {
                setUser(firebaseUser);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId, router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.replace('/login'); 
    };

    if (loading) {
        return <p>Loading...</p>; 
    }

    if (!user) {
        return <p>Unauthorized access. Redirecting...</p>; 
    }

    return (
        <div className={styles.content}>
            <h2>Your Profile</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.uid}</p>
            <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
            </button>
        </div>
    );
}
