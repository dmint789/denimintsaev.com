import {
  listContainsKanji,
  getCompareFunc,
  isSortable,
  hash,
} from '~/helpers/kanjiSorterFunctions';
import { KanjiLinkedList, ListNode } from '~/helpers/sortedLinkedList';
import { KanjiExtra } from '~/helpers/kanjiExtra';
import { IKanji, IKanjiExt } from '~/helpers/interfaces/kanji';
import { SortType } from '~/helpers/enums/sortType';
import { FilterType } from '~/helpers/enums/filterType';

export const state = () => ({
  // Data for all kanji
  kanjiData: [] as Array<IKanji>,
  kanjiExtraData: [] as Array<KanjiExtra>,
  // WIP list of kanji
  workingList: {
    // Original unsorted and unfiltered kanji
    original: '',
    // List of sorted and filtered indices, each referring to a kanji in kanjiData
    sorted: [] as Array<IKanjiExt>,
    // Filtered kanji from that cannot be sorted (not covered by the sort type)
    unsorted: [] as Array<IKanjiExt>,
  },
  // Output ready for display (kanjionly view only)
  output: '',
  uniqueKanji: 0 as number,
  mode: 'replace' as 'replace' | 'add',
  view: 'default' as 'default' | 'kanjionly',
  sortType: SortType.Occurrences,
  filterType: FilterType.None,
  repeats: false,
  reversed: false,
  update: true,
});

export const getters = {
  getOriginal: (state: any) => (): string => state.workingList.original,
  getSorted: (state: any) => (): Array<IKanjiExt> => state.workingList.sorted,
  getUnsorted: (state: any) => (): Array<IKanjiExt> => state.workingList.unsorted,
  getOutput: (state: any) => (): string => state.output,
  getUniqueKanji: (state: any) => (): number => state.uniqueKanji,
  getTotalKanji: (state: any) => (): number => state.workingList.original.length,
  getMode: (state: any) => (): string => state.mode,
  getView: (state: any) => (): string => state.view,
  getSortType: (state: any) => (): string => state.sortType,
  getFilterType: (state: any) => (): string => state.filterType,
  getRepeats: (state: any) => (): boolean => state.repeats,
  getReversed: (state: any) => (): boolean => state.reversed,
  getUpdate: (state: any) => (): boolean => state.update,
};

export const mutations = {
  setKanjiData: (state: any, data: Array<IKanji>) => (state.kanjiData = data),
  setKanjiExtraData: (state: any, data: Array<KanjiExtra>) => (state.kanjiExtraData = data),
  setOriginalList: (state: any, data: string) => (state.workingList.original = data),
  setSortedList: (state: any, data: Array<IKanjiExt>) => (state.workingList.sorted = data),
  setUnsortedList: (state: any, data: Array<IKanjiExt>) => (state.workingList.unsorted = data),
  setValue: (state: any, { field, value }: { field: string; value: any }) => (state[field] = value),
};

