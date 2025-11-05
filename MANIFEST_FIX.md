# Manifest Fix Documentation

## Problem

Browser console menampilkan error:
```
Manifest: Line: 1, column: 1, Syntax error.
manifest.webmanifest:1
```

## Root Cause Analysis

### Issue Breakdown:

1. **Browser Behavior**: 
   - Browser/PWA mencari manifest file dengan nama `manifest.webmanifest` (standar lama)
   - Ini adalah naming convention yang umum digunakan untuk PWA manifest

2. **Next.js 14 Behavior**:
   - Next.js 14 dengan App Router menggunakan `app/manifest.ts`
   - File ini di-generate menjadi `/manifest.json` (bukan `.webmanifest`)
   - Route: `http://localhost:3000/manifest.json` ✅
   - Route: `http://localhost:3000/manifest.webmanifest` ❌ (404)

3. **Mismatch**:
   - Browser request: `/manifest.webmanifest`
   - Next.js provides: `/manifest.json`
   - Result: 404 error → Syntax error karena response bukan valid JSON manifest

### Why This Happens:

- Beberapa browser dan PWA tools masih mencari `.webmanifest` extension
- Next.js modern menggunakan `.json` extension
- Tidak ada automatic redirect/rewrite dari `.webmanifest` ke `.json`

## Solution Applied

### Fix: Add Rewrites in next.config.ts

Menambahkan rewrite rule untuk redirect request `/manifest.webmanifest` ke `/manifest.json`:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // ... other config

  // Rewrites untuk manifest compatibility
  async rewrites() {
    return [
      {
        source: '/manifest.webmanifest',
        destination: '/manifest.json',
      },
    ];
  },

  // ... other config
};
```

### How It Works:

1. Browser request `/manifest.webmanifest`
2. Next.js rewrites internally ke `/manifest.json`
3. Next.js serves manifest dari `app/manifest.ts`
4. Browser receives valid manifest JSON
5. No more syntax error ✅

### Alternative Solutions (Not Used):

**Option 1: Create Static File**
```bash
# Create manifest.webmanifest in public folder
cp public/manifest.json public/manifest.webmanifest
```
❌ Cons: Need to maintain two files, manual sync

**Option 2: Update HTML Meta Tag**
```html
<link rel="manifest" href="/manifest.json" />
```
❌ Cons: Doesn't fix browser auto-discovery

**Option 3: Service Worker Redirect**
```javascript
// In service worker
self.addEventListener('fetch', (event) => {
  if (event.request.url.endsWith('/manifest.webmanifest')) {
    event.respondWith(fetch('/manifest.json'));
  }
});
```
❌ Cons: More complex, service worker overhead

## Verification

### Test Steps:

1. **Start Development Server**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Test Manifest Routes**:
   - Open: `http://localhost:3000/manifest.json` ✅
   - Open: `http://localhost:3000/manifest.webmanifest` ✅
   - Both should return same manifest JSON

3. **Check Browser Console**:
   - Open DevTools → Console
   - No more "Manifest: Syntax error" ✅

4. **Check Application Tab**:
   - Open DevTools → Application → Manifest
   - Should show manifest details ✅

### Expected Manifest Content:

```json
{
  "name": "Posyandu Lansia",
  "short_name": "Posyandu",
  "description": "Aplikasi Posyandu untuk manajemen data lansia dan pemeriksaan kesehatan",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#171717",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

## Technical Details

### Next.js Manifest Generation:

**File**: `app/manifest.ts`
```typescript
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Posyandu Lansia',
    short_name: 'Posyandu',
    // ... other properties
  };
}
```

**Generated Route**: `/manifest.json`

### Rewrite Configuration:

**File**: `next.config.ts`
```typescript
async rewrites() {
  return [
    {
      source: '/manifest.webmanifest',  // What browser requests
      destination: '/manifest.json',     // Where Next.js serves
    },
  ];
}
```

**Type**: Internal rewrite (not redirect)
- Browser URL stays as `/manifest.webmanifest`
- Next.js internally serves `/manifest.json`
- No 301/302 redirect, seamless

## Benefits

✅ **Backward Compatibility**: Support both `.json` and `.webmanifest`
✅ **No Duplication**: Single source of truth (`app/manifest.ts`)
✅ **Automatic Updates**: Changes in `manifest.ts` reflect in both routes
✅ **Clean Solution**: No manual file management
✅ **Performance**: Internal rewrite, no extra HTTP request

## Browser Support

This fix ensures compatibility with:
- ✅ Chrome/Edge (prefer `.json`)
- ✅ Firefox (prefer `.webmanifest`)
- ✅ Safari (support both)
- ✅ PWA tools (support both)
- ✅ Lighthouse (support both)

## Related Files

- `frontend/app/manifest.ts` - Manifest definition
- `frontend/next.config.ts` - Rewrite configuration
- `frontend/public/icons/` - Manifest icons
- `frontend/app/layout.tsx` - Manifest link tag

## Troubleshooting

### Issue: Still seeing syntax error

**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard reload (Ctrl+Shift+R)
3. Restart Next.js dev server
4. Check Network tab for manifest request

### Issue: Manifest not loading

**Solution**:
1. Verify icons exist in `/public/icons/`
2. Check manifest.ts syntax
3. Check next.config.ts rewrites
4. Test both routes directly in browser

### Issue: PWA not installable

**Solution**:
1. Manifest must be valid JSON
2. Icons must exist and be accessible
3. HTTPS required (or localhost)
4. Service worker must be registered

## References

- [Web App Manifest Spec](https://www.w3.org/TR/appmanifest/)
- [Next.js Metadata Files](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
- [Next.js Rewrites](https://nextjs.org/docs/app/api-reference/next-config-js/rewrites)
- [PWA Manifest Best Practices](https://web.dev/add-manifest/)

## Commit Message

```
fix(pwa): tambah rewrite untuk manifest.webmanifest compatibility

- Add rewrites di next.config.ts untuk redirect /manifest.webmanifest ke /manifest.json
- Fix browser error "Manifest: Syntax error" 
- Support backward compatibility dengan .webmanifest extension
- Maintain single source of truth di app/manifest.ts

Fixes: Browser console error saat mencari manifest.webmanifest
```
