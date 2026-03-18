import Link from "next/link";

const headingFontClass =
  "[font-family:'Avenir_Next','Trebuchet_MS','Hiragino_Sans','Yu_Gothic',sans-serif]";
const bodyFontClass =
  "[font-family:'Avenir_Next','Hiragino_Sans','Yu_Gothic','Meiryo',sans-serif]";

const highlights = [
  "企業側はPCで更新",
  "アフィリエイター側はスマホで確認",
  "在庫あり / 残りわずか / 売り切れを即反映",
  "楽天 / Amazon の導線を整理",
];

const features = [
  {
    index: "01",
    title: "Update Fast",
    description:
      "管理画面から在庫やメモを更新すると、確認画面の表示をすぐ切り替えられます。",
  },
  {
    index: "02",
    title: "Mobile Ready",
    description:
      "アフィリエイター向け画面はスマホで見やすい余白とボタンサイズを前提に設計しています。",
  },
  {
    index: "03",
    title: "Lean Prototype",
    description:
      "JSON保存ベースの軽い構成なので、認証やDB移行の前段としても使いやすい作りです。",
  },
];

const flows = [
  {
    label: "企業側",
    title: "在庫を入力・更新",
    description: "商品登録、在庫ステータス変更、在庫数更新、メモ編集をPCでまとめて処理。",
  },
  {
    label: "共有",
    title: "一覧データとして保持",
    description: "商品情報は API と JSON ファイルで一元管理。updatedAt も保存時に自動更新。",
  },
  {
    label: "閲覧側",
    title: "スマホで迷わず確認",
    description: "商品検索やステータス絞り込みで、どの商品を訴求できるかを即判断できます。",
  },
];

