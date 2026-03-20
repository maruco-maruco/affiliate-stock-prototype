import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { MAX_PRODUCT_IMAGES } from "@/lib/constants";
import { saveProductImages } from "@/lib/image-storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
    }

    if (session.role !== "company") {
      return NextResponse.json({ error: "この操作を行う権限がありません。" }, { status: 403 });
    }

    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((value): value is File => value instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "アップロードする画像を選択してください。" }, { status: 400 });
    }

    if (files.length > MAX_PRODUCT_IMAGES) {
      return NextResponse.json(
        { error: `商品画像は最大${MAX_PRODUCT_IMAGES}枚までアップロードできます。` },
        { status: 400 },
      );
    }

    const imageUrls = await saveProductImages(files);
    return NextResponse.json({ imageUrls }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "画像アップロードに失敗しました。";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
