import { StaticImageData } from "next/image";

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  scripture: string;
  duration: string;
  videoUrl?: string;
  image?: string | StaticImageData;
  views?: number;
}
