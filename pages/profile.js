import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import styles from "@/styles/Profile.module.css";

export default function UserProfilePage() {
    const router = useRouter();
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subscribed, setSubscribed] = useState(false); // Check subscription status

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (!firebaseUser) {
                router.replace("/login");
            } else {
                setUser(firebaseUser);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.replace("/login");
    };

    const handleUpgrade = async () => {
        if (!user) return;

        try {
            const response = await fetch("/api/stripe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: user.email,
                    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID, // Price ID from .env.local
                }),
            });

            const data = await response.json();
            if (data.sessionId) {
                window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
            }
        } catch (error) {
            console.error("Error creating Stripe session:", error);
        }
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
            <p><strong>Subscription Status:</strong> {subscribed ? "Premium" : "Free"}</p>

            {!subscribed && (
                <button onClick={handleUpgrade} className={styles.upgradeButton}>
                    Upgrade to Premium
                </button>
            )}

            <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
            </button>
        </div>
    );
}
