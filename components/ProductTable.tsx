"use client";

import { PLATFORM_LABELS } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { Product } from "@/types/product";
import { StatusBadge } from "@/components/StatusBadge";

type ProductTableProps = {
  products: Product[];
  editingId: string | null;
  isDeletingId: string | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export function ProductTable({
  products,
  editingId,
  isDeletingId,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">商品一覧</h2>
          <p className="mt-1 text-sm text-slate-500">登録済みの商品を一覧で確認できます。</p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
          {products.length}件
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm font-semibold text-slate-600">
              <th className="px-6 py-4">商品</th>
              <th className="px-4 py-4">ブランド</th>
              <th className="px-4 py-4">媒体</th>
              <th className="px-4 py-4">在庫</th>
              <th className="px-4 py-4">在庫数</th>
              <th className="px-4 py-4">更新日時</th>
              <th className="px-4 py-4">メモ</th>
              <th className="px-6 py-4">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
            {products.map((product) => (
              <tr
                key={product.id}
                className={editingId === product.id ? "bg-brand-50/60" : "hover:bg-slate-50"}
              >
                <td className="px-6 py-4">
                  <div className="min-w-[220px]">
                    <div className="font-semibold text-slate-900">{product.productName}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      画像: {product.imageUrls.length}枚
                    </div>
                    <a
                      href={product.productUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-xs font-medium text-brand-700 hover:underline"
                    >
                      商品ページを開く
                    </a>
                  </div>
                </td>
                <td className="px-4 py-4">{product.brandName}</td>
                <td className="px-4 py-4">{PLATFORM_LABELS[product.platformType]}</td>
                <td className="px-4 py-4">
                  <StatusBadge status={product.stockStatus} />
                </td>
                <td className="px-4 py-4">{product.stockCount ?? "-"}</td>
                <td className="px-4 py-4">{formatDateTime(product.updatedAt)}</td>
                <td className="px-4 py-4">
                  <div className="max-w-[220px] whitespace-pre-wrap text-slate-600">
                    {product.note || "-"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      編集
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      disabled={isDeletingId === product.id}
                      className="rounded-lg border border-rose-200 px-3 py-2 font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDeletingId === product.id ? "削除中..." : "削除"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                  商品がまだ登録されていません。
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
