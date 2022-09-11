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
  // Index of the kanji for display. index = 0 means the kanji is a repeat (text order sort only).
  index: number;
  // Number of occurrences in the text
  occurrences: number;
  // true = filtered (include the kanji in the list)
  filtered: boolean;
  // true = is in the input
  inInput: boolean;
  // true = is in the kanji list
  // inList: boolean;
}

// Interface for the text order sort
export interface IKanjiMin {
  // Index of the kanji for accessing its data in kanjiData
  i: number;
  // Whether or not the kanji is a repeat (used for setting indices)
  repeat: boolean;
}

// Interface for the kanji only output
export interface IKanjiOnly {
  sorted: string;
  unsorted: string;
}
