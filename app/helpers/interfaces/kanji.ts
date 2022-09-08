export interface IKanji {
  // Character
  c: string;
  // Stroke count
  s: number;
  // All possible stroke counts
  a: string;
  // Frequency of use in newspapers
  p: number;
  // Frequency of use in novels
  v: number;
  // JLPT level
  n: number;
  // JOYO list (1 = true)
  y: number;
}

// Extended kanji interface
export interface IKanjiExt extends IKanji {
  // Number of occurrences in the text
  occurrences: number;
}
