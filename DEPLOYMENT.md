# Deployment Guide

Panduan lengkap untuk deploy aplikasi Posyandu Lansia Frontend ke Vercel.

## 📋 Daftar Isi

- [Prerequisites](#prerequisites)
- [Persiapan Deployment](#persiapan-deployment)
- [Deploy ke Vercel](#deploy-ke-vercel)
- [Environment Variables](#environment-variables)
- [Custom Domain](#custom-domain)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)
- [Rollback Strategy](#rollback-strategy)

## Prerequisites

Sebelum deploy, pastikan:

- ✅ Backend API sudah deployed dan accessible
- ✅ Database backend sudah setup
- ✅ Git repository sudah di push ke GitHub/GitLab/Bitbucket
- ✅ Akun Vercel sudah dibuat (gratis di [vercel.com](https://vercel.com))
- ✅ Node.js >= 18.0.0 installed locally untuk testing

## Persiapan Deployment

### 1. Test Build Locally

Sebelum deploy, test build di local environment:

```bash
# Install dependencies
npm install

# Run build
npm run build

# Test production build
npm start
```

Pastikan tidak ada error saat build dan aplikasi berjalan dengan baik di `http://localhost:3000`.

### 2. Check Environment Variables

Pastikan `.env.example` sudah up-to-date:

```env
# .env.example
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
NEXT_PUBLIC_APP_NAME=Posyandu Lansia
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Verify PWA Configuration

Check `next.config.ts` untuk PWA configuration:

```typescript
const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // PWA disabled di development
  register: true,
  fallbacks: {
    document: '/offline',
  },
  // ... workbox options
});
```

### 4. Generate PWA Icons

Jika belum generate icons:

```bash
npm run generate-icons
```

Verify icons exist di `public/icons/`:
- `icon-192x192.png`
- `icon-512x512.png`

### 5. Check Security Headers

Verify security headers di `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
      ],
    },
  ];
}
```

## Deploy ke Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Import Project

1. Login ke [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import Git repository:
   - Pilih GitHub/GitLab/Bitbucket
   - Authorize Vercel untuk access repository
   - Select repository `posyandu-digital`

#### Step 2: Configure Project

1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: `frontend` (jika monorepo)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

#### Step 3: Environment Variables

Add environment variables di Vercel dashboard:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-api.com/api` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_NAME` | `Posyandu Lansia` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_VERSION` | `1.0.0` | Production, Preview, Development |

**Important**: 
- Gunakan URL backend production untuk Production environment
- Gunakan URL backend staging untuk Preview environment (optional)

#### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build process (biasanya 2-5 menit)
3. Vercel akan provide deployment URL: `https://your-project.vercel.app`

### Method 2: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login

```bash
vercel login
```

#### Step 3: Deploy

```bash
# Dari root directory frontend
cd frontend

# Deploy ke production
vercel --prod

# Atau deploy ke preview
vercel
```

#### Step 4: Set Environment Variables

```bash
# Set environment variable
vercel env add NEXT_PUBLIC_API_URL production

# List environment variables
vercel env ls
```

## Environment Variables

### Production Environment

```env
NEXT_PUBLIC_API_URL=https://api.posyandu.com/api
NEXT_PUBLIC_APP_NAME=Posyandu Lansia
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Preview Environment (Optional)

```env
NEXT_PUBLIC_API_URL=https://staging-api.posyandu.com/api
NEXT_PUBLIC_APP_NAME=Posyandu Lansia (Staging)
NEXT_PUBLIC_APP_VERSION=1.0.0-preview
```

### Development Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Posyandu Lansia (Dev)
NEXT_PUBLIC_APP_VERSION=1.0.0-dev
```

### Managing Environment Variables

#### Via Vercel Dashboard

1. Go to project settings
2. Navigate to **"Environment Variables"**
3. Add/Edit/Delete variables
4. Redeploy untuk apply changes

#### Via Vercel CLI

```bash
# Add variable
vercel env add NEXT_PUBLIC_API_URL production

# Remove variable
vercel env rm NEXT_PUBLIC_API_URL production

# Pull environment variables ke local
vercel env pull .env.local
```

## Custom Domain

### Step 1: Add Domain

1. Go to project settings di Vercel
2. Navigate to **"Domains"**
3. Click **"Add"**
4. Enter domain name: `posyandu.com` atau `app.posyandu.com`

### Step 2: Configure DNS

Vercel akan provide DNS records yang perlu ditambahkan:

#### Option A: Using Vercel Nameservers (Recommended)

1. Update nameservers di domain registrar:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

2. Wait for DNS propagation (bisa 24-48 jam)

#### Option B: Using CNAME Record

1. Add CNAME record di DNS provider:
   ```
   Type: CNAME
   Name: app (atau @ untuk root domain)
   Value: cname.vercel-dns.com
   ```

2. Wait for DNS propagation

### Step 3: Enable HTTPS

Vercel automatically provision SSL certificate dari Let's Encrypt.

HTTPS akan active setelah DNS propagation selesai.

### Step 4: Redirect Configuration

Configure redirects di `next.config.ts` jika diperlukan:

```typescript
async redirects() {
  return [
    {
      source: '/home',
      destination: '/',
      permanent: true,
    },
  ];
}
```

## Monitoring & Analytics

### Vercel Analytics

Enable Vercel Analytics untuk monitoring:

1. Go to project settings
2. Navigate to **"Analytics"**
3. Enable **"Web Analytics"**

Analytics akan track:
- Page views
- Unique visitors
- Top pages
- Referrers
- Devices & browsers

### Vercel Speed Insights

Enable Speed Insights untuk performance monitoring:

1. Go to project settings
2. Navigate to **"Speed Insights"**
3. Enable **"Speed Insights"**

Speed Insights akan track:
- Core Web Vitals (LCP, FID, CLS)
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)

### Custom Monitoring (Optional)

Integrate dengan monitoring tools:

#### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

#### Google Analytics

```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Troubleshooting

### Build Failures

#### Problem: Build fails dengan error "Module not found"

**Solution**:
1. Check `package.json` dependencies
2. Ensure all imports correct
3. Clear cache dan rebuild:
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

#### Problem: Build fails dengan PWA error

**Solution**:
1. Check `next.config.ts` PWA configuration
2. Ensure icons exist di `public/icons/`
3. Regenerate icons:
   ```bash
   npm run generate-icons
   ```

### Runtime Errors

#### Problem: API calls fail dengan CORS error

**Solution**:
1. Check backend CORS configuration
2. Ensure `NEXT_PUBLIC_API_URL` correct
3. Verify backend accessible dari Vercel IP

#### Problem: Environment variables not working

**Solution**:
1. Ensure variable names start dengan `NEXT_PUBLIC_`
2. Redeploy after adding environment variables
3. Check variable values di Vercel dashboard

### Performance Issues

#### Problem: Slow page load

**Solution**:
1. Enable Vercel Speed Insights
2. Optimize images dengan Next.js Image component
3. Implement code splitting
4. Check backend API response time

#### Problem: Large bundle size

**Solution**:
1. Analyze bundle dengan:
   ```bash
   npm install @next/bundle-analyzer
   ```

2. Add to `next.config.ts`:
   ```typescript
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   });

   module.exports = withBundleAnalyzer(nextConfig);
   ```

3. Run analysis:
   ```bash
   ANALYZE=true npm run build
   ```

### PWA Issues

#### Problem: PWA not installable

**Solution**:
1. Check manifest.json generated di `public/`
2. Verify icons exist dan correct size
3. Ensure HTTPS enabled (required untuk PWA)
4. Check service worker registered:
   ```javascript
   // Browser console
   navigator.serviceWorker.getRegistrations()
   ```

#### Problem: Offline mode not working

**Solution**:
1. Check service worker caching strategy di `next.config.ts`
2. Verify offline page exist di `app/offline/page.tsx`
3. Clear service worker cache:
   ```javascript
   // Browser console
   navigator.serviceWorker.getRegistrations().then(registrations => {
     registrations.forEach(registration => registration.unregister());
   });
   ```

## Rollback Strategy

### Automatic Rollback

Vercel keeps history of all deployments. Untuk rollback:

1. Go to project di Vercel dashboard
2. Navigate to **"Deployments"**
3. Find previous successful deployment
4. Click **"..."** → **"Promote to Production"**

### Manual Rollback via Git

```bash
# Revert to previous commit
git revert HEAD

