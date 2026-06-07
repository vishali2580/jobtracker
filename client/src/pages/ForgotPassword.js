import React, { useState } from 'react';

export default function ForgotPassword({ goToLogin }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(
        `https://jobtrackr-api-axc0.onrender.com/api/auth/forgot-password`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }) }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="logo">JobTrackr</h1>
        <h2>Reset password 🔐</h2>
        <p className="auth-sub">Enter your email to receive a reset link</p>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
            <p style={{ color: '#6366f1', fontWeight: 500, marginBottom: '8px' }}>Email sent!</p>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              Check your inbox for the password reset link
            </p>
            <button onClick={goToLogin} style={{ width: 'auto', padding: '10px 24px' }}>
              Back to Login
            </button>
          </div>
        ) : (
          <>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <input required type="email" placeholder="Your email address"
                value={email} onChange={e => setEmail(e.target.value)} />
              <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link →'}
              </button>
            </form>
            <p className="auth-switch">
              Remember your password? <span onClick={goToLogin}>Login here</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}