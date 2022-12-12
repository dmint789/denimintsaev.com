export class SortedLinkedList<T> {
  head: ListNode<T>;
  tail: ListNode<T>;
  length: number;
  // Compare function for sorting the list
  compare: (a: T, b: T) => number;

  constructor(data = null as T, compare = null as (a: T, b: T) => number) {
    if (data) {
      this.head = new ListNode<T>(data, null);
      this.length = 1;
    } else {
      this.head = null;
      this.length = 0;
    }

    if (compare) this.compare = compare;
  }

  // Add item to the end of the list (or add first item if there aren't any)
  addToEnd(item: T) {
    if (this.tail) {
      this.tail.next = new ListNode<T>(item, this.tail);
      this.tail = this.tail.next;
    } else {
      this.head = new ListNode<T>(item, null, null);
      this.tail = this.head;
    }
    this.length++;
  }

  // Add item to where it belongs in the list. A compare function must have been provided to the class object.
  // This assumes that all items provided are unique.
  addToList(item: T) {
    if (this.length === 0) {
      this.head = new ListNode<T>(item, null, null);
      this.tail = this.head;
    } else {
      let tempItem = this.head;

      while (tempItem.next !== null && this.compare(item, tempItem.data) >= 0) tempItem = tempItem.next;

      if (tempItem === this.head) {
        // This covers the case where the new item goes in before the head
        if (this.compare(item, this.head.data) < 0) {
          this.head = new ListNode<T>(item, null, this.head);
          this.head.next.previous = this.head;
        }
        // This covers the case where the new item goes in after the head, when there is only one item in the list
        else {
          this.tail = new ListNode<T>(item, this.head, null);
          this.head.next = this.tail;
        }
      }
      // This covers the case where the new item goes in after the tail
      else if (tempItem === this.tail && this.compare(item, this.tail.data) >= 0) {
        this.tail = new ListNode<T>(item, this.tail, null);
        this.tail.previous.next = this.tail;
      } else {
        // Insert new item before tempItem
        tempItem.previous = new ListNode<T>(item, tempItem.previous, tempItem);
        tempItem.previous.previous.next = tempItem.previous;
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
  // This assumes that the given item does already exist somewhere in the list
  // and that there is at least one item in the list.
  repositionInList(item: number) {
    let tempItem = this.head;

    while (this.compare(item, tempItem.data) >= 0) tempItem = tempItem.next;

    if (tempItem === this.head) {
      // This covers the case where the item was already in the head position, so nothing is changed
      if (this.head.data === item) return;
      // This covers the case where the item is repositioned to before the head
      else {
        this.head = new ListNode<number>(item, null, this.head);
        this.head.next.previous = this.head;
      }
    } else {
      // Reposition the item if it doesn't remain in the same spot
      if (tempItem.previous.data === item) return;

      tempItem.previous = new ListNode<number>(item, tempItem.previous, tempItem);
      tempItem.previous.previous.next = tempItem.previous;
      tempItem = tempItem.next;
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
