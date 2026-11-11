import { useState } from "react";
import { initialData } from "./lists/data";
import type { Store } from "./types";
const key = "tax-admin-demo-v1";
export function useStore() {
  const [data, setData] = useState<Store>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialData;
    } catch {
      return initialData;
    }
  });
  const [storageError, setStorageError] = useState("");
  function update(next: Store) {
    setData(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setStorageError("");
    } catch {
      setStorageError("تعذر الحفظ في المتصفح. التعديلات الحالية مؤقتة؛ قد تكون مساحة التخزين ممتلئة.");
    }
  }
  return { data, update, storageError };
}
export const uid = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
export const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Tripoli" });
