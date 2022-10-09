import { getCompareFunc, isSortable, isInFilter, hash } from '~/helpers/kanjiSorterFunctions';
import { KanjiLinkedList, ListNode } from '~/helpers/sortedLinkedList';
import {
  IKanjiDB,
  IKanji,
  IKanjiListEntry,
  IKanjiMin,
  IKanjiOnly,
  IKanjiLists,
} from '~/helpers/interfaces/kanji';
import { SortType } from '~/helpers/enums/sortType';
import { FilterType } from '~/helpers/enums/filterType';

export const state = () => ({
  // Data for all kanji
  kanjiData: [] as Array<IKanjiDB>,
  kanjiLists: {} as IKanjiLists,
  workingList: {
    // Original list of kanji indices (INCLUDING repeats and ignoring the filter)
    original: [] as Array<number>,
    // List of sorted and filtered kanji
    sorted: [] as Array<IKanji>,
    // Filtered kanji that cannot be sorted (not covered by the sort type)
    unsorted: [] as Array<IKanji>,
    // Indices of all filtered kanji without repeats to be used for adding to the kanji list
    allFiltered: [] as Array<number>,
    // Final output for the kanji only view
    kanjiOnly: { sorted: '', unsorted: '' } as IKanjiOnly,
  },
  uniqueKanji: 0,
  totalKanji: 0,
  mode: 'replace' as 'replace' | 'add',
  resultsSettings: {
    view: 'default' as 'default' | 'kanjionly',
    repeats: false,
    reversed: false,
    sortType: SortType.TextOrder,
    filterType: FilterType.None,
    negativeFilter: false,
    update: true,
  },
  // There can't be repeats here
  kanjiList: {
    // Original list of kanji indices in the list WITHOUT repeats
    original: [] as Array<number>,
    // List of sorted and filtered kanji
    sorted: [] as Array<IKanjiListEntry>,
    // Filtered kanji that cannot be sorted (not covered by the sort type)
    unsorted: [] as Array<IKanjiListEntry>,
    // For kanji only output
    kanjiOnly: { sorted: '', unsorted: '' } as IKanjiOnly,
    // Array with the length of the kanji DB. Each item says whether or not the kanji is in the list.
    list: [] as Array<boolean>,
  },
  kanjiListSettings: {
    view: 'default' as 'default' | 'kanjionly',
    reversed: false,
    sortType: SortType.Newspapers, // this can't have text order sort or number of occurrences sort
    filterType: FilterType.None, // this can't have kanji list sort
    negativeFilter: false,
  },
});

export const getters = {
  getOriginal:
    (state: any) =>
    (results: boolean): Array<number> => {
      if (results) return state.workingList.original;
      else return state.kanjiList.original;
    },
  getSorted:
    (state: any) =>
    (results: boolean): Array<IKanji> | Array<IKanjiListEntry> => {
      if (results) return state.workingList.sorted;
      else return state.kanjiList.sorted;
    },
  getUnsorted:
    (state: any) =>
    (results: boolean): Array<IKanji> | Array<IKanjiListEntry> => {
      if (results) return state.workingList.unsorted;
      else return state.kanjiList.unsorted;
    },
  getKanjiOnly:
    (state: any) =>
    (results: boolean): string => {
      let output: string;
      if (results) {
        output = state.workingList.kanjiOnly.sorted;

        if (state.workingList.kanjiOnly.unsorted) {
          if (output) output += '\n\n';
          output += 'Unsorted:\n' + state.workingList.kanjiOnly.unsorted;
        }
      } else {
        output = state.kanjiList.kanjiOnly.sorted;

        if (state.kanjiList.kanjiOnly.unsorted) {
          if (output) output += '\n\n';
          output += 'Unsorted:\n' + state.kanjiList.kanjiOnly.unsorted;
        }
      }
      return output;
    },
  getUniqueKanji: (state: any) => (): number => state.uniqueKanji,
  getTotalKanji: (state: any) => (): number => state.totalKanji,
  getKanjiInList: (state: any) => (): number => state.kanjiList.original.length,
  getMode: (state: any) => (): 'replace' | 'add' => state.mode,
  // Settings getters
  getView:
    (state: any) =>
    (results: boolean): 'default' | 'kanjionly' => {
      if (results) return state.resultsSettings.view;
      else return state.kanjiListSettings.view;
    },
  getRepeats: (state: any) => (): boolean => state.resultsSettings.repeats,
  getReversed:
    (state: any) =>
    (results: boolean): boolean => {
      if (results) return state.resultsSettings.reversed;
      else return state.kanjiListSettings.reversed;
    },
  getSortType:
    (state: any) =>
    (results: boolean): string => {
      if (results) return state.resultsSettings.sortType;
      else return state.kanjiListSettings.sortType;
    },
  getFilterType:
    (state: any) =>
    (results: boolean): FilterType => {
      if (results) return state.resultsSettings.filterType;
      else return state.kanjiListSettings.filterType;
    },
  getNegativeFilter:
    (state: any) =>
    (results: boolean): boolean => {
      if (results) return state.resultsSettings.negativeFilter;
      else return state.kanjiListSettings.negativeFilter;
    },
  getUpdate: (state: any) => (): boolean => state.resultsSettings.update,
  getKanjiLists: (state: any) => (): IKanjiLists => state.kanjiLists,
};

