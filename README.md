# Asset Map Manager

ระบบจัดการทรัพย์สินแบบครบวงจร พัฒนาด้วย Next.js, TypeScript, Tailwind CSS และ Supabase

## คุณสมบัติหลัก

- 🏠 ระบบจัดการทรัพย์สิน (เพิ่ม/แก้ไข/ลบ)
- 👤 ระบบจัดการเจ้าของทรัพย์สิน
- 🕵️‍♀️ บันทึกกิจกรรม (Activity Logs)
- 📁 จัดการไฟล์แนบ
- 🔐 ระบบผู้ใช้ (Admin/User)
- 🖼 UI ภาษาไทย 100%
- 🌙 รองรับ Dark Mode
- 📊 Export ข้อมูล (CSV/PDF)
- 🗺️ แสดงตำแหน่งบนแผนที่

## เทคโนโลยีที่ใช้

- Frontend: Next.js 14 (TypeScript), Tailwind CSS
- Backend: Supabase (Database, Auth, Storage)
- UI Components: Headless UI, Heroicons
- Maps: Google Maps API
- State Management: React Query
- Export: jsPDF, xlsx

## การติดตั้ง

1. Clone repository:

```bash
git clone [repository-url]
cd asset-map-manager
```

2. ติดตั้ง dependencies:

```bash
npm install
```

3. สร้างไฟล์ .env.local และกำหนดค่า environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

4. รัน development server:

```bash
npm run dev
```

## โครงสร้างโปรเจกต์

```
src/
├── app/                 # Next.js App Router
├── components/          # React Components
├── lib/                 # Utility functions
├── types/              # TypeScript types
├── hooks/              # Custom hooks
└── styles/             # Global styles
```

## การ Deploy

- Production: Vercel
- Development: Localhost

## License

MIT
