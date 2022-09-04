import { IKanji } from './interfaces/kanji';

export function listContainsKanji(list: Array<IKanji>, kanji: IKanji): boolean {
  for (let i of list) {
    if (i.c === kanji.c) return true;
  }

  return false;
}
