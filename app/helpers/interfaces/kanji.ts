export interface IKanji {
  // Character
  c: string;
  // Stroke count
  s: number;
  // All possible stroke counts
  a: string;
  // JLPT level
  n: number;
  // Frequency of use in newspapers
  p: number;
  // Frequency of use in novels
  v: number;
  // JOYO list (1 = true)
  y: number;
}