export const mutations = {
  setKanjiData: (state: any, data: Array<IKanjiDB>) => (state.kanjiData = data),
  setKanjiLists: (state: any, data: IKanjiLists) => (state.kanjiLists = data),
  setOriginal: (state: any, data: Array<number>) => (state.workingList.original = data),
  setSortedList: (state: any, data: Array<IKanji>) => (state.workingList.sorted = data),
  setUnsortedList: (state: any, data: Array<IKanji>) => (state.workingList.unsorted = data),
  setAllFiltered: (state: any, data: Array<number>) => (state.workingList.allFiltered = data),
  setKanjiOnly: (state: any, data: IKanjiOnly) => (state.workingList.kanjiOnly = data),
  setUniqueKanji: (state: any, data: number) => (state.uniqueKanji = data),
  setTotalKanji: (state: any, data: number) => (state.totalKanji = data),
  setMode: (state: any, data: 'replace' | 'add') => (state.mode = data),
  // Kanji list property setters
  setKLOriginal: (state: any, data: Array<number>) => (state.kanjiList.original = data),
  setKLSortedList: (state: any, data: Array<IKanjiListEntry>) => (state.kanjiList.sorted = data),
  setKLUnsortedList: (state: any, data: Array<IKanjiListEntry>) => (state.kanjiList.unsorted = data),
  setKLKanjiOnly: (state: any, data: IKanjiOnly) => (state.kanjiList.kanjiOnly = data),
  setKanjiList: (state: any, data: Array<Boolean>) => (state.kanjiList.list = data),
  // Results settings setters
  setView: (state: any, data: 'default' | 'kanjionly') => (state.resultsSettings.view = data),
  setSortType: (state: any, data: SortType) => (state.resultsSettings.sortType = data),
  setRepeats: (state: any, data: boolean) => (state.resultsSettings.repeats = data),
  setReversed: (state: any, data: boolean) => (state.resultsSettings.reversed = data),
  setFilterType: (state: any, data: FilterType) => (state.resultsSettings.filterType = data),
  setNegativeFilter: (state: any, data: boolean) => (state.resultsSettings.negativeFilter = data),
  setUpdate: (state: any, data: boolean) => (state.resultsSettings.update = data),
  // Kanji list settings setters
  setKLView: (state: any, data: 'default' | 'kanjionly') => (state.kanjiListSettings.view = data),
  setKLSortType: (state: any, data: SortType) => (state.kanjiListSettings.sortType = data),
  setKLReversed: (state: any, data: boolean) => (state.kanjiListSettings.reversed = data),
  setKLFilterType: (state: any, data: FilterType) => (state.kanjiListSettings.filterType = data),
  setKLNegativeFilter: (state: any, data: boolean) => (state.kanjiListSettings.negativeFilter = data),
};

