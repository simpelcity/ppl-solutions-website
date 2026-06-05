'use client'

import { useState } from 'react'
import axios from 'axios';

type HTTPMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type formData = {
  title: string;
  url: string;
  message: string;
  requestUrl: string;
  method: HTTPMethods | undefined;
}

const statusToErrorName: Record<number, string> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  405: "METHOD_NOT_ALLOWED",
  409: "CONFLICT",
  422: "UNPROCESSABLE_ENTITY",
  429: "TOO_MANY_REQUESTS",
  500: "INTERNAL_SERVER_ERROR",
  502: "BAD_GATEWAY",
  503: "SERVICE_UNAVAILABLE",
  504: "GATEWAY_TIMEOUT",
};

function formatTimestamp(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = pad(date.getDate());
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const tzOffset = -date.getTimezoneOffset();
  const sign = tzOffset >= 0 ? "+" : "-";
  const tzHours = pad(Math.floor(Math.abs(tzOffset) / 60));
  const tzMinutes = pad(Math.abs(tzOffset) % 60);
  return `${day}-${month}-${year}:${hours}:${minutes}:${seconds} ${sign}${tzHours}${tzMinutes}`;
}

export default function useDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  const sendData = async (title: string, url: string, message: string, requestUrl: string, method: string, HTTPStatus: string) => {
    setLoading(true);
    setError(null);

    const statusNumber = Number(HTTPStatus);
    const errorName = statusToErrorName[statusNumber];

    try {
      const res = await axios.post('/api/discord-webhook', {
        // username: 'PPL Solutions',
        // avatar_url: 'https://ppl-solutions.vercel.app/assets/images/dark/logo.png',
        embeds: [
          {
            title: title || 'New Dashboard Message',
            url: url || 'https://ppl-solutions.vercel.app/drivershub/dashboard',
            description: `
            [${formatTimestamp(new Date())}]
URL: ${requestUrl}
Method: ${method}
Status: ${HTTPStatus}
Error: ${errorName}
Message: ${message}
-----------------------------
            `,
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
      setStatus(err?.response?.status || null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, status, sendData };
}
