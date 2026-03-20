"use client";

import { ChangeEvent, FormEvent } from "react";

import { PLATFORM_OPTIONS, STOCK_STATUS_OPTIONS } from "@/lib/constants";
import { PlatformType, StockStatus } from "@/types/product";

export interface ProductFormValues {
  productName: string;
  brandName: string;
  platformType: PlatformType;
  productUrl: string;
  imageUrls: string[];
  stockStatus: StockStatus;
  stockCount: string;
  note: string;
}

export type ProductFormTextField = Exclude<keyof ProductFormValues, "imageUrls">;

type ProductFormProps = {
  values: ProductFormValues;
  isEditing: boolean;
  isSubmitting: boolean;
  isUploadingImages: boolean;
  errorMessage: string | null;
  onChange: (field: ProductFormTextField, value: string) => void;
  onImageUpload: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function ProductForm({
  values,
  isEditing,
  isSubmitting,
  isUploadingImages,
  errorMessage,
  onChange,
  onImageUpload,
  onRemoveImage,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const handleInputChange =
    (field: ProductFormTextField) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      onChange(field, event.target.value);
    };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    onImageUpload(event.target.files);
    event.target.value = "";
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

        <div className="block">
          <div className="mb-1 flex items-center justify-between gap-3">
            <span className="block text-sm font-medium text-slate-700">商品画像</span>
            <span className="text-xs text-slate-500">最大5枚まで</span>
          </div>
          <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:bg-brand-50">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              disabled={isUploadingImages || values.imageUrls.length >= 5}
            />
            {isUploadingImages
              ? "画像をアップロード中..."
              : values.imageUrls.length >= 5
                ? "画像は5枚登録済みです"
                : "画像を追加する"}
          </label>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            JPEG / PNG / WebP などの画像を登録できます。保存後はアフィリエイター画面でも表示されます。
          </p>

          {values.imageUrls.length > 0 ? (
            <div className="mt-3 grid grid-cols-2 gap-3">
              {values.imageUrls.map((imageUrl, index) => (
                <div
                  key={`${imageUrl}-${index}`}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <img
                    src={imageUrl}
                    alt={`商品画像 ${index + 1}`}
                    className="h-32 w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-2 px-3 py-2">
                    <span className="text-xs font-medium text-slate-500">{index + 1}枚目</span>
                    <button
                      type="button"
                      onClick={() => onRemoveImage(index)}
                      className="text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

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
            disabled={isSubmitting || isUploadingImages}
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
