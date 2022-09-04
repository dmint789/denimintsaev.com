// Returns the hash id for the input character if it is a kanji.
// Otherwise returns null.
export default function hash(character: string): number | null {
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
