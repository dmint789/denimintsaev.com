import { session } from 'wix-storage';
import wixWindow from 'wix-window';
//import wixLocation from 'wix-location';
import wixData from 'wix-data';
import wixUsers from 'wix-users';
import { showMessage } from 'public/global_functions.js';
import { invertString } from 'public/global_functions.js';
import { countChar } from 'public/global_functions.js';
import { invertArray } from 'public/global_functions.js';
import { sortArrayByProperty } from 'public/global_functions.js';
import { findIndexInArray } from 'public/global_functions.js';

function assignConstants() {
  allKanji = '';
  kanjiData = '';
  newspaperSort = '';
  novelSort = '';
  strokeSort = '';
  joyo = '';
  jlpt = {};

  // No point in this anymore
  sortKanjiInfo(kanjiData);
}

let kanjiInfo = new Array();
let allKanji;
let kanjiData;
let newspaperSort;
let novelSort;
let joyo;
let jlpt;
let strokeSort;
let update = true;

let output = {
  original: '',
  sorted: '',
  unsorted: '',
};
let filter = '';
let loadedList = '';

//-----------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

$w.onReady(function () {
  startProcess(1, false);

  $w('#anchor1').scrollTo();

  assignConstants();

  $w('#text12').text = 'Unique kanji: 0  |  Total kanji: 0';
  $w('#kanjiListCount').text = 'Total kanji: 0';
  $w('#inputBox').value = '';
  $w('#kanjiList').value = '';
  $w('#resultBox').value = '';
  $w('#unsavedChangesText').collapse();

  //Used in the "Import list" feature
  session.setItem('selected', '1');

  if (wixUsers.currentUser.loggedIn) {
    wixData
      .query('kanjilists')
      .contains('_owner', wixUsers.currentUser.id.toString())
      .find()
      .then((result) => {
        if (result.items[0] !== undefined) {
          $w('#kanjiList').value = result.items[0]['list'];
          $w('#kanjiListCount').text = 'Total kanji: ' + $w('#kanjiList').value.length.toString();

          loadedList = result.items[0]['list'];
        }

        endProcess();
      })
      .catch(() => {
        showMessage('An error has occurred!', true);
      });
  } else endProcess();
});

//Updates input filter if selected
export function inputBox_change(event) {
  if ($w('#filter').value === '9') sendUpdate(true, true);
}

//About page button
export async function about_click(event) {
  startProcess(1, false);

  await wixWindow.openLightbox('Kanji Sorter About Page');

  endProcess();
}

//Get kanji button
export function getKanji_click(event) {
  startProcess(2);

  setTimeout(() => {
    turnUpdateOn();

    if (isolateKanji($w('#inputBox').value, allKanji, '') !== '') enterInput('');
    else showMessage('There are no kanji in the input');
  }, 1);

  endProcess();
}

//Get new kanji button
export function getNewKanji_click(event) {
  startProcess(2);

  setTimeout(() => {
    turnUpdateOn();

    if (isolateKanji($w('#inputBox').value, allKanji, '') !== '') {
      if (isolateKanji($w('#kanjiList').value, allKanji, '', true) !== '')
        enterInput($w('#kanjiList').value);
      else showMessage('There are no kanji in your kanji list');
    } else showMessage('There are no kanji in the input');
  }, 1);

  endProcess();
}

//Clear input button
export function button6_click(event) {
  $w('#inputBox').value = '';
  $w('#inputBox').focus();

  if ($w('#filter').value === '9') {
    filter = '';
    $w('#filter').selectedIndex = 0;
    $w('#text12').text =
      'Unique kanji: ' +
      noRepeats(output.original).length.toString() +
      '  |  Total kanji: ' +
      output.original.length.toString();
  }
}

//Add input to list button
export function addInputToList_click(event) {
  addToKanjiList($w('#inputBox').value);
}

