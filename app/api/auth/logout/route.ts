import { NextResponse } from "next/server";

import { createLogoutCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  response.cookies.set(createLogoutCookie());
  return response;
}
