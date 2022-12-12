import { defineStore } from 'pinia';
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
import { ListType, ViewType, Mode } from '~/helpers/enums/index';
import { SortType } from '~/helpers/enums/sortType';
import { FilterType } from '~/helpers/enums/filterType';

export const useKanjiSorterStore = defineStore('kanjiSorterStore', {
  state: () => ({
    // Data for all kanji
    kanjiData: [] as IKanjiDB[],
    kanjiLists: {} as IKanjiLists,
    results: {
      // Original list of kanji indices (INCLUDING repeats and ignoring the filter)
      original: [] as number[],
      // List of sorted and filtered kanji
      sorted: [] as IKanji[],
      // Filtered kanji that cannot be sorted (not covered by the sort type)
      unsorted: [] as IKanji[],
      // Indices of all filtered kanji without repeats to be used for adding to the kanji list
      allFiltered: [] as number[],
      // Final output for the kanji only view
      kanjiOnly: { sorted: '', unsorted: '' } as IKanjiOnly,
    },
    uniqueKanji: 0,
    totalKanji: 0,
    mode: Mode.Replace,
    update: true,
    resultsSettings: {
      view: ViewType.Default,
      repeats: false,
      reversed: false,
      sortType: SortType.TextOrder,
      filterType: FilterType.None,
      negativeFilter: false,
    },
    // There can't be repeats here
    kanjiList: {
      // Original list of kanji indices in the list WITHOUT repeats
      original: [] as number[],
      // List of sorted and filtered kanji
      sorted: [] as IKanjiListEntry[],
      // Filtered kanji that cannot be sorted (not covered by the sort type)
      unsorted: [] as IKanjiListEntry[],
      // For kanji only output
      kanjiOnly: { sorted: '', unsorted: '' } as IKanjiOnly,
      // Array with the length of the kanji DB. Each item says whether or not the kanji is in the list.
      list: [] as boolean[],
    },
    kanjiListSettings: {
      view: ViewType.Default,
      reversed: false,
      sortType: SortType.Newspapers, // this can't have text order sort or number of occurrences sort
      filterType: FilterType.None, // this can't have kanji list sort
      negativeFilter: false,
    },
  }),

  /**
   *  GETTERS
   */
  getters: {
    getKanjiOnly:
      (state: any) =>
      (listType: ListType): string => {
        const list = listType === ListType.Results ? state.results : state.kanjiList;
        let output = list.kanjiOnly.sorted as string;

        if (list.kanjiOnly.unsorted) {
          if (output) {
            output += '\n\n';
          }
          output += 'Unsorted:\n' + list.kanjiOnly.unsorted;
        }
        return output;
      },
  },

  /**
   *  ACTIONS
   */
  actions: {
    // OPTIMIZE FILTERING WHEN NOTHING BUT THE FILTER HAS CHANGED
    // OPTIMIZE REVERSING WHEN NOTHING BUT REVERSE HAS CHANGED
    // newK is true when the "Get new kanji" was pressed
    sortResults(input = '', newK = false) {
      if (input || this.results.original.length > 0) {
        const sortType = this.resultsSettings.sortType;
        const filterType = this.resultsSettings.filterType;

        let kanjiOccurrences = new Array<number>(this.kanjiData.length);
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
            sortType === SortType.Occurrences ? kanjiOccurrences : this.kanjiData,
            sortType,
          );
          tempSorted = new KanjiLinkedList(null, compareFunc);
        }

        // One iteration of the loop that takes the id of the character that needs to be added
        const loop = (id: number, readd = false) => {
          if (!newK || readd || !this.kanjiList.list[id]) {
            let kanji = this.kanjiData[id];
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
                isInFilter(kanji, filterType, this.resultsSettings.negativeFilter, this.kanjiList.list[id])
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
        if (this.mode === 'add' || !input) {
          for (let i = 0; i < this.results.original.length; i++) {
            loop(this.results.original[i], true);
          }
        }

        // Iterate through the input and add all kanji to the list while keeping it sorted
        for (let i = 0; i < input.length; i++) {
          const id = hash(input[i]) as number;

          // If the hash function didn't return null, that means the character is a kanji
          if (id !== null) {
            loop(id);
          }
        }

        // Save the sorted list into an array ready for display while filtering it and assigning indices
        let tempSortedKanji = [] as Array<IKanji>;
        let tempUniqueKanji = 0;

        const setNextKanji = (kanjiId: number, repeat: boolean) => {
          let fullKanji = this.kanjiData[kanjiId];

          if (
            isInFilter(
              fullKanji,
              filterType,
              this.resultsSettings.negativeFilter,
              this.kanjiList.list[kanjiId],
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

        // Mutations
        this.results.original = tempOriginal;
        this.results.sorted = tempSortedKanji;
        this.results.unsorted = tempUnsorted;
        this.results.allFiltered = tempAllFiltered;
        this.results.kanjiOnly = tempKanjiOnly;
        this.uniqueKanji = tempUniqueKanji;
        this.totalKanji = tempOriginal.length;

        if (this.resultsSettings.reversed) this.changeSortingDirection();
      }
    },
    // add is true when we're adding more characters to the list, as opposed to resorting the existing list
    sortKanjiList(add = false) {
      if (this.uniqueKanji > 0 || !add) {
        const input = (
          add ? [...this.kanjiList.original, ...this.results.allFiltered] : this.kanjiList.original
        ) as Array<number>;
        const sortType = this.kanjiListSettings.sortType;
        const filterType = this.kanjiListSettings.filterType;
        const compareFunc = getCompareFunc(this.kanjiData, sortType);

        let tempOriginal = [] as Array<number>;
        let tempSorted = new KanjiLinkedList(null, compareFunc);
        let tempUnsorted = [] as Array<IKanjiListEntry>;
        let tempKanjiOnly = { sorted: '', unsorted: '' } as IKanjiOnly; // for the kanji only output
        let tempList = new Array<Boolean>(this.kanjiData.length);

        for (let i = 0; i < input.length; i++) {
          const id = input[i];

          // This prevents repeats
          if (!tempList[id]) {
            let kanji = this.kanjiData[id];
            tempList[id] = true;
            tempOriginal.push(id);

            if (isSortable(kanji, sortType)) {
              tempSorted.addToList(id);
            } else if (isInFilter(kanji, filterType, this.kanjiListSettings.negativeFilter)) {
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
          let fullKanji = this.kanjiData[pointer.data];

          if (isInFilter(fullKanji, filterType, this.kanjiListSettings.negativeFilter)) {
            index++;

            tempSortedKanji.push({
              ...fullKanji,
              index,
            });
            tempKanjiOnly.sorted += fullKanji.c; // for kanjionly view
          }

          pointer = pointer.next;
        }

        this.kanjiList.original = tempOriginal;
        this.kanjiList.sorted = tempSortedKanji;
        this.kanjiList.unsorted = tempUnsorted;
        this.kanjiList.kanjiOnly = tempKanjiOnly;
        this.kanjiList.list = tempList;

        if (this.kanjiListSettings.reversed) this.changeSortingDirection();
        if (this.kanjiListSettings.filterType === FilterType.List && this.update) this.sortResults();

        // Save list to local storage
        if (process.client) {
          localStorage.setItem('kanji-list', JSON.stringify(this.kanjiList));
        }
      }
    },
    resetOutput() {
      this.results.original = [];
      this.results.sorted = [];
      this.results.unsorted = [];
      this.results.kanjiOnly = { sorted: '', unsorted: '' };
      this.uniqueKanji = 0;
      this.totalKanji = 0;
    },
    clearKanjiList() {
      this.kanjiList.original = [];
      this.kanjiList.sorted = [];
      this.kanjiList.unsorted = [];
      this.kanjiList.kanjiOnly = { sorted: '', unsorted: '' };
      this.kanjiList.list = [];

      if (process.client) {
        localStorage.setItem('kanji-list', JSON.stringify(this.kanjiList));
      }
    },
    resortList(listType: ListType) {
      if (this.update && listType === ListType.Results) {
        this.sortResults();
      } else if (this.update && listType === ListType.KanjiList) {
        this.sortKanjiList();
      }
    },
    changeSortingDirection() {
      this.results.sorted = this.results.sorted.slice().reverse();

      this.results.kanjiOnly = {
        sorted: this.results.kanjiOnly.sorted.split('').reverse().join(''),
        unsorted: this.results.kanjiOnly.unsorted,
      };
    },
    changeRepeats(value: boolean) {
      this.resultsSettings.repeats = value;
      if (this.update) this.sortResults();
    },
    changeReversed(listType: ListType, value: boolean) {
      this[`${listType}Settings`].reversed = value;
      this.resortList(listType);
    },
    changeSortType(listType: ListType, value: SortType) {
      this[`${listType}Settings`].sortType = value;
      this.resortList(listType);
    },
    changeFilterType(listType: ListType, value: FilterType) {
      this[`${listType}Settings`].filterType = value;
      this.resortList(listType);
    },
    changeNegativeFilter(listType: ListType, value: boolean) {
      this[`${listType}Settings`].negativeFilter = value;
      this.resortList(listType);
    },
    changeUpdate(value: boolean) {
      this.update = value;

      if (value) {
        this.sortKanjiList();
        this.sortResults();
      }
    },
  },
});
