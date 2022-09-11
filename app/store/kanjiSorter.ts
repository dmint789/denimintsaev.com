import { getCompareFunc, isSortable, isInFilter, hash } from '~/helpers/kanjiSorterFunctions';
import { KanjiLinkedList, ListNode } from '~/helpers/sortedLinkedList';
import { IKanji, IKanjiExt, IKanjiMin, IKanjiOnly } from '~/helpers/interfaces/kanji';
import { SortType } from '~/helpers/enums/sortType';
import { FilterType } from '~/helpers/enums/filterType';

export const state = () => ({
  // Data for all kanji
  kanjiData: [] as Array<IKanji>,
  // WIP list of kanji
  workingList: {
    // Original unsorted and unfiltered kanji
    original: '',
    // List of sorted and filtered indices, each referring to a kanji in kanjiData
    sorted: [] as Array<IKanjiExt>,
    // Filtered kanji from that cannot be sorted (not covered by the sort type)
    unsorted: [] as Array<IKanjiExt>,
  },
  kanjiOnly: {} as IKanjiOnly,
  uniqueKanji: 0,
  totalKanji: 0,
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
  getKanjiOnly: (state: any) => (): string => {
    let output;

    if (state.kanjiOnly.sorted) {
      if (!state.reversed) output = state.kanjiOnly.sorted;
      else output = state.kanjiOnly.sorted.split('').reverse().join('');
    }

    if (state.kanjiOnly.unsorted) {
      if (output) output += '\n\n';
      output += 'Unsorted:\n' + state.kanjiOnly.unsorted;
    }

    return output;
  },
  getUniqueKanji: (state: any) => (): number => state.uniqueKanji,
  getTotalKanji: (state: any) => (): number => state.totalKanji,
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
  setOriginalList: (state: any, data: string) => (state.workingList.original = data),
  setSortedList: (state: any, data: Array<IKanjiExt>) => (state.workingList.sorted = data),
  setUnsortedList: (state: any, data: Array<IKanjiExt>) => (state.workingList.unsorted = data),
  setKanjiOnly: (state: any, data: IKanjiOnly) => (state.kanjiOnly = data),
  setUniqueKanji: (state: any, data: number) => (state.uniqueKanji = data),
  setTotalKanji: (state: any, data: number) => (state.totalKanji = data),
  setValue: (state: any, { field, value }: { field: string; value: any }) => (state[field] = value),
};

export const actions = {
  enterInput({ dispatch }: any, input: string) {
    dispatch('sortWorkingList', input);
  },
  sortWorkingList({ state, commit }: any, input = '') {
    if (state.mode === 'add') input = state.workingList.original + input;
    else if (!input) input = state.workingList.original;

    if (input) {
      let kanjiExtraData = new Array<IKanjiExt>(state.kanjiData.length);
      let tempOriginal = '';
      let tempSorted: KanjiLinkedList; // for the default output
      let tempTextSorted: Array<IKanjiMin>;
      let tempUnsorted = [] as Array<IKanjiExt>;
      let tempKanjiOnly = { sorted: '', unsorted: '' } as IKanjiOnly; // for the kanji only output

      // Initialize sorted list depending on the sort type
      if (state.sortType === SortType.TextOrder) tempTextSorted = new Array<IKanjiMin>();
      else {
        const compareFunc = getCompareFunc(
          state.sortType === SortType.Occurrences ? kanjiExtraData : state.kanjiData,
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

          if (kanjiExtraData[id]) kanjiExtraData[id].occurrences++;
          else kanjiExtraData[id] = { occurrences: 1 } as IKanjiExt;

          if (state.sortType === SortType.TextOrder) {
            if (kanjiExtraData[id].occurrences === 1) {
              tempTextSorted.push({ i: id, repeat: false });
            } else {
              tempTextSorted.push({ i: id, repeat: true });
            }
          } else if (state.sortType === SortType.Occurrences) {
            if (kanjiExtraData[id].occurrences > 1) tempSorted.repositionInList(id);
            else {
              tempSorted.addToList(id);
            }
          } else if (kanjiExtraData[id].occurrences === 1) {
            if (isSortable(kanji, state.sortType)) {
              tempSorted.addToList(id);
            } else {
              tempUnsorted.push({
                ...kanji,
                occurrences: kanjiExtraData[id].occurrences,
                index: 0,
              });
              tempKanjiOnly.unsorted += kanji.c;
            }
          }
        }
      }

      // Save the sorted list into an array ready for display
      let tempSortedKanji = [] as Array<IKanjiExt>;
      let tempUniqueKanji = 0;
      let tempTotalKanji = 0;

      const setNextKanji = (i: number, kanjiId: number, repeat: boolean) => {
        let fullKanji = state.kanjiData[kanjiId];
        let inFilter = isInFilter(fullKanji, state.filterType) as boolean;

        if (inFilter) {
          tempTotalKanji++;
          if (!repeat) tempUniqueKanji++;
        }

        tempSortedKanji[i] = {
          ...fullKanji,
          index: repeat ? 0 : tempUniqueKanji,
          occurrences: kanjiExtraData[kanjiId].occurrences,
          filtered: inFilter,
        };
        tempKanjiOnly.sorted += fullKanji.c; // for kanjionly view
      };

      if (state.sortType === SortType.TextOrder) {
        tempSortedKanji = new Array<IKanjiExt>(tempTextSorted.length);

        for (let i = 0; i < tempSortedKanji.length; i++)
          setNextKanji(i, tempTextSorted[i].i, tempTextSorted[i].repeat);
      } else if (tempSorted.length > 0) {
        tempSortedKanji = new Array<IKanjiExt>(tempSorted.length);
        let pointer = tempSorted.head as ListNode<number>;

        for (let i = 0; i < tempSortedKanji.length; i++) {
          if (!pointer) break;
          setNextKanji(i, pointer.data, false);
          pointer = pointer.next;
        }
      }

      commit('setOriginalList', tempOriginal);
      commit('setSortedList', tempSortedKanji);
      commit('setUnsortedList', tempUnsorted);
      commit('setKanjiOnly', tempKanjiOnly);
      commit('setUniqueKanji', tempUniqueKanji);
      commit('setTotalKanji', tempTotalKanji);
    }
  },
  reset: ({ commit }: any) => {
    commit('setOriginalList', '');
    commit('setSortedList', []);
    commit('setUnsortedList', []);
    commit('setKanjiOnly', {});
    commit('setUniqueKanji', 0);
    commit('setTotalKanji', 0);
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
