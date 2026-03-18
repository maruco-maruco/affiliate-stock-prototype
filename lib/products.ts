import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

import { PLATFORM_OPTIONS, STOCK_STATUS_OPTIONS } from "@/lib/constants";
import { Product, ProductInput, PlatformType, StockStatus } from "@/types/product";

function getDataFilePath(): string {
  return process.env.PRODUCTS_DATA_FILE || path.join(process.cwd(), "data", "products.json");
}

interface ValidationResult {
  success: boolean;
  data?: ProductInput;
  errors: string[];
}

type SuccessfulBulkValidation = {
  index: number;
  success: true;
  data: ProductInput;
};

type FailedBulkValidation = {
  index: number;
  success: false;
  errors: string[];
};

function isPlatformType(value: unknown): value is PlatformType {
  return PLATFORM_OPTIONS.some((option) => option.value === value);
}

function isStockStatus(value: unknown): value is StockStatus {
  return STOCK_STATUS_OPTIONS.some((option) => option.value === value);
}

function sanitizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStockCount(value: unknown): { value: number | null; error?: string } {
  if (value === "" || value === null || value === undefined) {
    return { value: null };
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0 || !Number.isInteger(parsed)) {
    return { value: null, error: "在庫数は0以上の整数で入力してください。" };
  }

  return { value: parsed };
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateProductInput(payload: unknown): ValidationResult {
  const errors: string[] = [];

  if (!payload || typeof payload !== "object") {
    return { success: false, errors: ["不正なリクエストです。"] };
  }

  const raw = payload as Record<string, unknown>;
  const productName = sanitizeText(raw.productName);
  const brandName = sanitizeText(raw.brandName);
  const productUrl = sanitizeText(raw.productUrl);
  const note = sanitizeText(raw.note);

  if (!productName) {
    errors.push("商品名は必須です。");
  }

  if (!brandName) {
    errors.push("ブランド名は必須です。");
  }

  if (!isPlatformType(raw.platformType)) {
    errors.push("プラットフォーム種別が不正です。");
  }

  if (!productUrl) {
    errors.push("商品URLは必須です。");
  } else if (!isValidHttpUrl(productUrl)) {
    errors.push("商品URLは http または https で始まるURLを入力してください。");
  }

  if (!isStockStatus(raw.stockStatus)) {
    errors.push("在庫ステータスが不正です。");
  }

  const stockCountResult = normalizeStockCount(raw.stockCount);
  if (stockCountResult.error) {
    errors.push(stockCountResult.error);
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    errors: [],
    data: {
      productName,
      brandName,
      platformType: raw.platformType as PlatformType,
      productUrl,
      stockStatus: raw.stockStatus as StockStatus,
      stockCount: stockCountResult.value,
      note,
    },
  };
}

async function ensureDataFile(): Promise<void> {
  const filePath = getDataFilePath();
  const dirPath = path.dirname(filePath);

  await fs.mkdir(dirPath, { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]\n", "utf-8");
  }
}

async function readProductsFile(): Promise<Product[]> {
  await ensureDataFile();
  const filePath = getDataFilePath();

  const fileContent = await fs.readFile(filePath, "utf-8");

  if (!fileContent.trim()) {
    return [];
  }

  const parsed = JSON.parse(fileContent) as Product[];
  return parsed;
}

async function writeProductsFile(products: Product[]): Promise<void> {
  await ensureDataFile();
  const filePath = getDataFilePath();
  await fs.writeFile(filePath, `${JSON.stringify(products, null, 2)}\n`, "utf-8");
}

function sortByUpdatedAt(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export async function listProducts(): Promise<Product[]> {
  const products = await readProductsFile();
  return sortByUpdatedAt(products);
}

export async function createProduct(payload: unknown): Promise<Product> {
  const validation = validateProductInput(payload);

  if (!validation.success || !validation.data) {
    throw new Error(validation.errors.join("\n"));
  }

  const products = await readProductsFile();
  const now = new Date().toISOString();

  const newProduct: Product = {
    id: randomUUID(),
    ...validation.data,
    note: validation.data.note ?? "",
    updatedAt: now,
  };

  const nextProducts = sortByUpdatedAt([newProduct, ...products]);
  await writeProductsFile(nextProducts);

  return newProduct;
}

export async function createProducts(payloads: unknown[]): Promise<Product[]> {
  if (!Array.isArray(payloads) || payloads.length === 0) {
    throw new Error("一括登録する商品データがありません。");
  }

  const validationResults: Array<SuccessfulBulkValidation | FailedBulkValidation> = payloads.map(
    (payload, index) => {
    const validation = validateProductInput(payload);

    if (!validation.success || !validation.data) {
      return {
        index,
        success: false as const,
        errors: validation.errors,
      };
    }

    return {
      index,
        success: true as const,
        data: validation.data,
      };
    },
  );

  const failedResults = validationResults.filter((result) => !result.success);

  if (failedResults.length > 0) {
    const messages = failedResults.flatMap((result) =>
      result.errors.map((error) => `${result.index + 1}行目: ${error}`),
    );
    throw new Error(messages.join("\n"));
  }

  const successfulResults = validationResults.filter(
    (result): result is SuccessfulBulkValidation => result.success,
  );

  const products = await readProductsFile();
  const now = new Date().toISOString();

  const newProducts: Product[] = successfulResults.map((result) => ({
    id: randomUUID(),
    ...result.data,
    note: result.data.note ?? "",
    updatedAt: now,
  }));

  await writeProductsFile(sortByUpdatedAt([...newProducts, ...products]));

  return sortByUpdatedAt(newProducts);
}

export async function updateProduct(id: string, payload: unknown): Promise<Product | null> {
  const validation = validateProductInput(payload);

  if (!validation.success || !validation.data) {
    throw new Error(validation.errors.join("\n"));
  }

  const products = await readProductsFile();
  const targetIndex = products.findIndex((product) => product.id === id);

  if (targetIndex === -1) {
    return null;
  }

  const updatedProduct: Product = {
    id,
    ...validation.data,
    note: validation.data.note ?? "",
    updatedAt: new Date().toISOString(),
  };

  products[targetIndex] = updatedProduct;
  await writeProductsFile(sortByUpdatedAt(products));

  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<Product | null> {
  const products = await readProductsFile();
  const target = products.find((product) => product.id === id);

  if (!target) {
    return null;
  }

  const nextProducts = products.filter((product) => product.id !== id);
  await writeProductsFile(sortByUpdatedAt(nextProducts));

  return target;
}
