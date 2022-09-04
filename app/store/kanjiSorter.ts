import hash from '~/helpers/kanjiSorterHashFunc';
import { listContainsKanji } from '~/helpers/globalFunctions';
import { IKanji } from '~/helpers/interfaces/kanji';
import { SortType } from '~/helpers/enums/sortType';
import { FilterType } from '~/helpers/enums/filterType';

export const state = () => ({
  // Data for all kanji
  kanjiData: [] as Array<IKanji>,
  // WIP list of kanji
  workingList: {
    // Original unfiltered list with an additional "filtered" property for each character (set to true if kanji is needed)
    original: [] as Array<IKanji>,
    sorted: [] as Array<IKanji>,
    // Kanji from the input that cannot be sorted (not covered by the sort type)
    unsorted: '',
  },
  // Pretty output ready for display
  output: '',
  uniqueKanji: 0 as number,
  mode: 'replace' as 'replace' | 'add',
  view: 'kanjionly' as 'default' | 'kanjionly',
  sortType: 'textorder',
  filterType: 'none',
  repeats: false,
  reversed: false,
  update: true,
});

export const getters = {
  getOriginal: (state: any) => (): Array<IKanji> => {
    return state.workingList.original;
  },
  getSorted: (state: any) => (): Array<IKanji> => {
    return state.workingList.sorted;
  },
  getUnsorted: (state: any) => (): string => {
    return state.workingList.unsorted;
  },
  getOutput: (state: any) => (): string => state.output,
  getUniqueKanji: (state: any) => (): number => state.uniqueKanji,
  getTotalKanji: (state: any) => (): number => state.workingList.original.length,
};

export const mutations = {
  setKanjiData: (state: any, data: Array<IKanji>) => {
    state.kanjiData = data;
  },
  setOriginalList: (state: any, data: Array<IKanji>) => {
    state.workingList.original = data;
  },
  setValue: (state: any, { field, value }: { field: string; value: any }) => {
    state[field] = value;
  },
  // THIS SHOULD BE AN ACTION
  updateOutput: (state: any) => {
    let tempSorted = new Array<IKanji>();
    let tempUnsorted = new Array<IKanji>();

    let tempUniqueKanji = 0;

    if (state.sortType === SortType.TextOrder) {
      for (let i of state.workingList.original) {
        // Add character to temp list if we include repeats or the character isn't a repeat
        // Also, increment temp unique kanji, if the character isn't a repeat
        if (!listContainsKanji(tempSorted, i)) {
          tempSorted.push(i);
          tempUniqueKanji++;
        } else if (state.repeats) {
          tempSorted.push(i);
        }
      }
    }

    state.workingList.sorted = tempSorted;
    state.workingList.unsorted = tempUnsorted;

    let tempOutput = '';

    if (state.view === 'default') {
      state.output = '';
    } else {
      // Add sorted kanji to the output either normally or in reverse order
      if (!state.reversed) {
        for (let i of state.workingList.sorted) {
          tempOutput += i.c;
        }
      } else {
        for (let i = state.workingList.sorted.length - 1; i >= 0; i--) {
          tempOutput += state.workingList.sorted[i].c;
        }
      }

      for (let j of state.workingList.unsorted) {
        tempOutput += j.c;
      }
    }

    state.output = tempOutput;
    state.uniqueKanji = tempUniqueKanji;
  },
  addKanjiToOriginal: (state: any, kanjiList: Array<IKanji>) => {
    state.workingList.original = state.workingList.original.concat(kanjiList);
  },
};

export const actions = {
  enterInput({ state, commit }: any, input: string) {
    let tempList = [] as Array<IKanji>;

    for (let i = 0; i < input.length; i++) {
      let id = hash(input[i]);

      if (id !== null) {
        tempList.push(state.kanjiData[id]);
      }
    }

    if (state.mode === 'replace') {
      commit('setOriginalList', tempList);
    } else {
      commit('addKanjiToOriginal', tempList);
    }

    commit('updateOutput');
  },
  changeView({ state, commit }: any, value: 'default' | 'kanjionly') {
    commit('setValue', { field: 'view', value });

    if (state.update) commit('updateOutput');
  },
  changeSortType({ state, commit }: any, value: SortType) {
    commit('setValue', { field: 'sortType', value });

    if (state.update) commit('updateOutput');
  },
  changeFilterType({ state, commit }: any, value: FilterType) {
    commit('setValue', { field: 'filterType', value });

    if (state.update) commit('updateOutput');
  },
  changeRepeats({ state, commit }: any, value: boolean) {
    commit('setValue', { field: 'repeats', value });

    if (state.update) commit('updateOutput');
  },
  changeReversed({ state, commit }: any, value: boolean) {
    commit('setValue', { field: 'reversed', value });

    if (state.update) commit('updateOutput');
  },
};
