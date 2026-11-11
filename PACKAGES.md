# الحزم المستخدمة

## التشغيل
- react: بناء مكونات الواجهة وإدارة الحالة.
- react-dom: عرض تطبيق React في المتصفح.
- qrcode: توليد رمز QR لمرجع المحضر محليًا.

## التطوير والبناء (الحزم الموجودة في المشروع)
- vite: خادم التطوير وبناء ملفات الإنتاج.
- typescript: فحص أنواع البيانات.
- @vitejs/plugin-react: تكامل React مع Vite.
- @babel/core، @rolldown/plugin-babel، babel-plugin-react-compiler: تحويل وتجميع React.
- eslint، @eslint/js، typescript-eslint: فحص الشيفرة.
- eslint-plugin-react-hooks، eslint-plugin-react-refresh: قواعد React.
- globals: تعريف المتغيرات العامة لأداة الفحص.
- @types/react، @types/react-dom، @types/node، @types/babel__core، @types/qrcode: تعريفات TypeScript.

## أدوات قراءة المقترح فقط
- pdfjs-dist: استخراج وعرض صفحات PDF أثناء التطوير، في `.tools`، ولا تدخل في التطبيق.
- @napi-rs/canvas: رسم صفحات PDF محليًا، تبعية لأداة القراءة.
- prettier: تنسيق ملفات المصدر أثناء التطوير فقط.
- @playwright/test، playwright، playwright-core: اختبار المتصفح والتفاعلات والطباعة أثناء التطوير فقط.

## خدمات خارجية دون حزم إضافية
- OpenStreetMap: خريطة مضمّنة تحتاج اتصالًا بالإنترنت.
- Google Fonts: خط Noto Sans Arabic؛ يتوفر Tahoma كبديل دون إنترنت.

الإصدارات الدقيقة مسجلة في package-lock.json.
