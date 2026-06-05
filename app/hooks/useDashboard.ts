'use client'

import { useState } from 'react'
import axios from 'axios';

type HTTPMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type formData = {
  title: string;
  description: string;
  footer: string;
  author: string;
  authorIcon: string;
  announcementTag: string;
  roleTag: string | null;
  emojiTag: string | null;
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

function toUnixTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export default function useDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [status, setStatus] = useState<number | null>(null);

  async function sendAnnouncement(formData: formData) {
    setLoading(true);
    setError(null);

    const { title, description, footer, author, authorIcon, announcementTag, roleTag, emojiTag } = formData;
    
    const authorName = author || 'PPL Solutions VTC';
    const authorIconUrl = authorIcon || 'https://ppl-solutions.vercel.app/assets/images/dark/logo.png';
    const announcementTitle = title ? title : 'Announcement';
    const announcementFooter = footer ? footer : 'Best regards,\n';
    const role = roleTag ? `<@&${roleTag}>` : '';
    const emoji = emojiTag ? `<${emojiTag}>` : '';
    const payload = {
      content: `# ${announcementTitle}\nGreetings <@&${announcementTag}><:peepo_love:1288523924094845030>\n\n${description}\n\n${announcementFooter}${role}${emoji}`,
    }

    try {
      const res = await axios.post('/api/discord-webhook?messageType=announcement', {
        username: authorName,
        avatar_url: authorIconUrl,
        ...payload,
      });

      if (res.status !== 200) throw new Error('Failed to send announcement data');

      const data = res.data;
      setData(data);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to send announcement data';
      setError({ message: message, success: false });
      setStatus(err?.response?.status || null);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  const sendData = async (messageType: "embed" | "error" | "announcement" | null, title: string, url: string, message: string, requestUrl: string, method: string, HTTPStatus: string) => {
    setLoading(true);
    setError(null);

    const statusNumber = Number(HTTPStatus);
    const errorName = statusToErrorName[statusNumber];

    const errorPayload = {
      embeds: [
        {
          title: title || 'New Dashboard Error',
          url: url || 'https://ppl-solutions.vercel.app/drivershub/dashboard',
          description: `
**<t:${toUnixTimestamp(new Date())}:F>**
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
    };

    const embedPayload = {
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
    };

    const announcementPayload = {
      content: message
    };

    let payload = null;
    let authorName = '';
    if (messageType === "error") {
      payload = errorPayload;
      authorName = 'PPL Solutions VTC Error Logger';
    } else if (messageType === "announcement") {
      payload = announcementPayload;
      authorName
    } else {
      payload = embedPayload;
      authorName = 'PPL Solutions VTC Dashboard Messager';
    }

    try {
      const res = await axios.post(`/api/discord-webhook?messageType=${messageType}`, {
        username: messageType === 'error' ? 'PPL Solutions VTC Error Logger' : 'PPL Solutions VTC Dashboard Messager',
        avatar_url: 'https://ppl-solutions.vercel.app/assets/images/dark/logo.png',
        ...payload,
      });

      if (res.status !== 200) throw new Error('Failed to send dashboard data');

      const data = res.data;
      setData(data);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to send dashboard data';
      setError({ message: message, success: false });
      setStatus(err?.response?.status || null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, status, sendData, sendAnnouncement };
}
