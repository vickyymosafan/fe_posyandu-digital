# Dashboard Components

Komponen-komponen reusable untuk dashboard Admin dan Petugas.

## Komponen

### StatCard

Komponen untuk menampilkan statistik dalam bentuk card.

**Props:**
- `label` (string): Label statistik
- `value` (number | string): Nilai statistik
- `icon` (ReactNode, optional): Icon untuk card
- `color` ('blue' | 'green' | 'purple' | 'orange', optional): Warna accent
- `description` (string, optional): Deskripsi tambahan

**Contoh Penggunaan:**
```tsx
<StatCard
  label="Total Petugas Aktif"
  value={25}
  icon={<UsersIcon size={24} />}
  color="blue"
  description="Petugas yang sedang aktif"
/>
```

### TrendChart

Komponen untuk menampilkan grafik tren menggunakan Recharts.

**Props:**
- `data` (ChartData[]): Data untuk chart
- `title` (string): Judul chart
- `lineColor` (string, optional): Warna line chart
- `yAxisLabel` (string, optional): Label untuk Y axis

**Contoh Penggunaan:**
```tsx
<TrendChart
  data={trendData}
  title="Tren Pemeriksaan 7 Hari Terakhir"
  lineColor="#8b5cf6"
  yAxisLabel="Jumlah Pemeriksaan"
/>
```

### QuickNavCard

Komponen untuk navigasi cepat ke halaman lain.

**Props:**
- `title` (string): Judul navigasi
- `description` (string): Deskripsi navigasi
- `href` (string): URL tujuan
- `icon` (ReactNode, optional): Icon untuk card
- `color` ('blue' | 'green' | 'purple' | 'orange', optional): Warna accent

**Contoh Penggunaan:**
```tsx
<QuickNavCard
  title="Daftar Petugas"
  description="Kelola data petugas dan akses sistem"
  href="/admin/petugas"
  icon={<CogIcon size={24} />}
  color="blue"
/>
```

### DashboardSkeleton

Komponen skeleton loading untuk dashboard.

**Contoh Penggunaan:**
```tsx
{isLoading ? <DashboardSkeleton /> : <DashboardContent />}
```

## Custom Hook

### useDashboardStats

Hook untuk fetch dan aggregate data statistik dashboard.

**Return Value:**
- `stats` (DashboardStats | null): Data statistik
- `trendData` (TrendData[]): Data tren pemeriksaan
- `isLoading` (boolean): Loading state
- `error` (string | null): Error message
- `refetch` (() => Promise<void>): Function untuk refetch data

**Contoh Penggunaan:**
```tsx
const { stats, trendData, isLoading, error } = useDashboardStats();

if (isLoading) return <DashboardSkeleton />;
if (error) return <ErrorMessage message={error} />;

return (
  <div>
    <StatCard label="Total Petugas" value={stats.totalPetugasAktif} />
    <TrendChart data={trendData} title="Tren Pemeriksaan" />
  </div>
);
```

## Design Principles

Semua komponen mengikuti prinsip:

- **SRP (Single Responsibility Principle)**: Setiap komponen hanya memiliki satu tanggung jawab
- **OCP (Open/Closed Principle)**: Mudah diperluas dengan props tanpa ubah kode internal
- **DRY (Don't Repeat Yourself)**: Reusable di berbagai dashboard
- **SoC (Separation of Concerns)**: Pemisahan UI, state management, dan data fetching
- **Composition Over Inheritance**: Menggunakan komposisi komponen

## Struktur File

```
components/dashboard/
├── StatCard.tsx           # Komponen statistik card
├── TrendChart.tsx         # Komponen grafik tren
├── QuickNavCard.tsx       # Komponen navigasi cepat
├── DashboardSkeleton.tsx  # Komponen loading skeleton
├── index.ts               # Export semua komponen
└── README.md              # Dokumentasi
```

## Dependencies

- `recharts`: Library untuk chart visualization
- `date-fns`: Library untuk date manipulation
- `@/components/ui`: UI components (Card, Button, dll)
- `@/lib/api`: API client untuk fetch data
- `@/lib/db`: IndexedDB repositories
