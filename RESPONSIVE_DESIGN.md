# Responsive Design Documentation

## Overview

Aplikasi Posyandu Lansia Frontend dibangun dengan responsive design yang mengikuti prinsip mobile-first dan menggunakan TailwindCSS breakpoints untuk memastikan pengalaman pengguna yang optimal di semua ukuran layar.

## Breakpoints

Aplikasi menggunakan breakpoints standar TailwindCSS:

| Breakpoint | Min Width | Target Device | Prefix |
|------------|-----------|---------------|--------|
| Mobile     | 0px       | Mobile phones | (default) |
| sm         | 640px     | Large phones  | `sm:` |
| md         | 768px     | Tablets       | `md:` |
| lg         | 1024px    | Small laptops | `lg:` |
| xl         | 1280px    | Desktops      | `xl:` |
| 2xl        | 1536px    | Large screens | `2xl:` |

## Layout Components

### 1. Sidebar

**Desktop (≥768px):**
- Fixed position di sebelah kiri
- Width: 256px (w-64)
- Sticky dengan top-16
- Selalu terlihat

**Mobile (<768px):**
- Drawer yang dapat dibuka/tutup
- Overlay backdrop dengan blur
- Slide animation dari kiri
- Close button di header
- User info ditampilkan di sidebar

**Implementation:**
```tsx
<aside className={`
  fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-neutral-200 
  transition-transform duration-300 ease-in-out
  md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0
  ${isOpen ? 'translate-x-0' : '-translate-x-full'}
`}>
```

### 2. Header

**Desktop (≥768px):**
- User info dengan avatar dan nama
- Logout button dengan text
- Logo dengan nama aplikasi

**Mobile (<768px):**
- Hamburger menu button
- Logo dengan icon saja
- Logout button icon only
- User info disembunyikan (ada di sidebar)

**Implementation:**
```tsx
{/* Hamburger - mobile only */}
<button className="md:hidden">...</button>

{/* User info - desktop only */}
<div className="hidden md:flex">...</div>

{/* Logout text - desktop only */}
<Button className="hidden md:inline-flex">...</Button>

{/* Logout icon - mobile only */}
<button className="md:hidden">...</button>
```

### 3. Main Content

**All Breakpoints:**
- Container dengan max-width
- Responsive padding
- Flexible width

**Implementation:**
```tsx
<main className="flex-1 min-w-0">
  <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-screen-2xl">
    {children}
  </div>
</main>
```

## Component Patterns

### 1. Grid Layouts

**Dashboard Stats:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <StatCard />
  <StatCard />
  <StatCard />
</div>
```

**Quick Navigation:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <QuickNavCard />
  <QuickNavCard />
  <QuickNavCard />
</div>
```

**Lansia Card:**
```tsx
<div className="grid grid-cols-2 gap-4">
  <div>Tanggal Lahir</div>
  <div>Umur</div>
</div>
```

### 2. Tables

**Responsive Wrapper:**
```tsx
<div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
  <div className="inline-block min-w-full align-middle">
    <table>...</table>
  </div>
</div>
```

**Features:**
- Horizontal scroll pada mobile
- Negative margin untuk full-width pada mobile
- Normal margin pada desktop

### 3. Forms

**Responsive Spacing:**
```tsx
<form className="space-y-6">
  <Input />
  <Input />
  <Button fullWidth />
</form>
```

**Features:**
- Vertical stacking pada semua breakpoints
- Full-width inputs
- Proper spacing dengan space-y-6

### 4. Buttons

**Size Variants:**
- `sm`: min-h-[36px] min-w-[36px] - untuk secondary actions
- `md`: min-h-[44px] min-w-[44px] - default, touch-friendly
- `lg`: min-h-[52px] min-w-[52px] - untuk primary CTAs