//Import list button
export async function button7_click(event) {
  startProcess(1, false);

  await wixWindow
    .openLightbox('Import kanji list', {
      b2: ' Kanji by frequency of use in newspapers',
      b3: ' Kanji by frequency of use in novels',
      b4: ' Kanji by stroke count',
      b5: ' Kanji from JLPT level',
      b6: ' Jōyō kanji list',
      b7: ' Full kanji library',
      list1: newspaperSort,
      list2: novelSort,
      list3: strokeSort,
      'list4.5': jlpt.n5,
      'list4.4': jlpt.n4,
      'list4.3': jlpt.n3,
      'list4.2': jlpt.n2,
      'list4.1': jlpt.n1,
      list5: joyo,
      list6: allKanji,
    })
    .then((data) => {
      if (data !== '' && data !== null) {
        $w('#inputBox').value = data;
        if ($w('#filter').value === '9') {
          filter = isolateKanji(data, allKanji, '', true);
          updateOutput();
        }
      }
    });

  endProcess();
}

//Update on/off button
export function updateButton_click(event) {
  if (update) {
    update = false;

    $w('#updateButton').label = 'Update: Off';
    $w('#updateButton').style.backgroundColor = '#A0A0A0';
  } else turnUpdateOn();
}

//View type change (Default or Kanji only)
export function viewType_change(event) {
  sendUpdate(true);
}

//Sort change
export function sortType_change(event) {
  sendUpdate(true);
}

//Filter change
export function filter_change(event) {
  sendUpdate(true, true);
}

//Show repeats change
export function showRepeats_change(event) {
  sendUpdate();
}

//Reversed change
export function reversed_change(event) {
  sendUpdate();
}

//Add output to kanji list button
export function addResultToList_click(event) {
  addToKanjiList($w('#resultBox').value);
}

//Clear result button
export function button8_click(event) {
  output.original = '';
  output.sorted = '';
  output.unsorted = '';

  $w('#resultBox').value = '';
  $w('#text12').text = 'Total kanji: 0  |  Unique kanji: 0';
}

//Load kanji list button
export function load_click(event) {
  startProcess(3);

  //OLD
  /*if (wixUsers.currentUser.loggedIn) {
		await wixData.query("kanjilists").contains("_owner", wixUsers.currentUser.id.toString()).find()
		.then(result => {
			if (result.items[0] !== undefined) {
				$w("#kanjiList").value = result.items[0]["list"];
				$w('#kanjiListCount').text = "Total kanji: " + $w('#kanjiList').value.length.toString();

				loadedList = result.items[0]["list"];
				$w('#unsavedChangesText').collapse();

				if ($w('#filter').value === "8")
					sendUpdate(true, true);
			}
			else showMessage("Kanji list save not found");
		})
		.catch(() => { showMessage("An error has occurred!", true); });
	}
	else showMessage("You must first log in to be able to load your kanji list");*/

  $w('#kanjiList').value = loadedList;
  $w('#kanjiListCount').text = 'Total kanji: ' + $w('#kanjiList').value.length.toString();
  $w('#unsavedChangesText').collapse();

  if ($w('#filter').value === '8') sendUpdate(true, true);

  endProcess();
}

//Save kanji list button
export async function save_click(event) {
  startProcess(3);

  if (wixUsers.currentUser.loggedIn) {
    if ($w('#kanjiList').value !== '') {
      //Just gets the item id of the kanji list of the current user (if available)
      await wixData
        .query('kanjilists')
        .contains('_owner', wixUsers.currentUser.id.toString())
        .find()
        .then((result) => {
          if (result.items[0] === undefined) {
            //Save kanji list if user does not have one saved
            wixData
              .save('kanjilists', {
                list: $w('#kanjiList').value,
              })
              .then(() => {
                loadedList = $w('#kanjiList').value;
                $w('#unsavedChangesText').collapse();

                showMessage(
                  'Kanji list saved.\nTo load it up next time you will need to log into the same account.'
                );

                endProcess();
              })
              .catch(() => {
                showMessage('An error has occurred!', true);
              });
          } else {
            //Update existing kanji list
            wixData
              .update('kanjilists', {
                _id: result.items[0]['_id'],
                list: $w('#kanjiList').value,
              })
              .then(() => {
                loadedList = $w('#kanjiList').value;
                $w('#unsavedChangesText').collapse();

                showMessage('Kanji list updated');

                endProcess();
              })
              .catch(() => {
                showMessage('An error has occurred!', true);
              });
          }
        })
        .catch(() => {
          showMessage('An error has occurred!', true);
        });
    } else {
      showMessage('The "Kanji list" field is empty');
      endProcess();
    }
  } else {
    showMessage('You must first log in to be able to save your kanji list');
    endProcess();
  }
}

