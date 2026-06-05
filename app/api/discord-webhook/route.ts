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
    
    // const username = body?.username || 'PPL Solutions';
    // const avatar_url = body?.avatar_url || 'https://ppl-solutions.vercel.app/assets/images/logo.png';
    const embeds = Array.isArray(body?.embeds) ? body.embeds : [];

    if (!embeds.length) {
      return errorHandler({ error: 'Missing message or embeds' }, request, lang, 400);
    }

    if (!process.env.DISCORD_WEBHOOK_URL) {
      return errorHandler({ error: 'Discord webhook URL is not configured' }, request, lang, 500);
    }

    const res = await axios.post(process.env.DISCORD_WEBHOOK_URL!, {
      // username,
      // avatar_url,
      embeds
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