**Responsive Usage:**
```tsx
{/* Desktop: text + icon, Mobile: icon only */}
<Button className="hidden md:inline-flex">
  <Icon />
  <span className="ml-2">Text</span>
</Button>
<button className="md:hidden">
  <Icon />
</button>
```

### 5. Cards

**Responsive Padding:**
```tsx
<Card className="p-4 md:p-6">
  {content}
</Card>
```

**Responsive Hover:**
```tsx
<Card className="hover:shadow-md transition-shadow duration-300">
  {content}
</Card>
```

## Spacing System

### Container Padding

| Breakpoint | Padding |
|------------|---------|
| Mobile     | px-4    |
| Desktop    | px-6    |

### Section Padding

| Breakpoint | Padding |
|------------|---------|
| Mobile     | py-6    |
| Desktop    | py-8    |

### Gap Spacing

| Usage      | Gap     |
|------------|---------|
| Grid items | gap-4 md:gap-6 |
| Form fields| space-y-6 |
| Flex items | gap-3 md:gap-4 |

## Typography

### Responsive Font Sizes

| Element | Mobile | Desktop |
|---------|--------|---------|
| h1      | text-2xl | text-3xl |
| h2      | text-xl | text-2xl |
| h3      | text-lg | text-xl |
| Body    | text-base | text-base |
| Small   | text-sm | text-sm |

### Implementation:
```tsx
<h1 className="text-2xl md:text-3xl font-bold">
  Dashboard Admin
</h1>
```

## Overflow Prevention

### Global Styles

```css
@layer base {
  html {
    @apply overflow-x-hidden;
  }
}
```

**Purpose:**
- Mencegah horizontal scroll di semua halaman
- Memastikan content tidak keluar dari viewport

### Component Level

```tsx
{/* Table dengan horizontal scroll */}
<div className="overflow-x-auto">
  <table>...</table>
</div>

{/* Sidebar dengan vertical scroll */}
<nav className="flex-1 overflow-y-auto">
  <ul>...</ul>
</nav>
```

## Touch Targets

### Minimum Size

Semua elemen interaktif memiliki minimum size 44x44px untuk aksesibilitas touch:

```tsx
{/* Button */}
<Button size="md" /> // min-h-[44px] min-w-[44px]

{/* Icon button */}
<button className="min-h-[44px] min-w-[44px] p-2">
  <Icon />
</button>

{/* Input */}
<Input className="min-h-[44px]" />
```

## Modal & Overlay

### Responsive Modal

```tsx
<Modal>
  <div className="w-full max-w-md mx-auto">
    {content}
  </div>
</Modal>
```

**Features:**
- Full-width pada mobile dengan padding
- Max-width pada desktop
- Centered dengan mx-auto

### Backdrop

```tsx
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40">
  {/* Overlay */}
</div>
```

## Navigation

### Mobile Navigation

**Hamburger Menu:**
- Visible: `md:hidden`
- Size: 44x44px minimum
- Icon: 24x24px

**Drawer:**
- Full height
- Width: 256px (w-64)
- Slide from left
- Backdrop overlay

### Desktop Navigation

**Sidebar:**
- Fixed position
- Always visible
- Sticky scroll

## Best Practices

### 1. Mobile-First Approach

```tsx
{/* ✅ Good: Mobile first, then desktop */}
<div className="px-4 md:px-6">

{/* ❌ Bad: Desktop first */}
<div className="px-6 sm:px-4">
```

### 2. Consistent Breakpoints

```tsx
{/* ✅ Good: Consistent md breakpoint */}
<div className="hidden md:block">
<div className="grid-cols-1 md:grid-cols-3">

{/* ❌ Bad: Mixed breakpoints */}
<div className="hidden lg:block">
<div className="grid-cols-1 md:grid-cols-3">
```

### 3. Flexible Layouts

```tsx
{/* ✅ Good: Flexible with min-w-0 */}
<main className="flex-1 min-w-0">

{/* ❌ Bad: Fixed width */}
<main className="w-[800px]">
```

