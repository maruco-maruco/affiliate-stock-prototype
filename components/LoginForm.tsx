"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { LOGIN_HINTS, ROLE_LABELS, UserRole } from "@/lib/auth-config";

type LoginFormProps = {
  initialRole: UserRole;
};

export function LoginForm({ initialRole }: LoginFormProps) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(initialRole);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const activeHint = LOGIN_HINTS.find((hint) => hint.role === role);

  const handleRoleChange = (nextRole: UserRole) => {
    setRole(nextRole);
    setErrorMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          loginId,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "ログインに失敗しました。");
      }

      router.push(result.redirectPath);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("ログインに失敗しました。");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white/90 p-8 shadow-soft backdrop-blur sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Login</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            ログインして画面を開く
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            役割ごとにログインして、企業側は管理画面、アフィリエイター側は在庫確認画面へ入れます。
          </p>

          <div className="mt-6">
            <div className="inline-flex w-full rounded-2xl bg-slate-100 p-1">
              {(["company", "affiliate"] as UserRole[]).map((item) => {
                const active = role === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleRoleChange(item)}
                    className={`flex-1 rounded-[14px] px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {ROLE_LABELS[item]}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="text-sm font-semibold text-slate-900">{ROLE_LABELS[role]}ログイン</div>
              <div className="mt-1 text-sm leading-6 text-slate-500">
                {role === "company"
                  ? "PC向けの管理画面に入ります。商品登録・在庫更新・削除に対応しています。"
                  : "スマホ向けの在庫確認画面に入ります。検索とステータス確認に対応しています。"}
              </div>
            </div>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">ログインID</span>
              <input
                value={loginId}
                onChange={(event) => setLoginId(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                placeholder={activeHint ? `例: ${activeHint.loginId}` : "ログインIDを入力"}
                required
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">パスワード</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                placeholder={activeHint ? `${ROLE_LABELS[role]}のパスワードを入力` : "パスワードを入力"}
                required
              />
            </label>

            {errorMessage ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-brand-500 px-5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "ログイン中..." : `${ROLE_LABELS[role]}でログイン`}
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-500">
            <Link href="/" className="font-medium text-brand-700 hover:underline">
              トップページに戻る
            </Link>
          </div>
        </section>

        <aside className="rounded-[28px] border border-slate-200 bg-slate-900 p-8 text-white shadow-soft sm:p-10">
          <h2 className="text-xl font-semibold">テスト用アカウント</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            このプロトタイプでは固定アカウントでログインできます。将来的にはここを認証基盤に差し替える想定です。
          </p>

          <div className="mt-6 space-y-4">
            {LOGIN_HINTS.map((hint) => (
              <div key={hint.role} className="rounded-2xl bg-white/10 p-4">
                <div className="text-sm font-semibold">{hint.roleLabel}</div>
                <p className="mt-1 text-xs leading-6 text-slate-300">{hint.description}</p>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-300">ログインID</dt>
                    <dd className="font-mono font-semibold">{hint.loginId}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-300">パスワード</dt>
                    <dd className="font-mono font-semibold">{hint.password}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
