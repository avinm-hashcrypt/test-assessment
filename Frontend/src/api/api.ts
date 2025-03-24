import axios from 'axios';

const API_BASE_URL = 'http://localhost:4001/api/common'; // Adjust based on your backend setup

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

export default api;
