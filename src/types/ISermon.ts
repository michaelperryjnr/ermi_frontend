import { StaticImageData } from "next/image";

interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  scripture: string;
  duration: string;
  image: string | StaticImageData;
}

export type { Sermon };
