'use client'

import { useState } from 'react'
import axios from 'axios';
import type { Dictionary } from "@/app/i18n";

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

function toUnixTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export default function useDashboard(dict: Dictionary) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  function clearFeedback() {
    setData(null);
    setError(null);
    setStatus(null);
    setSuccess(null);
  }

  async function sendAnnouncement(formData: announcementsFormData) {
    clearFeedback();
    setLoading(true);

    const { username, avatar_url, title, announcementMentionTag, message, footer, footerRoleTag, footerEmojiTag } = formData;
    
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

      if (res.status !== 200) throw new Error(dict.errors.dashboard.hook.announcement.FAILED_TO_SEND_ANNOUNCEMENT_DATA);

      const data = res.data;
      setSuccess(dict.success.dashboard.announcement.MESSAGE_SENT);
      setData(data);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.dashboard.hook.announcement.FAILED_TO_SEND_ANNOUNCEMENT_DATA;
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

      if (res.status !== 200) throw new Error(dict.errors.dashboard.hook.error.FAILED_TO_SEND_ERROR_DATA);

      const data = res.data;
      setSuccess(dict.success.dashboard.error.MESSAGE_SENT);
      setData(data);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.dashboard.hook.error.FAILED_TO_SEND_ERROR_DATA;
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

      if (res.status !== 200) throw new Error(dict.errors.dashboard.hook.embed.FAILED_TO_SEND_EMBED_DATA);

      const data = res.data;
      setSuccess(dict.success.dashboard.embed.MESSAGE_SENT);
      setData(data);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.dashboard.hook.embed.FAILED_TO_SEND_EMBED_DATA;
      setError({ message: message, success: false });
      setStatus(err?.response?.status || null);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, success, status, sendAnnouncement, sendError, sendEmbed, clearFeedback };
}
