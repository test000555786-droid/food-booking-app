import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseCredentials, isSupabaseConfigured } from "./shared";

const SUPABASE_RESPONSE_HEADERS = ["cache-control", "expires", "pragma"] as const;

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (!isSupabaseConfigured()) {
    return response;
  }

  const { key, url } = getSupabaseCredentials();

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });

        Object.entries(headers).forEach(([headerName, headerValue]) => {
          response.headers.set(headerName, headerValue);
        });
      },
    },
  });

  await supabase.auth.getClaims();

  return response;
}

export function applySupabaseHeaders(
  targetResponse: NextResponse,
  sourceResponse: NextResponse
) {
  sourceResponse.cookies.getAll().forEach((cookie) => {
    targetResponse.cookies.set(cookie);
  });

  SUPABASE_RESPONSE_HEADERS.forEach((headerName) => {
    const headerValue = sourceResponse.headers.get(headerName);

    if (headerValue) {
      targetResponse.headers.set(headerName, headerValue);
    }
  });

  return targetResponse;
}
