import { useState } from "react";
import type { Store } from "../types";
import { regions } from "../lists/data";
import { Badge, Empty, Icon } from "../components/UI";
export default function ActivityMap({ data, query }: { data: Store; query: string }) {
  const [region, setRegion] = useState("");
  const [violationOnly, setViolationOnly] = useState(false);
  const [selected, setSelected] = useState(data.companies[0]?.id);
  const list = data.companies.filter(
    (c) =>
      (!region || c.region === region) &&
      `${c.name} ${c.tax}`.includes(query) &&
      (!violationOnly ||
        data.reports.some((r) => r.violation !== "لا توجد مخالفة" && data.tasks.find((t) => t.id === r.taskId)?.companyId === c.id)),
  );
  const company = list.find((c) => c.id === selected) || list[0];
  return (
    <>
      <div className="section-heading">
        <div>
          <h2>خريطة الأنشطة والمخالفات</h2>
          <p>اختر نشاطًا لعرض موقعه المسجل وتاريخ محاضره.</p>
        </div>
        <span className="demo-label">OpenStreetMap</span>
      </div>
      <div className="panel">
        <div className="toolbar">
          <select aria-label="المنطقة" value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">كل المناطق</option>
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <label className="checkbox">
            <input type="checkbox" checked={violationOnly} onChange={(e) => setViolationOnly(e.target.checked)} />
            أنشطة لديها مخالفات فقط
          </label>
        </div>
        <div className="map-layout">
          <div className="map-list">
            {list.map((c) => (
              <button className={`map-company ${company?.id === c.id ? "selected" : ""}`} key={c.id} onClick={() => setSelected(c.id)}>
                <Icon name="companies" />
                <div>
                  <strong>{c.name}</strong>
                  <small>
                    {c.region} · {c.address}
                  </small>
                  <Badge>{c.status}</Badge>
                </div>
              </button>
            ))}
            {!list.length && <Empty />}
          </div>
          <div className="map-frame">
            {company ? (
              <>
                <iframe
                  title={`موقع ${company.name}`}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${company.lng - 0.025}%2C${company.lat - 0.018}%2C${company.lng + 0.025}%2C${company.lat + 0.018}&layer=mapnik&marker=${company.lat}%2C${company.lng}`}
                />
                <div className="map-caption">
                  <strong>{company.name}</strong>
                  <span>
                    {company.lat}, {company.lng}
                  </span>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${company.lat}&mlon=${company.lng}#map=15/${company.lat}/${company.lng}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    فتح الخريطة ↗
                  </a>
                </div>
              </>
            ) : (
              <Empty />
            )}
          </div>
        </div>
      </div>
      {company && (
        <section className="panel map-history">
          <h3>المحاضر المرتبطة بـ {company.name}</h3>
          {data.reports
            .filter((r) => data.tasks.find((t) => t.id === r.taskId)?.companyId === company.id)
            .map((r) => (
              <p key={r.id}>
                {r.id} · {r.violation} <Badge>{r.status}</Badge>
              </p>
            ))}
          {!data.reports.some((r) => data.tasks.find((t) => t.id === r.taskId)?.companyId === company.id) && (
            <p className="muted">لا توجد محاضر لهذا النشاط.</p>
          )}
        </section>
      )}
      <p className="muted">تحتاج الخريطة إلى الإنترنت. الإحداثيات والأنشطة المعروضة تجريبية.</p>
    </>
  );
}
