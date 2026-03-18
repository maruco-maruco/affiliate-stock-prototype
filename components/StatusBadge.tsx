import { STOCK_STATUS_LABELS } from "@/lib/constants";
import { StockStatus } from "@/types/product";

const STATUS_STYLES: Record<StockStatus, string> = {
  in_stock: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  low_stock: "bg-amber-50 text-amber-700 ring-amber-200",
  out_of_stock: "bg-rose-50 text-rose-700 ring-rose-200",
};

type StatusBadgeProps = {
  status: StockStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {STOCK_STATUS_LABELS[status]}
    </span>
  );
}