export const actions = {
  loadKanjiList({ commit }: any) {
    if (process.client) {
      const kanjiList = JSON.parse(localStorage.getItem('kanji-list'));

      if (kanjiList) {
        commit('setKLOriginal', kanjiList.original);
        commit('setKLSortedList', kanjiList.sorted);
        commit('setKLUnsortedList', kanjiList.unsorted);
        commit('setKLKanjiOnly', kanjiList.kanjiOnly);
        commit('setKanjiList', kanjiList.list);
      }
    }
  },
  getKanji({ dispatch }: any, { input, newK = false }: { input: string; newK: boolean }) {
    dispatch('sortWorkingList', { input, newK });
  },
  addToList({ dispatch }: any) {
    dispatch('sortKanjiList', true);
  },
  sortKanjiList({ state, commit, dispatch }: any, add = false) {
    if (state.uniqueKanji > 0) {
      const input = (
        add ? [...state.kanjiList.original, ...state.workingList.allFiltered] : state.kanjiList.original
      ) as Array<number>;
      const sortType = state.kanjiListSettings.sortType;
      const filterType = state.kanjiListSettings.filterType;
      const compareFunc = getCompareFunc(state.kanjiData, sortType);

      let tempOriginal = [] as Array<number>;
      let tempSorted = new KanjiLinkedList(null, compareFunc);
      let tempUnsorted = [] as Array<IKanjiListEntry>;
      let tempKanjiOnly = { sorted: '', unsorted: '' } as IKanjiOnly; // for the kanji only output
      let tempList = new Array<Boolean>(state.kanjiData.length);

      for (let i = 0; i < input.length; i++) {
        const id = input[i];

        // This prevents repeats
        if (!tempList[id]) {
          let kanji = state.kanjiData[id];
          tempList[id] = true;
          tempOriginal.push(id);

          if (isSortable(kanji, sortType)) {
            tempSorted.addToList(id);
          } else if (isInFilter(kanji, filterType, state.kanjiListSettings.negativeFilter)) {
            tempUnsorted.push({
              ...kanji,
              index: -1,
            });
            tempKanjiOnly.unsorted += kanji.c;
          }
        }
      }

      // Save the sorted list into an array ready for display while filtering it and assigning indices
      let tempSortedKanji = [] as Array<IKanjiListEntry>;
      let pointer = tempSorted.head as ListNode<number>;
      let index = 0;

      for (let i = 0; i < tempSorted.length; i++) {
        if (!pointer) break;
        let fullKanji = state.kanjiData[pointer.data];

        if (isInFilter(fullKanji, filterType, state.kanjiListSettings.negativeFilter)) {
          index++;

          tempSortedKanji.push({
            ...fullKanji,
            index,
          });
          tempKanjiOnly.sorted += fullKanji.c; // for kanjionly view
        }

        pointer = pointer.next;
      }

      commit('setKLOriginal', tempOriginal);
      commit('setKLSortedList', tempSortedKanji);
      commit('setKLUnsortedList', tempUnsorted);
      commit('setKLKanjiOnly', tempKanjiOnly);
      commit('setKanjiList', tempList);

      if (state.resultsSettings.reversed) dispatch('changeSortingDirection', true);

      if (state.resultsSettings.filterType === FilterType.List && state.resultsSettings.update)
        dispatch('sortWorkingList');

      // Save list to local storage
      if (process.client) localStorage.setItem('kanji-list', JSON.stringify(state.kanjiList));
    }
  },
  // OPTIMIZE FILTERING WHEN NOTHING BUT THE FILTER HAS CHANGED
  // OPTIMIZE REVERSING WHEN NOTHING BUT REVERSE HAS CHANGED
  // newK is true when the "Get new kanji" was pressed
  sortWorkingList({ state, commit, dispatch }: any, { input, newK } = { input: '', newK: false }) {
    if (input || state.workingList.original.length > 0) {
      const sortType = state.resultsSettings.sortType;
      const filterType = state.resultsSettings.filterType;

      let kanjiOccurrences = new Array<number>(state.kanjiData.length);
      let tempOriginal = [] as Array<number>;
      let tempSorted: KanjiLinkedList; // for the default output
      let tempTextSorted: Array<IKanjiMin>;
      let tempUnsorted = [] as Array<IKanji>;
      let tempAllFiltered = [] as Array<number>;
      let tempKanjiOnly = { sorted: '', unsorted: '' } as IKanjiOnly; // for the kanji only output

      // Initialize sorted list depending on the sort type
      if (sortType === SortType.TextOrder) tempTextSorted = new Array<IKanjiMin>();
      else {
        const compareFunc = getCompareFunc(
          sortType === SortType.Occurrences ? kanjiOccurrences : state.kanjiData,
          sortType,
        );
        tempSorted = new KanjiLinkedList(null, compareFunc);
      }

      // One iteration of the loop that takes the id of the character that needs to be added
      const loop = (id: number) => {
        if (!newK || !state.kanjiList.list[id]) {
          let kanji = state.kanjiData[id];
          tempOriginal.push(id);

          if (kanjiOccurrences[id]) kanjiOccurrences[id]++;
          else kanjiOccurrences[id] = 1;

          if (sortType === SortType.TextOrder) {
            if (kanjiOccurrences[id] === 1) tempTextSorted.push({ i: id, repeat: false });
            else tempTextSorted.push({ i: id, repeat: true });
          } else if (sortType === SortType.Occurrences) {
            if (kanjiOccurrences[id] > 1) tempSorted.repositionInList(id);
            else tempSorted.addToList(id);
          } else if (kanjiOccurrences[id] === 1) {
            if (isSortable(kanji, sortType)) {
              tempSorted.addToList(id);
            } else if (
              isInFilter(kanji, filterType, state.resultsSettings.negativeFilter, state.kanjiList.list[id])
            ) {
              tempUnsorted.push({
                ...kanji,
                occurrences: kanjiOccurrences[id],
                index: -1,
              });
              tempKanjiOnly.unsorted += kanji.c;
              tempAllFiltered.push(id);
            }
          }
        }
      };

      // If we're in add mode or the input is empty, go through all of the previously
      // added characters, while keeping the list sorted
      if (state.mode === 'add' || !input)
        for (let i = 0; i < state.workingList.original.length; i++) loop(state.workingList.original[i]);

      // Iterate through the input and add all kanji to the list while keeping it sorted
      for (let i = 0; i < input.length; i++) {
        let id = hash(input[i]) as number;
        // If the hash function didn't return null, that means the character is a kanji
        if (id !== null) loop(id);
      }

      // Save the sorted list into an array ready for display while filtering it and assigning indices
      let tempSortedKanji = [] as Array<IKanji>;
      let tempUniqueKanji = 0;

      const setNextKanji = (kanjiId: number, repeat: boolean) => {
        let fullKanji = state.kanjiData[kanjiId];

        if (
          isInFilter(
            fullKanji,
            filterType,
            state.resultsSettings.negativeFilter,
            state.kanjiList.list[kanjiId],
          )
        ) {
          if (!repeat) {
            tempUniqueKanji++;
            tempAllFiltered.push(kanjiId);
          }

          tempSortedKanji.push({
            ...fullKanji,
            index: repeat ? 0 : tempUniqueKanji,
            occurrences: kanjiOccurrences[kanjiId],
          });
          tempKanjiOnly.sorted += fullKanji.c; // for kanjionly view
        }
      };

      if (sortType === SortType.TextOrder) {
        for (let i = 0; i < tempTextSorted.length; i++)
          setNextKanji(tempTextSorted[i].i, tempTextSorted[i].repeat);
      } else if (tempSorted.length > 0) {
        let pointer = tempSorted.head as ListNode<number>;

        for (let i = 0; i < tempSorted.length; i++) {
          if (!pointer) break;
          setNextKanji(pointer.data, false);
          pointer = pointer.next;
        }
      }

      // Add unsorted kanji to the unique kanji total (unsorted kanji can't have repeats anyways)
      tempUniqueKanji += tempUnsorted.length;

      commit('setOriginal', tempOriginal);
      commit('setSortedList', tempSortedKanji);
      commit('setUnsortedList', tempUnsorted);
      commit('setAllFiltered', tempAllFiltered);
      commit('setKanjiOnly', tempKanjiOnly);
      commit('setUniqueKanji', tempUniqueKanji);
      commit('setTotalKanji', tempOriginal.length);

      if (state.resultsSettings.reversed) dispatch('changeSortingDirection', true);
    }
  },
  changeSortingDirection: ({ state, commit }: any, results: boolean) => {
    if (results) {
      commit('setSortedList', state.workingList.sorted.slice().reverse());

      const kanjiOnly = {
        sorted: state.workingList.kanjiOnly.sorted.split('').reverse().join(''),
        unsorted: state.workingList.kanjiOnly.unsorted,
      };
      commit('setKanjiOnly', kanjiOnly);
    } else {
      commit('setKLSortedList', state.kanjiList.sorted.slice().reverse());

      const kanjiOnly = {
        sorted: state.kanjiList.kanjiOnly.sorted.split('').reverse().join(''),
        unsorted: state.kanjiList.kanjiOnly.unsorted,
      };
      commit('setKLKanjiOnly', kanjiOnly);
    }
  },
  reset: ({ commit }: any) => {
    commit('setOriginal', []);
    commit('setSortedList', []);
    commit('setUnsortedList', []);
    commit('setKanjiOnly', { sorted: '', unsorted: '' });
    commit('setUniqueKanji', 0);
    commit('setTotalKanji', 0);
  },
  clearKanjiList: ({ state, commit }: any) => {
    commit('setKLOriginal', []);
    commit('setKLSortedList', []);
    commit('setKLUnsortedList', []);
    commit('setKLKanjiOnly', { sorted: '', unsorted: '' });
    commit('setKanjiList', []);

    if (process.client) localStorage.setItem('kanji-list', JSON.stringify(state.kanjiList));
  },
  changeView({ commit }: any, { results, value }: { results: boolean; value: 'default' | 'kanjionly' }) {
    if (results) commit('setView', value);
    else commit('setKLView', value);
  },
  changeRepeats({ state, commit, dispatch }: any, value: boolean) {
    commit('setRepeats', value);
    if (state.resultsSettings.update) dispatch('sortWorkingList');
  },
  changeReversed({ state, commit, dispatch }: any, { results, value }: { results: boolean; value: boolean }) {
    if (results) {
      commit('setReversed', value);
      if (state.resultsSettings.update) dispatch('sortWorkingList');
    } else {
      commit('setKLReversed', value);
      if (state.resultsSettings.update) dispatch('sortKanjiList');
    }
  },
  changeSortType(
    { state, commit, dispatch }: any,
    { results, value }: { results: boolean; value: SortType },
  ) {
    if (results) {
      commit('setSortType', value);
      if (state.resultsSettings.update) dispatch('sortWorkingList');
    } else {
      commit('setKLSortType', value);
      if (state.resultsSettings.update) dispatch('sortKanjiList');
    }
  },
  changeFilterType(
    { state, commit, dispatch }: any,
    { results, value }: { results: boolean; value: FilterType },
  ) {
    if (results) {
      commit('setFilterType', value);
      if (state.resultsSettings.update) dispatch('sortWorkingList');
    } else {
      commit('setKLFilterType', value);
      if (state.resultsSettings.update) dispatch('sortKanjiList');
    }
  },
  changeNegativeFilter(
    { state, commit, dispatch }: any,
    { results, value }: { results: boolean; value: boolean },
  ) {
    if (results) {
      commit('setNegativeFilter', value);
      if (state.resultsSettings.update) dispatch('sortWorkingList');
    } else {
      commit('setKLNegativeFilter', value);
      if (state.resultsSettings.update) dispatch('sortKanjiList');
    }
  },
  changeUpdate({ commit, dispatch }: any, value: boolean) {
    commit('setUpdate', value);

    if (value) {
      dispatch('sortWorkingList');
      dispatch('sortKanjiList');
    }
  },
};
