'use client'

import { useState } from 'react'
import axios from 'axios';

type HTTPMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type embedFormData = {
  username: string;
  avatar_url: string;
  author: string;
  authorIcon: string;
  title: string;
  titleUrl: string;
  message: string;
}

type errorsFormData = {
  username: string;
  avatar_url: string;
  errorAuthor: string;
  errorAuthorIcon: string;
  title: string;
  titleUrl: string;
  requestUrl: string;
  method: HTTPMethods;
  HTTPStatus: string;
  message: string;
}

type announcementsFormData = {
  username: string;
  avatar_url: string;
  title: string;
  announcementMentionTag: string;
  message: string;
  footer: string;
  footerRoleTag: string | null;
  footerEmojiTag: string | null;
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
  const [markdownPreview, setMarkdownPreview] = useState<any | null>(null);

  function clearFeedback() {
    setData(null);
    setError(null);
    setStatus(null);
  }

  async function sendAnnouncement(formData: announcementsFormData) {
    clearFeedback();
    setLoading(true);

    const { username, avatar_url, title, announcementMentionTag, message, footer, footerRoleTag, footerEmojiTag } = formData;
    
    // const username = author || 'PPL Solutions VTC';
    // const authorIconUrl = authorIcon || 'https://ppl-solutions.vercel.app/assets/images/dark/logo.png';
    const announcementTitle = title ? title : 'Announcement';
    const announcementMention = announcementMentionTag === 'everyone' ? '@everyone' : `<@&${announcementMentionTag}>`;
    const announcementFooter = footer ? footer : 'Best regards,\n';
    const footerRole = footerRoleTag ? `<@&${footerRoleTag}>` : '';
    const footerEmoji = footerEmojiTag ? `<${footerEmojiTag}>` : '';
    const payload = {
      content: `# ${announcementTitle}\nGreetings ${announcementMention}<:peepo_love:1288523924094845030>\n\n${message}\n\n${announcementFooter}${footerRole}${footerEmoji}`,
      allowed_mentions: {
        parse: ['everyone', 'roles']
      }
    }

    try {
      const res = await axios.post('/api/discord-webhook?messageType=announcement', {
        username: username,
        avatar_url: avatar_url,
        ...payload,
      });

      if (res.status !== 200) throw new Error('Failed to send announcement data');

      const data = res.data;
      setData(data);
      setMarkdownPreview(res);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to send announcement data';
      setError({ message: message, success: false });
      setStatus(err?.response?.status || null);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function sendError(formData: errorsFormData) {
    clearFeedback();
    setLoading(true);

    const { username, avatar_url, errorAuthor, errorAuthorIcon, title, titleUrl, requestUrl, method, HTTPStatus, message } = formData;

    const statusNumber = Number(HTTPStatus);
    const errorName = statusToErrorName[statusNumber] || 'UNKNOWN_ERROR';

    const payload = {
      embeds: [
        {
          title: title || 'New Dashboard Error',
          url: titleUrl || 'https://ppl-solutions.vercel.app/drivershub/dashboard',
          description: `
**<t:${toUnixTimestamp(new Date())}:F>**
URL: ${requestUrl}
Method: ${method}
Status: ${HTTPStatus}: ${errorName}
Message: ${message}
-----------------------------
          `,
          color: 0x009a86,
          author: {
            name: errorAuthor || 'PPL Solutions VTC Error Logger',
            icon_url: errorAuthorIcon || 'https://ppl-solutions.vercel.app/assets/images/dark/logo.png',
          }
        }
      ]
    };

    try {
      const res = await axios.post('/api/discord-webhook?messageType=error', {
        username: username,
        avatar_url: avatar_url,
        ...payload,
      });

      if (res.status !== 200) throw new Error('Failed to send dashboard error data');

      const data = res.data;
      setData(data);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to send dashboard error data';
      setError({ message: message, success: false });
      setStatus(err?.response?.status || null);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function sendEmbed(formData: embedFormData) {
    clearFeedback();
    setLoading(true);

    const { username, avatar_url, author, authorIcon, title, titleUrl, message } = formData;

    const payload = {
      embeds: [
        {
          title: title || 'New Dashboard Message',
          url: titleUrl || 'https://ppl-solutions.vercel.app/drivershub/dashboard',
          description: message,
          color: 0x009a86,
          author: {
            name: author || 'PPL Solutions VTC',
            icon_url: authorIcon || 'https://ppl-solutions.vercel.app/assets/images/dark/logo.png',
          }
        }
      ]
    };

    try {
      const res = await axios.post('/api/discord-webhook?messageType=embed', {
        username: username,
        avatar_url: avatar_url,
        ...payload,
      });

      if (res.status !== 200) throw new Error('Failed to send dashboard embed data');

      const data = res.data;
      setData(data);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to send dashboard embed data';
      setError({ message: message, success: false });
      setStatus(err?.response?.status || null);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  const sendData = async (messageType: "embed" | "error" | null, title: string, url: string, message: string, requestUrl: string, method: string, HTTPStatus: string) => {
    clearFeedback();
    setLoading(true);

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

    let payload = null;
    let authorName = '';
    if (messageType === "error") {
      payload = errorPayload;
      authorName = 'PPL Solutions VTC Error Logger';
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
      setMarkdownPreview(res);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to send dashboard data';
      setError({ message: message, success: false });
      setStatus(err?.response?.status || null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, status, markdownPreview, sendAnnouncement, sendError, sendEmbed, clearFeedback };
}
