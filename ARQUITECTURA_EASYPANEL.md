# 🏗️ Arquitectura de Deploy en EasyPanel

## 📊 Flujo de Build

```
┌─────────────────────────────────────────────────────────────────┐
│                        EASYPANEL BUILD                          │
└─────────────────────────────────────────────────────────────────┘

1️⃣ Git Clone
   ├── Clona repositorio
   └── Checkout branch especificada

2️⃣ Docker Build (Multi-stage)
   │
   ├── STAGE 1: Builder (node:20-alpine)
   │   ├── Copia package.json y packages/
   │   ├── npm ci (instala dependencias)
   │   ├── Copia archivos fuente
   │   ├── npm run build
   │   └── Genera /app/dist/
   │
   └── STAGE 2: Production (nginx:alpine)
       ├── Copia nginx.conf
       ├── Copia dist/ desde builder
       ├── Expone puerto 80
       └── CMD: nginx -g "daemon off;"

3️⃣ Container Start
   ├── Nginx inicia en puerto 80
   ├── Health check: GET /health
   └── Ready! ✅
```

## 🗂️ Estructura de Archivos

```
nexus-fluent/
├── 📄 Dockerfile              ← Build configuration
├── 📄 nginx.conf             ← Web server config
├── 📄 .dockerignore          ← Exclude files from build
├── 📄 .easypanel             ← EasyPanel metadata
├── 📄 package.json           ← Dependencies
├── 📄 vite.config.ts         ← Build tool config
├── 📄 index.html             ← Entry point
├── 📁 src/                   ← Source code
│   ├── App.tsx
│   ├── components/
│   ├── lib/
│   └── hooks/
├── 📁 packages/              ← Workspace packages
└── 📁 dist/                  ← Build output (generated)
    ├── index.html
    ├── assets/
    │   ├── index-[hash].js
    │   ├── index-[hash].css
    │   └── ...
    └── health                ← Health check file
```

## 🔄 Request Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ HTTP Request
     ▼
┌────────────────┐
│   EasyPanel    │
│  Load Balancer │
└────┬───────────┘
     │
     │ Port 80
     ▼
┌────────────────┐
│     Nginx      │
│   Container    │
└────┬───────────┘
     │
     ├── /health ─────► 200 OK (health check)
     │
     ├── /assets/* ───► Cached static files
     │                  (1 year cache)
     │
     └── /* ──────────► index.html
                        (SPA fallback)
```

## 🔐 Nginx Configuration

```
┌─────────────────────────────────────────────────────┐
│                  NGINX RULES                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📍 Location: /                                     │
│     ├── try_files $uri $uri/ /index.html           │
│     └── Cache-Control: no-cache                    │
│                                                     │
│  📍 Location: /health                               │
│     ├── return 200 "OK"                            │
│     └── Content-Type: text/plain                   │
│                                                     │
│  📍 Location: ~ \.(js|css|png|jpg|...)$            │
│     ├── expires 1y                                 │
│     └── Cache-Control: public, immutable           │
│                                                     │
│  🔒 Security Headers:                               │
│     ├── X-Frame-Options: DENY                      │
│     ├── X-Content-Type-Options: nosniff            │
│     ├── X-XSS-Protection: 1; mode=block            │
│     └── Content-Security-Policy: ...               │
│                                                     │
│  🗜️ Compression:                                    │
│     ├── gzip on                                    │
│     ├── gzip_types: text/plain, text/css, ...     │
│     └── gzip_comp_level: 6                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 🎯 Health Check

```
┌──────────────────────────────────────────┐
│         HEALTH CHECK FLOW                │
└──────────────────────────────────────────┘

Every 30 seconds:

EasyPanel ──GET /health──► Nginx
                            │
                            ├── Returns "OK"
                            └── Status 200

✅ Healthy:   Container running
❌ Unhealthy: Container restarted
```

## 📦 Docker Layers

```
Layer 1: nginx:alpine (base image)
   ↓
Layer 2: + nginx.conf
   ↓
Layer 3: + dist/ (built app)
   ↓
Layer 4: + health endpoint
   ↓
Final Image: ~50MB (optimized)
```

## 🚀 Deployment Options

### Option 1: Manual Deploy
```
EasyPanel Dashboard
  → Your Project
    → Your App
      → Click "Redeploy"
```

### Option 2: Automatic Deploy (Webhook)
```
Git Push
  ↓
GitHub/GitLab Webhook
  ↓
EasyPanel receives notification
  ↓
Automatic rebuild & deploy
```

### Option 3: CLI (if available)
```bash
easypanel deploy nexus-fluent
```

## 🔍 Troubleshooting Flow

```
┌──────────────────────────────────────────┐
│       DEPLOYMENT FAILED?                 │
└──────────────────────────────────────────┘

Check Build Logs
  ├── npm ci failed?
  │   └── Check package.json dependencies
  │
  ├── npm run build failed?
  │   └── Check source code for errors
  │
  └── Docker build failed?
      └── Check Dockerfile syntax

Check Runtime Logs
  ├── Nginx failed to start?
  │   └── Check nginx.conf syntax
  │
  ├── Health check failing?
  │   └── Check /health endpoint
  │
  └── App not responding?
      └── Check port configuration (should be 80)

Check Resources
  ├── Out of memory?
  │   └── Increase memory allocation
  │
  └── High CPU usage?
      └── Check for infinite loops or heavy computation
```

## 📊 Monitoring

```
┌─────────────────────────────────────────────────────┐
│               EASYPANEL METRICS                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📈 CPU Usage:        [====      ] 40%              │
│  💾 Memory Usage:     [======    ] 512Mi / 768Mi    │
│  🌐 Network In:       1.2 MB/s                      │
│  🌐 Network Out:      850 KB/s                      │
│  📊 Request Count:    1,234 req/min                 │
│  ⏱️  Response Time:    45ms avg                      │
│  ✅ Health Status:     Healthy                       │
│  🔄 Uptime:           7d 14h 23m                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 🎓 Best Practices

### ✅ DO:
- Use Dockerfile method for full control
- Configure health check endpoint
- Set appropriate resource limits
- Enable automatic deployments
- Monitor logs regularly
- Use environment variables for config

### ❌ DON'T:
- Commit node_modules to git
- Hardcode secrets in code
- Use development server in production
- Ignore health check failures
- Deploy without testing locally first
- Set resource limits too low

## 📝 Configuration Checklist

```
✅ Dockerfile exists and is valid
✅ nginx.conf properly configured
✅ .dockerignore includes node_modules, .git, dist
✅ .easypanel has correct metadata
✅ package.json has build script
✅ Health check endpoint at /health
✅ Port 80 exposed in Dockerfile
✅ SPA fallback configured in nginx
✅ Static assets cached appropriately
✅ Security headers configured
✅ Gzip compression enabled
✅ Resource limits set (768Mi RAM, 0.5 CPU)
```

---

**Nota**: Esta arquitectura está optimizada para aplicaciones React/Vite SPA servidas con Nginx.
