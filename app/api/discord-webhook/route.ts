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
    const dict = await getDictionary(lang);
    const body = await request.json();

    const { searchParams } = new URL(request.url);
    const messageType = searchParams.get("messageType");

    if (messageType !== 'announcement' && messageType !== 'error' && messageType !== 'embed') {
      return errorHandler({ error: dict.errors.dashboard.route.INVALID_MESSAGE_TYPE }, request, lang, 400);
    }

    const typedWebhookUrlMap: Record<'announcement' | 'error' | 'embed', string | undefined> = {
      announcement: process.env.DISCORD_ANNOUNCEMENTS_WEBHOOK_URL,
      error: process.env.DISCORD_WEBSITE_ALERTS_WEBHOOK_URL,
      embed: process.env.DISCORD_DASHBOARD_WEBHOOK_URL,
    };

    let webhookUrl;
    if (process.env.NODE_ENV === 'development') {
      webhookUrl = process.env.DISCORD_TEST_DUMMY_WEBHOOK_URL;
    } else {
      webhookUrl = typedWebhookUrlMap[messageType];
    }
    
    const embeds = Array.isArray(body?.embeds) ? body.embeds : [];
    const content = typeof body?.content === 'string' ? body.content : '';
    const username = typeof body?.username === 'string' ? body.username.trim() : '';
    const avatar_url = typeof body?.avatar_url === 'string' ? body.avatar_url.trim() : '';
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
      return errorHandler({ error: dict.errors.dashboard.route.MISSING_MESSAGE_EMBEDS }, request, lang, 400);
    }

    if (!webhookUrl) {
      return errorHandler({ error: dict.errors.dashboard.route.INVALID_WEBHOOK_URL }, request, lang, 500);
    }

    const webhookPayload = {
      ...(username ? { username } : {}),
      ...(avatar_url ? { avatar_url } : {}),
      ...postData,
    };

    const res = await axios.post(webhookUrl, webhookPayload);

    const data = res.data;
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const responseData = err?.response?.data;
    const responseMessage = responseData?.message;

    const serverMessage = typeof responseMessage === 'string'
      ? responseMessage
      : typeof responseData === 'string'
        ? responseData
        : typeof err?.message === 'string'
          ? err.message
          : JSON.stringify(responseData || err);

    const statusCode = typeof err?.response?.status === 'number' ? err.response.status : 500;
    const discordCode = responseData?.code;
    const message = discordCode
      ? `${dict.errors.dashboard.route.FAILED_TO_SEND_MESSAGE_TO_DISCORD}: ${serverMessage} (${dict.errors.dashboard.route.HTTP_CODE}: ${discordCode})`
      : `${dict.errors.dashboard.route.FAILED_TO_SEND_MESSAGE_TO_DISCORD}: ${serverMessage}`;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, statusCode);
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