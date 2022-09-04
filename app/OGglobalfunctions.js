import wixWindow from 'wix-window';
import wixLocation from 'wix-location';
//import {session} from 'wix-storage';

//Checks if the input is a number, checks if it is positive or negative if needed and excludes 0 if needed
//checkSign = 0 means we don't need to check; 1 means it needs to be positive (or 0); -1 means it needs to be negative (or 0)
export function isNum(value, checkSign = 0, excludeZero = false) {
  if (
    parseInt(value, 10).toString() === value ||
    parseInt(value, 10) === value
  ) {
    if (
      checkSign === 0 ||
      (checkSign === 1 && value >= 0) ||
      (checkSign === -1 && value <= 0)
    ) {
      if (excludeZero === false || value !== 0) return true;
      else return false;
    } else return false;
  } else return false;
}

//Shows a pop-up message with the specified information and reloads the page if necessary (false by default)
export async function showMessage(text, reload = false) {
  await wixWindow.openLightbox('Message', { message: text }).then(() => {
    if (reload) wixLocation.to('https://www.denimintsaev.com/kanjisorter');
  });
}

//Counts how many occurences of the specified character exist in the specified text
export function countChar(text, character) {
  let number = 0;

  for (let ch of text) if (ch === character) number++;

  return number;
}

//Returns index of the specified element in the specified array.
//If the array contains objects and a property id is specified, then the specified property in each array item will be checked using the id.
//If the specified element does not exist in the array, undefined will be returned.
export function findIndexInArray(element, array, id = undefined) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][id] === element) return i;
    else if (array[i][id] === undefined && array[i] === element) return i;
  }

  return undefined;
}

//Returns inverted version of a string
export function invertString(input) {
  let inv = '';

  for (let i = input.length - 1; i >= 0; i--) {
    inv += input[i];
  }

  return inv;
}

//Function for inverting an array
export function invertArray(input) {
  let inv = new Array();

  for (let i = 0; i < input.length; i++) inv[i] = input[input.length - i - 1];

  return inv;
}

//Sorts an array of objects based on one numeric property of the objects using Quick sort going from high to low. Array is the array that needs to be sorted and id is the id of the property used for sorting the array.
export function sortArrayByProperty(array, id, highToLow = true) {
  if (array.length > 2) {
    let pivot = Math.round(array.length / 2) - 1;
    let done = false;

    array = swap(pivot, array.length - 1, array);
    pivot = array.length - 1;

    let itemFromLeft = { object: array[0], index: 0 };
    let itemFromRight = { object: array[pivot - 1], index: pivot - 1 };

    let debug = 0;
    while (itemFromLeft['index'] < itemFromRight['index'] && debug < 1000) {
      //This is for catching when Quick sort gets stuck in a loop
      debug++;
      //Older version that uses sessions
      //session.setItem("qsi", (parseInt(session.getItem("qsi"), 10) + 1).toString());

      //Finds itemFromLeft
      if (itemFromLeft['object'][id] >= array[pivot][id]) {
        for (let i = 1; i < pivot; i++) {
          if (
            array[i][id] <= array[pivot][id] &&
            array[i][id] !== itemFromLeft['object'][id]
          ) {
            itemFromLeft = { object: array[i], index: i };
            break;
          }
        }
        //Breaks out of the while loop if we find out that the pivot has the lowest value in the array and nothing else has the same value
        if (itemFromLeft['object'][id] > array[pivot][id]) break;
      }

      //Finds itemFromRight
      if (
        itemFromRight['object'][id] < array[pivot][id] ||
        itemFromRight['object'][id] === itemFromLeft['object'][id]
      ) {
        for (let i = pivot - 2; i >= 0; i--) {
          if (
            array[i][id] >= array[pivot][id] &&
            array[i][id] > itemFromLeft['object'][id] &&
            array[i][id] !== itemFromRight['object'][id]
          ) {
            itemFromRight = { object: array[i], index: i };
            break;
          }
        }
        //Breaks out of the while loop if we find out that the pivot has the highest value in the array and nothing else has the same value
        if (itemFromRight['object'][id] < array[pivot][id]) {
          array = swap(0, pivot, array);
          pivot = 0;
          break;
        }
      }

      if (itemFromLeft['index'] < itemFromRight['index']) {
        if (
          itemFromLeft['index'] !== itemFromRight['index'] &&
          itemFromLeft['object'][id] !== itemFromRight['object'][id]
        ) {
          array = swap(itemFromLeft['index'], itemFromRight['index'], array);
          itemFromLeft = { object: array[0], index: 0 };
          itemFromRight = { object: array[pivot - 1], index: pivot - 1 };
        } else {
          done = true;
          break;
        }
      } else {
        array = swap(itemFromLeft['index'], array.length - 1, array);
        pivot = itemFromLeft['index'];
      }
    }

    //This is for catching when Quick sort gets stuck in a loop
    if (debug >= 1000) {
      done = true;
      showMessage(
        'An error has occurred! Please send an email to alphavitagama@yandex.ru with the following message: "Error: Over 1000 iterations"',
        true
      );
    }

    //This won't run the recursive functions if we see that this part of the array is sorted already
    if (!done) {
      //First two if/else statements deal with the pivot being in the very beginning or the very end
      if (pivot !== 0) {
        if (pivot !== array.length - 1) {
          //All of these if/else statements check if there is more than one element to the left and to the right of the pivot
          if (array.slice(0, pivot).length > 1) {
            if (array.slice(pivot + 1).length > 1)
              array = new Array(
                ...sortArrayByProperty(array.slice(0, pivot), id),
                array[pivot],
                ...sortArrayByProperty(array.slice(pivot + 1), id)
              );
            else
              array = new Array(
                ...sortArrayByProperty(array.slice(0, pivot), id),
                array[pivot],
                array[pivot + 1]
              );
          } else if (array.slice(pivot + 1).length > 1)
            array = new Array(
              array[0],
              array[1],
              ...sortArrayByProperty(array.slice(pivot + 1), id)
            );
        } else
          array = new Array(
            ...sortArrayByProperty(array.slice(0, array.length - 1), id),
            array[array.length - 1]
          );
      } else
        array = new Array(array[0], ...sortArrayByProperty(array.slice(1), id));
    }
  } else if (array.length > 1 && array[0][id] < array[1][id])
    array = swap(0, 1, array);

  if (!highToLow) array = invertArray(array);

  return array;
}
//Used for sortArrayByProperty function. It swaps two elements in the array based on their ids. id is still just the property id passed on from the previous function
function swap(id1, id2, array) {
  let temp = array[id1];
  array[id1] = array[id2];
  array[id2] = temp;

  return array;
}

// The following code demonstrates how to call the add
// function from your site's page code or site code.

/* 
import {add} from 'public/global_functions.js'

$w.onReady(function () {	
    let sum = add(6,7);
    console.log(sum);
});
*/

//The following code demonstrates how to call the add
//function in one of your site's backend files.

/* 
import {add} from 'public/global_functions.js'

export function usingFunctionFromPublic(a, b) {
	return add(a,b);
}
*/
