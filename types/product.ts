export type PlatformType = "rakuten" | "amazon";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Product {
  id: string;
  productName: string;
  brandName: string;
  platformType: PlatformType;
  productUrl: string;
  stockStatus: StockStatus;
  stockCount?: number | null;
  note: string;
  updatedAt: string;
}

export interface ProductInput {
  productName: string;
  brandName: string;
  platformType: PlatformType;
  productUrl: string;
  stockStatus: StockStatus;
  stockCount?: number | null;
  note?: string;
}
