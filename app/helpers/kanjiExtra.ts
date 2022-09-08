// Additional data about kanji that is not in the kanjiData file
export class KanjiExtra {
  // Number of occurrences in the text
  occurrences: number;
  // true = filtered (include the kanji in the list)
  filtered: boolean;
  // true = is in the kanji list
  inList: boolean;

  constructor() {
    this.occurrences = 0;
    this.filtered = true;
    this.inList = false;
  }
}
