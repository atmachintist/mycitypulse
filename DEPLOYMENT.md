# MyCityPulse - Deployment Guide

## 🚀 Production Build Ready

**Build Status:** ✅ Complete and Optimized
- **Build Date:** April 12, 2026
- **Build Tool:** Vite v7.3.1
- **Output Directory:** `./dist/`
- **Main Bundle:** ~332 kB (gzip: ~102 kB)

---

## 📦 Production Build Contents

```
dist/
├── index.html                 (Main entry point - 2.0 KB)
├── assets/
│   ├── index-*.js            (Main app bundle - ~332 KB gzipped)
│   ├── index-*.css           (Main styles)
│   ├── CityPage-*.js         (City detail page)
│   ├── CivicSurvey-*.js      (Civic survey component)
│   ├── ElectionsCard-*.js    (Elections component)
│   ├── CompareView-*.js      (Compare view)
│   ├── [city-name]-*.js      (City-specific election data)
│   └── *.css                 (Styles for components)
├── favicon.svg
├── robots.txt
├── sitemap.xml
└── vite.svg
```

---

## 🔧 Deployment Instructions

### **Option 1: Deploy to Vercel (Recommended)**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add URL routing for all city sub-pages"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Connect your GitHub repo
   - Project settings:
     - Framework: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Click "Deploy"

3. **Environment**
   - No environment variables needed
   - Deployment will be live at your Vercel URL

---

### **Option 2: Deploy to Netlify**

1. **Connect Repository**
   - Go to https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repo

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

3. **Configure Redirects**
   Create `netlify.toml` in root:
   ```toml
   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```

---

### **Option 3: Deploy to Traditional Server (Apache/Nginx)**

#### **For Apache:**

Create `.htaccess` in root `dist/` directory:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### **For Nginx:**

Add to server block:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

### **Option 4: Deploy to AWS S3 + CloudFront**

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://mycitypulse-prod
   ```

2. **Upload Build**
   ```bash
   aws s3 sync dist/ s3://mycitypulse-prod/ --delete
   ```

3. **Configure for SPA**
   - Set index.html as default
   - Configure error document (404 → index.html)

4. **Setup CloudFront**
   - Create distribution pointing to S3 bucket
   - Set custom domain (mycitypulse.in)
   - Enable caching for assets

---

### **Option 5: Deploy to Docker**

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:
```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
  }
}
```

Build and run:
```bash
docker build -t mycitypulse .
docker run -p 80:80 mycitypulse
```

---

## 🌐 Production URL Routing

All routes are now fully supported on production:

```
https://www.mycitypulse.in/                      (Home)
https://www.mycitypulse.in/ahmedabad             (City page)
https://www.mycitypulse.in/ahmedabad/health      (City Health)
https://www.mycitypulse.in/ahmedabad/ecosystem   (Civic Ecosystem)
https://www.mycitypulse.in/ahmedabad/issues      (Civic Issues)
https://www.mycitypulse.in/ahmedabad/elections   (Elections)
https://www.mycitypulse.in/ahmedabad/wards       (Wards)
https://www.mycitypulse.in/compare               (Compare mode)
```

---

## ✅ Pre-Deployment Checklist

- [x] Build completes without errors
- [x] All routes are functional
- [x] Assets are optimized (gzipped)
- [x] No console errors in production build
- [x] Bundle size is reasonable
- [x] Code splitting is working
- [ ] Set custom domain (mycitypulse.in)
- [ ] Configure SSL/TLS certificate
- [ ] Setup analytics (if needed)
- [ ] Configure CDN caching headers
- [ ] Setup error tracking (Sentry/Rollbar)
- [ ] Configure backups

---

## 📊 Performance Metrics

- **Main Bundle:** 332 KB (gzipped: 102 KB)
- **CSS Size:** ~14 KB gzipped
- **Module Count:** 64 modules
- **Build Time:** ~8 seconds
- **Image Format:** SVG favicon

---

## 🔒 Security Considerations

1. **HTTPS Only**
   - Always deploy with HTTPS enabled
   - Redirect HTTP to HTTPS

2. **Security Headers**
   Add these headers in your server:
   ```
   X-Content-Type-Options: nosniff
   X-Frame-Options: SAMEORIGIN
   X-XSS-Protection: 1; mode=block
   Referrer-Policy: strict-origin-when-cross-origin
   ```

3. **CSP Headers** (if needed)
   ```
   Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
   ```

---

## 🔄 Continuous Deployment

### **GitHub Actions Example**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 📝 Environment Variables

Currently, no environment variables are required. If you add them:

Create `.env.production`:
```
VITE_API_URL=https://api.mycitypulse.in
VITE_APP_NAME=MyCityPulse
```

---

## 🐛 Troubleshooting

### **Issue: Routes don't work after deployment**
- **Solution:** Ensure server redirects all unknown routes to `index.html`

### **Issue: Assets return 404**
- **Solution:** Check that `dist/` folder is deployed, not source files

### **Issue: CSS/JS not loading**
- **Solution:** Verify CDN/path configuration, clear browser cache

### **Issue: Slow page loads**
- **Solution:** Enable gzip compression on server, setup CDN caching

---

## 📞 Support

For deployment issues:
1. Check the framework-specific deployment docs (Vite, React)
2. Verify all files are in `dist/` folder
3. Test routing with browser dev tools
4. Check server logs for errors

---

## ✨ Summary

The application is **production-ready** with:
- ✅ Full URL routing for all pages and panels
- ✅ Optimized bundle size
- ✅ Proper asset splitting
- ✅ SEO metadata support
- ✅ Browser history support
- ✅ Shareable URLs

**Ready to deploy! 🚀**
