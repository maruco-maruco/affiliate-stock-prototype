export type UserRole = "company" | "affiliate";

export type LoginHint = {
  role: UserRole;
  roleLabel: string;
  loginId: string;
  password: string;
  description: string;
};

export const ROLE_LABELS: Record<UserRole, string> = {
  company: "企業側",
  affiliate: "アフィリエイター側",
};

// プロトタイプ用の固定アカウントです。
// 将来的には DB や外部認証に置き換えやすいように定義を分離しています。
export const LOGIN_HINTS: LoginHint[] = [
  {
    role: "company",
    roleLabel: ROLE_LABELS.company,
    loginId: "company",
    password: "company1234",
    description: "商品登録・在庫更新・削除ができる管理者アカウント",
  },
  {
    role: "affiliate",
    roleLabel: ROLE_LABELS.affiliate,
    loginId: "affiliate",
    password: "affiliate1234",
    description: "スマホ向け在庫確認ページを閲覧するアカウント",
  },
];

export const ROLE_HOME_PATHS: Record<UserRole, string> = {
  company: "/admin",
  affiliate: "/affiliate",
};
