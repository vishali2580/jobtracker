import React, { useState } from 'react';
import { registerUser } from '../api/jobs';

export default function Register({ onLogin, goToLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await registerUser(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="logo">JobTrackr</h1>
        <h2>Create account 🚀</h2>
        <p className="auth-sub">Start tracking your job applications</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input required placeholder="Full Name" value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} />
          <input required type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} />
          <input required type="password" placeholder="Password (min 6 chars)" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <span onClick={goToLogin}>Login here</span>
        </p>
      </div>
    </div>
  );
}