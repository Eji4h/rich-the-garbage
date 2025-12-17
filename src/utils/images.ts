const imageImports = import.meta.glob('/src/assets/gallery/*.{jpg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

export const galleryImages = Object.values(imageImports) as string[];

