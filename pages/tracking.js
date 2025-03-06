import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import styles from '@/styles/Tracking.module.css';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function TrackingPage({ user }) {
    const router = useRouter();
    const auth = getAuth();

    const [dailyHours, setDailyHours] = useState(0);
    const [tasks, setTasks] = useState([
        { id: 1, text: "Complete a lesson", completed: false },
        { id: 2, text: "Practice coding", completed: false },
        { id: 3, text: "Read a programming article", completed: false }
    ]);
    const [progressHistory, setProgressHistory] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (!firebaseUser) {
                router.replace('/login'); 
            }
        });

        // Load progress from local storage
        const storedData = JSON.parse(localStorage.getItem("trackingData"));
        if (storedData) {
            setProgressHistory(storedData);
        }

        return () => unsubscribe();
    }, [router]);

    // Handle Study Hours Input
    const handleHoursChange = (e) => {
        setDailyHours(e.target.value);
    };

    // Handle Task Completion
    const toggleTaskCompletion = (taskId) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
    };

    // Save Progress
    const saveProgress = () => {
        const newEntry = {
            date: new Date().toLocaleDateString(),
            hours: Number(dailyHours),
            completedTasks: tasks.filter(task => task.completed).length
        };

        const updatedProgress = [...progressHistory, newEntry];
        setProgressHistory(updatedProgress);
        localStorage.setItem("trackingData", JSON.stringify(updatedProgress));
        alert("Progress saved!");
    };

    // Prepare Chart Data
    const chartData = {
        labels: progressHistory.map(entry => entry.date),
        datasets: [
            {
                label: "Hours Studied",
                data: progressHistory.map(entry => entry.hours),
                borderColor: "#007bff",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                fill: true
            },
            {
                label: "Tasks Completed",
                data: progressHistory.map(entry => entry.completedTasks),
                borderColor: "#28a745",
                backgroundColor: "rgba(40, 167, 69, 0.2)",
                fill: true
            }
        ]
    };

    return (
        <div className={styles.trackingContainer}>
            <h2 className={styles.title}>Daily Learning Progress</h2>

            {/* Input for Study Hours */}
            <div className={styles.inputSection}>
                <label>Enter Study Hours:</label>
                <input
                    type="number"
                    min="0"
                    max="24"
                    value={dailyHours}
                    onChange={handleHoursChange}
                />
            </div>

            {/* Task List */}
            <div className={styles.taskSection}>
                <h3>Today's Tasks</h3>
                <ul className={styles.taskList}>
                    {tasks.map(task => (
                        <li key={task.id} className={styles.taskItem}>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTaskCompletion(task.id)}
                            />
                            <label>{task.text}</label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Save Progress Button */}
            <button onClick={saveProgress} className={styles.saveButton}>
                Save Progress
            </button>

            {/* Progress Graph */}
            <div className={styles.chartContainer}>
                <h3>Weekly Progress</h3>
                <Line data={chartData} />
            </div>
        </div>
    );
}
