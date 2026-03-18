import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { createProduct, createProducts, listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
    }

    const products = await listProducts();
    return NextResponse.json({ products });
  } catch (error) {
    const message = error instanceof Error ? error.message : "商品一覧の取得に失敗しました。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
    }

    if (session.role !== "company") {
      return NextResponse.json({ error: "この操作を行う権限がありません。" }, { status: 403 });
    }

    const payload = await request.json();

    if (
      payload &&
      typeof payload === "object" &&
      "products" in payload &&
      Array.isArray((payload as { products?: unknown[] }).products)
    ) {
      const products = await createProducts((payload as { products: unknown[] }).products);
      return NextResponse.json({ products, importedCount: products.length }, { status: 201 });
    }

    const product = await createProduct(payload);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "商品の作成に失敗しました。";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
