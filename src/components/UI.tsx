import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, string> = {
    dashboard: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
    inspectors:
      "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M20 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
    companies: "M4 21V3h12v18 M16 9h4v12 M8 7h4 M8 11h4 M8 15h4 M2 21h20",
    tasks: "M9 5H5v16h14V5h-4 M9 3h6v4H9z M8 12l2 2 5-5 M8 18h7",
    reports: "M14 2H4v20h16V8z M14 2v6h6 M8 12h8 M8 16h6",
    map: "M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3z M9 3v15 M15 6v15",
    statistics: "M4 20h17 M7 16v-5 M12 16V4 M17 16V8",
    search: "M21 21l-5-5 M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16",
    bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4",
    plus: "M12 5v14 M5 12h14",
    check: "M5 12l4 4L19 6",
    arrow: "M19 12H5 M11 6l-6 6 6 6",
    shield: "M12 2l9 4v6c0 5-9 10-9 10S3 17 3 12V6z M8 12l3 3 5-6",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.reports} />
    </svg>
  );
}
export function Badge({ children }: { children: ReactNode }) {
  const value = String(children);
  const tone = ["معتمد", "مكتملة", "مسجل", "نشط", "منخفض"].includes(value)
    ? "green"
    : ["مرتفع", "عالية", "غير مسجل", "معاد للتعديل"].includes(value)
      ? "red"
      : ["بانتظار المراجعة", "قيد التنفيذ", "متوسط"].includes(value)
        ? "amber"
        : "gray";
  return (
    <span className={`badge ${tone}`}>
      <i />
      {children}
    </span>
  );
}
export function Modal({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button className="icon-button" onClick={close} aria-label="إغلاق">
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Empty() {
  return (
    <div className="empty">
      <Icon name="search" size={32} />
      <h3>لا توجد نتائج</h3>
      <p>جرّب تغيير كلمات البحث أو خيارات التصفية.</p>
    </div>
  );
}
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
