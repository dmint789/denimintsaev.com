import { getCompareFunc, isSortable, hash } from '~/helpers/kanjiSorterFunctions';
import { KanjiLinkedList, ListNode } from '~/helpers/sortedLinkedList';
import { IKanji, IKanjiExt, IKanjiMin } from '~/helpers/interfaces/kanji';
import { KanjiOnly } from '~/helpers/kanjiOnly';
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
  kanjiOnly: new KanjiOnly(),
  uniqueKanji: 0,
  mode: 'add' as 'replace' | 'add',
  view: 'default' as 'default' | 'kanjionly',
  sortType: SortType.Newspapers,
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
  getKanjiOnly: (state: any) => (): string => {
    let output;

    if (!state.reversed) output = state.kanjiOnly.sorted;
    else output = state.kanjiOnly.sorted.split('').reverse().join('');

    if (state.kanjiOnly.unsorted) output += '\n\nUnsorted:\n' + state.kanjiOnly.unsorted;

    return output;
  },
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
  setKanjiExtraData: (state: any, data: Array<IKanjiExt>) => (state.kanjiExtraData = data),
  setOriginalList: (state: any, data: string) => (state.workingList.original = data),
  setSortedList: (state: any, data: Array<IKanjiExt>) => (state.workingList.sorted = data),
  setUnsortedList: (state: any, data: Array<IKanjiExt>) => (state.workingList.unsorted = data),
  setKanjiOnly: (state: any, data: KanjiOnly) => (state.kanjiOnly = data),
  setUniqueKanji: (state: any, data: number) => (state.uniqueKanji = data),
  setValue: (state: any, { field, value }: { field: string; value: any }) => (state[field] = value),
};

export const actions = {
  enterInput({ dispatch }: any, input: string) {
    dispatch('sortWorkingList', input);
  },
  //// INDEXING CAN BE BETTER.
  //// IS THERE A NEED TO STORE THE TEMPKANJIEXTRADATA? MAYBE REUSE IT WHEN JUST THE SORT TYPE CHANGED
  sortWorkingList({ state, commit }: any, input = '') {
    if (state.mode === 'add') input = state.workingList.original + input;
    else if (!input) input = state.workingList.original;

    if (input) {
      let tempKanjiExtraData = new Array<IKanjiExt>(state.kanjiData.length);
      let tempOriginal = '';
      let tempSorted: KanjiLinkedList; // for the default output
      let tempTextSorted: Array<IKanjiMin>;
      let tempUnsorted = [] as Array<IKanjiExt>;
      let tempKanjiOnly = new KanjiOnly(); // for the kanji only output
      let tempUniqueKanji = 0;

      // Initialize sorted list depending on the sort type
      if (state.sortType === SortType.TextOrder) tempTextSorted = new Array<IKanjiMin>();
      else {
        const compareFunc = getCompareFunc(
          state.sortType === SortType.Occurrences ? tempKanjiExtraData : state.kanjiData,
          state.sortType
        );
        tempSorted = new KanjiLinkedList(null, compareFunc);
      }

      // Continue iterating through the input and adding kanji to the list while keeping it sorted
      for (let i = 0; i < input.length; i++) {
        let id = hash(input[i]) as number;

        // If the hash function didn't return null, that means the character is a kanji
        if (id !== null) {
          let kanji = state.kanjiData[id];
          tempOriginal += kanji.c;

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
            if (isSortable(kanji, state.sortType)) {
              tempSorted.addToList(id);
            } else {
              tempUnsorted.push({
                ...kanji,
                occurrences: tempKanjiExtraData[id].occurrences,
                index: 0,
              });
              tempKanjiOnly.unsorted += kanji.c;
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
          let tempI = tempTextSorted[i];
          tempSortedKanji[i] = {
            ...state.kanjiData[tempI.i],
            occurrences: tempKanjiExtraData[tempI.i].occurrences,
            index: tempI.index,
          };
          tempKanjiOnly.sorted += state.kanjiData[tempI.i].c;
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
          tempKanjiOnly.sorted += state.kanjiData[pointer.data].c;
          pointer = pointer.next;
          i++;
        }
      }

      commit('setKanjiExtraData', tempKanjiExtraData);
      commit('setOriginalList', tempOriginal);
      commit('setSortedList', tempSortedKanji);
      commit('setUnsortedList', tempUnsorted);
      commit('setKanjiOnly', tempKanjiOnly);
      commit('setUniqueKanji', tempUniqueKanji);
    }
  },
  reset: ({ commit }: any) => {
    commit('setKanjiExtraData', []);
    commit('setOriginalList', '');
    commit('setSortedList', []);
    commit('setUnsortedList', []);
    commit('setKanjiOnly', new KanjiOnly());
    commit('setUniqueKanji', 0);
  },
  changeView({ commit }: any, value: 'default' | 'kanjionly') {
    commit('setValue', { field: 'view', value });
  },
  changeSortType({ state, commit, dispatch }: any, value: SortType) {
    commit('setValue', { field: 'sortType', value });
    if (state.update) dispatch('sortWorkingList');
  },
  changeFilterType({ state, commit, dispatch }: any, value: FilterType) {
    commit('setValue', { field: 'filterType', value });
    if (state.update) dispatch('sortWorkingList');
  },
  changeRepeats({ state, commit, dispatch }: any, value: boolean) {
    commit('setValue', { field: 'repeats', value });
    if (state.update) dispatch('sortWorkingList');
  },
  changeReversed({ commit }: any, value: boolean) {
    commit('setValue', { field: 'reversed', value });
  },
  changeUpdate({ commit, dispatch }: any, value: boolean) {
    commit('setValue', { field: 'update', value });
    if (value) dispatch('sortWorkingList');
  },
};
