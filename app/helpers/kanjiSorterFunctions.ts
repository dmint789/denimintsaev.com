import { IKanji } from '~/helpers/interfaces/kanji';
import { SortType } from '~/helpers/enums/sortType';
import { FilterType } from '~/helpers/enums/filterType';

export function listContainsKanji(list: Array<IKanji>, kanji: IKanji): boolean {
  for (let i of list) {
    if (i.c === kanji.c) return true;
  }

  return false;
}

// Gets the appropriate compare function according to the given sort type
// < 0 means a goes before b, > 0 means a goes after b, 0 means they are the same
export function getCompareFunc(kanjiData: Array<any>, sortType: SortType): (a: number, b: number) => number {
  switch (sortType) {
    case SortType.Occurrences:
      return (a: number, b: number): number => {
        return kanjiData[b].occurrences - kanjiData[a].occurrences;
      };
    case SortType.Newspapers:
      return (a: number, b: number): number => {
        return kanjiData[a].p - kanjiData[b].p;
      };
    case SortType.Novels:
      return (a: number, b: number): number => {
        return kanjiData[a].v - kanjiData[b].v;
      };
    case SortType.StrokeCount:
      return (a: number, b: number): number => {
        return kanjiData[b].s - kanjiData[a].s;
      };
    case SortType.JLPT:
      return (a: number, b: number): number => {
        return kanjiData[a].n - kanjiData[b].n;
      };
    default:
      throw `Unable to retrieve compare function for sort type ${sortType}`;
  }
}

export function isSortable(kanji: IKanji, sortType: SortType): boolean {
  switch (sortType) {
    case SortType.Newspapers:
      return !!kanji.p;
    case SortType.Novels:
      return !!kanji.v;
    case SortType.StrokeCount:
      return !!kanji.s;
    case SortType.JLPT:
      return !!kanji.n;
    default:
      throw `Unable to check sortability for kanji; sort type: ${sortType}`;
  }
}

// Returns true if the kanji passes the filter
export function isInFilter(kanji: IKanji, filterType: FilterType, negative: boolean): boolean {
  let output: boolean;

  switch (filterType) {
    case FilterType.None:
      return true;
    case FilterType.Joyo:
      output = kanji.y === 1;
      break;
    case FilterType.N5:
      output = kanji.n === 5;
      break;
    case FilterType.N4:
      output = kanji.n === 4;
      break;
    case FilterType.N3:
      output = kanji.n === 3;
      break;
    case FilterType.N2:
      output = kanji.n === 2;
      break;
    case FilterType.N1:
      output = kanji.n === 1;
      break;
    case FilterType.List:
      output = false;
      break;
    default:
      throw `Unable to check if kanji passes filter; filter type: ${filterType}`;
  }

  output = negative ? !output : output;
  return output;
}

// Returns the hash id for the input character if it is a kanji.
// Otherwise returns null.
export function hash(character: string): number | null {
  if (character.length === 1) {
    let id = character.charCodeAt(0);

    if (id < 19894) {
      if (id <= 13311) return null;
      id -= 13312;
    } else if (id < 40880) {
      if (id <= 19967) return null;
      id -= 13386;
    } else if (id < 63774) {
      if (id <= 63772) return null;
      id -= 36279;
    } else if (id < 63786) {
      if (id <= 63783) return null;
      id -= 36289;
    } else if (id < 63799) {
      if (id <= 63797) return null;
      id -= 36301;
    } else if (id < 63857) {
      if (id <= 63855) return null;
      id -= 36358;
    } else if (id < 63953) {
      if (id <= 63951) return null;
      id -= 36453;
    } else if (id < 63965) {
      if (id <= 63963) return null;
      id -= 36464;
    } else if (id < 64018) {
      if (id <= 64014) return null;
      id -= 36514;
    } else if (id < 64023) {
      if (id <= 64018) return null;
      id -= 36515;
    } else if (id < 64028) {
      if (id <= 64024) return null;
      id -= 36517;
    } else if (id < 64035) {
      if (id <= 64030) return null;
      id -= 36520;
    } else if (id < 64037) {
      if (id <= 64035) return null;
      id -= 36521;
    } else if (id < 64039) {
      if (id <= 64037) return null;
      id -= 36522;
    } else {
      if (id <= 64047) return null;
      id -= 36531;
    }

    return id;
  } else {
    throw 'Input for the hash function is not a single character!';
  }
}

// Kanji gaps in Unicode (all indices inclusive):
// { start: 0, end: 13311 }
// { start: 19894, end: 19967 }
// { start: 40880, end: 63772 }
// { start: 63774, end: 63783 }
// { start: 63786, end: 63797 }
// { start: 63799, end: 63855 }
// { start: 63857, end: 63951 }
// { start: 63953, end: 63963 }
// { start: 63965, end: 64014 }
// { start: 64018, end: 64018 }
// { start: 64023, end: 64024 }
// { start: 64028, end: 64030 }
// { start: 64035, end: 64035 }
// { start: 64037, end: 64037 }
// { start: 64039, end: 64047 }
