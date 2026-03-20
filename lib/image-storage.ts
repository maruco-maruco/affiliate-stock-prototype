import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

import { MAX_PRODUCT_IMAGES, MAX_PRODUCT_IMAGE_SIZE_BYTES } from "@/lib/constants";

export const PRODUCT_IMAGE_PUBLIC_PATH = "/uploads/products";

const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function getProductImagesDirectory(): string {
  return process.env.PRODUCT_IMAGES_DIR || path.join(process.cwd(), "public", "uploads", "products");
}

async function ensureProductImagesDirectory(): Promise<void> {
  await fs.mkdir(getProductImagesDirectory(), { recursive: true });
}

function getFileExtension(file: File): string {
  const fileExtension = path.extname(file.name).toLowerCase();

  if (fileExtension) {
    return fileExtension;
  }

  return MIME_EXTENSION_MAP[file.type] || ".jpg";
}

export function isStoredProductImageUrl(value: string): boolean {
  return value.startsWith(`${PRODUCT_IMAGE_PUBLIC_PATH}/`);
}

function resolveStoredProductImagePath(imageUrl: string): string | null {
  if (!isStoredProductImageUrl(imageUrl)) {
    return null;
  }

  const fileName = path.basename(imageUrl);

  if (!fileName || fileName === "." || fileName === "..") {
    return null;
  }

  return path.join(getProductImagesDirectory(), fileName);
}

export async function saveProductImages(files: File[]): Promise<string[]> {
  if (files.length === 0) {
    return [];
  }

  if (files.length > MAX_PRODUCT_IMAGES) {
    throw new Error(`商品画像は最大${MAX_PRODUCT_IMAGES}枚までアップロードできます。`);
  }

  await ensureProductImagesDirectory();

  const imageUrls: string[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      throw new Error("画像ファイルのみアップロードできます。");
    }

    if (file.size > MAX_PRODUCT_IMAGE_SIZE_BYTES) {
      throw new Error("画像サイズは1枚あたり5MB以下にしてください。");
    }

    const fileName = `${Date.now()}-${randomUUID()}${getFileExtension(file)}`;
    const filePath = path.join(getProductImagesDirectory(), fileName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(filePath, buffer);
    imageUrls.push(`${PRODUCT_IMAGE_PUBLIC_PATH}/${fileName}`);
  }

  return imageUrls;
}

export async function deleteStoredProductImages(imageUrls: string[]): Promise<void> {
  await Promise.all(
    imageUrls.map(async (imageUrl) => {
      const filePath = resolveStoredProductImagePath(imageUrl);

      if (!filePath) {
        return;
      }

      try {
        await fs.unlink(filePath);
      } catch (error) {
        const code = error instanceof Error && "code" in error ? String(error.code) : "";

        if (code !== "ENOENT") {
          throw error;
        }
      }
    }),
  );
}
