import React, { useState } from 'react';
import { loginUser } from '../api/jobs';

export default function Login({ onLogin, goToRegister }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="logo">JobTrackr</h1>
        <h2>Welcome back 👋</h2>
        <p className="auth-sub">Login to track your applications</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input required type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} />
          <input required type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <span onClick={goToRegister}>Register here</span>
        </p>
      </div>
    </div>
  );
}