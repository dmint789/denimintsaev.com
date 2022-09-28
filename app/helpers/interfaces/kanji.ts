// Interface representing a kanji as it's stored in the DB
export interface IKanjiDB {
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

// Interface for a kanji in the results
export interface IKanji extends IKanjiDB {
  // Index of the kanji for display. index = 0 means the kanji is a repeat (text order sort only).
  index: number;
  // Number of occurrences in the text.
  occurrences: number;
}

// Interface for a kanji in the list
export interface IKanjiListEntry extends IKanjiDB {
  // Index of the kanji for display. index = 0 means the kanji is a repeat (text order sort only).
  index: number;
  // Date of when the kanji was added to the list
  dateAdded: Date;
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
