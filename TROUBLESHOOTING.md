# Troubleshooting Guide

Panduan mengatasi masalah umum yang mungkin terjadi saat development atau production.

## 📋 Daftar Isi

- [Development Issues](#development-issues)
- [Build Issues](#build-issues)
- [Runtime Issues](#runtime-issues)
- [API Integration Issues](#api-integration-issues)
- [PWA Issues](#pwa-issues)
- [Database Issues](#database-issues)
- [Performance Issues](#performance-issues)
- [Browser Compatibility](#browser-compatibility)

## Development Issues

### Dev Server Tidak Bisa Start

**Problem**: `npm run dev` gagal dengan error "Port 3000 already in use"

**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Atau gunakan port lain
PORT=3001 npm run dev
```

### Hot Reload Tidak Bekerja

**Problem**: Changes tidak auto-reload di browser

**Solution**:
1. Check file watcher limit (Linux):
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. Restart dev server:
   ```bash
   # Stop server (Ctrl+C)
   # Clear cache
   rm -rf .next
   # Start again
   npm run dev
   ```

### TypeScript Errors

**Problem**: Type errors di editor tapi build berhasil

**Solution**:
```bash
# Restart TypeScript server di VS Code
# Command Palette (Ctrl+Shift+P) → "TypeScript: Restart TS Server"

# Atau rebuild TypeScript
npm run type-check
```

### Import Path Errors

**Problem**: `Cannot find module '@/components/ui'`

**Solution**:
1. Check `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

2. Restart dev server

## Build Issues

### Build Fails dengan Memory Error

**Problem**: `JavaScript heap out of memory`

**Solution**:
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Atau tambahkan ke package.json scripts
"build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
```

### PWA Build Error

**Problem**: Build fails dengan error di PWA plugin

**Solution**:
1. Check icons exist:
   ```bash
   ls public/icons/
   # Should show: icon-192x192.png, icon-512x512.png
   ```

2. Regenerate icons:
   ```bash
   npm run generate-icons
   ```

3. Check `next.config.ts` PWA configuration

### Module Not Found Error

**Problem**: `Module not found: Can't resolve 'xyz'`

**Solution**:
```bash
# Clear cache dan reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### TypeScript Build Errors

**Problem**: Build fails dengan type errors

**Solution**:
```bash
# Run type check
npm run type-check

# Fix type errors atau add type assertions
const data = response.data as Lansia[];
```

## Runtime Issues

### White Screen / Blank Page

**Problem**: Aplikasi hanya menampilkan white screen

**Solution**:
1. Check browser console untuk errors
2. Check network tab untuk failed requests
3. Verify environment variables:
   ```bash
   # Check .env.local
   cat .env.local
   ```

4. Check backend API status:
   ```bash
   curl http://localhost:5000/health
   ```

### Infinite Redirect Loop

**Problem**: Aplikasi terus redirect antara login dan dashboard

**Solution**:
1. Check middleware.ts logic
2. Clear cookies:
   ```javascript
   // Browser console
   document.cookie.split(";").forEach(c => {
     document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
   });
   ```

3. Check token validation di middleware

### 404 Not Found

**Problem**: Page menampilkan 404 error

**Solution**:
1. Check route path di `app/` directory
2. Verify dynamic route parameters:
   ```typescript
   // app/petugas/lansia/[kode]/page.tsx
   export default function Page({ params }: { params: { kode: string } }) {
     // ...
   }
   ```

3. Check middleware route protection

### Hydration Errors

**Problem**: `Hydration failed because the initial UI does not match`

**Solution**:
1. Avoid using browser-only APIs di server components:
   ```typescript
   // ❌ Wrong
   const isOnline = navigator.onLine;

   // ✅ Correct
   'use client';
   const [isOnline, setIsOnline] = useState(true);
   useEffect(() => {
     setIsOnline(navigator.onLine);
   }, []);
   ```

2. Use `suppressHydrationWarning` untuk dynamic content:
   ```typescript
   <time suppressHydrationWarning>
     {new Date().toLocaleString()}
   </time>
   ```

## API Integration Issues

### CORS Error

**Problem**: `Access to fetch has been blocked by CORS policy`

**Solution**:
1. Check backend CORS configuration:
   ```typescript
   // backend/src/app.ts
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
     credentials: true
   }));
   ```

2. Verify `NEXT_PUBLIC_API_URL` di `.env.local`

3. Check backend running:
   ```bash
   curl http://localhost:5000/health
   ```

### 401 Unauthorized

**Problem**: API requests return 401 error

**Solution**:
1. Check token di cookies:
   ```javascript
   // Browser console
   document.cookie
   ```

2. Login ulang untuk get new token

3. Check token expiration (15 menit)

4. Verify middleware token validation

### Network Timeout

**Problem**: Request timeout setelah 30 detik

**Solution**:
1. Check backend response time
2. Increase timeout di `lib/api/client.ts`:
   ```typescript
   const REQUEST_TIMEOUT = 60000; // 60 detik
   ```

3. Check network connection

### API Response Error

**Problem**: API return error response

**Solution**:
1. Check error message di response:
   ```typescript
   try {
     await lansiaAPI.create(data);
   } catch (error) {
     console.error('API Error:', error);
   }
   ```

2. Check backend logs:
   ```bash
   # Backend directory
   tail -f logs/error.log
   ```

3. Verify request payload format

## PWA Issues

### PWA Not Installable

**Problem**: Install prompt tidak muncul

**Solution**:
1. Check requirements:
   - ✅ HTTPS enabled (production)
   - ✅ Valid manifest.json
   - ✅ Service worker registered
   - ✅ Icons correct size

2. Check manifest:
   ```bash
   curl https://your-domain.com/manifest.json
   ```

3. Check service worker:
   ```javascript
   // Browser console
   navigator.serviceWorker.getRegistrations()
   ```

4. Use Lighthouse audit untuk check PWA criteria

### Service Worker Not Updating

**Problem**: Changes tidak apply setelah deploy

**Solution**:
1. Unregister service worker:
   ```javascript
   // Browser console
   navigator.serviceWorker.getRegistrations().then(registrations => {
     registrations.forEach(registration => registration.unregister());
   });
   ```

2. Clear cache:
   ```javascript
   // Browser console
   caches.keys().then(keys => {
     keys.forEach(key => caches.delete(key));
   });
   ```

3. Hard refresh (Ctrl+Shift+R)

### Offline Mode Not Working

**Problem**: Aplikasi tidak bekerja saat offline

**Solution**:
1. Check service worker caching strategy di `next.config.ts`

2. Verify offline page exist:
   ```bash
   ls app/offline/page.tsx
   ```

3. Check IndexedDB data:
   ```javascript
   // Browser console
   indexedDB.databases()
   ```

4. Test offline mode:
   - Open DevTools
   - Network tab → Throttling → Offline
   - Reload page

## Database Issues

### IndexedDB Not Working

**Problem**: Data tidak tersimpan di IndexedDB

**Solution**:
1. Check browser support:
   ```javascript
   if (!('indexedDB' in window)) {
     console.error('IndexedDB not supported');
   }
   ```

2. Check database initialization:
   ```typescript
   // lib/db/schema.ts
   import { db } from '@/lib/db';
   console.log('DB version:', db.verno);
   ```

3. Clear IndexedDB:
   ```javascript
   // Browser console
   indexedDB.deleteDatabase('PosyanduDB');
   ```

### Sync Queue Not Processing

**Problem**: Offline data tidak sync saat online

**Solution**:
1. Check online event listener:
   ```typescript
   // lib/hooks/useOffline.ts
   window.addEventListener('online', () => {
     console.log('Back online, syncing...');
     syncManager.syncAll();
   });
   ```

2. Check sync queue:
   ```typescript
   import { syncQueueRepository } from '@/lib/db';
   const queue = await syncQueueRepository.getAll();
   console.log('Queue items:', queue);
   ```

3. Manually trigger sync:
   ```typescript
   import { syncManager } from '@/lib/utils';
   await syncManager.syncAll();
   ```

### Data Inconsistency

**Problem**: Data di IndexedDB berbeda dengan backend

**Solution**:
1. Clear IndexedDB dan refetch:
   ```typescript
   import { db } from '@/lib/db';
   await db.delete();
   await db.open();
   // Refetch data dari backend
   ```

2. Check sync logic di `lib/utils/syncManager.ts`

3. Verify API responses

## Performance Issues

### Slow Page Load

**Problem**: Page load time > 3 detik

**Solution**:
1. Run Lighthouse audit:
   - Open DevTools
   - Lighthouse tab
   - Generate report

2. Optimize images:
   ```typescript
   // Use Next.js Image component
   import Image from 'next/image';
   <Image src="/image.jpg" width={500} height={300} alt="..." />
   ```

3. Implement code splitting:
   ```typescript
   // Dynamic import
   const Chart = dynamic(() => import('./Chart'), { ssr: false });
   ```

4. Check backend API response time

### Large Bundle Size

**Problem**: JavaScript bundle > 500KB

**Solution**:
1. Analyze bundle:
   ```bash
   npm install @next/bundle-analyzer
   ANALYZE=true npm run build
   ```

2. Remove unused dependencies:
   ```bash
   npm uninstall unused-package
   ```

3. Use dynamic imports untuk large components

4. Enable tree shaking

### Memory Leak

**Problem**: Memory usage terus meningkat

**Solution**:
1. Check useEffect cleanup:
   ```typescript
   useEffect(() => {
     const interval = setInterval(() => {}, 1000);
     return () => clearInterval(interval); // Cleanup
   }, []);
   ```

2. Check event listeners:
   ```typescript
   useEffect(() => {
     const handler = () => {};
     window.addEventListener('resize', handler);
     return () => window.removeEventListener('resize', handler);
   }, []);
   ```

3. Use React DevTools Profiler untuk identify leaks

## Browser Compatibility

### Safari Issues

**Problem**: Aplikasi tidak bekerja di Safari

**Solution**:
1. Check IndexedDB support (Safari < 14 limited support)
2. Use polyfills jika diperlukan
3. Test di Safari Technology Preview

### iOS PWA Issues

**Problem**: PWA tidak install di iOS

**Solution**:
1. Check manifest format (iOS requires specific format)
2. Add apple-touch-icon:
   ```html
   <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
   ```

3. Add meta tags:
   ```html
   <meta name="apple-mobile-web-app-capable" content="yes" />
   <meta name="apple-mobile-web-app-status-bar-style" content="default" />
   ```

### Internet Explorer

**Problem**: Aplikasi tidak bekerja di IE

**Solution**:
IE tidak supported. Tampilkan message untuk upgrade browser:
```typescript
// app/layout.tsx
<noscript>
  <div>
    Browser Anda tidak didukung. Silakan gunakan Chrome, Firefox, Safari, atau Edge.
  </div>
</noscript>
```

## Common Error Messages

### "Failed to fetch"

**Causes**:
- Backend tidak running
- CORS error
- Network error
- Wrong API URL

**Solution**: Check backend status dan network connection

### "Token expired"

**Causes**:
- JWT token expired (15 menit)
- Invalid token

**Solution**: Login ulang

### "Validation error"

**Causes**:
- Invalid input data
- Missing required fields

**Solution**: Check form validation dan input data

### "Resource not found"

**Causes**:
- Invalid ID/kode
- Data deleted
- Wrong endpoint

**Solution**: Verify resource exists di database

## Debug Tools

### Browser DevTools

1. **Console**: Check errors dan logs
2. **Network**: Monitor API requests
3. **Application**: Check cookies, localStorage, IndexedDB
4. **Lighthouse**: Performance audit
5. **React DevTools**: Component inspection

### VS Code Extensions

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Error Lens**: Inline error display
- **TypeScript Error Translator**: Better error messages

### Logging

Add logging untuk debug:
```typescript
// Development only
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

## Getting Help

Jika masalah masih belum resolved:

1. **Check Documentation**:
   - README.md
   - API_INTEGRATION.md
   - PROJECT_STRUCTURE.md
   - DEPLOYMENT.md

2. **Search Issues**: Check GitHub issues untuk similar problems

3. **Create Issue**: Create new issue dengan:
   - Problem description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/logs
   - Environment info (OS, browser, Node version)

4. **Contact Team**: Hubungi team untuk bantuan

## Prevention Tips

### 1. Regular Updates

```bash
# Update dependencies
npm update

# Check outdated packages
npm outdated
```

### 2. Code Quality

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Format code
npm run format
```

### 3. Testing

```bash
# Run tests (when implemented)
npm test

# Test build
npm run build
npm start
```

### 4. Monitoring

- Enable Vercel Analytics
- Monitor error logs
- Track performance metrics
- Regular Lighthouse audits

### 5. Documentation

- Keep documentation up-to-date
- Document known issues
- Share solutions dengan team