### 4. Responsive Images

```tsx
{/* ✅ Good: Responsive image */}
<img className="w-full h-auto" />

{/* ❌ Bad: Fixed size */}
<img width="400" height="300" />
```

### 5. Touch-Friendly Spacing

```tsx
{/* ✅ Good: Adequate spacing */}
<div className="space-y-4">
  <Button />
  <Button />
</div>

{/* ❌ Bad: Too tight */}
<div className="space-y-1">
  <Button />
  <Button />
</div>
```

## Testing Checklist

### Breakpoint Testing

- [ ] **Mobile (320px - 639px)**
  - [ ] Sidebar drawer berfungsi
  - [ ] Hamburger menu visible
  - [ ] Content tidak overflow horizontal
  - [ ] Touch targets minimal 44px
  - [ ] Forms full-width
  - [ ] Tables scrollable horizontal

- [ ] **Tablet (640px - 767px)**
  - [ ] Layout masih mobile-like
  - [ ] Spacing lebih lega
  - [ ] Grid masih single column

- [ ] **Small Desktop (768px - 1023px)**
  - [ ] Sidebar fixed visible
  - [ ] Grid 2-3 columns
  - [ ] User info visible di header
  - [ ] Logout button dengan text

- [ ] **Desktop (1024px - 1279px)**
  - [ ] Grid 3 columns
  - [ ] Optimal spacing
  - [ ] All features visible

- [ ] **Large Desktop (1280px+)**
  - [ ] Max-width container
  - [ ] Centered content
  - [ ] No excessive whitespace

### Device Testing

- [ ] iPhone SE (375px)
- [ ] iPhone 12/13 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] iPad Mini (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1920px)

### Orientation Testing

- [ ] Portrait mode
- [ ] Landscape mode
- [ ] Rotation handling

### Browser Testing

- [ ] Chrome (mobile & desktop)
- [ ] Safari (mobile & desktop)
- [ ] Firefox (desktop)
- [ ] Edge (desktop)

## Common Issues & Solutions

### Issue 1: Horizontal Scroll

**Problem:** Content keluar dari viewport

**Solution:**
```css
html {
  @apply overflow-x-hidden;
}
```

### Issue 2: Sidebar Tidak Menutup

**Problem:** Sidebar tetap terbuka saat resize ke desktop

**Solution:**
```tsx
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(false);
    }
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### Issue 3: Touch Targets Terlalu Kecil

**Problem:** Button sulit di-tap di mobile

**Solution:**
```tsx
<button className="min-h-[44px] min-w-[44px]">
  {/* Minimum 44x44px */}
</button>
```

### Issue 4: Table Overflow

**Problem:** Table terlalu lebar untuk mobile

**Solution:**
```tsx
<div className="overflow-x-auto">
  <table className="min-w-full">
    {/* Table content */}
  </table>
</div>
```

## Performance Considerations

### 1. CSS Purging

TailwindCSS automatically purges unused styles in production:

```js
// tailwind.config.ts
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
],
```

### 2. Responsive Images

Use Next.js Image component untuk optimasi:

```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
  className="w-full h-auto"
/>
```

### 3. Lazy Loading

Components yang tidak immediately visible:

```tsx
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loading />,
});
```

## Accessibility

### 1. Focus Indicators

```tsx
<button className="focus-visible:ring-2 focus-visible:ring-neutral-900">
  {/* Visible focus ring */}
</button>
```

### 2. Skip Links

```tsx
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### 3. ARIA Labels

```tsx
<button aria-label="Toggle menu" className="md:hidden">
  <MenuIcon />
</button>
```

## Conclusion

Aplikasi Posyandu Lansia Frontend telah diimplementasikan dengan responsive design yang komprehensif, mengikuti best practices dan memastikan pengalaman pengguna yang optimal di semua ukuran layar. Semua komponen telah diuji dan dioptimasi untuk mobile, tablet, dan desktop.
