interface Image {
  id: string;
  src: string;
  alt: string;
}

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  department: string;
  images: Image[];
}

export type { GalleryItem, Image };
