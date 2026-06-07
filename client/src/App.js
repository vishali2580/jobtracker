import React, { useState, useEffect } from 'react';
import { getAllJobs, createJob, updateJob, deleteJob } from './api/jobs';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

const STATUS_COLORS = {
  Applied:   '#3B8BD4',
  Interview: '#EF9F27',
  Offer:     '#1D9E75',
  Rejected:  '#E24B4A'
};

const EMPTY_FORM = { company: '', role: '', status: 'Applied', link: '', notes: '' };

export default function App() {
  const [user, setUser]       = useState(null);
  const [page, setPage]       = useState('login');
  const [jobs, setJobs]       = useState([]);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [editId, setEditId]   = useState(null);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('All');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();
      setJobs(res.data);
    } catch { handleLogout(); }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setJobs([]);
    setPage('login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) { await updateJob(editId, form); setEditId(null); }
    else { await createJob(form); }
    setForm(EMPTY_FORM);
    setShowForm(false);
    fetchJobs();
  };

  const handleEdit = (job) => {
    setForm({ company: job.company, role: job.role, status: job.status, link: job.link || '', notes: job.notes || '' });
    setEditId(job._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job?')) { await deleteJob(id); fetchJobs(); }
  };

  const filtered = jobs
    .filter(j => filter === 'All' || j.status === filter)
    .filter(j => j.company.toLowerCase().includes(search.toLowerCase()) ||
                 j.role.toLowerCase().includes(search.toLowerCase()));

  const count = (s) => jobs.filter(j => j.status === s).length;

  if (!user) {
    return page === 'login'
      ? <Login onLogin={handleLogin} goToRegister={() => setPage('register')} />
      : <Register onLogin={handleLogin} goToLogin={() => setPage('login')} />;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <span className="logo">JobTrackr</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>Hi, {user.name}! 👋</span>
          <button className="btn-add" onClick={() => { setShowForm(!showForm); setForm(EMPTY_FORM); setEditId(null); }}>
            {showForm ? '✕ Cancel' : '+ Add Job'}
          </button>
          <button onClick={handleLogout} style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '14px' }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="stats">
        {['Applied','Interview','Offer','Rejected'].map(s => (
          <div className="stat-card" key={s} style={{ borderTop: `3px solid ${STATUS_COLORS[s]}` }}>
            <span className="stat-num">{count(s)}</span>
            <span className="stat-label">{s}</span>
          </div>
        ))}
      </div>

      {showForm && (
        <form className="job-form" onSubmit={handleSubmit}>
          <h2>{editId ? 'Edit Job' : 'Add New Job'}</h2>
          <div className="form-row">
            <input required placeholder="Company *" value={form.company}
              onChange={e => setForm({...form, company: e.target.value})} />
            <input required placeholder="Role *" value={form.role}
              onChange={e => setForm({...form, role: e.target.value})} />
          </div>
          <div className="form-row">
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              {['Applied','Interview','Offer','Rejected'].map(s => <option key={s}>{s}</option>)}
            </select>
            <input placeholder="Job link (optional)" value={form.link}
              onChange={e => setForm({...form, link: e.target.value})} />
          </div>
          <textarea placeholder="Notes (optional)" value={form.notes}
            onChange={e => setForm({...form, notes: e.target.value})} />
          <button type="submit" className="btn-submit">{editId ? 'Update Job' : 'Save Job'}</button>
        </form>
      )}

      <div className="controls">
        <input className="search" placeholder="Search company or role..." value={search}
          onChange={e => setSearch(e.target.value)} />
        <div className="filters">
          {['All','Applied','Interview','Offer','Rejected'].map(s => (
            <button key={s} className={`filter-btn ${filter===s?'active':''}`}
              style={filter===s && s!=='All' ? { background: STATUS_COLORS[s], color: '#fff', borderColor: STATUS_COLORS[s] } : {}}
              onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className="job-grid">
        {filtered.length === 0 && <p className="empty">No jobs found. Add one!</p>}
        {filtered.map(job => (
          <div className="job-card" key={job._id}>
            <div className="card-top">
              <div>
                <h3>{job.company}</h3>
                <p className="role">{job.role}</p>
              </div>
              <span className="badge" style={{ background: STATUS_COLORS[job.status] + '22', color: STATUS_COLORS[job.status], border: `1px solid ${STATUS_COLORS[job.status]}` }}>
                {job.status}
              </span>
            </div>
            {job.notes && <p className="notes">{job.notes}</p>}
            <div className="card-footer">
              <span className="date">{new Date(job.createdAt).toLocaleDateString()}</span>
              <div className="card-actions">
                {job.link && <a href={job.link} target="_blank" rel="noreferrer" className="btn-link">View</a>}
                <button onClick={() => handleEdit(job)} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete(job._id)} className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}