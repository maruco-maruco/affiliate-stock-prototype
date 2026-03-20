"use client";

import { useState } from "react";

import { StatusBadge } from "@/components/StatusBadge";
import { PLATFORM_LABELS, STOCK_STATUS_LABELS } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { Product, StockStatus } from "@/types/product";

type AffiliateCatalogProps = {
  initialProducts: Product[];
  userLabel: string;
};

type FilterValue = "all" | StockStatus;

const FILTER_OPTIONS: Array<{ value: FilterValue; label: string }> = [
  { value: "all", label: "すべて" },
  { value: "in_stock", label: STOCK_STATUS_LABELS.in_stock },
  { value: "low_stock", label: STOCK_STATUS_LABELS.low_stock },
  { value: "out_of_stock", label: STOCK_STATUS_LABELS.out_of_stock },
];

export function AffiliateCatalog({ initialProducts, userLabel }: AffiliateCatalogProps) {
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");

  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredProducts = initialProducts.filter((product) => {
    const matchesFilter = filter === "all" ? true : product.stockStatus === filter;
    const matchesKeyword =
      !normalizedKeyword ||
      product.productName.toLowerCase().includes(normalizedKeyword) ||
      product.brandName.toLowerCase().includes(normalizedKeyword);

    return matchesFilter && matchesKeyword;
  });

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 py-6 sm:px-6">
      <header className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
              Affiliate
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">在庫確認ページ</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              スマホで見やすい簡易ビューです。商品名やブランド名で検索し、在庫状況で絞り込めます。
            </p>
          </div>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              ログアウト
            </button>
          </form>
        </div>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-soft">
          ログイン中: <span className="font-semibold text-slate-900">{userLabel}</span>
        </div>
      </header>

      <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">商品検索</span>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            placeholder="商品名・ブランド名で検索"
          />
        </label>

        <div className="mt-4">
          <span className="mb-2 block text-sm font-medium text-slate-700">在庫ステータス</span>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTER_OPTIONS.map((option) => {
              const isActive = filter === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilter(option.value)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-brand-500 text-white"
                      : "border border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mb-4 text-sm font-medium text-slate-600">
        表示件数: <span className="font-semibold text-slate-900">{filteredProducts.length}</span>
      </div>

      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {PLATFORM_LABELS[product.platformType]}
                </p>
                <h2 className="mt-1 text-lg font-semibold leading-6 text-slate-900">
                  {product.productName}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{product.brandName}</p>
              </div>
              <StatusBadge status={product.stockStatus} />
            </div>

            {product.imageUrls.length > 0 ? (
              <div className="-mx-4 mt-4 overflow-x-auto pb-1">
                <div className="flex gap-3 px-4">
                  {product.imageUrls.map((imageUrl, index) => (
                    <img
                      key={`${product.id}-${imageUrl}-${index}`}
                      src={imageUrl}
                      alt={`${product.productName} の商品画像 ${index + 1}`}
                      className="h-48 w-40 shrink-0 rounded-2xl border border-slate-200 object-cover"
                    />
                  ))}
                </div>
              </div>
            ) : null}

            <dl className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-3">
                <dt>更新日時</dt>
                <dd className="font-medium text-slate-900">{formatDateTime(product.updatedAt)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt>在庫数</dt>
                <dd className="font-medium text-slate-900">{product.stockCount ?? "-"}</dd>
              </div>
            </dl>

            {product.note ? (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {product.note}
              </p>
            ) : null}

            <a
              href={product.productUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex h-11 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              {PLATFORM_LABELS[product.platformType]}の商品ページを見る
            </a>
          </article>
        ))}

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-sm text-slate-500">
            条件に一致する商品がありません。
          </div>
        ) : null}
      </div>
    </div>
  );
}
