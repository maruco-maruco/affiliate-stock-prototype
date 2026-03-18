import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { deleteProduct, updateProduct } from "@/lib/products";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
    }

    if (session.role !== "company") {
      return NextResponse.json({ error: "この操作を行う権限がありません。" }, { status: 403 });
    }

    const { id } = await context.params;
    const payload = await request.json();
    const product = await updateProduct(id, payload);

    if (!product) {
      return NextResponse.json({ error: "商品が見つかりません。" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    const message = error instanceof Error ? error.message : "商品の更新に失敗しました。";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
    }

    if (session.role !== "company") {
      return NextResponse.json({ error: "この操作を行う権限がありません。" }, { status: 403 });
    }

    const { id } = await context.params;
    const product = await deleteProduct(id);

    if (!product) {
      return NextResponse.json({ error: "商品が見つかりません。" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    const message = error instanceof Error ? error.message : "商品の削除に失敗しました。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