# Push to trigger new deployment
git push origin main
```

### Rollback Environment Variables

1. Go to project settings
2. Navigate to **"Environment Variables"**
3. Edit variable ke previous value
4. Redeploy

## Deployment Checklist

Sebelum deploy ke production:

- [ ] Backend API deployed dan accessible
- [ ] Database seeded dengan admin user
- [ ] Environment variables configured
- [ ] PWA icons generated
- [ ] Build test passed locally
- [ ] Security headers configured
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Analytics enabled
- [ ] Error tracking configured (optional)
- [ ] Documentation updated

## Post-Deployment

### Verify Deployment

1. **Check Homepage**:
   - Visit `https://your-domain.com`
   - Verify redirect ke `/login`

2. **Test Login**:
   - Login dengan admin credentials
   - Verify redirect ke dashboard

3. **Test PWA**:
   - Open di mobile browser
   - Check install prompt
   - Install dan test offline mode

4. **Test API Integration**:
   - Create lansia
   - Create pemeriksaan
   - Verify data saved

5. **Check Performance**:
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Verify page load time < 3s

### Monitor Deployment

1. **Check Vercel Logs**:
   - Go to project dashboard
   - Navigate to **"Logs"**
   - Monitor for errors

2. **Check Analytics**:
   - Monitor page views
   - Check error rate
   - Track user behavior

