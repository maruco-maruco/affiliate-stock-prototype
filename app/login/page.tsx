import { redirect } from "next/navigation";

import { LoginForm } from "@/components/LoginForm";
import { getRoleHomePath, getSession } from "@/lib/auth";
import { UserRole } from "@/lib/auth-config";

type LoginPageProps = {
  searchParams: Promise<{
    role?: string | string[];
  }>;
};

function normalizeRole(value?: string | string[]): UserRole {
  const normalizedValue = Array.isArray(value) ? value[0] : value;
  return normalizedValue === "affiliate" ? "affiliate" : "company";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();

  if (session) {
    redirect(getRoleHomePath(session.role));
  }

  const params = await searchParams;
  const initialRole = normalizeRole(params.role);

  return <LoginForm initialRole={initialRole} />;
}
