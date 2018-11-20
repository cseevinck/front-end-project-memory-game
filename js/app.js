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
 * Do startup and reset of game
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
  document.querySelector('.moves').innerHTML = clickCount;
  // corky clear all the stars

  deleteChildren(document.querySelector('.deck')); // remove all the deck HTML children

  // allCards = document.querySelectorAll('.card');
  // document.querySelector('.deck');
  // allCards.forEach(function (card, cardIndex) {
  //   card.classList.remove('open', 'show', 'match'); // clear all classes
  // });

  /*
   * Create a list that holds all of your cards
   */

  // object to create l and li items
  let TheCard = function (liClass1, liClass2, iClass1, iClass2) {
    this.liClass1 = liClass1;
    this.liClass2 = liClass2;
    this.iClass1 = iClass1;
    this.iClass2 = iClass2;
  };

  // create the card list from scratch
  let cardList = new Array();
  cardList[0]  = new TheCard('card', 'icon-id-0', 'fa', 'fa-diamond');
  cardList[1]  = new TheCard('card', 'icon-id-1', 'fa', 'fa-paper-plane-o');
  cardList[2]  = new TheCard('card', 'icon-id-2', 'fa', 'fa-anchor');
  cardList[3]  = new TheCard('card', 'icon-id-3', 'fa', 'fa-bolt');
  cardList[4]  = new TheCard('card', 'icon-id-4', 'fa', 'fa-cube');
  cardList[5]  = new TheCard('card', 'icon-id-5', 'fa', 'fa-leaf');
  cardList[6]  = new TheCard('card', 'icon-id-6', 'fa', 'fa-bicycle');
  cardList[7]  = new TheCard('card', 'icon-id-7', 'fa', 'fa-bomb');
  cardList[8]  = new TheCard('card', 'icon-id-0', 'fa', 'fa-diamond');
  cardList[9]  = new TheCard('card', 'icon-id-1', 'fa', 'fa-paper-plane-o');
  cardList[10] = new TheCard('card', 'icon-id-2', 'fa', 'fa-anchor');
  cardList[11] = new TheCard('card', 'icon-id-3', 'fa', 'fa-bolt');
  cardList[12] = new TheCard('card', 'icon-id-4', 'fa', 'fa-cube');
  cardList[13] = new TheCard('card', 'icon-id-5', 'fa', 'fa-leaf');
  cardList[14] = new TheCard('card', 'icon-id-6', 'fa', 'fa-bicycle');
  cardList[15] = new TheCard('card', 'icon-id-7', 'fa', 'fa-bomb');

  shuffle(cardList);

  // Build a dom fragment for the list & Insert it into the list
  let deck = document.querySelector('.deck');
  let fragment = document.createDocumentFragment();
  let elementLi;
  let elementI;

  for (i = 0; i < 16; i++) {
    elementLi = document.createElement('li');
    elementLi.classList.add(cardList[i].liClass1);
    elementLi.classList.add(cardList[i].liClass2);
    elementI = document.createElement('i');
    elementI.classList.add(cardList[i].iClass1);
    elementI.classList.add(cardList[i].iClass2);
    elementLi.appendChild(elementI);
    fragment.appendChild(elementLi);
  };

  deck.appendChild(fragment); // add fragment to the dom
}

/*
 * deleteChildren
 *   delete all the child nodes from this element
 *
 */

function deleteChildren(element) {
  console.log (element);
  // As long as element has a child node, remove it
  while (element.hasChildNodes()) {
      element.removeChild(element.firstChild);
  }
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided 'shuffle' method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

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
 * filterEvent
 *
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
    iconId1 = getClassThatMatch(useTarget.classList, 'icon-id-').slice(8);
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
  iconId2 = getClassThatMatch(useTarget.classList, 'icon-id-').slice(8);
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
      document.querySelector('.moves').innerHTML = clickCount;

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

restartGame();
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
