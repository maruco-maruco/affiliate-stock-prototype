"use client";

import { FormEvent, useState } from "react";

import { CsvImportPanel } from "@/components/CsvImportPanel";
import { ProductForm, ProductFormValues } from "@/components/ProductForm";
import { ProductTable } from "@/components/ProductTable";
import { Product } from "@/types/product";

type AdminDashboardProps = {
  initialProducts: Product[];
  userLabel: string;
};

function sortProductsByUpdatedAt(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

function createEmptyFormValues(): ProductFormValues {
  return {
    productName: "",
    brandName: "",
    platformType: "rakuten",
    productUrl: "",
    stockStatus: "in_stock",
    stockCount: "",
    note: "",
  };
}

function mapProductToFormValues(product: Product): ProductFormValues {
  return {
    productName: product.productName,
    brandName: product.brandName,
    platformType: product.platformType,
    productUrl: product.productUrl,
    stockStatus: product.stockStatus,
    stockCount: product.stockCount === null || product.stockCount === undefined ? "" : String(product.stockCount),
    note: product.note,
  };
}

function normalizeErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "保存に失敗しました。入力内容を確認してください。";
}

export function AdminDashboard({ initialProducts, userLabel }: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [formValues, setFormValues] = useState<ProductFormValues>(createEmptyFormValues());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setFormValues(createEmptyFormValues());
    setEditingId(null);
    setErrorMessage(null);
  };

  const handleChange = (field: keyof ProductFormValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormValues(mapProductToFormValues(product));
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        ...formValues,
        stockCount: formValues.stockCount === "" ? null : Number(formValues.stockCount),
      };

      const response = await fetch(editingId ? `/api/products/${editingId}` : "/api/products", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "保存に失敗しました。");
      }

      const savedProduct = result.product as Product;

      setProducts((current) => {
        if (editingId) {
          return sortProductsByUpdatedAt(
            current.map((product) => (product.id === savedProduct.id ? savedProduct : product)),
          );
        }

        return sortProductsByUpdatedAt([savedProduct, ...current]);
      });

      resetForm();
    } catch (error) {
      setErrorMessage(normalizeErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product: Product) => {
    const shouldDelete = window.confirm(`「${product.productName}」を削除しますか？`);

    if (!shouldDelete) {
      return;
    }

    setIsDeletingId(product.id);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "削除に失敗しました。");
      }

      setProducts((current) => current.filter((item) => item.id !== product.id));

      if (editingId === product.id) {
        resetForm();
      }
    } catch (error) {
      setErrorMessage(normalizeErrorMessage(error));
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleImported = (importedProducts: Product[]) => {
    setProducts((current) => sortProductsByUpdatedAt([...importedProducts, ...current]));
    setErrorMessage(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-3 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">在庫管理ダッシュボード</h1>
          <p className="mt-2 text-sm text-slate-500">
            企業担当者向けの簡易管理画面です。商品登録、在庫更新、削除ができます。
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-soft">
            保存先: <span className="font-semibold text-slate-900">data/products.json</span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-soft">
            ログイン中: <span className="font-semibold text-slate-900">{userLabel}</span>
          </div>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              ログアウト
            </button>
          </form>
        </div>
      </header>

      <div className="mb-6">
        <CsvImportPanel onImported={handleImported} onError={setErrorMessage} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-6 xl:self-start">
          <ProductForm
            values={formValues}
            isEditing={Boolean(editingId)}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        </div>

        <ProductTable
          products={products}
          editingId={editingId}
          isDeletingId={isDeletingId}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
