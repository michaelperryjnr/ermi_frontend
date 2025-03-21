export interface Devotional {
  id: number;
  title: string;
  date: string;
  verse: string;
  verseText: string;
  content: string;
  author: string;
  categories?: string[];
  quote?: {
    text: string;
    author: string;
    source?: string;
  };
  relatedScriptures?: string[];
  prayerPoints?: string[];
}
