import { getCompareFunc, isSortable, isInFilter, hash } from '~/helpers/kanjiSorterFunctions';
import { KanjiLinkedList, ListNode } from '~/helpers/sortedLinkedList';
import { IKanji, IKanjiMin, IKanjiListEntry, IKanjiOnly } from '~/helpers/interfaces/kanji';
import { SortType } from '~/helpers/enums/sortType';
import { FilterType } from '~/helpers/enums/filterType';

export const state = () => ({
  // Data for all kanji
  kanjiData: [] as Array<IKanji>,
  workingList: {
    // Original unsorted and unfiltered kanji
    original: '',
    // List of sorted and filtered kanji
    sorted: [] as Array<IKanji>,
    // Filtered kanji that cannot be sorted (not covered by the sort type)
    unsorted: [] as Array<IKanji>,
    // Final output for the kanji only view
    kanjiOnly: {} as IKanjiOnly,
  },
  uniqueKanji: 0,
  totalKanji: 0,
  mode: 'replace' as 'replace' | 'add',
  resultSettings: {
    view: 'default' as 'default' | 'kanjionly',
    repeats: false,
    reversed: false,
    sortType: SortType.TextOrder,
    filterType: FilterType.None,
    negativeFilter: false,
    update: true,
  },
  kanjiList: {
    default: [] as Array<IKanjiListEntry>,
    kanjiOnly: '',
  },
  kanjiListSettings: {
    view: 'default' as 'default' | 'kanjionly',
    reversed: false,
    sortType: SortType.StrokeCount, // this can't have text order sort or number of occurrences sort
    filterType: FilterType.None, // this can't have kanji list sort
    negativeFilter: false,
  },
});

export const getters = {
  getOriginal: (state: any) => (): string => state.workingList.original,
  getSorted: (state: any) => (): Array<IKanji> => {
    if (!state.resultSettings.reversed) return state.workingList.sorted;
    else return state.workingList.sorted.slice().reverse();
  },
  getUnsorted: (state: any) => (): Array<IKanji> => state.workingList.unsorted,
  getKanjiOnly: (state: any) => (): string => {
    let output;

    if (state.workingList.kanjiOnly.sorted) {
      if (!state.resultSettings.reversed) output = state.workingList.kanjiOnly.sorted;
      else output = state.workingList.kanjiOnly.sorted.split('').reverse().join('');
    }

    if (state.workingList.kanjiOnly.unsorted) {
      if (output) output += '\n\n';
      output += 'Unsorted:\n' + state.workingList.kanjiOnly.unsorted;
    }

    return output;
  },
  getUniqueKanji: (state: any) => (): number => state.uniqueKanji,
  getTotalKanji: (state: any) => (): number => state.totalKanji,
  getKLDefault: (state: any) => (): Array<IKanjiListEntry> => state.kanjiList.default,
  getKLKanjiOnly: (state: any) => (): string => state.kanjiList.kanjiOnly,
  getMode: (state: any) => (): 'replace' | 'add' => state.mode,
  // Settings getters
  getView:
    (state: any) =>
    (results: boolean): 'default' | 'kanjionly' => {
      if (results) return state.resultSettings.view;
      else return state.kanjiListSettings.view;
    },
  getRepeats: (state: any) => (): boolean => state.resultSettings.repeats,
  getReversed:
    (state: any) =>
    (results: boolean): boolean => {
      if (results) return state.resultSettings.reversed;
      else return state.kanjiListSettings.reversed;
    },
  getSortType:
    (state: any) =>
    (results: boolean): string => {
      if (results) return state.resultSettings.sortType;
      else return state.kanjiListSettings.sortType;
    },
  getFilterType:
    (state: any) =>
    (results: boolean): FilterType => {
      if (results) return state.resultSettings.filterType;
      else return state.kanjiListSettings.filterType;
    },
  getNegativeFilter:
    (state: any) =>
    (results: boolean): boolean => {
      if (results) return state.resultSettings.negativeFilter;
      else return state.kanjiListSettings.negativeFilter;
    },
  getUpdate: (state: any) => (): boolean => state.resultSettings.update,
};

export const mutations = {
  setKanjiData: (state: any, data: Array<IKanji>) => (state.kanjiData = data),
  setOriginalList: (state: any, data: string) => (state.workingList.original = data),
  setSortedList: (state: any, data: Array<IKanji>) => (state.workingList.sorted = data),
  setUnsortedList: (state: any, data: Array<IKanji>) => (state.workingList.unsorted = data),
  setKanjiOnly: (state: any, data: IKanjiOnly) => (state.workingList.kanjiOnly = data),
  setUniqueKanji: (state: any, data: number) => (state.uniqueKanji = data),
  setTotalKanji: (state: any, data: number) => (state.totalKanji = data),
  setMode: (state: any, data: 'replace' | 'add') => (state.mode = data),
  // Results settings setters
  setView: (state: any, data: 'default' | 'kanjionly') => (state.resultSettings.view = data),
  setSortType: (state: any, data: SortType) => (state.resultSettings.sortType = data),
  setRepeats: (state: any, data: boolean) => (state.resultSettings.repeats = data),
  setReversed: (state: any, data: boolean) => (state.resultSettings.reversed = data),
  setFilterType: (state: any, data: FilterType) => (state.resultSettings.filterType = data),
  setNegativeFilter: (state: any, data: boolean) => (state.resultSettings.negativeFilter = data),
  setUpdate: (state: any, data: boolean) => (state.resultSettings.update = data),
  // Kanji list settings setters
  setKLView: (state: any, data: 'default' | 'kanjionly') => (state.kanjiListSettings.view = data),
  setKLSortType: (state: any, data: SortType) => (state.kanjiListSettings.sortType = data),
  setKLReversed: (state: any, data: boolean) => (state.kanjiListSettings.reversed = data),
  setKLFilterType: (state: any, data: FilterType) => (state.kanjiListSettings.filterType = data),
  setKLNegativeFilter: (state: any, data: boolean) =>
    (state.kanjiListSettings.negativeFilter = data),
};