//Delete save button
export async function deleteSave_click(event) {
  startProcess(3);

  //Just gets the item id of the kanji list of the current user (if available)
  if (wixUsers.currentUser.loggedIn) {
    await wixData
      .query('kanjilists')
      .contains('_owner', wixUsers.currentUser.id.toString())
      .find()
      .then((result) => {
        if (result.items[0] !== undefined) {
          wixData
            .remove('kanjilists', result.items[0]['_id'])
            .then(() => {
              loadedList = '';

              showMessage('Kanji list save deleted');

              endProcess();
            })
            .catch(() => {
              showMessage('An error has occurred!', true);
            });
        } else {
          showMessage('Kanji list save not found');
          endProcess();
        }
      })
      .catch(() => {
        showMessage('An error has occurred!', true);
      });
  } else {
    showMessage('You must first log in to be able to delete your kanji list');
    endProcess();
  }
}

//Clear kanji list button
export function clearKanjiList_click(event) {
  startProcess(3);

  $w('#kanjiList').value = '';
  $w('#kanjiListCount').text = 'Total kanji: 0';

  if ($w('#filter').value === '8') {
    filter = '';
    $w('#filter').selectedIndex = 0;
    $w('#text12').text =
      'Unique kanji: ' +
      noRepeats(output.original).length.toString() +
      '  |  Total kanji: ' +
      output.original.length.toString();
  }

  if ($w('#kanjiList').value !== loadedList) {
    $w('#unsavedChangesText').expand();
  }

  endProcess();
}

//Back to top button
export function button11_click(event) {
  $w('#anchor1').scrollTo();
}

//-----------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

//Enters the input into the result. Ignore passes the corresponding value to isolateKanji.
function enterInput(ignore) {
  if ($w('#radioGroup3').selectedIndex === 0)
    output.original = isolateKanji($w('#inputBox').value, allKanji, ignore);
  else output.original += isolateKanji($w('#inputBox').value, allKanji, ignore);

  output = sort(output.original);

  updateOutput(false);
}

//Sends an update for the result box when the user changes a parameter
function sendUpdate(doSort = false, doFilter = false) {
  if (update && output.original !== '') {
    startProcess(2);

    setTimeout(() => {
      //Updates the filter if needed
      if (doFilter) {
        switch ($w('#filter').value) {
          case '1':
            filter = '';
            break;
          case '2':
            filter = joyo;
            break;
          case '3':
            filter = jlpt.n5;
            break;
          case '4':
            filter = jlpt.n4;
            break;
          case '5':
            filter = jlpt.n3;
            break;
          case '6':
            filter = jlpt.n2;
            break;
          case '7':
            filter = jlpt.n1;
            break;
          case '8':
            if ($w('#kanjiList').value !== '') filter = $w('#kanjiList').value;
            else {
              filter = '';
              $w('#filter').selectedIndex = 0;
              showMessage('There are no kanji in your kanji list');
            }
            break;
          case '9':
            if (isolateKanji($w('#inputBox').value, allKanji, '', true) !== '')
              filter = isolateKanji($w('#inputBox').value, allKanji, '', true);
            else {
              filter = '';
              $w('#filter').selectedIndex = 0;
              showMessage('There are no kanji in the input field');
            }
            break;
        }
      }

      //Updates sort if needed
      if (doSort)
        setTimeout(() => {
          output = sort(output.original);
        }, 1);

      updateOutput(false);
    }, 1);

    endProcess();
  }
}

//Returns a string of kanji that only contains the kanji from the input text based on the specified list,
//ignores the specified list and ignores repetitions (itself) if specified
function isolateKanji(text, list, ignore, ignoreItself = false) {
  let iK = '';

  for (let k of text)
    if (
      list.includes(k) &&
      !ignore.includes(k) &&
      ((!iK.includes(k) && ignoreItself) || !ignoreItself)
    )
      iK += k;

  return iK;
}