3. **Check Backend Logs**:
   - Monitor API request logs
   - Check for errors
   - Verify database connections

## Continuous Deployment

Vercel automatically deploy saat push ke Git:

### Production Deployment

```bash
# Push ke main branch
git push origin main
```

Vercel akan:
1. Detect push ke main branch
2. Run build
3. Deploy ke production
4. Update production URL

### Preview Deployment

```bash
# Push ke feature branch
git push origin feature/new-feature
```

Vercel akan:
1. Detect push ke feature branch
2. Run build
3. Deploy ke preview URL
4. Comment preview URL di PR (jika GitHub)

### Deployment Protection

Configure deployment protection di Vercel:

1. Go to project settings
2. Navigate to **"Deployment Protection"**
3. Enable **"Vercel Authentication"** untuk preview deployments
4. Enable **"Password Protection"** untuk production (optional)

## Best Practices

### 1. Use Preview Deployments

- Test changes di preview deployment sebelum merge ke main
- Share preview URL dengan team untuk review
- Verify functionality di preview environment

### 2. Monitor Performance

- Enable Vercel Analytics dan Speed Insights
- Set up alerts untuk performance degradation
- Regular Lighthouse audits

### 3. Secure Environment Variables

- Never commit `.env.local` ke Git
- Use Vercel environment variables untuk secrets
- Rotate secrets regularly

### 4. Implement CI/CD

- Add tests di CI pipeline
- Run linting dan type checking sebelum deploy
- Automate deployment process

### 5. Document Changes

- Update CHANGELOG.md untuk setiap deployment
- Document breaking changes
- Communicate dengan team

## Support

Untuk bantuan deployment:

1. **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
2. **Vercel Support**: [vercel.com/support](https://vercel.com/support)
3. **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
4. **GitHub Issues**: Create issue di repository

## Resources

- [Vercel Deployment Documentation](https://vercel.com/docs/deployments/overview)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [PWA Deployment Guide](https://web.dev/progressive-web-apps/)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)

