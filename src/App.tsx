import { useState } from "react";
import type { Page } from "./types";
import { useStore } from "./store";
import { Icon } from "./components/UI";
import Overview, { Analytics, Stats, ViolationStats } from "./pages/Overview";
import Registry from "./pages/Registry";
import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";
import ActivityMap from "./pages/Map";
import "./App.css";
const navigation: { id: Page; label: string }[] = [
  { id: "dashboard", label: "نظرة عامة" },
  { id: "inspectors", label: "إدارة المفتشين" },
  { id: "companies", label: "الشركات والأنشطة" },
  { id: "tasks", label: "المهام والجولات" },
  { id: "reports", label: "المحاضر والمراجعة" },
  { id: "map", label: "الخريطة الميدانية" },
  { id: "statistics", label: "الإحصاءات والتقارير" },
];
export default function App() {
  const { data, update, storageError } = useStore();
  const [page, setPage] = useState<Page>(new URLSearchParams(location.search).has("report") ? "reports" : "dashboard");
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState(false);
  const pending = data.reports.filter((r) => r.status === "بانتظار المراجعة").length;
  function navigate(next: Page) {
    setPage(next);
    setQuery("");
    setMenu(false);
  }
  return (
    <div className="app" dir="rtl">
      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("dashboard");
          }}
        >
          <span className="brand-icon">
            <Icon name="shield" size={29} />
          </span>
          <div>
            <strong>رَصْد</strong>
            <small>منظومة التفتيش الضريبي</small>
          </div>
        </a>
        <div className="workspace-label">
          لوحة الإدارة <span>ADMIN</span>
        </div>
        <nav aria-label="التنقل الرئيسي">
          {navigation.map((n) => (
            <button key={n.id} className={page === n.id ? "active" : ""} onClick={() => navigate(n.id)}>
              <Icon name={n.id} />
              <span>{n.label}</span>
              {n.id === "reports" && pending > 0 && <b>{pending}</b>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="secure">
            <Icon name="shield" />
            <div>
              <strong>بيئة تجريبية</strong>
              <small>البيانات محفوظة في هذا المتصفح</small>
            </div>
          </div>
          <div className="profile">
            <span className="avatar">م</span>
            <div>
              <strong>مسؤول الإدارة</strong>
              <small>إدارة مكافحة التهرب الضريبي</small>
            </div>
          </div>
        </div>
      </aside>
      {menu && <button className="menu-overlay" aria-label="إغلاق القائمة" onClick={() => setMenu(false)} />}
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button className="mobile-menu" onClick={() => setMenu(!menu)} aria-label="فتح القائمة">
              ☰
            </button>
            <span>الرئيسية</span>
            <span>/</span>
            <strong>{navigation.find((n) => n.id === page)?.label}</strong>
          </div>
          <div className="topbar-actions">
            <span className="live-dot" />
            نسخة تجريبية
            <button
              className="notification icon-button"
              title={`${pending} محاضر بانتظار المراجعة`}
              onClick={() => navigate("reports")}
              aria-label="عرض المحاضر المنتظرة"
            >
              <Icon name="bell" />
              {pending > 0 && <i />}
            </button>
            <span className="avatar mini">م</span>
          </div>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <div className="eyebrow">إدارة مكافحة التهرب الضريبي</div>
              <h1>{navigation.find((n) => n.id === page)?.label}</h1>
              <p>
                {new Date().toLocaleDateString("ar-LY", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "Africa/Tripoli",
                })}
              </p>
            </div>
            {page !== "dashboard" && page !== "statistics" ? (
              <label className="search">
                <Icon name="search" />
                <input aria-label="البحث" placeholder="ابحث بالاسم أو الرقم…" value={query} onChange={(e) => setQuery(e.target.value)} />
              </label>
            ) : (
              <button className="primary" onClick={() => navigate("tasks")}>
                <Icon name="plus" />
                إدارة الجولات
              </button>
            )}
          </div>
          {storageError && (
            <div className="notice" role="alert">
              {storageError}
            </div>
          )}
          {page === "dashboard" && <Overview data={data} navigate={navigate} />}
          {(page === "inspectors" || page === "companies") && <Registry key={page} kind={page} data={data} update={update} query={query} />}
          {page === "tasks" && <Tasks data={data} update={update} query={query} />}
          {page === "reports" && <Reports data={data} update={update} query={query} />}
          {page === "map" && <ActivityMap data={data} query={query} />}
          {page === "statistics" && (
            <>
              <Stats data={data} />
              <Analytics data={data} />
              <ViolationStats data={data} />
            </>
          )}
          <footer>
            <span>رَصْد · منظومة التفتيش الميداني</span>
            <span>المعاينة والتوثيق والمتابعة</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