function sort(input) {
  let obj = {
    original: input,
    sorted: '',
    unsorted: '',
  };
  let sorter;

  switch ($w('#sortType').value) {
    case '2':
      sorter = newspaperSort;
      break;
    case '3':
      sorter = novelSort;
      break;
    case '4':
      sorter = strokeSort;
      break;
    case '5':
      sorter = 'jlpt';
      break;
    //In case sort type is 1 (text order) or 6 (number of occurences in the text)
    default:
      sorter = '';
      break;
  }

  if (sorter !== '') {
    //If we selected newspaper, novel or stroke sort in the default view, this will separate the input into the pile that can be sorted and the pile that is unsorted.
    //The sorting process happens in updateOutput.
    //If we're in kanji only view, then the sorting process happens here for those three sort types.
    if (sorter !== 'jlpt') {
      if ($w('#viewType').selectedIndex === 0) {
        for (let i = 0; i < obj.original.length; i++) {
          if (sorter.includes(obj.original[i])) obj.sorted += obj.original[i];
          else obj.unsorted += obj.original[i];
        }
      } else {
        obj.unsorted = obj.original;

        for (let i of sorter) {
          if (obj.original.includes(i)) {
            if (!obj.sorted.includes(i)) {
              for (let j = 0; j < countChar(obj.original, i); j++) {
                obj.sorted += i;

                let index = findIndexInArray(i, obj.unsorted);
                obj.unsorted = obj.unsorted.substring(0, index) + obj.unsorted.substring(index + 1);
              }
            }
          }
        }
      }
    }
    //Sorts the kanji if JLPT sort is selected
    else {
      sorter = {
        n5: '',
        n4: '',
        n3: '',
        n2: '',
        n1: '',
      };

      for (let i = 0; i < obj.original.length; i++) {
        if (jlpt.n5.includes(obj.original[i])) {
          if (!sorter.n5.includes(obj.original[i])) {
            for (let j = 0; j < countChar(obj.original, obj.original[i]); j++)
              sorter.n5 += obj.original[i];
          }
        } else if (jlpt.n4.includes(obj.original[i])) {
          if (!sorter.n4.includes(obj.original[i])) {
            for (let j = 0; j < countChar(obj.original, obj.original[i]); j++)
              sorter.n4 += obj.original[i];
          }
        } else if (jlpt.n3.includes(obj.original[i])) {
          if (!sorter.n3.includes(obj.original[i])) {
            for (let j = 0; j < countChar(obj.original, obj.original[i]); j++)
              sorter.n3 += obj.original[i];
          }
        } else if (jlpt.n2.includes(obj.original[i])) {
          if (!sorter.n2.includes(obj.original[i])) {
            for (let j = 0; j < countChar(obj.original, obj.original[i]); j++)
              sorter.n2 += obj.original[i];
          }
        } else if (jlpt.n1.includes(obj.original[i])) {
          if (!sorter.n1.includes(obj.original[i])) {
            for (let j = 0; j < countChar(obj.original, obj.original[i]); j++)
              sorter.n1 += obj.original[i];
          }
        } else obj.unsorted += obj.original[i];
      }

      obj.sorted =
        sorter.n5 + '5' + sorter.n4 + '4' + sorter.n3 + '3' + sorter.n2 + '2' + sorter.n1 + '1';
    }
  }

  return obj;
}

