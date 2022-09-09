import { getCompareFunc, isSortable, hash } from '~/helpers/kanjiSorterFunctions';
import { KanjiLinkedList, ListNode } from '~/helpers/sortedLinkedList';
import { IKanji, IKanjiExt, IKanjiMin } from '~/helpers/interfaces/kanji';
import { SortType } from '~/helpers/enums/sortType';
import { FilterType } from '~/helpers/enums/filterType';

export const state = () => ({
  // Data for all kanji
  kanjiData: [] as Array<IKanji>,
  kanjiExtraData: [] as Array<IKanjiExt>,
  // WIP list of kanji
  workingList: {
    // Original unsorted and unfiltered kanji
    original: '',
    // List of sorted and filtered indices, each referring to a kanji in kanjiData
    sorted: [] as Array<IKanjiExt>,
    // Filtered kanji from that cannot be sorted (not covered by the sort type)
    unsorted: [] as Array<IKanjiExt>,
  },
  uniqueKanji: 0 as number,
  mode: 'replace' as 'replace' | 'add',
  view: 'default' as 'default' | 'kanjionly',
  sortType: SortType.TextOrder,
  filterType: FilterType.None,
  repeats: false,
  reversed: false,
  update: true,
});

export const getters = {
  getOriginal: (state: any) => (): string => state.workingList.original,
  getSorted: (state: any) => (): Array<IKanjiExt> => {
    if (!state.reversed) return state.workingList.sorted;
    else return state.workingList.sorted.slice().reverse();
  },
  getUnsorted: (state: any) => (): Array<IKanjiExt> => state.workingList.unsorted,
  getUniqueKanji: (state: any) => (): number => state.uniqueKanji,
  getTotalKanji: (state: any) => (): number => state.workingList.original.length,
  getMode: (state: any) => (): string => state.mode,
  getView: (state: any) => (): string => state.view,
  getSortType: (state: any) => (): string => state.sortType,
  getFilterType: (state: any) => (): string => state.filterType,
  getRepeats: (state: any) => (): boolean => state.repeats,
  getReversed: (state: any) => (): boolean => state.reversed,
  getUpdate: (state: any) => (): boolean => state.update,
  getKanjiOnly: (state: any) => (): string => {
    if (state.sortType === SortType.TextOrder && state.repeats) return state.workingList.original;

    return state.workingList.original;
  },
};

export const mutations = {
  setKanjiData: (state: any, data: Array<IKanji>) => (state.kanjiData = data),
  setKanjiExtraData: (state: any, data: Array<IKanjiExt>) => (state.kanjiExtraData = data),
  setOriginalList: (state: any, data: string) => (state.workingList.original = data),
  setSortedList: (state: any, data: Array<IKanjiExt>) => (state.workingList.sorted = data),
  setUnsortedList: (state: any, data: Array<IKanjiExt>) => (state.workingList.unsorted = data),
  setValue: (state: any, { field, value }: { field: string; value: any }) => (state[field] = value),
};

