import axios from 'axios';

const BASE = 'https://jobtrackr-api-axc0.onrender.com/api/jobs';

export const getAllJobs   = ()         => axios.get(BASE);
export const createJob   = (data)     => axios.post(BASE, data);
export const updateJob   = (id, data) => axios.put(`${BASE}/${id}`, data);
export const deleteJob   = (id)       => axios.delete(`${BASE}/${id}`);