//Updates the output and formats everything as it should be. startP determines whether or not we want to start and end a process.
function updateOutput(startP = true) {
  if (startP) startProcess(2);

  setTimeout(() => {
    let newOutput = '';

    if ($w('#sortType').value === '1' || $w('#sortType').value === '6') newOutput = output.original;
    else if (output.sorted !== '') newOutput = output.sorted;

    //Filters out kanji using the filter if it isn't empty (None isn't selected). 12345 are added in case we are sorting by JLPT level.
    if (filter !== '') newOutput = isolateKanji(newOutput, filter + '12345', '');

    //Removes repetitions of the same kanji from newOutput if the Include repetitions checkbox
    //is not checked or if we have selected sorting by number of occurences in the text
    if (!$w('#showRepeats').checked || $w('#sortType').value === '6')
      newOutput = noRepeats(newOutput);

    //Formats DEFAULT output view if we're not sorting by JLPT levels
    if ($w('#viewType').selectedIndex === 0 && $w('#sortType').value !== '5') {
      let rows = new Array();
      //This array contains all of the indices to be displayed
      let indices = new Array();
      let index = 0;

      switch ($w('#sortType').value) {
        case '1':
          for (let i = 0; i < newOutput.length; i++) {
            if (findIndexInArray(newOutput[i], rows) === undefined) {
              index++;
              indices[i] = index;
            } else indices[i] = 0;

            rows[i] = newOutput[i];
          }
          break;
        case '2':
          for (let i = 0; i < newspaperSort.length; i++) {
            for (let j = 0; j < countChar(newOutput, newspaperSort[i]); j++) {
              rows.push({
                character: newspaperSort[i],
                property: '#' + (i + 1).toString(),
              });

              //Updates the indices
              if (j === 0) index++;
              indices.push(index);
            }

            if (rows.length === newOutput.length) break;
          }
          break;
        case '3':
          for (let i = 0; i < novelSort.length; i++) {
            for (let j = 0; j < countChar(newOutput, novelSort[i]); j++) {
              rows.push({
                character: novelSort[i],
                property: '#' + (i + 1).toString(),
              });

              //Updates the indices
              if (j === 0) index++;
              indices.push(index);
            }

            if (rows.length === newOutput.length) break;
          }
          break;
        case '4':
          for (let i = 0; i < kanjiInfo.length; i++) {
            for (let j = 0; j < countChar(newOutput, kanjiInfo[i]['character']); j++) {
              rows.push({
                character: kanjiInfo[i]['character'],
                property: kanjiInfo[i]['strokes'].toString(),
              });

              if (kanjiInfo[i]['allStrokes'] !== null)
                rows[index]['property'] += '  (' + kanjiInfo[i]['allStrokes'] + ')';

              //Updates the indices
              if (j === 0) index++;
              indices.push(index);
            }

            if (rows.length === newOutput.length) break;
          }

          break;
        case '6':
          for (let i = 0; i < newOutput.length; i++) {
            rows[i] = {
              character: newOutput[i],
              property: countChar(output.original, newOutput[i]),
            };

            indices[i] = i + 1;
          }

          //Old: This line is for debugging and error catching in the sortArrayByProperty function. qsi stands for quick sort iterations.
          //session.setItem("qsi", "0");

          rows = sortArrayByProperty(rows, 'property');
          break;
      }

      newOutput = '';

      if ($w('#reversed').checked) {
        rows = invertArray(rows);
        indices = invertArray(indices);
      }

      let tab = '\t\t\t';

      //Does the normal output if we're not displaying some property of the character or displays that property if needed (frequency list rank, stroke count)
      if ($w('#sortType').value === '1') {
        let passed1K = false;

        for (let i = 0; i < rows.length; i++) {
          if (indices[i] >= 1000) passed1K = true;
          if (passed1K) {
            if (indices[i] === 0) tab = '\t\t\t';
            else tab = '\t\t';
          }

          if (indices[i] !== 0) newOutput += indices[i].toString() + tab + rows[i] + '\n';
          else newOutput += tab + rows[i] + '\n';
        }
      } else {
        for (let i = 0; i < rows.length; i++) {
          if (indices[i] >= 1000) {
            if (indices[i] === indices[i - 1]) tab = '\t\t\t';
            else tab = '\t\t';
          }

          if (indices[i] !== indices[i - 1] || i === 0)
            newOutput +=
              indices[i].toString() +
              tab +
              rows[i]['character'] +
              '\t\t' +
              rows[i]['property'] +
              '\n';
          else newOutput += tab + rows[i]['character'] + '\n';
        }
      }

      //This line just removes the last \n from the numbered output
      newOutput = newOutput.substring(0, newOutput.length - 1);
    }
    //Invert newOutput if we're NOT sorting in default view, if the "Reversed" checkbox is checked and we're not sorting by JLPT or number of occurences in the text
    else if (
      $w('#reversed').checked &&
      $w('#sortType').value !== '5' &&
      $w('#sortType').value !== '6'
    )
      newOutput = invertString(newOutput);

    //Sorts by number of occurences in the text in the "Kanji only" view type if both are selected
    if ($w('#viewType').selectedIndex === 1 && $w('#sortType').value === '6') {
      let rows = new Array();

      for (let i = 0; i < newOutput.length; i++) {
        rows[i] = {
          character: newOutput[i],
          property: countChar(output.original, newOutput[i]),
        };
      }

      newOutput = '';

      //Old: This line is for debugging and error catching in the sortArrayByProperty function. qsi stands for quick sort iterations.
      //session.setItem("qsi", "0");

      rows = sortArrayByProperty(rows, 'property', !$w('#reversed').checked);

      for (let k of rows) newOutput += k['character'];
    }

    //Format JLPT sort
    if ($w('#sortType').value === '5') {
      let jlptOutput = {
        n5: '',
        n4: '',
        n3: '',
        n2: '',
        n1: '',
      };

      //This extracts kanji by JLPT level into the jlptOutput array
      for (let i = 5; i >= 1; i--) {
        if (newOutput !== '') {
          if (newOutput[0] !== i.toString()) {
            for (let j = 0; j < newOutput.length; j++) {
              if (newOutput[j] !== i.toString()) jlptOutput['n' + i.toString()] += newOutput[j];
              else {
                newOutput = newOutput.substring(j + 1);
                break;
              }
            }
          } else if (newOutput[0] !== '1') newOutput = newOutput.substring(1);
        }
      }

      newOutput = '';
      let index = $w('#reversed').checked ? 1 : 5;

      //All of this formats JLPT output according to the selected view type
      while (index >= 1 && index <= 5) {
        if (jlptOutput['n' + index.toString()] !== '') {
          if ($w('#viewType').selectedIndex === 0) {
            if (newOutput !== '') newOutput += '\n\n';
            newOutput +=
              'JLPT N' + index.toString() + ' kanji: ' + jlptOutput['n' + index.toString()];
          } else newOutput += jlptOutput['n' + index.toString()];
        }

        if ($w('#reversed').checked) index++;
        else index--;
      }
    }

    //Adds all of the unsorted kanji
    if (output.unsorted !== '') {
      let unsortedOutput = '';

      if (filter !== '') unsortedOutput = isolateKanji(output.unsorted, filter, '');
      else unsortedOutput = output.unsorted;

      if (unsortedOutput !== '') {
        if (!$w('#showRepeats').checked) unsortedOutput = noRepeats(unsortedOutput);

        if (output.sorted !== '') newOutput += '\n\n';

        //This switch determines what kind of unsorted result message has to be shown
        switch ($w('#sortType').value) {
          case '2':
            newOutput += 'Not in top 2500 kanji used in newspapers: ' + unsortedOutput;
            break;
          case '4':
            newOutput += 'Stroke count unknown: ' + unsortedOutput;
            break;
          case '5':
            newOutput += 'Not in JLPT: ' + unsortedOutput;
            break;
          default:
            newOutput += 'Unsorted: ' + unsortedOutput;
            break;
        }
      }
    }

    $w('#resultBox').value = newOutput;

    if (newOutput === '') showMessage('No kanji match the selected filter');

    //The following just gets the number of unique kanji in the output and the number of total kanji, filters them if necessary and updates the correspoding label
    if (filter === '')
      $w('#text12').text =
        'Unique kanji: ' +
        noRepeats(output.original).length.toString() +
        '  |  Total kanji: ' +
        output.original.length.toString();
    else {
      $w('#text12').text =
        'Unique kanji: ' + isolateKanji(output.original, filter, '', true).length.toString();
      if (wixWindow.formFactor === 'Desktop')
        $w('#text12').text +=
          '  |  Total kanji: ' +
          isolateKanji(output.original, filter, '').length.toString() +
          '  |  Total unfiltered: ' +
          output.original.length.toString();
      else
        $w('#text12').text +=
          ' | Total kanji: ' +
          isolateKanji(output.original, filter, '').length.toString() +
          ' |\nTotal unfiltered: ' +
          output.original.length.toString();
    }
  }, 1);

  if (startP) endProcess();
}