export const actions = {
  enterInput({ dispatch }: any, input: string) {
    dispatch('sortWorkingList', input);
  },
  sortWorkingList({ state, commit }: any, input = '') {
    if (!input) input = state.workingList.original;
    if (input) {
      let tempKanjiExtraData: Array<IKanjiExt>;
      let tempOriginal = '';
      let tempSorted: KanjiLinkedList;
      let tempTextSorted: Array<IKanjiMin>;
      let tempUnsorted = [] as Array<IKanjiExt>;
      let tempUniqueKanji = 0;
      let id: number; // used for storing hash IDs

      // Initialize temp variables based on the selected mode. If the original list of kanji
      // is empty, that means we need to start from scratch anyways.
      if (state.mode === 'replace' || state.workingList.original.length === 0) {
        tempKanjiExtraData = new Array<IKanjiExt>(state.kanjiData.length);

        if (state.sortType === SortType.TextOrder) tempTextSorted = new Array<IKanjiMin>();
        else {
          const compareFunc = getCompareFunc(
            state.sortType === SortType.Occurrences ? tempKanjiExtraData : state.kanjiData,
            state.sortType
          );
          tempSorted = new KanjiLinkedList(null, compareFunc);
        }
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

          if (tempKanjiExtraData[id]) tempKanjiExtraData[id].occurrences++;
          else tempKanjiExtraData[id] = { occurrences: 1 } as IKanjiExt;

          if (state.sortType === SortType.TextOrder) {
            if (tempKanjiExtraData[id].occurrences === 1) {
              tempUniqueKanji++;
              tempTextSorted.push({ i: id, index: tempUniqueKanji });
            } else if (state.repeats) {
              tempTextSorted.push({ i: id, index: 0 });
            }
          } else if (state.sortType === SortType.Occurrences) {
            if (tempKanjiExtraData[id].occurrences > 1) tempSorted.repositionInList(id);
            else {
              tempSorted.addToList(id);
              tempUniqueKanji++;
            }
          } else if (tempKanjiExtraData[id].occurrences === 1) {
            if (isSortable(state.kanjiData[id], state.sortType)) {
              tempSorted.addToList(id);
            } else {
              tempUnsorted.push({
                ...state.kanjiData[id],
                occurrences: tempKanjiExtraData[id].occurrences,
              });
            }

            tempUniqueKanji++;
          }
        }
      }

      // Save the sorted list into an array ready for display
      let tempSortedKanji = [] as Array<IKanjiExt>;
      if (state.sortType === SortType.TextOrder) {
        tempSortedKanji = new Array<IKanjiExt>(tempTextSorted.length);

        for (let i = 0; i < tempTextSorted.length; i++) {
          tempSortedKanji[i] = {
            ...state.kanjiData[tempTextSorted[i].i],
            occurrences: tempKanjiExtraData[tempTextSorted[i].i].occurrences,
            index: tempTextSorted[i].index,
          };
        }
      } else if (tempSorted.length > 0) {
        tempSortedKanji = new Array<IKanjiExt>(tempSorted.length);
        let pointer = tempSorted.head as ListNode<number>;
        let i = 0;

        while (pointer) {
          tempSortedKanji[i] = {
            ...state.kanjiData[pointer.data],
            occurrences: tempKanjiExtraData[pointer.data].occurrences,
            index: i + 1,
          };
          pointer = pointer.next;
          i++;
        }
      }

      commit('setKanjiExtraData', tempKanjiExtraData);
      commit('setOriginalList', tempOriginal);
      commit('setSortedList', tempSortedKanji);
      commit('setUnsortedList', tempUnsorted);
      commit('setValue', { field: 'uniqueKanji', value: tempUniqueKanji });
    }
  },
  reset: ({ commit }: any) => {
    commit('setKanjiExtraData', []);
    commit('setOriginalList', '');
    commit('setSortedList', []);
    commit('setUnsortedList', []);
    commit('setValue', { field: 'uniqueKanji', value: 0 });
  },
  changeView({ commit }: any, value: 'default' | 'kanjionly') {
    commit('setValue', { field: 'view', value });
  },
  changeSortType({ state, dispatch, commit }: any, value: SortType) {
    commit('setValue', { field: 'sortType', value });
    if (state.update) dispatch('sortWorkingList');
  },
  changeFilterType({ state, dispatch, commit }: any, value: FilterType) {
    commit('setValue', { field: 'filterType', value });
    if (state.update) dispatch('sortWorkingList');
  },
  changeRepeats({ state, dispatch, commit }: any, value: boolean) {
    commit('setValue', { field: 'repeats', value });
    if (state.update) dispatch('sortWorkingList');
  },
  changeReversed({ commit }: any, value: boolean) {
    commit('setValue', { field: 'reversed', value });
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
