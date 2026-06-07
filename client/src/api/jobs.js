import axios from 'axios';

const BASE = 'https://jobtrackr-api-axc0.onrender.com';

const getToken = () => localStorage.getItem('token');

export const registerUser = (data) => axios.post(`${BASE}/auth/register`, data);
export const loginUser    = (data) => axios.post(`${BASE}/auth/login`, data);

export const getAllJobs  = ()         => axios.get(`${BASE}/jobs`,       { headers: { Authorization: `Bearer ${getToken()}` }});
export const createJob  = (data)     => axios.post(`${BASE}/jobs`, data, { headers: { Authorization: `Bearer ${getToken()}` }});
export const updateJob  = (id, data) => axios.put(`${BASE}/jobs/${id}`, data, { headers: { Authorization: `Bearer ${getToken()}` }});
export const deleteJob  = (id)       => axios.delete(`${BASE}/jobs/${id}`, { headers: { Authorization: `Bearer ${getToken()}` }});