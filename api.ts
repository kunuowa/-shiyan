import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getSubjects = () => axios.get(`${API_URL}/subjects`);
export const addSubject = (data) => axios.post(`${API_URL}/subjects`, data);
export const getAssignments = (subjectId) => axios.get(`${API_URL}/assignments/${subjectId}`);
export const submitResponses = (data) => axios.post(`${API_URL}/responses`, data);
