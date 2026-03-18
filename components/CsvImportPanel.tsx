"use client";

import { ChangeEvent, useState } from "react";

import { Product } from "@/types/product";

const CSV_HEADERS = [
  "productName",
  "brandName",
  "platformType",
  "productUrl",
  "stockStatus",
  "stockCount",
  "note",
];

type CsvImportPanelProps = {
  onImported: (products: Product[]) => void;
  onError: (message: string | null) => void;
};

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseCsvText(text: string): Record<string, string>[] {
  const normalizedText = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").trim();

  if (!normalizedText) {
    throw new Error("CSVファイルが空です。");
  }

  const lines = normalizedText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("ヘッダー行とデータ行を含むCSVファイルを用意してください。");
  }

  const headers = parseCsvLine(lines[0]);
  const missingHeaders = CSV_HEADERS.filter((header) => !headers.includes(header));

  if (missingHeaders.length > 0) {
    throw new Error(`CSVヘッダーが不足しています: ${missingHeaders.join(", ")}`);
  }

  return lines.slice(1).map((line) => {
    const columns = parseCsvLine(line);

    return headers.reduce<Record<string, string>>((record, header, index) => {
      record[header] = columns[index] ?? "";
      return record;
    }, {});
  });
}

export function CsvImportPanel({ onImported, onError }: CsvImportPanelProps) {
  const [fileName, setFileName] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFileName(file.name);
    setIsImporting(true);
    onError(null);

    try {
      const text = await file.text();
      const rows = parseCsvText(text);
      const payload = rows.map((row) => ({
        productName: row.productName,
        brandName: row.brandName,
        platformType: row.platformType,
        productUrl: row.productUrl,
        stockStatus: row.stockStatus,
        stockCount: row.stockCount === "" ? null : Number(row.stockCount),
        note: row.note ?? "",
      }));

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: payload }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "CSVの取り込みに失敗しました。");
      }

      onImported(result.products as Product[]);
      event.target.value = "";
      setFileName("");
    } catch (error) {
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError("CSVの取り込みに失敗しました。");
      }
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">CSV一括登録</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Excelやスプレッドシートで作成したCSVから、商品をまとめて追加できます。
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
          {isImporting ? "取り込み中..." : "CSVを選択"}
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
            disabled={isImporting}
          />
        </label>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <div className="font-semibold text-slate-900">CSVヘッダー</div>
        <div className="mt-2 break-all font-mono text-xs leading-6 text-slate-500">
          {CSV_HEADERS.join(",")}
        </div>
        <div className="mt-2 text-xs leading-6 text-slate-500">
          `platformType` は `rakuten` / `amazon`、`stockStatus` は `in_stock` /
          `low_stock` / `out_of_stock` を指定します。
        </div>
        {fileName ? (
          <div className="mt-2 text-xs font-medium text-slate-700">
            選択中のファイル: {fileName}
          </div>
        ) : null}
        <a
          href="/products-import-template.csv"
          download
          className="mt-3 inline-flex text-xs font-semibold text-brand-700 hover:underline"
        >
          テンプレートCSVをダウンロード
        </a>
      </div>
    </div>
  );
}
