/*
*  Declare script wide variables
*/
let theEvent = 0;
let useTarget;
let iconId1 = null;
let iconId2 = null;
let cardIndex1 = null;
let cardIndex2 = null;
let clickCount = 0;     // count total number of pairs tried
let matchCount = 0;     // count the number of matched pairs found
let allowClicks = true;
let savCrd1Event;
let allCards;

/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided 'shuffle' method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex;
  currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/*
 * Do startup
 *
 */
function restartGame() {
  cardIndex1 = null;
  cardIndex2 = null;
  clickCount = 0;
  matchCount = 0;
  iconId1 = null;
  iconId2 = null;
  allowClicks = true;
  console.log('Here to restart the game');
  allCards = document.querySelectorAll('.card');
  allCards.forEach(function (card, cardIndex) {
    card.classList.remove('open', 'show', 'match'); // clear all classes
  });
}
/*
 * Throw out the events that we don't want an determine if it's first or second card1
 *
 * Input:
 * 1. the event
 *
 * Function returns:
 * 1. 'discard' for an event that should be ignored - this might be a
 *        non applicable event due to 'bubbling' or an already flipped card.
 * 2. 'restart' for an restart event
 * 3. 'card 1' for the first in a pair of cards
 * 4. 'card 2' for the second in a pair of cards
 *
 * If functions returns 'false' the event is discarded
 */

function filterEvent(theEvent) {

  console.log('filterEvent - event = ' + theEvent);

  // useTarget = the associated element that contains the class
  useTarget = theEvent.target;
  console.log('filterEvent - tagname = ' + useTarget.tagName);
  if (useTarget.tagName == 'I') {
    console.log('filterEvent - found I');

    // we want the parent of the 'i' element cause it has the class
    useTarget = theEvent.target.parentNode;

    // now the useTarget.classList has to have 'card' or 'restart' in it -
    // throw everything else away
    // console.log ('replaced target - new tagname = ' + useTarget.tagName);
  }

  console.log('filterEvent - Use this classList= ' + useTarget.classList);
  if (!(((useTarget.classList.contains('restart')) ||
        (useTarget.classList.contains('card'))))) {
    console.log('filterEvent - discard cause not "restart" or "card" - it is = '
                + useTarget.classList);
    return 'discard';
  };

  // console.log('filterEvent - Use this classList= ' + useTarget.classList);
  if (useTarget.classList.contains('restart')) {
    return 'restart';
  } else if (!(useTarget.classList.contains('card'))) {

    // This must be an event that should be ignored - not 'card' or ' restart'
    console.log('filterEvent - discard this event - tagname = ' + TheEvent.target.tagName);
    return ('discard');
  };

  // Discard event if card is already face-up
  if (((useTarget.classList.contains('show')) ||
        useTarget.classList.contains('match'))) {
    console.log('filterEvent - allready face-up - ignore click');
    return 'discard';
  }

  // Set card 1 or 2 - strip off 'icon-id-' from class to get card index
  if (iconId1 == null) { // card 1
    iconId1 = getClassThatMatch(useTarget.classList, 'icon-id-').slice(7);
    console.log('filterEvent - done with card1 - iconId1 = ' + iconId1 + ' iconId2 = ' + iconId2);
    cardIndex1 = getCardIndex(useTarget);
    return 'card1';
  }

  // discard if card 2 has the same index as card 1
  tempCardIndex2 = getCardIndex(useTarget);
  if (tempCardIndex2 = cardIndex1) {
    console.log('filterEvent - 2nd click was on card1 - discard');
    return 'discard';
  };

  cardIndex2 = tempCardIndex2;
  iconId2 = getClassThatMatch(useTarget.classList, 'icon-id-').slice(7);
  console.log('filterEvent - done with card2 - iconId1 = ' + iconId1 + ' iconId2 = ' + iconId2);
  return 'card2';
};

/*
 * Create an event handler for all events using a switch statement
 *
 * Input:
 * 1. event
 */