//Function for removing repetitions in a string
function noRepeats(input) {
  let out = '';

  for (let i of input) if (!out.includes(i) || i === ' ') out += i;

  return out;
}

function addToKanjiList(newKanji) {
  startProcess(3);

  setTimeout(() => {
    let temp = isolateKanji(newKanji, allKanji, $w('#kanjiList').value, true);

    if (temp !== '') {
      $w('#kanjiList').value += temp;
      $w('#kanjiListCount').text = 'Total kanji: ' + $w('#kanjiList').value.length.toString();

      sendUpdate(true, true);

      if ($w('#kanjiList').value !== loadedList) {
        $w('#unsavedChangesText').expand();
      } else {
        $w('#unsavedChangesText').collapse();
      }

      if (temp.length > 1)
        showMessage(temp.length.toString() + ' kanji have been added to your kanji list');
      else showMessage('1 kanji has been added to your kanji list');
    } else showMessage('No new kanji have been found');
  }, 1);

  endProcess();
}

function turnUpdateOn() {
  if (!update) {
    update = true;

    $w('#updateButton').label = 'Update: On';
    $w('#updateButton').style.backgroundColor = '#000000';

    sendUpdate(true, true);
  }
}

//Starts a process for most buttons that disables all interactive elements
function startProcess(waitMsg = 0, scroll = true) {
  //waitMsg 0 means we don't want to show a wait message
  //waitMsg 1 means show the first one, waitMsg 2 is for the second one, etc.
  switch (waitMsg) {
    case 1:
      $w('#columnStrip15').expand();
      if (scroll) $w('#anchor1').scrollTo();
      break;
    case 2:
      $w('#columnStrip12').expand();
      if (scroll) $w('#anchor2').scrollTo();
      break;
    case 3:
      $w('#columnStrip13').expand();
      if (scroll) $w('#anchor3').scrollTo();
      break;
  }

  $w('#inputBox').disable();
  $w('#getKanji').disable();
  $w('#addInputToList').disable();
  $w('#getNewKanji').disable();
  $w('#button6').disable();
  $w('#button7').disable();
  $w('#button8').disable();
  $w('#clearKanjiList').disable();
  $w('#about').disable();
  $w('#addResultToList').disable();
  $w('#showRepeats').disable();
  $w('#reversed').disable();
  $w('#viewType').disable();
  $w('#radioGroup3').disable();
  $w('#sortType').disable();
  $w('#filter').disable();
  $w('#load').disable();
  $w('#save').disable();
  $w('#deleteSave').disable();
  $w('#updateButton').disable();
}

