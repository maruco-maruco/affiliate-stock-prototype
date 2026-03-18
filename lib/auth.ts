import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ROLE_HOME_PATHS, UserRole } from "@/lib/auth-config";

const SESSION_COOKIE_NAME = "affiliate_stock_session";
const SESSION_MAX_AGE = 60 * 60 * 12;
const SESSION_SECRET = process.env.AUTH_SECRET ?? "prototype-local-secret";

type Account = {
  role: UserRole;
  loginId: string;
  password: string;
  displayName: string;
};

export type AuthSession = {
  role: UserRole;
  loginId: string;
  displayName: string;
};

const ACCOUNTS: Record<UserRole, Account> = {
  company: {
    role: "company",
    loginId: "company",
    password: "company1234",
    displayName: "企業担当者",
  },
  affiliate: {
    role: "affiliate",
    loginId: "affiliate",
    password: "affiliate1234",
    displayName: "アフィリエイター",
  },
};

function sign(value: string): string {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("base64url");
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function createSessionValue(session: AuthSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

function parseSessionValue(value?: string): AuthSession | null {
  if (!value) {
    return null;
  }

  const [payload, signature] = value.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = sign(payload);

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as AuthSession;

    if (
      parsed.role !== "company" &&
      parsed.role !== "affiliate"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function authenticateUser(role: UserRole, loginId: string, password: string): AuthSession | null {
  const account = ACCOUNTS[role];

  if (!account) {
    return null;
  }

  if (account.loginId !== loginId || account.password !== password) {
    return null;
  }

  return {
    role: account.role,
    loginId: account.loginId,
    displayName: account.displayName,
  };
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  return parseSessionValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function requireRole(role: UserRole): Promise<AuthSession> {
  const session = await getSession();

  if (!session || session.role !== role) {
    redirect(`/login?role=${role}`);
  }

  return session;
}

export function getRoleHomePath(role: UserRole): string {
  return ROLE_HOME_PATHS[role];
}

export function createAuthCookie(session: AuthSession) {
  return {
    name: SESSION_COOKIE_NAME,
    value: createSessionValue(session),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export function createLogoutCookie() {
  return {
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}
