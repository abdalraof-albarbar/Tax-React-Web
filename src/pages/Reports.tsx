import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { Report, Store } from "../types";
import { Badge, Empty, Field, Modal } from "../components/UI";
export default function Reports({ data, update, query }: { data: Store; update: (data: Store) => void; query: string }) {
  const [selected, setSelected] = useState<string | null>(() => new URLSearchParams(location.search).get("report"));
  const [filter, setFilter] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [qr, setQr] = useState("");
  const report = data.reports.find((r) => r.id === selected);
  const task = data.tasks.find((t) => t.id === report?.taskId);
  const company = data.companies.find((c) => c.id === task?.companyId);
  const inspector = data.inspectors.find((i) => i.id === task?.inspectorId);
  useEffect(() => {
    let active = true;
    if (selected)
      QRCode.toDataURL(`${location.origin}${location.pathname}?report=${encodeURIComponent(selected)}`, { width: 160, margin: 1 })
        .then((url) => {
          if (active) setQr(url);
        })
        .catch(() => {
          if (active) setError("تعذر إنشاء رمز QR");
        });
    return () => {
      active = false;
    };
  }, [selected]);
  function decide(status: string) {
    if (!report) return;
    if (status === "معاد للتعديل" && !feedback.trim()) {
      setError("أدخل سبب الإعادة للمفتش.");
      return;
    }
    const next: Report = {
      ...report,
      status,
      feedback: feedback.trim(),
      history: [
        ...report.history,
        `${status} — ${new Date().toLocaleString("ar-LY", { timeZone: "Africa/Tripoli" })}${feedback.trim() ? ` — ${feedback.trim()}` : ""}`,
      ],
    };
    update({ ...data, reports: data.reports.map((r) => (r.id === report.id ? next : r)) });
    setError("");
    setFeedback("");
  }
  const rows = data.reports.filter((r) => {
    const t = data.tasks.find((t) => t.id === r.taskId);
    return (
      (!filter || r.status === filter) &&
      `${r.id} ${r.violation} ${data.companies.find((c) => c.id === t?.companyId)?.name}`.includes(query)
    );
  });
  return (
    <>
      <div className="section-heading">
        <div>
          <h2>مراجعة المحاضر</h2>
          <p>راجع الوقائع والمرفقات قبل اتخاذ قرارك.</p>
        </div>
        <span className="demo-label">محاضر واردة تجريبية</span>
      </div>
      <div className="panel">
        <div className="toolbar">
          <h3>
            سجل المحاضر <span className="count">{rows.length}</span>
          </h3>
          <select aria-label="حالة المحضر" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">كل الحالات</option>
            {["بانتظار المراجعة", "معتمد", "معاد للتعديل"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>المحضر / الشركة</th>
                <th>نوع المخالفة</th>
                <th>وقت المعاينة</th>
                <th>الحالة</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const t = data.tasks.find((t) => t.id === r.taskId);
                return (
                  <tr key={r.id}>
                    <td>
                      <strong>{data.companies.find((c) => c.id === t?.companyId)?.name}</strong>
                      <small>{r.id}</small>
                    </td>
                    <td>{r.violation}</td>
                    <td>{r.date.replace("T", " · ")}</td>
                    <td>
                      <Badge>{r.status}</Badge>
                    </td>
                    <td>
                      <button
                        className="text-button"
                        onClick={() => {
                          setSelected(r.id);
                          setFeedback("");
                          setError("");
                          setQr("");
                        }}
                      >
                        مراجعة المحضر ←
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!rows.length && <Empty />}
        </div>
      </div>
      {selected && !report && (
        <div className="notice">لم يُعثر على المحضر في بيانات هذا المتصفح. رمز QR يفتح مرجعًا محليًا ولا يمثل خدمة تحقق رسمية.</div>
      )}
      {report && (
        <Modal
          title={`المحضر ${report.id}`}
          close={() => {
            setSelected(null);
            history.replaceState({}, "", location.pathname);
          }}
        >
          <article className="print-report">
            <div className="report-brand">
              <div>
                <strong>إدارة مكافحة التهرب الضريبي</strong>
                <p>محضر معاينة ميدانية · نسخة تجريبية</p>
              </div>
              {qr && <img className="qr" src={qr} alt={`رمز مرجع ${report.id}`} />}
            </div>
            <div className="report-summary">
              <h2>{company?.name}</h2>
              <Badge>{report.status}</Badge>
            </div>
            <dl className="details">
              <div>
                <dt>الرقم التسلسلي</dt>
                <dd>{report.id}</dd>
              </div>
              <div>
                <dt>الرقم الضريبي</dt>
                <dd>{company?.tax}</dd>
              </div>
              <div>
                <dt>المفتش</dt>
                <dd>{inspector?.name}</dd>
              </div>
              <div>
                <dt>وقت المعاينة</dt>
                <dd>{report.date.replace("T", " ")}</dd>
              </div>
              <div>
                <dt>العنوان</dt>
                <dd>
                  {company?.region} — {company?.address}
                </dd>
              </div>
              <div>
                <dt>موقع النشاط المسجل</dt>
                <dd>
                  {company?.lat}, {company?.lng}
                </dd>
              </div>
            </dl>
            <h3>نوع المخالفة</h3>
            <p>{report.violation}</p>
            <h3>وقائع المعاينة</h3>
            <p className="report-notes">{report.notes}</p>
            <h3>الصور والمرفقات</h3>
            {report.evidence.length ? (
              <div className="evidence">
                {report.evidence.map((src, i) => (
                  <a href={src} key={src} target="_blank" rel="noreferrer">
                    <img src={src} alt={`مرفق المعاينة ${i + 1}`} />
                  </a>
                ))}
              </div>
            ) : (
              <p className="muted">
                لا توجد صور مرفقة في هذا المحضر التجريبي. إحداثيات الزيارة الموثقة غير متاحة؛ المعروض هو موقع الشركة المسجل.
              </p>
            )}
            {report.feedback && <div className="notice">ملاحظات الإدارة: {report.feedback}</div>}
            <h3>سجل المراجعة</h3>
            <ul className="history">
              {report.history.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
            <p className="print-note">
              الرمز مرجع للمحضر في نفس نسخة المتصفح؛ التحقق المركزي يتطلب ربطًا بخادم. لا يترتب على النسخة التجريبية إجراء قانوني.
            </p>
          </article>
          <div className="no-print">
            {report.status === "بانتظار المراجعة" && (
              <Field label="ملاحظات الإدارة (مطلوبة عند الإعادة)">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  placeholder="وضّح للمفتش ما يحتاج إلى تعديل…"
                />
              </Field>
            )}
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <div className="modal-actions">
              {report.status === "بانتظار المراجعة" && (
                <>
                  <button className="primary" onClick={() => decide("معتمد")}>
                    اعتماد المحضر
                  </button>
                  <button className="danger" onClick={() => decide("معاد للتعديل")}>
                    إعادة للتعديل
                  </button>
                </>
              )}
              <button onClick={() => window.print()} disabled={!qr}>
                طباعة / حفظ PDF
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
