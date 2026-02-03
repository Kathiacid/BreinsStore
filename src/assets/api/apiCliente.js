// src/assets/api/apiCliente.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // ajusta si tu backend usa otro
  headers: { 'Content-Type': 'application/json' }
});

export default apiClient;
