# Adasa — React

تم تحويل مشروع عدسة إلى React مع React Router (HashRouter)، مع الحفاظ على ملفات التصميم الأصلية كما هي دون إعادة تصميم.

## التشغيل
1. ثبّت Node.js.
2. افتح مجلد المشروع في VS Code.
3. افتح Terminal واكتب:
   ```bash
   npm install
   npm run dev
   ```
4. افتح الرابط الذي يظهر في Terminal.

## البناء النهائي
```bash
npm run build
```

## ملاحظات
- التنقل بين الصفحات أصبح عبر React Router.
- صفحات Home وBlog وBlog Details و404 موجودة.
- البحث والفلترة وGrid/List وPagination موجودة في منطق المدونة الأصلي.
- بيانات المقالات محلية من `posts.json` مع fallback في `posts-data.js`.
- ملفات `style.css` و`custom.css` وملفات `assets` الأصلية محفوظة كما هي.
