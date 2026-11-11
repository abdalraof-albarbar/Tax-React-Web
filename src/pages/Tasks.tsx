import { useState } from "react";
import type { Store, Task } from "../types";
import { today, uid } from "../store";
import { Badge, Empty, Field, Icon, Modal } from "../components/UI";
export default function Tasks({ data, update, query }: { data: Store; update: (data: Store) => void; query: string }) {
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("");
  const list = data.tasks.filter(
    (t) =>
      (!filter || t.status === filter) &&
      `${t.id} ${data.companies.find((c) => c.id === t.companyId)?.name} ${data.inspectors.find((i) => i.id === t.inspectorId)?.name}`.includes(
        query,
      ),
  );
  function add(form: HTMLFormElement) {
    const v = Object.fromEntries(new FormData(form));
    const task = { ...v, id: uid("TSK"), status: "مجدولة" } as Task;
    update({ ...data, tasks: [task, ...data.tasks] });
    setAdding(false);
  }
  return (
    <>
      <div className="section-heading">
        <div>
          <h2>تنظيم الجولات الميدانية</h2>
          <p>إسناد واضح، ومتابعة لكل خطوة في الميدان.</p>
        </div>
        <button className="primary" onClick={() => setAdding(true)}>
          <Icon name="plus" />
          إسناد مهمة جديدة
        </button>
      </div>
      <div className="panel">
        <div className="toolbar">
          <h3>
            جميع المهام <span className="count">{list.length}</span>
          </h3>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="حالة المهمة">
            <option value="">كل الحالات</option>
            {["مجدولة", "قيد التنفيذ", "مكتملة"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>المهمة / الشركة</th>
                <th>المفتش المسؤول</th>
                <th>تاريخ الزيارة</th>
                <th>الأولوية</th>
                <th>الحالة</th>
                <th>متابعة الإنجاز</th>
              </tr>
            </thead>
            <tbody>
              {list.map((t) => (
                <tr key={t.id}>
                  <td>
                    <strong>{data.companies.find((c) => c.id === t.companyId)?.name}</strong>
                    <small>
                      {t.id} · {t.notes}
                    </small>
                  </td>
                  <td>{data.inspectors.find((i) => i.id === t.inspectorId)?.name}</td>
                  <td>{t.date}</td>
                  <td>
                    <Badge>{t.priority}</Badge>
                  </td>
                  <td>
                    <Badge>{t.status}</Badge>
                  </td>
                  <td>
                    <select
                      aria-label={`تحديث حالة ${t.id}`}
                      value={t.status}
                      onChange={(e) =>
                        update({ ...data, tasks: data.tasks.map((x) => (x.id === t.id ? { ...x, status: e.target.value } : x)) })
                      }
                    >
                      {["مجدولة", "قيد التنفيذ", "مكتملة"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!list.length && <Empty />}
        </div>
      </div>
      {adding && (
        <Modal title="إسناد مهمة جديدة" close={() => setAdding(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              add(e.currentTarget);
            }}
          >
            <div className="form-grid">
              <Field label="الشركة / النشاط">
                <select required name="companyId">
                  <option value="">اختر الشركة</option>
                  {data.companies.map((c) => (
                    <option value={c.id} key={c.id}>
                      {c.name} — {c.region}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="المفتش المسؤول">
                <select required name="inspectorId">
                  <option value="">اختر مفتشًا نشطًا</option>
                  {data.inspectors
                    .filter((i) => i.active)
                    .map((i) => (
                      <option value={i.id} key={i.id}>
                        {i.name}
                      </option>
                    ))}
                </select>
              </Field>
              <Field label="تاريخ الزيارة">
                <input required type="date" name="date" min={today()} defaultValue={today()} />
              </Field>
              <Field label="الأولوية">
                <select name="priority">
                  <option>عادية</option>
                  <option>عالية</option>
                </select>
              </Field>
            </div>
            <Field label="تعليمات الزيارة">
              <textarea name="notes" required rows={3} />
            </Field>
            <div className="modal-actions">
              <button className="primary">إسناد المهمة</button>
              <button type="button" onClick={() => setAdding(false)}>
                إلغاء
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
