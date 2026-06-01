'use client'

import { useState } from 'react'
import axios from 'axios';

export default function useDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendData = async (title: string, url: string, message: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post('/api/discord-webhook', {
        username: 'PPL Solutions',
        avatar_url: 'https://ppl-solutions.vercel.app/assets/images/dark/logo.png',
        embeds: [
          {
            title: title || 'New Dashboard Message',
            url: url || 'https://ppl-solutions.vercel.app/drivershub/dashboard',
            description: message,
            color: 0x009a86,
            author: {
              name: 'Simpelcity',
              icon_url: 'https://ppl-solutions.vercel.app/assets/images/team/simpelcity.jpg',
            }
          }
        ]
      });

      if (res.status !== 200) throw new Error('Failed to send dashboard data');

      const data = res.data;
      setData(data);
      return data;
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || 'Failed to send dashboard data';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, sendData };
}
