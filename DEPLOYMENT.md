# Cloudflare Pages Deployment Guide

## Prerequisites

- Node.js 18+
- pnpm
- Cloudflare account

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Create KV Namespace

สร้าง KV namespace สำหรับเก็บข้อมูล likes:

```bash
# สร้าง production KV namespace
pnpm run cf:kv:create

# สร้าง preview KV namespace
pnpm run cf:kv:create:preview
```

จะได้ output แบบนี้:
```
{ binding = "LIKES_KV", id = "abc123..." }
{ binding = "LIKES_KV", preview_id = "xyz789..." }
```

### 3. Update wrangler.jsonc

นำ ID ที่ได้มาใส่ใน `wrangler.jsonc`:

```jsonc
{
  "name": "rich-the-garbage",
  "compatibility_date": "2024-11-22",
  "assets": {
    "directory": "./dist"
  },
  "pages_build_output_dir": "./dist",
  "kv_namespaces": [
    {
      "binding": "LIKES_KV",
      "id": "YOUR_PRODUCTION_ID",      // <-- ใส่ id ตรงนี้
      "preview_id": "YOUR_PREVIEW_ID"  // <-- ใส่ preview_id ตรงนี้
    }
  ]
}
```

### 4. Deploy

```bash
pnpm run pages:deploy
```

## Local Development

### Standard Development (without API)

```bash
pnpm run dev
```

Like button จะใช้ localStorage ในโหมด dev

### Development with Cloudflare Functions

ถ้าต้องการทดสอบ API จริงๆ:

```bash
# Build first
pnpm run build

# Run with wrangler
pnpm run pages:dev
```

## Scripts Reference

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start dev server (localhost:8080) |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm pages:dev` | Test with Cloudflare Functions locally |
| `pnpm pages:deploy` | Build and deploy to Cloudflare Pages |
| `pnpm cf:kv:create` | Create production KV namespace |
| `pnpm cf:kv:create:preview` | Create preview KV namespace |

## Cloudflare Pages Dashboard Setup

หาก deploy ผ่าน Cloudflare Dashboard (Git integration):

### Build Settings

- **Build command:** `pnpm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (or your project path)

### Environment Variables

ไม่จำเป็นต้องตั้ง environment variables เพิ่มเติม

### Functions KV Binding

1. ไปที่ **Settings** → **Functions** → **KV namespace bindings**
2. เพิ่ม binding:
   - **Variable name:** `LIKES_KV`
   - **KV namespace:** เลือก namespace ที่สร้างไว้

## Project Structure

```
rich-the-garbage/
├── dist/                    # Build output
├── functions/
│   └── api/
│       └── likes/
│           └── [imageId].ts # Like API endpoint
├── src/
│   ├── assets/
│   │   └── gallery/         # Gallery images
│   ├── components/          # React components
│   ├── utils/
│   │   ├── images.ts        # Image loader
│   │   └── likeApi.ts       # Like API client
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── wrangler.jsonc           # Cloudflare config
└── package.json
```

## Features

- ✨ Beautiful animated gallery
- ❤️ Like button with real-time counts
- 🌈 Floating garbage icons animation
- 📱 Responsive design
- ⚡ Fast Cloudflare CDN
- 🔒 Cloudflare KV for persistent storage

## Troubleshooting

### Like counts not persisting

1. ตรวจสอบว่า KV namespace binding ถูกต้อง
2. ตรวจสอบ wrangler.jsonc มี id และ preview_id ที่ถูกต้อง

### Build errors

```bash
# Clear cache and rebuild
rm -rf dist node_modules/.vite
pnpm run build
```

### API returns 404

ตรวจสอบว่า functions folder structure ถูกต้อง:
```
functions/api/likes/[imageId].ts
```

