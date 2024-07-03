import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/register.module.css';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleRegister = async () => {
        // Basic validation
        if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('Please fill out all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const { data } = await axios.post('http://localhost:8000/api/register', {
                name,
                email,
                password,
                password_confirmation: confirmPassword,
            });
            // Pass email and password to the login page via query parameters
            router.push({
                pathname: '/login',
                query: { email, password },
            });
        } catch (error) {
            setError('Registration failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <h1>Register</h1>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                />
                <button className={styles.button} onClick={handleRegister}>
                    Register
                </button>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    );
};

export default Register;