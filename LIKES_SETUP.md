# Like Button Setup Instructions

## Local Development

The like button will work in local development, but likes won't persist because KV storage requires Cloudflare infrastructure. The UI will still function with optimistic updates.

## Cloudflare Pages Deployment

### 1. Create KV Namespace

First, create a KV namespace for storing likes:

```bash
# Create production KV namespace
npx wrangler kv:namespace create "LIKES_KV"

# Create preview KV namespace (for previews)
npx wrangler kv:namespace create "LIKES_KV" --preview
```

This will output namespace IDs like:
```
{ binding = "LIKES_KV", id = "abc123..." }
{ binding = "LIKES_KV", preview_id = "xyz789..." }
```

### 2. Update wrangler.jsonc

Replace the `preview_id` in `wrangler.jsonc` with your actual namespace IDs:

```jsonc
{
  "name": "rich-the-garbage",
  "compatibility_date": "2024-11-22",
  "assets": {
    "directory": "./dist"
  },
  "kv_namespaces": [
    {
      "binding": "LIKES_KV",
      "id": "YOUR_PRODUCTION_ID",
      "preview_id": "YOUR_PREVIEW_ID"
    }
  ]
}
```

### 3. Configure Cloudflare Pages

In your Cloudflare Pages dashboard:

1. Go to your project settings
2. Navigate to **Settings** → **Functions**
3. Add KV namespace binding:
   - Variable name: `LIKES_KV`
   - KV namespace: Select the namespace you created

### 4. Deploy

```bash
pnpm run build
```

Then deploy via Cloudflare Pages dashboard or use Wrangler:

```bash
npx wrangler pages deploy dist
```

## Features

- ❤️ Animated heart icon with smooth transitions
- 📊 Real-time like counts stored in Cloudflare KV
- ⚡ Optimistic UI updates for instant feedback
- 💾 Persistent likes across sessions
- 🔄 Automatic rollback on errors
- 🎨 Beautiful pastel-themed design matching your gallery

## How It Works

1. **Like Button Component**: Displays heart icon and count
2. **Local Storage**: Tracks which images user has liked
3. **Cloudflare KV**: Stores global like counts
4. **API Endpoints**: Handle GET/POST/DELETE operations
5. **Optimistic Updates**: UI updates immediately, syncs with server
