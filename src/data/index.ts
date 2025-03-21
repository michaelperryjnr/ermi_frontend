import { events } from "./events";
import { blogPosts } from "./blog";
import { XMLParser } from "fast-xml-parser";
import { getSermonById, getRelatedSermons, getAllSermons } from "./sermons";
import {
  getDevotionalById,
  getFilteredDevotionals,
  getLatestDevotional,
  devotionals,
} from "./devotionals";

// Initialize the XML parser
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  textNodeName: "text",
  preserveOrder: true,
});

// Utility function to fix missing spaces between words
function fixMissingSpaces(text: string): string {
  return text
    .replace(/(<[^>]+>)/g, " $1 ") // Add spaces around tags
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim(); // Trim leading and trailing spaces
}

// Define a more comprehensive book abbreviation mapping
const bookNameMapping: Record<string, string> = {
  // Old Testament (Numeric mappings)
  "1": "Genesis",
  "2": "Exodus",
  "3": "Leviticus",
  "4": "Numbers",
  "5": "Deuteronomy",
  "6": "Joshua",
  "7": "Judges",
  "8": "Ruth",
  "9": "1 Samuel",
  "10": "2 Samuel",
  "11": "1 Kings",
  "12": "2 Kings",
  "13": "1 Chronicles",
  "14": "2 Chronicles",
  "15": "Ezra",
  "16": "Nehemiah",
  "17": "Esther",
  "18": "Job",
  "19": "Psalms",
  "20": "Proverbs",
  "21": "Ecclesiastes",
  "22": "Song of Solomon",
  "23": "Isaiah",
  "24": "Jeremiah",
  "25": "Lamentations",
  "26": "Ezekiel",
  "27": "Daniel",
  "28": "Hosea",
  "29": "Joel",
  "30": "Amos",
  "31": "Obadiah",
  "32": "Jonah",
  "33": "Micah",
  "34": "Nahum",
  "35": "Habakkuk",
  "36": "Zephaniah",
  "37": "Haggai",
  "38": "Zechariah",
  "39": "Malachi",

  // New Testament (Numeric mappings)
  "40": "Matthew",
  "41": "Mark",
  "42": "Luke",
  "43": "John",
  "44": "Acts",
  "45": "Romans",
  "46": "1 Corinthians",
  "47": "2 Corinthians",
  "48": "Galatians",
  "49": "Ephesians",
  "50": "Philippians",
  "51": "Colossians",
  "52": "1 Thessalonians",
  "53": "2 Thessalonians",
  "54": "1 Timothy",
  "55": "2 Timothy",
  "56": "Titus",
  "57": "Philemon",
  "58": "Hebrews",
  "59": "James",
  "60": "1 Peter",
  "61": "2 Peter",
  "62": "1 John",
  "63": "2 John",
  "64": "3 John",
  "65": "Jude",
  "66": "Revelation",

  // Old Testament (Abbreviations)
  GEN: "Genesis",
  GENESIS: "Genesis",
  GE: "Genesis",
  Gen: "Genesis",
  EXO: "Exodus",
  EXODUS: "Exodus",
  EX: "Exodus",
  Exo: "Exodus",
  LEV: "Leviticus",
  LEVITICUS: "Leviticus",
  LE: "Leviticus",
  Lev: "Leviticus",
  NUM: "Numbers",
  NUMBERS: "Numbers",
  NU: "Numbers",
  Num: "Numbers",
  DEU: "Deuteronomy",
  DEUTERONOMY: "Deuteronomy",
  DE: "Deuteronomy",
  Deu: "Deuteronomy",
  JOS: "Joshua",
  JOSHUA: "Joshua",
  Jos: "Joshua",
  JDG: "Judges",
  JUDGES: "Judges",
  JUD: "Judges",
  Jud: "Judges",
  RUT: "Ruth",
  RUTH: "Ruth",
  Ruth: "Ruth",
  "1SA": "1 Samuel",
  "1SAM": "1 Samuel",
  "1SAMUEL": "1 Samuel",
  "1Sa": "1 Samuel",
  "2SA": "2 Samuel",
  "2SAM": "2 Samuel",
  "2SAMUEL": "2 Samuel",
  "2Sa": "2 Samuel",
  "1KI": "1 Kings",
  "1KIN": "1 Kings",
  "1KINGS": "1 Kings",
  "1Ki": "1 Kings",
  "1Kgs": "1 Kings",
  "1KGS": "1 Kings",
  "2KI": "2 Kings",
  "2KIN": "2 Kings",
  "2KINGS": "2 Kings",
  "2Ki": "2 Kings",
  "2Kgs": "2 Kings",
  "2KGS": "2 Kings",
  "1CH": "1 Chronicles",
  "1CHR": "1 Chronicles",
  "1CHRONICLES": "1 Chronicles",
  "1Ch": "1 Chronicles",
  "2CH": "2 Chronicles",
  "2CHR": "2 Chronicles",
  "2CHRONICLES": "2 Chronicles",
  "2Ch": "2 Chronicles",
  EZR: "Ezra",
  EZRA: "Ezra",
  Ezr: "Ezra",
  NEH: "Nehemiah",
  NEHEMIAH: "Nehemiah",
  Ne: "Nehemiah",
  Neh: "Nehemiah",
  EST: "Esther",
  ESTHER: "Esther",
  Es: "Esther",
  Est: "Esther",
  JOB: "Job",
  Job: "Job",
  PSA: "Psalms",
  PSALM: "Psalms",
  PSALMS: "Psalms",
  PS: "Psalms",
  Psa: "Psalms",
  PRO: "Proverbs",
  PROVERBS: "Proverbs",
  PR: "Proverbs",
  Pro: "Proverbs",
  ECC: "Ecclesiastes",
  ECCLESIASTES: "Ecclesiastes",
  EC: "Ecclesiastes",
  Ecc: "Ecclesiastes",
  SON: "Song of Solomon",
  SONG: "Song of Solomon",
  SONGOFSOLOMON: "Song of Solomon",
  SOS: "Song of Solomon",
  Son: "Song of Solomon",
  ISA: "Isaiah",
  ISAIAH: "Isaiah",
  IS: "Isaiah",
  Isa: "Isaiah",
  JER: "Jeremiah",
  JEREMIAH: "Jeremiah",
  JE: "Jeremiah",
  Jer: "Jeremiah",
  LAM: "Lamentations",
  LAMENTATIONS: "Lamentations",
  LA: "Lamentations",
  Lam: "Lamentations",
  EZE: "Ezekiel",
  EZEKIEL: "Ezekiel",
  EZK: "Ezekiel",
  Eze: "Ezekiel",
  DAN: "Daniel",
  DANIEL: "Daniel",
  DA: "Daniel",
  Dan: "Daniel",
  HOS: "Hosea",
  HOSEA: "Hosea",
  HO: "Hosea",
  Hos: "Hosea",
  JOE: "Joel",
  JOEL: "Joel",
  Joe: "Joel",
  AMO: "Amos",
  AMOS: "Amos",
  AM: "Amos",
  Amo: "Amos",
  OBA: "Obadiah",
  OBADIAH: "Obadiah",
  OB: "Obadiah",
  Oba: "Obadiah",
  JON: "Jonah",
  JONAH: "Jonah",
  Jon: "Jonah",
  MIC: "Micah",
  MICAH: "Micah",
  MI: "Micah",
  Mic: "Micah",
  NAH: "Nahum",
  NAHUM: "Nahum",
  NA: "Nahum",
  Nah: "Nahum",
  HAB: "Habakkuk",
  HABAKKUK: "Habakkuk",
  Hab: "Habakkuk",
  ZEP: "Zephaniah",
  ZEPHANIAH: "Zephaniah",
  Zep: "Zephaniah",
  HAG: "Haggai",
  HAGGAI: "Haggai",
  Hag: "Haggai",
  ZEC: "Zechariah",
  ZECHARIAH: "Zechariah",
  Zec: "Zechariah",
  MAL: "Malachi",
  MALACHI: "Malachi",
  Mal: "Malachi",

  // New Testament (Abbreviations)
  MAT: "Matthew",
  MATTHEW: "Matthew",
  MT: "Matthew",
  Mat: "Matthew",
  MAR: "Mark",
  MARK: "Mark",
  MK: "Mark",
  Mar: "Mark",
  LUK: "Luke",
  LUKE: "Luke",
  LK: "Luke",
  Luk: "Luke",
  JOH: "John",
  JOHN: "John",
  JN: "John",
  Joh: "John",
  ACT: "Acts",
  ACTS: "Acts",
  AC: "Acts",
  Act: "Acts",
  ROM: "Romans",
  ROMANS: "Romans",
  RO: "Romans",
  Rom: "Romans",
  "1CO": "1 Corinthians",
  "1COR": "1 Corinthians",
  "1CORINTHIANS": "1 Corinthians",
  "1Co": "1 Corinthians",
  "2CO": "2 Corinthians",
  "2COR": "2 Corinthians",
  "2CORINTHIANS": "2 Corinthians",
  "2Co": "2 Corinthians",
  GAL: "Galatians",
  GALATIANS: "Galatians",
  GA: "Galatians",
  Gal: "Galatians",
  EPH: "Ephesians",
  EPHESIANS: "Ephesians",
  Eph: "Ephesians",
  PHP: "Philippians",
  PHILIPPIANS: "Philippians",
  Php: "Philippians",
  COL: "Colossians",
  COLOSSIANS: "Colossians",
  Col: "Colossians",
  "1TH": "1 Thessalonians",
  "1THESS": "1 Thessalonians",
  "1THESSALONIANS": "1 Thessalonians",
  "1Th": "1 Thessalonians",
  "2TH": "2 Thessalonians",
  "2THESS": "2 Thessalonians",
  "2THESSALONIANS": "2 Thessalonians",
  "2Th": "2 Thessalonians",
  "1TI": "1 Timothy",
  "1TIM": "1 Timothy",
  "1TIMOTHY": "1 Timothy",
  "1Ti": "1 Timothy",
  "2TI": "2 Timothy",
  "2TIM": "2 Timothy",
  "2TIMOTHY": "2 Timothy",
  "2Ti": "2 Timothy",
  TIT: "Titus",
  TITUS: "Titus",
  TI: "Titus",
  Tit: "Titus",
  PHM: "Philemon",
  PHLM: "Philemon",
  Phlm: "Philemon",
  PHILEMON: "Philemon",
  Phm: "Philemon",
  HEB: "Hebrews",
  HEBREWS: "Hebrews",
  HE: "Hebrews",
  Heb: "Hebrews",
  JAM: "James",
  JAMES: "James",
  JA: "James",
  Jam: "James",
  "1PE": "1 Peter",
  "1PET": "1 Peter",
  "1PETER": "1 Peter",
  "1Pe": "1 Peter",
  "2PE": "2 Peter",
  "2PET": "2 Peter",
  "2PETER": "2 Peter",
  "2Pe": "2 Peter",
  "1JO": "1 John",
  "1JN": "1 John",
  "1JOHN": "1 John",
  "1Jo": "1 John",
  "2JO": "2 John",
  "2JN": "2 John",
  "2JOHN": "2 John",
  "2Jo": "2 John",
  "3JO": "3 John",
  "3JN": "3 John",
  "3JOHN": "3 John",
  "3Jo": "3 John",
  JUDE: "Jude",
  Jude: "Jude",
  REV: "Revelation",
  REVELATION: "Revelation",
  RE: "Revelation",
  Rev: "Revelation",
};