export default function HomePage() {
  return (
    <main
      className={`${bodyFontClass} overflow-hidden bg-[linear-gradient(180deg,#f6d8dd_0%,#f6e7d6_20%,#f5f0e8_42%,#e8e7f3_72%,#efe6f3_100%)] text-slate-900`}
    >
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute left-[-8%] top-14 h-72 w-72 rounded-full bg-sky-200/45 blur-3xl" />
          <div className="absolute right-[-4%] top-16 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl" />
          <div className="absolute left-1/3 top-[26rem] h-72 w-72 rounded-full bg-violet-200/25 blur-3xl" />
        </div>

        <section className="relative border-b border-slate-900/10 px-4 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <header className="flex flex-wrap items-center justify-between gap-4 py-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-900/70">
                  Affiliate Stock Club
                </p>
                <p className="mt-1 text-sm text-slate-900/65">
                  inventory sharing for modern teams
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/login?role=company"
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  企業側ログイン
                </Link>
                <Link
                  href="/login?role=affiliate"
                  className="rounded-full border border-slate-900/20 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white"
                >
                  アフィリエイター側ログイン
                </Link>
              </div>
            </header>
          </div>
        </section>

        <section className="relative px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-10">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-900/45">
                  Modern Inventory Flow
                </p>
                <h1
                  className={`${headingFontClass} mt-5 text-[40px] font-bold leading-[1.02] tracking-[-0.05em] text-slate-900 sm:text-[56px] lg:text-[72px]`}
                >
                  在庫共有を、
                  <br />
                  軽やかに
                  <br />
                  速くする。
                </h1>
                <p className="mt-6 max-w-xl text-[15px] leading-8 text-slate-900/70 sm:text-base">
                  メインビジュアルの世界観を活かしつつ、トーンは少し落として整理。
                  スタートアップらしい軽さは残しながら、見やすさと品のバランスを取りにいったトップです。
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:max-w-[420px] sm:flex-row">
                  <Link
                    href="/login?role=company"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    企業側でログイン
                  </Link>
                  <Link
                    href="/login?role=affiliate"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-slate-900/15 bg-white/70 px-6 text-sm font-semibold text-slate-900 transition hover:bg-white"
                  >
                    アフィリエイター側でログイン
                  </Link>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-900/15 pt-6">
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-900/75">
                  {highlights.map((item) => (
                    <span key={item} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-500" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-5 top-10 h-20 w-20 rounded-full border-4 border-sky-200/80" />
              <div className="absolute right-6 top-[-14px] h-16 w-16 rounded-full border-4 border-amber-200/90" />
              <div className="absolute bottom-8 left-8 h-10 w-10 rounded-full bg-rose-300/70 blur-sm" />

              <div className="overflow-hidden rounded-[40px] border-[3px] border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.52),rgba(255,255,255,0.22))] p-3 shadow-[0_30px_80px_rgba(40,48,82,0.14)] backdrop-blur">
                <div className="overflow-hidden rounded-[32px] border-2 border-slate-900/15 bg-[linear-gradient(180deg,#efe5e7_0%,#efe7dc_20%,#f4f0ea_42%,#e7e8f0_70%,#ebe4ef_100%)]">
                  <div className="flex items-center justify-between border-b-2 border-slate-900/15 px-5 py-4">
                    <div className="flex gap-2">
                      <span className="h-3 w-3 rounded-full bg-rose-500" />
                      <span className="h-3 w-3 rounded-full bg-yellow-400" />
                      <span className="h-3 w-3 rounded-full bg-cyan-400" />
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-900/55">
                      Main Visual
                    </div>
                  </div>

                  <div className="relative min-h-[480px] overflow-hidden px-5 py-6">
                    <div className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.72),rgba(255,255,255,0)_62%)]" />
                    <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-sky-100/70 blur-3xl" />
                    <div className="absolute right-0 top-10 h-44 w-44 rounded-full bg-rose-100/70 blur-3xl" />

                    <div className="relative z-10 mx-auto max-w-[620px]">
                      <div className="mb-5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-900/45">
                        <span>PC dashboard + mobile view</span>
                        <span>admin / affiliate</span>
                      </div>

                      <div className="relative rounded-[30px] border border-slate-900/15 bg-slate-950 p-3 shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
                        <div className="rounded-[22px] bg-[#f7f7fb] p-4">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <div>
                              <div className="text-sm font-semibold text-slate-900">
                                在庫管理ダッシュボード
                              </div>
                              <div className="mt-1 text-xs text-slate-500">
                                商品登録 / 在庫更新 / メモ編集
                              </div>
                            </div>
                            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                              sync active
                            </div>
                          </div>

                          <div className="mt-4 grid gap-4 lg:grid-cols-[180px_1fr]">
                            <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                              <div className="h-3 w-24 rounded-full bg-slate-900/80" />
                              <div className="mt-4 h-10 rounded-2xl bg-slate-100" />
                              <div className="mt-3 h-10 rounded-2xl bg-slate-100" />
                              <div className="mt-3 h-10 rounded-2xl bg-slate-100" />
                              <div className="mt-3 h-24 rounded-[22px] bg-slate-100" />
                              <div className="mt-4 h-10 rounded-full bg-slate-900" />
                            </div>

                            <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                              <div className="grid grid-cols-[1.2fr_0.8fr_0.6fr_0.6fr] gap-3 border-b border-slate-100 pb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                <span>商品名</span>
                                <span>ブランド</span>
                                <span>在庫</span>
                                <span>更新</span>
                              </div>
                              <div className="space-y-3 pt-3">
                                <div className="grid grid-cols-[1.2fr_0.8fr_0.6fr_0.6fr] gap-3 rounded-2xl bg-slate-50 px-3 py-3">
                                  <div>
                                    <div className="h-3 w-28 rounded-full bg-slate-800" />
                                    <div className="mt-2 h-2.5 w-20 rounded-full bg-slate-300" />
                                  </div>
                                  <div className="h-3 w-16 rounded-full bg-slate-300" />
                                  <div className="h-7 rounded-full bg-emerald-100" />
                                  <div className="h-3 w-12 rounded-full bg-slate-300" />
                                </div>
                                <div className="grid grid-cols-[1.2fr_0.8fr_0.6fr_0.6fr] gap-3 rounded-2xl bg-slate-50 px-3 py-3">
                                  <div>
                                    <div className="h-3 w-24 rounded-full bg-slate-800" />
                                    <div className="mt-2 h-2.5 w-16 rounded-full bg-slate-300" />
                                  </div>
                                  <div className="h-3 w-14 rounded-full bg-slate-300" />
                                  <div className="h-7 rounded-full bg-amber-100" />
                                  <div className="h-3 w-10 rounded-full bg-slate-300" />
                                </div>
                                <div className="grid grid-cols-[1.2fr_0.8fr_0.6fr_0.6fr] gap-3 rounded-2xl bg-slate-50 px-3 py-3">
                                  <div>
                                    <div className="h-3 w-32 rounded-full bg-slate-800" />
                                    <div className="mt-2 h-2.5 w-24 rounded-full bg-slate-300" />
                                  </div>
                                  <div className="h-3 w-12 rounded-full bg-slate-300" />
                                  <div className="h-7 rounded-full bg-rose-100" />
                                  <div className="h-3 w-12 rounded-full bg-slate-300" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="absolute -bottom-8 right-3 w-[180px] rounded-[30px] border border-slate-900/15 bg-white/90 p-2 shadow-[0_24px_50px_rgba(15,23,42,0.18)] backdrop-blur">
                          <div className="rounded-[24px] border border-slate-200 bg-white p-3">
                            <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-slate-200" />
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs font-semibold text-slate-900">
                                  在庫確認ページ
                                </div>
                                <div className="mt-1 text-[11px] text-slate-500">
                                  mobile affiliate view
                                </div>
                              </div>
                              <div className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                live
                              </div>
                            </div>

                            <div className="mt-3 h-10 rounded-2xl bg-slate-100" />
                            <div className="mt-3 flex gap-2">
                              <div className="h-8 flex-1 rounded-full bg-slate-900" />
                              <div className="h-8 flex-1 rounded-full bg-slate-100" />
                            </div>

                            <div className="mt-4 space-y-3">
                              <div className="rounded-[20px] bg-slate-50 p-3">
                                <div className="h-3 w-24 rounded-full bg-slate-800" />
                                <div className="mt-2 h-2.5 w-16 rounded-full bg-slate-300" />
                                <div className="mt-3 h-7 w-20 rounded-full bg-emerald-100" />
                                <div className="mt-3 h-9 rounded-xl bg-slate-900" />
                              </div>
                              <div className="rounded-[20px] bg-slate-50 p-3">
                                <div className="h-3 w-20 rounded-full bg-slate-800" />
                                <div className="mt-2 h-2.5 w-14 rounded-full bg-slate-300" />
                                <div className="mt-3 h-7 w-20 rounded-full bg-amber-100" />
                                <div className="mt-3 h-9 rounded-xl bg-slate-900" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-900/10 bg-white/35 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-x-10 gap-y-3 text-[13px] font-semibold uppercase tracking-[0.24em] text-slate-900/55">
            <span>next.js</span>
            <span>typescript</span>
            <span>tailwind css</span>
            <span>app router</span>
            <span>json storage</span>
            <span>role based login</span>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 border-b border-slate-900/10 pb-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-900/45">
                  What This Product Does
                </p>
                <h2
                  className={`${headingFontClass} mt-4 text-3xl font-bold leading-[1.16] tracking-[-0.04em] text-slate-900 sm:text-4xl`}
                >
                  役割を分けて、
                  <br />
                  在庫連携だけを
                  <br />
                  すっきり整える。
                </h2>
              </div>

              <div className="space-y-8">
                {features.map((feature) => (
                  <div
                    key={feature.index}
                    className="grid gap-3 border-b border-slate-900/10 pb-8 last:border-b-0 last:pb-0 sm:grid-cols-[96px_1fr]"
                  >
                    <div className={`${headingFontClass} text-3xl font-bold tracking-[-0.05em] text-slate-900/30`}>
                      {feature.index}
                    </div>
                    <div>
                      <h3 className={`${headingFontClass} text-3xl font-bold tracking-[-0.05em] text-slate-900`}>
                        {feature.title}
                      </h3>
                      <p className="mt-3 max-w-2xl text-base leading-9 text-slate-900/65">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-900/45">
                  Workflow
                </p>
                <h2
                  className={`${headingFontClass} mt-4 text-3xl font-bold leading-[1.16] tracking-[-0.04em] text-slate-900 sm:text-4xl`}
                >
                  操作の流れも、
                  <br />
                  余計な装飾なしで
                  <br />
                  伝わる設計に。
                </h2>
              </div>

              <div className="border-t border-slate-900/15">
                {flows.map((flow) => (
                  <div
                    key={flow.label}
                    className="grid gap-3 border-b border-slate-900/15 py-7 sm:grid-cols-[128px_1fr]"
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-900/40">
                      {flow.label}
                    </div>
                    <div>
                      <h3 className={`${headingFontClass} text-2xl font-bold tracking-[-0.04em] text-slate-900`}>
                        {flow.title}
                      </h3>
                      <p className="mt-3 text-base leading-9 text-slate-900/65">
                        {flow.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-900/10 bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/35">
                  Get Started
                </p>
                <h2
                  className={`${headingFontClass} mt-4 text-3xl font-bold leading-[1.16] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl`}
                >
                  企業側と閲覧側、
                  <br />
                  それぞれの入口から
                  <br />
                  すぐ試せます。
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-9 text-white/65">
                  カードを置かず、最後も横並びのCTAでシンプルに。トーンを抑えながら、試しやすさは維持しています。
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/login?role=company"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  企業側として入る
                </Link>
                <Link
                  href="/login?role=affiliate"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 px-7 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  アフィリエイターとして入る
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
