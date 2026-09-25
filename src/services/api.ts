import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3005', // Asumiendo que tu backend NestJS corre en el puerto 3000
});

export default api;
