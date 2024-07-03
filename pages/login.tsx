import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/login.module.css';
import { setTokenCookie } from '../utils/auth';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Automatically fill the email and password fields if passed in query parameters
        if (router.query.email) {
            setEmail(router.query.email as string);
        }
        if (router.query.password) {
            setPassword(router.query.password as string);
        }
    }, [router.query]);

    const handleLogin = async () => {
        try {
            const { data } = await axios.post('http://localhost:8000/api/login', {
                email,
                password,
            });
            setTokenCookie(data.token);
            router.push('/karyawan');
        } catch (error) {
            setError('Invalid login credentials');
        }
    };

    const handleRegisterRedirect = () => {
        router.push('/register');
    };

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <h1>Login</h1>
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
                <button className={styles.button} onClick={handleLogin}>
                    Login
                </button>
                <p className={styles.registerLink} onClick={handleRegisterRedirect}>
                    Don't have an account? Register here.
                </p>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    );
};

export default Login;