export const actions = {
  enterInput({ dispatch }: any, input: string) {
    dispatch('sortWorkingList', { results: true, input });
  },
  // OPTIMIZE FILTERING WHEN NOTHING BUT THE FILTER HAS CHANGED?
  sortWorkingList({ state, getters, commit }: any, { results = true, input = '' }) {
    if (state.mode === 'add') input = state.workingList.original + input;
    else if (!input) input = state.workingList.original;

    if (input) {
      let kanjiExtraData = new Array<IKanji>(state.kanjiData.length);
      let tempOriginal = '';
      let tempSorted: KanjiLinkedList; // for the default output
      let tempTextSorted: Array<IKanjiMin>;
      let tempUnsorted = [] as Array<IKanji>;
      let tempKanjiOnly = { sorted: '', unsorted: '' } as IKanjiOnly; // for the kanji only output
      let sortType = getters.getSortType(results);

      // Initialize sorted list depending on the sort type
      if (sortType === SortType.TextOrder) tempTextSorted = new Array<IKanjiMin>();
      else {
        const compareFunc = getCompareFunc(
          sortType === SortType.Occurrences ? kanjiExtraData : state.kanjiData,
          sortType,
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
          else kanjiExtraData[id] = { occurrences: 1 } as IKanji;

          if (sortType === SortType.TextOrder) {
            if (kanjiExtraData[id].occurrences === 1) {
              tempTextSorted.push({ i: id, repeat: false });
            } else {
              tempTextSorted.push({ i: id, repeat: true });
            }
          } else if (sortType === SortType.Occurrences) {
            if (kanjiExtraData[id].occurrences > 1) tempSorted.repositionInList(id);
            else {
              tempSorted.addToList(id);
            }
          } else if (kanjiExtraData[id].occurrences === 1) {
            if (isSortable(kanji, sortType)) {
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
      let tempSortedKanji = [] as Array<IKanji>;
      let tempUniqueKanji = 0;
      let tempTotalKanji = 0;

      const setNextKanji = (i: number, kanjiId: number, repeat: boolean) => {
        let fullKanji = state.kanjiData[kanjiId];
        let inFilter = isInFilter(fullKanji, getters.getFilterType(results)) as boolean;

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

      if (sortType === SortType.TextOrder) {
        tempSortedKanji = new Array<IKanji>(tempTextSorted.length);

        for (let i = 0; i < tempSortedKanji.length; i++)
          setNextKanji(i, tempTextSorted[i].i, tempTextSorted[i].repeat);
      } else if (tempSorted.length > 0) {
        tempSortedKanji = new Array<IKanji>(tempSorted.length);
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
  changeView(
    { commit }: any,
    { results, value }: { results: boolean; value: 'default' | 'kanjionly' },
  ) {
    if (results) commit('setView', value);
    else commit('setKLView', value);
  },
  changeRepeats({ commit, dispatch }: any, value: boolean) {
    commit('setRepeats', value);
    if (getters.getUpdate) dispatch('sortWorkingList', {});
  },
  changeReversed({ commit }: any, { results, value }: { results: boolean; value: boolean }) {
    if (results) commit('setReversed', value);
    else commit('setKLReversed', value);
  },
  changeSortType(
    { commit, dispatch }: any,
    { results, value }: { results: boolean; value: SortType },
  ) {
    if (results) commit('setSortType', value);
    else commit('setKLSortType', value);

    if (getters.getUpdate) dispatch('sortWorkingList', { results });
  },
  changeFilterType(
    { commit, dispatch }: any,
    { results, value }: { results: boolean; value: FilterType },
  ) {
    if (results) commit('setFilterType', value);
    else commit('setKLFilterType', value);

    if (getters.getUpdate) dispatch('sortWorkingList', { results });
  },
  changeNegativeFilter(
    { commit, dispatch }: any,
    { results, value }: { results: boolean; value: boolean },
  ) {
    if (results) commit('setNegativeFilter', value);
    else commit('setKLNegativeFilter', value);

    if (getters.getUpdate) dispatch('sortWorkingList', { results });
  },
  changeUpdate({ commit, dispatch }: any, value: boolean) {
    commit('setUpdate', value);

    if (value) dispatch('sortWorkingList', {});
  },
};
