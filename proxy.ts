import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./i18n";
import { getDictionary } from "@/app/i18n";
import { createServerClient } from "@supabase/ssr";
import { checkRateLimit, createRateLimitResponse } from "@/utils/rateLimit";
import { applyCorsHeaders, getCorsContext } from "@/utils/cors";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const normalizedPathname = stripLocalePrefix(pathname);
  const localePrefix = getLocaleFromRequest(request);
  const dict = await getDictionary(localePrefix);

  if (pathname.startsWith("/api")) {
    const { isAllowedOrigin, headers } = getCorsContext(request);

    if (request.method === "OPTIONS") {
      if (!isAllowedOrigin) {
        return new NextResponse(
          JSON.stringify({ error: "Forbidden", message: dict.errors.cors.ORIGIN_NOT_ALLOWED }),
          { status: 403, headers: { "Content-Type": "application/json", ...headers } },
        );
      }

      return new NextResponse(null, { status: 204, headers });
    }

    if (!isAllowedOrigin) {
      return new NextResponse(
        JSON.stringify({ error: "Forbidden", message: dict.errors.cors.ORIGIN_NOT_ALLOWED }),
        { status: 403, headers: { "Content-Type": "application/json", ...headers } },
      );
    }

    let maxRequests = 0;
    let timeWindowInMs = 0;
    if (process.env.NODE_ENV === 'production') {
      maxRequests = 100;
      timeWindowInMs = 3600000;
    } else if (process.env.NODE_ENV === 'development') {
      maxRequests = 1000;
      timeWindowInMs = 60000;
    }

    const rateLimit = checkRateLimit(request, {
      timeWindowInMs: timeWindowInMs,
      maxRequests: maxRequests,
      keyPrefix: "api-global",
    });

    if (!rateLimit.success) {
      const rateLimitedResponse = await createRateLimitResponse(rateLimit, request);
      return applyCorsHeaders(rateLimitedResponse, headers);
    }

    const response = NextResponse.next();
    return applyCorsHeaders(response, headers);
  }

  // Exclude static files from rewrites/redirects
  const staticFiles = [
    "/.well-known",
    "/robots.txt",
    "/sitemap.xml",
    "/favicon.ico",
    "/favicon.png",
    "/assets",
    "/_next/static",
    "/_next/image",
  ];
  if (staticFiles.some((file) => normalizedPathname === file || normalizedPathname.startsWith(file + "/"))) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const requiresAuthSession = ["/drivershub"].some(
    (prefix) => normalizedPathname === prefix || normalizedPathname.startsWith(`${prefix}/`),
  );

  if (requiresAuthSession) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({
              request: { headers: request.headers },
            });
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      },
    );

    try {
      await supabase.auth.getUser();
    } catch (error) {
      console.warn("Supabase auth check failed in proxy:", error);
    }
  }

  const pathnameLocale = i18n.locales.find((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  if (pathnameLocale) {
    if (pathnameLocale === i18n.defaultLocale) {
      const newPathname = pathname.replace(`/${pathnameLocale}`, "") || "/";
      return NextResponse.rewrite(new URL(`/${pathnameLocale}${newPathname}`, request.url));
    }
    return response;
  }

  const locale = getLocaleFromRequest(request);

  if (locale !== i18n.defaultLocale) {
    return NextResponse.redirect(new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url));
  }

  const finalUrl = new URL(`/${i18n.defaultLocale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url);

  const rewriteResponse = NextResponse.rewrite(finalUrl);
  response.cookies.getAll().forEach((cookie) => {
    rewriteResponse.cookies.set(cookie.name, cookie.value);
  });

  return rewriteResponse;
}

function stripLocalePrefix(pathname: string): string {
  const localePrefix = i18n.locales.find((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  if (!localePrefix) return pathname;

  const stripped = pathname.slice(localePrefix.length + 1);
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|assets|favicon.ico|robots.txt|sitemap.xml).*)"],
};
