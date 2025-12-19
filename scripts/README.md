# Scripts

## generate-assets.ts

Automatically generates TypeScript files that list all images and videos from the `public/` directory.

### What it does

- Scans `public/videos/` for video files (`.mp4`, `.webm`, `.ogg`)
- Scans `public/gallery/` for image files (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`)
- Generates `src/utils/videos.ts` and `src/utils/images.ts` with sorted arrays of file paths

### Usage

```bash
pnpm generate:assets
```

### When to run

- **Automatically**: Runs before `pnpm build` (via `prebuild` hook)
- **Manually**: Run after adding new images or videos to the `public/` directories

### Adding new assets

1. Add your image files to `public/gallery/`
2. Add your video files to `public/videos/`
3. Run `pnpm generate:assets` to update the TypeScript files
4. The new assets will automatically appear in your gallery/carousel

### Note

The generated files (`src/utils/videos.ts` and `src/utils/images.ts`) are auto-generated. Do not edit them manually - your changes will be overwritten the next time you run the script.
