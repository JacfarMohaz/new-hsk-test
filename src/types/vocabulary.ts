export type RawWord = [hanzi: string, pinyin: string, pos: string, english: string];

export interface RawLesson {
  id: number;
  title_zh: string;
  title_en: string;
  words: RawWord[];
}

export interface RawVocabularyFile {
  _schema?: string;
  lessons: RawLesson[];
}

export interface Word {
  hanzi: string;
  pinyin: string;
  pos: string;
  en: string;
  lessonId: number;
}

export interface Lesson {
  id: number;
  titleZh: string;
  titleEn: string;
  words: Word[];
}
