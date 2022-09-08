class SortedLinkedList<T> {
  head: ListNode<T>;
  tail: ListNode<T>;
  length: number;
  // Compare function for sorting the list
  compare: (a: T, b: T) => number;

  constructor(data = null as T, compare: (a: T, b: T) => number) {
    if (data) {
      this.head = new ListNode<T>(data, null);
      this.length = 1;
    } else {
      this.head = null;
      this.length = 0;
    }

    if (compare) this.compare = compare;
  }

  // Add item to the end of the list
  addToEnd(item: T) {
    let tempItem = this.head;

    while (tempItem.next !== null) {
      tempItem = tempItem.next;
    }

    // Add item to the end
    tempItem.next = new ListNode<T>(item, tempItem);
    // Refer the head to this last item
    this.tail = tempItem.next;
    this.length++;
  }

  // Add item to where it belongs in the list. A compare function must have been provided to the class object.
  // This assumes that all items provided are unique.
  addToList(item: T) {
    if (this.head && this.compare(item, this.head.data) >= 0) {
      let tempItem = this.head;

      while (tempItem.next !== null && this.compare(item, tempItem.next.data) >= 0)
        tempItem = tempItem.next;

      // Insert new item after tempItem
      tempItem.next = new ListNode<T>(item, tempItem, tempItem.next);

      // Check if there was an item under the newly inserted one and refer the item
      // after that (or the head if we're at the end of the list) back to the new item
      if (tempItem.next.next) {
        tempItem.next.next.previous = tempItem.next;
      } else {
        this.tail = tempItem.next;
      }
    } else {
      // If the new item is ranked higher than the head, set it as the new head item
      this.head = new ListNode<T>(item, null, this.head);
      // If this wasn't the first time an item was set, refer the previous head back to the new head item
      if (this.head.next) {
        this.head.next.previous = this.head;
      }
    }
    this.length++;
  }
}

export class ListNode<T> {
  data: T;
  previous: ListNode<T>;
  next: ListNode<T>;

  constructor(data: T, previous: ListNode<T>, next = null as ListNode<T>) {
    this.data = data;
    this.previous = previous;
    this.next = next;
  }
}

export class KanjiLinkedList extends SortedLinkedList<number> {
  // Reposition the item to earlier in the list.
  // This assumes that the given item does exist somewhere in the list.
  repositionInList(item: number) {
    func: {
      let tempItem = this.head;

      if (this.compare(item, this.head.data) >= 0) {
        while (this.compare(item, tempItem.next.data) >= 0) {
          tempItem = tempItem.next;
        }

        // If we came across the item we're trying to reposition, that means it's supposed to stay in the same spot
        if (tempItem.data === item) break func;

        // Insert new item after tempItem
        tempItem.next = new ListNode<number>(item, tempItem, tempItem.next);
        tempItem.next.next.previous = tempItem.next;
        tempItem = tempItem.next.next;
      } else {
        // If we came across the item we're trying to reposition, that means it's supposed to stay in the same spot
        if (tempItem.data === item) break func;

        // If the new item is ranked higher than the head, set it as the new head item
        this.head = new ListNode<number>(item, null, this.head);
        // Refer the previous head back to the new head item
        this.head.next.previous = this.head;
        tempItem = this.head.next;
      }

      // Continue iterating to find the first copy
      while (tempItem.data !== item) tempItem = tempItem.next;
      // Remove first copy of the item
      if (tempItem !== this.tail) {
        tempItem.previous.next = tempItem.next;
        tempItem.next.previous = tempItem.previous;
      } else {
        tempItem.previous.next = null;
        this.tail = tempItem.previous;
      }
    }
  }
}