function eventHandler(event) {
  if (!(allowClicks)) {
    console.log('eventHandler - Clicks not allowed - discard');
    return false;
  };

  theEvent = event;
  console.log('eventHandler - before switch');

  const switchValue = filterEvent(theEvent);
  switch (switchValue) {

    case 'discard':
      console.log('eventHandler - discard event with target  = ' + event.target.tagName);

      break;

    case 'restart':
      console.log('eventHandler - event with restart = ' + event.target.tagName);
      restartGame();

      break;

    case 'card1':
      console.log('eventHandler - card1 classList ' + event.target.classList);
      event.target.classList.add('open', 'show');
      savCrd1Event = event; // save event for later

      break;

    case 'card2':
      console.log('eventHandler - card2 classList ' + event.target.classList);
      event.target.classList.add('open', 'show');
      console.log('We have a pair - clickCount = ' + clickCount);
      clickCount++;

      // here to check for a match
      if (iconId1 == iconId2) {

        // it's a match
        event.target.classList.remove('open', 'show'); // card 2
        savCrd1Event.target.classList.remove('open', 'show'); // card 1
        event.target.classList.add('match'); // card 2
        savCrd1Event.target.classList.add('match'); // card 1
        matchCount++;
        console.log('cards match - matchCount = ' + matchCount);

        // here to check for all cards match = end of game
        if (matchCount > 7) {
          // we are done - you are a winner
          alert('You won - good job');
        }
      } else {

        // cards do not match
        allowClicks = false; // setting to ignore clicks till after timeout
        shakeThem(event.target, savCrd1Event.target);

        // wait for 2 seconds then hide cards
        setTimeout(function () {
          savCrd1Event.target.classList.remove('open', 'show'); // hide first card
          event.target.classList.remove('open', 'show'); // hide second card
          allowClicks = true; // setting to allow clicks again
        }, 2000);

        console.log('No match');
      };

      // after match or no-match - ready for the next pair
      iconId1 = null;
      iconId2 = null;
      cardIndex1 = null;
      cardIndex2 = null;
      break;

    default:
      alert('eventHandler - invalid switchValue = ' + switchValue);
  };

  console.log('eventHandler - after switch - switchValue = ' + switchValue);
};

// +**********************************************************
// +**********************************************************
// +**********************************************************
// Start processing here
// +**********************************************************
// +**********************************************************
// +**********************************************************
allCards = document.querySelectorAll('.container');
console.log('wanna see card = ' + allCards[0]);

allCards[0].addEventListener('click', eventHandler);

/*
 * Check if the two supplied cards match
 *   - receive two card elements (the li elements)
 *   - return true if cards match
 */
function CardsMatch(card1, card2) {
  const card1I = card1.firstElementChild;
  const card2I = card2.firstElementChild;
  if (card1I.tagName != 'I' || card2I.tagName != 'I') {
    alert('I elements must be first after li element');
  }

  // search for class starting with fa- in card1I & card2I
  return getClassFA(card1I) == getClassFA(card2I);
}
/*
 * Find the index of the supplied card
 *   - return the index
 */
function getCardIndex(theCard) {
  allCards = document.querySelectorAll('.card');
  allCards.forEach(function (card, cardIndex) {
    // console.log(card);
    if (card === theCard) {
      // console.log('This is the getCardIndex = ' + cardIndex);
      return cardIndex1;
    };
  });
};

/*
 * Get class name starting with 'string' from the supplied classList
 *   - input - element
 *   - return the class name starting thats matches
 */
function getClassThatMatch(theClassList, string) {
  for (i = 0; i < theClassList.length; i++) {
    if (theClassList[i].startsWith(string)) {
      // console.log ('getClassThatMatch the - class = ' + theClassList[i]);
      return theClassList[i];
    };
  };

  alert('element must have a class starting with ' + string);
};

/*
 * Get class name starting with 'fa-'
 *   - input - 'I' element
 *   - return the class name starting with 'fa-' from the list
 */
function getClassFA(elementI) {
  for (i = 0; i < elementI.classList.length; i++) {
    if (elementI.classList[i].startsWith('fa-')) {
      return elementI.classList[i];
    };
  };

  alert('I element must have a class starting with "fa-"');
};

/*
 * ShakeThem - animate the two provided elements
 */
function shakeThem(element1, element2) {
  // shake element e left and right.
  let ind = 1;
  const originalStyle1 = element1.style.cssText;
  const originalStyle2 = element2.style.cssText;

  // console.log ('originalStyle = ' + originalStyle);
  element1.style.position = 'relative';
  element2.style.position = 'relative';

  // console.log ('RelativeStyle = ' + element.style.position);

  function theShake() {
    ind++;
    if (ind < 20) {
      if (ind % 2 == 0) {
        element1.style.left = '-2px';
        element2.style.left = '-2px';

        // console.log ('theShake- = ' + element.style.left);
      } else {
        element1.style.left = '2px';
        element2.style.left = '2px';

        // console.log ('theShake+ = ' + element.style.left);
      };

      setTimeout(theShake, 50);
    } else {
      element1.style.cssText = originalStyle1;
      element2.style.cssText = originalStyle2;
    };
  };

  theShake();
};

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of 'open' cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