// Function to find the book name from various possible abbreviations
function getBookName(abbr: string): string {
  const normalizedAbbr = abbr.replace(/\s+/g, "").replace(/^(\d+)/, "$1");
  const upperAbbr = normalizedAbbr.toUpperCase();

  if (bookNameMapping[upperAbbr]) {
    return bookNameMapping[upperAbbr];
  }

  for (const [key, value] of Object.entries(bookNameMapping)) {
    if (key.includes(upperAbbr) || upperAbbr.includes(key)) {
      return value;
    }
  }

  console.warn(`Unknown book abbreviation: ${abbr}`);
  return abbr;
}

// Interface for parsed Bible data
interface ParsedBible {
  bibleBooks: {
    id: string;
    name: string;
    chapters: number;
  }[];
  allVerses: {
    bookId: string;
    bookName: string;
    chapter: number;
    verse: number;
    text: string;
    id: string;
  }[];
}

// Load and parse a Bible translation from an XML file.
async function loadBible(bibleFile: string): Promise<ParsedBible | null> {
  try {
    const response = await fetch(bibleFile);
    const xmlText = await response.text();

    console.log(parser.parse(xmlText));

    const parsedData = parser.parse(xmlText)[0];

    if (!Array.isArray(parsedData.bible)) {
      throw new Error("Invalid Bible XML structure");
    }

    const bible = Array.isArray(parsedData.bible)
      ? parsedData.bible
      : [parsedData.bible];

    const books = bible.map((instance: any) => {
      const bookId = instance[":@"].num || instance.id || instance.abbr || "";
      const bookName = getBookName(bookId);
      const chapters = Array.isArray(instance.book)
        ? instance.book
        : [instance.book];

      return {
        id: bookId,
        name: bookName,
        chapters: chapters.length,
      };
    });

    const allVerses: {
      bookId: string;
      bookName: string;
      chapter: number;
      verse: number;
      text: string;
      id: string;
    }[] = [];

    bible.forEach((instance: any) => {
      if (instance === null || instance === undefined) {
        console.log(instance);
      }
      const bookId = instance[":@"].num || instance.id || instance.abbr || "";
      const bookName = getBookName(bookId);

      const chapters = Array.isArray(instance.book)
        ? instance.book
        : [instance.book];

      chapters.forEach((instance: any, instanceIndex: number) => {
        if (!instance) return;

        const chapterNum = instance[":@"].num || instanceIndex + 1;

        const verses = Array.isArray(instance.chapter)
          ? instance.chapter
          : [instance.chapter];

        verses.forEach((instance: any, instanceIndex: number) => {
          if (!instance) return;

          let verseNum: number;
          let verseText: string = "";

          verseNum = parseInt(
            instance[":@"]?.num || (instanceIndex + 1).toString(),
            10
          );

          // If instance.verse is an array with multiple elements
          if (instance.verse && Array.isArray(instance.verse)) {
            // Concatenate all text from all verse elements
            verseText = instance.verse
              .map((verseElement: any) => {
                // Case 1: If verseElement has direct text
                if (verseElement.text) {
                  return verseElement.text;
                }
                // Case 2: If verseElement has nested elements like 'i'
                else if (verseElement.i && Array.isArray(verseElement.i)) {
                  return verseElement.i
                    .map((item: any) => item.text || "")
                    .join(" ");
                }
                // Case 3: If verseElement has span
                else if (
                  verseElement.span &&
                  Array.isArray(verseElement.span)
                ) {
                  return verseElement.span
                    .map((span: any) => span.text || "")
                    .join(" ");
                }
                return "";
              })
              .join(" ");
          }
          // Fallback to direct text if available
          else if (instance.text) {
            verseText = instance.text;
          }

          // If still no text found, log the instance
          if (!verseText) {
            console.log("No text found for verse:", instance);
          }

          const verseId = `${bookId}-${chapterNum}-${verseNum}`;

          allVerses.push({
            bookId,
            bookName,
            chapter: chapterNum,
            verse: verseNum,
            text: verseText,
            id: verseId,
          });
        });
      });
    });

    return {
      bibleBooks: books,
      allVerses,
    };
  } catch (error) {
    console.error(
      `Error loading or parsing the Bible file (${bibleFile}):`,
      error
    );
    return null;
  }
}

// Load the KJV Bible asynchronously
const kjvBiblePromise = loadBible("./kjv.xml");

interface BibleTranslation {
  get(): Promise<ParsedBible | null>;
}

interface BibleCollection {
  [translationKey: string]: BibleTranslation;
}

interface IData {
  events: Array<any>;
  blogPosts: Array<any>;
  devotionals: Array<any>;
  bibles: BibleCollection;
}
const Data: IData = {
  events,
  blogPosts,
  devotionals,
  bibles: {
    kjv: {
      async get() {
        return await kjvBiblePromise;
      },
    },
  },
};

export {
  getRelatedSermons,
  getSermonById,
  getAllSermons,
  getDevotionalById,
  getFilteredDevotionals,
  getLatestDevotional,
};

export default Data;