//Ends the process and enables interactive elements again. setTimeout makes it so that this function waits for all processes to end.
function endProcess() {
  setTimeout(() => {
    //Collapses all of the "Please wait" messages
    $w('#columnStrip12').collapse();
    $w('#columnStrip13').collapse();
    $w('#columnStrip15').collapse();

    //Disables include repetitions button if number of occurences in the text sort is selected
    if ($w('#sortType').value !== '6') $w('#showRepeats').enable();

    $w('#inputBox').enable();
    $w('#getKanji').enable();
    $w('#addInputToList').enable();
    $w('#getNewKanji').enable();
    $w('#button6').enable();
    $w('#button7').enable();
    $w('#button8').enable();
    $w('#clearKanjiList').enable();
    $w('#about').enable();
    $w('#addResultToList').enable();
    $w('#reversed').enable();
    $w('#viewType').enable();
    $w('#radioGroup3').enable();
    $w('#sortType').enable();
    $w('#filter').enable();

    if ($w('#kanjiList').value !== loadedList) {
      if (loadedList !== '') $w('#load').enable();

      if ($w('#kanjiList').value !== '') $w('#save').enable();
    }

    $w('#deleteSave').enable();
    $w('#updateButton').enable();

    console.log('ending process');
  }, 1);
}

// Radio group 3 is replace, add
// Button 6 is the first clear
// Button 7 is import
// Button 8 is the second clear
