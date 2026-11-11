import type { Page, Store } from "../types";
import { regions, violations } from "../lists/data";
import { Badge, Icon } from "../components/UI";
export function Stats({ data }: { data: Store }) {
  const stats = [
    { title: "الشركات والأنشطة", value: data.companies.length, icon: "companies", note: "أنشطة مسجلة في المنظومة", color: "teal" },
    {
      title: "المهام الميدانية",
      value: data.tasks.length,
      icon: "tasks",
      note: `${data.tasks.filter((t) => t.status === "قيد التنفيذ").length} مهام قيد التنفيذ`,
      color: "blue",
    },
    {
      title: "بانتظار المراجعة",
      value: data.reports.filter((r) => r.status === "بانتظار المراجعة").length,
      icon: "reports",
      note: "محاضر تحتاج إلى قرارك",
      color: "orange",
    },
    {
      title: "المفتشون النشطون",
      value: data.inspectors.filter((i) => i.active).length,
      icon: "inspectors",
      note: `من أصل ${data.inspectors.length} مفتشين`,
      color: "purple",
    },
  ];
  return (
    <div className="stats">
      {stats.map((s) => (
        <div className="stat" key={s.title}>
          <span className={`stat-icon ${s.color}`}>
            <Icon name={s.icon} size={23} />
          </span>
          <p>{s.title}</p>
          <strong>{s.value.toLocaleString("ar-LY")}</strong>
          <small>{s.note}</small>
        </div>
      ))}
    </div>
  );
}
export function Analytics({ data }: { data: Store }) {
  const total = data.tasks.length;
  const done = data.tasks.filter((t) => t.status === "مكتملة").length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="analytics-grid">
      <section className="panel chart-panel">
        <div className="toolbar">
          <h3>توزيع المخالفات حسب المنطقة</h3>
          <span className="muted">حسب موقع النشاط</span>
        </div>
        <div className="bars">
          {regions.map((r) => {
            const count = data.reports.filter(
              (x) =>
                x.violation !== "لا توجد مخالفة" &&
                data.companies.find((c) => c.id === data.tasks.find((t) => t.id === x.taskId)?.companyId)?.region === r,
            ).length;
            return (
              <div className="bar-item" key={r}>
                <strong>{count}</strong>
                <div className="bar-track">
                  <div style={{ height: `${Math.max(3, (count / Math.max(1, data.reports.length)) * 100)}%` }} />
                </div>
                <span>{r}</span>
              </div>
            );
          })}
        </div>
        <p className="chart-note">تشمل المحاضر الواردة بجميع حالات مراجعتها.</p>
      </section>
      <section className="panel completion">
        <h3>إنجاز الجولات</h3>
        <p className="muted">متابعة تقدم الفريق الميداني</p>
        <div className="donut" style={{ background: `conic-gradient(#137c66 ${percent}%, #edf3f1 0)` }}>
          <div>
            <strong>{percent}٪</strong>
            <small>نسبة الإنجاز</small>
          </div>
        </div>
        <div className="legend">
          <span>
            <i />
            مكتملة <b>{done}</b>
          </span>
          <span>
            <i className="pale" />
            متبقية <b>{total - done}</b>
          </span>
        </div>
      </section>
    </div>
  );
}
export function ViolationStats({ data }: { data: Store }) {
  return (
    <section className="panel">
      <div className="toolbar">
        <h3>الإحصاءات حسب نوع المخالفة</h3>
      </div>
      <div className="violation-list">
        {violations.map((v) => {
          const count = data.reports.filter((r) => r.violation === v).length;
          return (
            <div key={v}>
              <span>{v}</span>
              <progress value={count} max={Math.max(1, data.reports.length)} />
              <strong>{count}</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default function Overview({ data, navigate }: { data: Store; navigate: (p: Page) => void }) {
  return (
    <>
      <div className="welcome">
        <div>
          <span className="eyebrow">مساحة عمل الإدارة</span>
          <h2>صورة أوضح، وقرارات أدق.</h2>
          <p>تابع فريقك الميداني، ونظّم الجولات، وراجع المحاضر من مكان واحد.</p>
          <button onClick={() => navigate("reports")}>
            مراجعة المحاضر الواردة <Icon name="arrow" size={17} />
          </button>
        </div>
        <div className="welcome-art">
          <Icon name="shield" size={85} />
          <span className="orbit one" />
          <span className="orbit two" />
          <span className="art-tag">
            <Icon name="check" size={16} /> رقابة أكثر كفاءة
          </span>
        </div>
      </div>
      <Stats data={data} />
      <Analytics data={data} />
      <section className="panel">
        <div className="toolbar">
          <div>
            <h3>آخر المحاضر الواردة</h3>
            <p>آخر المستجدات من الميدان</p>
          </div>
          <button className="text-button" onClick={() => navigate("reports")}>
            عرض كل المحاضر ←
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>المنشأة</th>
                <th>المفتش</th>
                <th>نوع المخالفة</th>
                <th>الحالة</th>
                <th>المراجعة</th>
              </tr>
            </thead>
            <tbody>
              {data.reports.slice(0, 4).map((r) => {
                const t = data.tasks.find((t) => t.id === r.taskId);
                return (
                  <tr key={r.id}>
                    <td>
                      <strong>{data.companies.find((c) => c.id === t?.companyId)?.name}</strong>
                      <small>{r.id}</small>
                    </td>
                    <td>{data.inspectors.find((i) => i.id === t?.inspectorId)?.name}</td>
                    <td>{r.violation}</td>
                    <td>
                      <Badge>{r.status}</Badge>
                    </td>
                    <td>
                      <button className="text-button" onClick={() => navigate("reports")}>
                        عرض ←
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
