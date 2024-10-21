import axios from 'axios';

export const retellClient = axios.create({
  baseURL: 'https://api.retellai.com',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.RETELL_API_KEY}`
  }
});
