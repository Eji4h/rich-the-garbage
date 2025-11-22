const imageImports = import.meta.glob('/src/assets/20240420/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default'
});

export const galleryImages = Object.values(imageImports) as string[];