export const actions = {
  enterInput({ state, dispatch, commit }: any, input: string) {
    dispatch('sortWorkingList', input);
  },
  sortWorkingList({ state, commit }: any, input = '') {
    let tempKanjiExtraData: Array<KanjiExtra>;
    let tempOriginal: string;
    let tempSorted: KanjiLinkedList;
    let tempUnsorted: Array<IKanjiExt>;
    let tempUniqueKanji = 0;
    let id: number; // used for storing hash IDs

    if (!input) input = state.workingList.original;

    // Initialize temp variables based on the selected mode. If the original list of kanji
    // is empty, that means we need to start from scratch anyways.
    if (state.mode === 'replace' || state.workingList.original.length === 0) {
      tempKanjiExtraData = new Array<KanjiExtra>(state.kanjiData.length);
      for (let i = 0; i < state.kanjiData.length; i++) tempKanjiExtraData[i] = new KanjiExtra();

      const compareFunc = getCompareFunc(
        state.sortType === SortType.Occurrences ? tempKanjiExtraData : state.kanjiData,
        state.sortType
      );

      tempOriginal = '';
      tempSorted = new KanjiLinkedList(null, compareFunc);
      tempUnsorted = [];
    } else {
      tempKanjiExtraData = state.kanjiExtraData;
      tempOriginal = state.workingList.original;
      tempSorted = state.workingList.sorted;
      tempUnsorted = state.workingList.unsorted;
      tempUniqueKanji = state.uniqueKanji;
    }

    // Continue iterating through the input and adding kanji to the linked list while keeping it sorted
    for (let i = 0; i < input.length; i++) {
      id = hash(input[i]);

      // If the hash function didn't return null, that means the character is a kanji
      if (id !== null) {
        tempOriginal += state.kanjiData[id].c;
        tempKanjiExtraData[id].occurrences++;

        if (state.sortType === SortType.Occurrences) {
          if (tempKanjiExtraData[id].occurrences > 1) tempSorted.repositionInList(id);
          else {
            tempSorted.addToList(id);
            tempUniqueKanji++;
          }
        } else if (tempKanjiExtraData[id].occurrences === 1) {
          if (isSortable(state.kanjiData[id], state.sortType)) tempSorted.addToList(id);
          else {
            tempUnsorted.push({
              ...state.kanjiData[id],
              occurrences: tempKanjiExtraData[id].occurrences,
            });
          }
          tempUniqueKanji++;
        }
      }
    }
    console.log('done');

    // Save the sorted linked list into an array ready for display
    let tempSortedKanji = [] as Array<IKanjiExt>;
    if (tempSorted.length > 0) {
      tempSortedKanji = new Array<IKanjiExt>(tempSorted.length);
      let pointer: ListNode<number>;
      let i = 0;

      pointer = tempSorted[state.reversed ? 'tail' : 'head'];
      while (pointer) {
        tempSortedKanji[i] = {
          ...state.kanjiData[pointer.data],
          occurrences: tempKanjiExtraData[pointer.data].occurrences,
        };
        pointer = pointer[state.reversed ? 'previous' : 'next'];
        i += state.reversed ? -1 : 1;
      }
    }

    commit('setKanjiExtraData', tempKanjiExtraData);
    commit('setOriginalList', tempOriginal);
    commit('setSortedList', tempSortedKanji);
    commit('setUnsortedList', tempUnsorted);
    commit('setValue', { field: 'uniqueKanji', value: tempUniqueKanji });

    console.log('done');
  },
  updateOutput: ({ state, commit }: any) => {
    // let tempOutput = '';
    // let index = 1;
    // if (state.view === 'default') {
    //   if (state.sortType !== SortType.JLPT) {
    //     const loop = (i: number) => {
    //       tempOutput += `${index}\t${state.workingList.sorted[i].c}`;
    //       // Display all properties that are present in the kanji entry
    //       for (let j of ['o', 's', 'a', 'p', 'v', 'n', 'y']) {
    //         tempOutput += '\t';
    //         if (state.workingList.sorted[i][j]) tempOutput += state.workingList.sorted[i][j];
    //       }
    //       tempOutput += '\n';
    //       index++;
    //     };
    //     if (!state.reversed) {
    //       for (let i = 0; i < state.workingList.sorted.length; i++) loop(i);
    //     } else {
    //       for (let i = state.workingList.sorted.length - 1; i >= 0; i--) loop(i);
    //     }
    //   }
    //   if (state.workingList.unsorted) tempOutput += '\n';
    // } else {
    //   // Add sorted kanji to the output either normally or in reverse order
    //   if (!state.reversed) {
    //     for (let i of state.workingList.sorted) tempOutput += i.c;
    //   } else {
    //     for (let i = state.workingList.sorted.length - 1; i >= 0; i--)
    //       tempOutput += state.workingList.sorted[i].c;
    //   }
    // }
    // tempOutput += state.workingList.unsorted;
    // commit('setValue', { field: 'output', value: tempOutput });
  },
  reset: ({ commit }: any) => {
    commit('setKanjiExtraData', []);
    commit('setOriginalList', []);
    commit('setSortedList', []);
    commit('setUnsortedList', []);
    commit('setValue', { field: 'uniqueKanji', value: 0 });
    commit('setValue', { field: 'output', value: '' });
  },
  changeView({ state, dispatch, commit }: any, value: 'default' | 'kanjionly') {
    commit('setValue', { field: 'view', value });

    if (state.update) dispatch('updateOutput');
  },
  changeSortType({ state, dispatch, commit }: any, value: SortType) {
    commit('setValue', { field: 'sortType', value });

    if (state.update) {
      dispatch('sortWorkingList');
    }
  },
  changeFilterType({ state, dispatch, commit }: any, value: FilterType) {
    commit('setValue', { field: 'filterType', value });

    if (state.update) {
      dispatch('sortWorkingList');
      dispatch('updateOutput');
    }
  },
  changeRepeats({ state, dispatch, commit }: any, value: boolean) {
    commit('setValue', { field: 'repeats', value });

    if (state.update) {
      dispatch('sortWorkingList');
      dispatch('updateOutput');
    }
  },
  changeReversed({ state, dispatch, commit }: any, value: boolean) {
    commit('setValue', { field: 'reversed', value });

    if (state.update) dispatch('updateOutput');
  },
};

// let pointer = tempSorted.head as ListNode<number>;
// let log = '';
// while (pointer) {
//   log += `c:${state.kanjiData[pointer.data].c}; o:${
//     tempKanjiExtraData[pointer.data].occurrences
//   } | `;
//   pointer = pointer.next;
// }
// console.log(log, state.kanjiData[id].c, id);
