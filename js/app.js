/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Code for the program
// Set listener events on all cards
let allCards = document.querySelectorAll('.card');
let clickCount = 0;
let matchCount = 0;
let firstIndex;
let allowClicks = true; // allow clicks - will be turned off during timeout
allCards.forEach(function(card, cardIndex, cardArray) {
	card.addEventListener ('click', function (e) {
    if (allowClicks) {
      console.log ('Click here - clickCount = ' + clickCount + '  cardIndex = ' + cardIndex);
//  process click if the card is not already visible
      if (!(card.classList.contains('show'))) {  //
        switch (clickCount++) {
// first click event - show card
        case 0:
          card.classList.add('open', 'show');
          console.log ('first click');
          firstIndex = cardIndex;
          console.log ('Case 0 clickCount = ' + clickCount + '  firstIndex = ' + cardIndex);
          break;
// second click event - show card & look if match with first card
        case 1:
          card.classList.add('open', 'show');
          console.log ('second click - clickCount = ' + clickCount);

          // here to check for a match
          if (CardsMatch (cardArray [firstIndex], card)){
            console.log ('cards match - clickCount = ' + clickCount);

            // here to check for all cards match
            if (matchCount++ > 15) {
              // we are done - you are a winner
              console.log ('All cards match - do end');
              alert ("You won - good job")
            }
            else {
              clickCount = 0; // prepare for another match
            }
          }
          else {
            console.log ('no match  - clickCount = ' + clickCount);
// wait for 2 seconds then hide the 2 cards
            allowClicks = false; // setting to ignore clicks till after timeout
            setTimeout(function(){
              cardArray [firstIndex].classList.remove('open', 'show'); // hide first card
              card.classList.remove('open', 'show'); // hide second card
              clickCount = 0;  // prepare for another match
              allowClicks = true; // setting to allow clicks again
              console.log ('Allow clicks again - clickCount = ' + clickCount);
              }, 2000);
            }
          break;
        default:
          alert ('This is a bug');
          console.log ('beyond second click - should not her here!');
        }; // end of switch
      }
      else {
        // alert ('Allready visible');
        console.log ('Allready visible - do nothing - clickCount = ' + clickCount);
      };
    }
    else {
      console.log ('Don"t allow Clicks - clickCount = ' + clickCount);
    };
  });
});

/*
 * Check if the two supplied cards match
 *   - receive two card elements (the li elements)
 *   - return true if cards match
 */
function CardsMatch (card1, card2) {
  const card1I = card1.firstElementChild;
  const card2I = card2.firstElementChild;
  if (card1I.tagName != "I" || card2I.tagName != "I") {
    alert ("I elements must be first after li element");
  }
  // search for class starting with fa- in card1I & card2I
  return getClassFA (card1I) == getClassFA (card2I);
}

/*
 * Get class name starting with "fa-"
 *   - input - "I" element
 *   - return the class name starting with "fa-" from the list
 */
function getClassFA (elementI) {
  for (i=0; i< elementI.classList.length; i++) {
    if (elementI.classList[i].startsWith('fa-')){
      return elementI.classList[i];
    }
  }
  alert ('I element must have a class starting with "fa-"');
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
