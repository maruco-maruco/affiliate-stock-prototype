import { NextResponse } from "next/server";

import { authenticateUser, createAuthCookie, getRoleHomePath } from "@/lib/auth";
import { UserRole } from "@/lib/auth-config";

export const runtime = "nodejs";

function isUserRole(value: unknown): value is UserRole {
  return value === "company" || value === "affiliate";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      role?: unknown;
      loginId?: unknown;
      password?: unknown;
    };

    const role = payload.role;
    const loginId = typeof payload.loginId === "string" ? payload.loginId.trim() : "";
    const password = typeof payload.password === "string" ? payload.password : "";

    if (!isUserRole(role)) {
      return NextResponse.json({ error: "ログイン種別が不正です。" }, { status: 400 });
    }

    if (!loginId || !password) {
      return NextResponse.json({ error: "ログインIDとパスワードを入力してください。" }, { status: 400 });
    }

    const session = authenticateUser(role, loginId, password);

    if (!session) {
      return NextResponse.json({ error: "ログイン情報が正しくありません。" }, { status: 401 });
    }

    const response = NextResponse.json({
      redirectPath: getRoleHomePath(session.role),
      session,
    });

    response.cookies.set(createAuthCookie(session));
    return response;
  } catch {
    return NextResponse.json({ error: "ログインに失敗しました。" }, { status: 500 });
  }
}
