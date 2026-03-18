"use client";

import { ChangeEvent, FormEvent } from "react";

import { PLATFORM_OPTIONS, STOCK_STATUS_OPTIONS } from "@/lib/constants";
import { PlatformType, StockStatus } from "@/types/product";

export interface ProductFormValues {
  productName: string;
  brandName: string;
  platformType: PlatformType;
  productUrl: string;
  stockStatus: StockStatus;
  stockCount: string;
  note: string;
}

type ProductFormProps = {
  values: ProductFormValues;
  isEditing: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onChange: (field: keyof ProductFormValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function ProductForm({
  values,
  isEditing,
  isSubmitting,
  errorMessage,
  onChange,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const handleInputChange =
    (field: keyof ProductFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      onChange(field, event.target.value);
    };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {isEditing ? "商品を編集" : "新規商品を追加"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            商品情報と在庫状況を入力して保存します。
          </p>
        </div>
        {isEditing ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            キャンセル
          </button>
        ) : null}
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">商品名</span>
            <input
              value={values.productName}
              onChange={handleInputChange("productName")}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              placeholder="例: 美容液 50ml"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">ブランド名</span>
            <input
              value={values.brandName}
              onChange={handleInputChange("brandName")}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              placeholder="例: Brand X"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              プラットフォーム
            </span>
            <select
              value={values.platformType}
              onChange={handleInputChange("platformType")}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              {PLATFORM_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">在庫ステータス</span>
            <select
              value={values.stockStatus}
              onChange={handleInputChange("stockStatus")}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              {STOCK_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">商品URL</span>
          <input
            type="url"
            value={values.productUrl}
            onChange={handleInputChange("productUrl")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            placeholder="https://example.com/product"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">在庫数（任意）</span>
          <input
            type="number"
            min="0"
            step="1"
            value={values.stockCount}
            onChange={handleInputChange("stockCount")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            placeholder="例: 25"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">メモ</span>
          <textarea
            value={values.note}
            onChange={handleInputChange("note")}
            rows={4}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            placeholder="補足情報や訴求ポイントを記入"
          />
        </label>

        {errorMessage ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "保存中..." : isEditing ? "更新する" : "追加する"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            フォームをリセット
          </button>
        </div>
      </form>
    </div>
  );
}
