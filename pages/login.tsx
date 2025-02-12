import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/login.module.css';
import { setTokenCookie, getTokenCookie } from '../utils/auth';
import { format } from 'date-fns';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });
      setTokenCookie(data.token);

      const loginTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");

      await axios.post('http://localhost:8000/api/absensi', {
        email,
        login_time: loginTime,
      }, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      router.push('/dashboard');
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
}