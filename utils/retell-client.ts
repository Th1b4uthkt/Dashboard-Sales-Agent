import axios from 'axios';

export const retellClient = axios.create({
  baseURL: 'https://api.retellai.com',
  headers: {
    'Authorization': `Bearer ${process.env.RETELL_API_KEY}`,
    'Content-Type': 'application/json',
  },
});
