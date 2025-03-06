import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbtABCn7lejIHeyeXPxOsHq1AVcHMHqKM",
  authDomain: "teachme-cd76f.firebaseapp.com",
  projectId: "teachme-cd76f",
  storageBucket: "teachme-cd76f.appspot.com",
  messagingSenderId: "679010402558",
  appId: "1:679010402558:web:uniqueId" //
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace(`/profile/${auth.currentUser.uid}`); 
        } catch (error) {
            console.error("Login failed:", error);
            alert("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.replace(`/profile/${auth.currentUser.uid}`); 
        } catch (error) {
            console.error("Signup failed:", error);
            alert("Signup failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h3>Welcome to TeachMe</h3>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <button onClick={handleSignup} style={{ marginTop: '10px' }} disabled={loading}>
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </div>
        </div>
    );
}
