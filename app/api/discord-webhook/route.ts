import { NextResponse, NextRequest } from 'next/server'
import { errorHandler } from "@/utils/errorHandler";
import axios from "axios";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";
import { getDictionary } from "@/app/i18n";

axios.defaults.headers.common["Content-Type"] = "application/json";

async function methodNotAllowed(request: NextRequest) {
  const lang = getLocaleFromRequest(request);
  const dict = await getDictionary(lang);
  return errorHandler({ error: dict.statusCodes.METHOD_NOT_ALLOWED }, request, lang, 405);
}

export async function POST(request: NextRequest) {
  try {
    const lang = getLocaleFromRequest(request);
    const body = await request.json();

    const { searchParams } = new URL(request.url);
    const messageType = searchParams.get("messageType") as "embed" | "error" | "announcement" | null;

    let webhookUrl: string = '';
    if (messageType === 'announcement') {
      webhookUrl = process.env.DISCORD_ANNOUNCEMENTS_WEBHOOK_URL as string;
    } else if (messageType === 'error') {
      webhookUrl = process.env.DISCORD_WEBSITE_ALERTS_WEBHOOK_URL as string;
    } else if (messageType === 'embed') {
      webhookUrl = process.env.DISCORD_DASHBOARD_WEBHOOK_URL as string;
    }

    const testUrl = process.env.DISCORD_TEST_DUMMY_WEBHOOK_URL;
    
    // const username = body?.username || 'PPL Solutions';
    // const avatar_url = body?.avatar_url || 'https://ppl-solutions.vercel.app/assets/images/logo.png';
    const embeds = Array.isArray(body?.embeds) ? body.embeds : [];
    const content = typeof body?.content === 'string' ? body.content : '';
    const username = body?.username ? String(body.username) : '';
    const avatar_url = body?.avatar_url ? String(body.avatar_url) : '';
    const allowed_mentions = body?.allowed_mentions && typeof body.allowed_mentions === 'object'
      ? body.allowed_mentions
      : undefined;

    let postData: any = {};
    if (messageType === 'announcement') {
      postData.content = content;
      if (allowed_mentions) {
        postData.allowed_mentions = allowed_mentions;
      }
    } else {
      postData.embeds = embeds;
    }

    if ((messageType === 'embed' || messageType === 'error') && !embeds.length) {
      return errorHandler({ error: 'Missing message or embeds' }, request, lang, 400);
    }

    if (!testUrl) {
      return errorHandler({ error: 'Discord webhook URL is not configured' }, request, lang, 500);
    }

    const res = await axios.post(testUrl!, {
      username,
      avatar_url,
      ...postData
    });

    const data = res.data;
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = 'Failed to send message to Discord';
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}

export async function GET(request: NextRequest) {
  return methodNotAllowed(request);
}

export async function PUT(request: NextRequest) {
  return methodNotAllowed(request);
}

export async function PATCH(request: NextRequest) {
  return methodNotAllowed(request);
}

export async function DELETE(request: NextRequest) {
  return methodNotAllowed(request);
}