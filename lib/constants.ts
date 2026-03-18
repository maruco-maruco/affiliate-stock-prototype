import { PlatformType, StockStatus } from "@/types/product";

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  in_stock: "在庫あり",
  low_stock: "残りわずか",
  out_of_stock: "売り切れ",
};

export const PLATFORM_LABELS: Record<PlatformType, string> = {
  rakuten: "楽天",
  amazon: "Amazon",
};

export const STOCK_STATUS_OPTIONS: Array<{
  value: StockStatus;
  label: string;
}> = [
  { value: "in_stock", label: STOCK_STATUS_LABELS.in_stock },
  { value: "low_stock", label: STOCK_STATUS_LABELS.low_stock },
  { value: "out_of_stock", label: STOCK_STATUS_LABELS.out_of_stock },
];

export const PLATFORM_OPTIONS: Array<{
  value: PlatformType;
  label: string;
}> = [
  { value: "rakuten", label: PLATFORM_LABELS.rakuten },
  { value: "amazon", label: PLATFORM_LABELS.amazon },
];
