import { useState } from "react";
import type { Company, Inspector, Store } from "../types";
import { regions } from "../lists/data";
import { uid } from "../store";
import { Badge, Empty, Field, Icon, Modal } from "../components/UI";
type Props = { data: Store; update: (data: Store) => void; kind: "companies" | "inspectors"; query: string };
export default function Registry({ data, update, kind, query }: Props) {
  const companies = kind === "companies";
  const [edit, setEdit] = useState<Company | Inspector | "new" | null>(null);
  const [region, setRegion] = useState("");
  const list = data[kind].filter(
    (x) => `${x.name} ${x.id} ${"tax" in x ? x.tax : x.phone}`.includes(query) && (!region || x.region === region),
  );
  function save(form: HTMLFormElement) {
    const values = Object.fromEntries(new FormData(form));
    const id = edit && edit !== "new" ? edit.id : uid(companies ? "COM" : "INS");
    if (companies) {
      if (data.companies.some((c) => c.tax === values.tax && c.id !== id)) {
        alert("الرقم الضريبي مستخدم بالفعل.");
        return;
      }
      const row = { ...values, id, lat: Number(values.lat), lng: Number(values.lng) } as Company;
      update({ ...data, companies: edit === "new" ? [...data.companies, row] : data.companies.map((x) => (x.id === id ? row : x)) });
    } else {
      const row = { ...values, id, active: values.active === "true" } as unknown as Inspector;
      update({ ...data, inspectors: edit === "new" ? [...data.inspectors, row] : data.inspectors.map((x) => (x.id === id ? row : x)) });
    }
    setEdit(null);
  }
  const value = (key: string) => (edit && edit !== "new" ? String((edit as unknown as Record<string, unknown>)[key] ?? "") : "");
  return (
    <>
      <div className="section-heading">
        <div>
          <h2>{companies ? "دليل الشركات والأنشطة" : "فريق التفتيش"}</h2>
          <p>
            {list.length} {companies ? "نشاط مسجل في المنظومة" : "مفتش في المنظومة"}
          </p>
        </div>
        <button className="primary" onClick={() => setEdit("new")}>
          <Icon name="plus" />
          {companies ? "إضافة شركة" : "إضافة مفتش"}
        </button>
      </div>
      <div className="panel">
        <div className="toolbar">
          <h3>{companies ? "ملفات الشركات" : "ملفات المفتشين"}</h3>
          <select aria-label="تصفية حسب المنطقة" value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">كل المناطق</option>
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{companies ? "الشركة / النشاط" : "المفتش"}</th>
                <th>{companies ? "الرقم الضريبي" : "الهاتف"}</th>
                <th>المنطقة</th>
                <th>{companies ? "الخطورة" : "المهام المنجزة"}</th>
                <th>الحالة</th>
                <th>الملف</th>
              </tr>
            </thead>
            <tbody>
              {list.map((x) => (
                <tr key={x.id}>
                  <td>
                    <div className="person">
                      <span className="avatar soft">{x.name.slice(0, 1)}</span>
                      <div>
                        <strong>{x.name}</strong>
                        <small>{x.id}</small>
                      </div>
                    </div>
                  </td>
                  <td dir="ltr">{"tax" in x ? x.tax : x.phone}</td>
                  <td>{x.region}</td>
                  <td>
                    {"risk" in x ? (
                      <Badge>{x.risk}</Badge>
                    ) : (
                      `${data.tasks.filter((t) => t.inspectorId === x.id && t.status === "مكتملة").length} / ${data.tasks.filter((t) => t.inspectorId === x.id).length}`
                    )}
                  </td>
                  <td>
                    <Badge>{"status" in x ? x.status : x.active ? "نشط" : "غير نشط"}</Badge>
                  </td>
                  <td>
                    <button className="text-button" onClick={() => setEdit(x)}>
                      عرض وتعديل ←
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!list.length && <Empty />}
        </div>
      </div>
      {edit && (
        <Modal title={`${edit === "new" ? "إضافة" : "ملف"} ${companies ? "شركة" : "مفتش"}`} close={() => setEdit(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save(e.currentTarget);
            }}
          >
            <div className="form-grid">
              <Field label={companies ? "اسم الشركة" : "الاسم الكامل"}>
                <input name="name" required defaultValue={value("name")} />
              </Field>
              <Field label="المنطقة">
                <select name="region" defaultValue={value("region") || regions[0]}>
                  {regions.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
              {companies ? (
                <>
                  <Field label="الرقم الضريبي">
                    <input name="tax" required pattern="[0-9]+" defaultValue={value("tax")} />
                  </Field>
                  <Field label="نوع النشاط">
                    <input name="activity" required defaultValue={value("activity")} />
                  </Field>
                  <Field label="العنوان">
                    <input name="address" required defaultValue={value("address")} />
                  </Field>
                  <Field label="الوضع الضريبي">
                    <select name="status" defaultValue={value("status") || "مسجل"}>
                      <option>مسجل</option>
                      <option>غير مسجل</option>
                    </select>
                  </Field>
                  <Field label="درجة الخطورة">
                    <select name="risk" defaultValue={value("risk") || "متوسط"}>
                      <option>منخفض</option>
                      <option>متوسط</option>
                      <option>مرتفع</option>
                    </select>
                  </Field>
                  <Field label="خط العرض">
                    <input name="lat" type="number" step="any" min="-90" max="90" required defaultValue={value("lat")} />
                  </Field>
                  <Field label="خط الطول">
                    <input name="lng" type="number" step="any" min="-180" max="180" required defaultValue={value("lng")} />
                  </Field>
                </>
              ) : (
                <>
                  <Field label="البريد الإلكتروني">
                    <input name="email" type="email" required defaultValue={value("email")} />
                  </Field>
                  <Field label="رقم الهاتف">
                    <input name="phone" type="tel" required pattern="[+0-9 ]{8,15}" defaultValue={value("phone")} />
                  </Field>
                  <Field label="حالة المفتش">
                    <select name="active" defaultValue={value("active") || "true"}>
                      <option value="true">نشط</option>
                      <option value="false">غير نشط</option>
                    </select>
                  </Field>
                </>
              )}
            </div>
            <div className="modal-actions">
              <button className="primary" type="submit">
                حفظ الملف
              </button>
              <button type="button" onClick={() => setEdit(null)}>
                إلغاء
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
