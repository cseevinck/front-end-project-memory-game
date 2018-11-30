/*
 * Declare script wide variables
 */
let moveCount = 0; // count total number of pairs tried
let allElements;
let startTime;
let intervalId = 0; // id of the interval for the timer
let cCards = []; // list for clicked cards

// define length of 'icon-id-' string portion
const iconStrL = 8;

// +**********************************************************
// +**********************************************************
// Start processing here
// +**********************************************************
// +**********************************************************

restartGame();
allElements = document.querySelectorAll('.container');
allElements[0].addEventListener('click', eventHandler);

// +**********************************************************
// Functions below
// +**********************************************************

/*
 * Do startup and reset of game
 *
 */
function restartGame() {
    moveCount = 0;
    console.log('Here to restart the game');

    // Clear the score panel
    document.querySelector('.moves').innerHTML = moveCount + ' Moves';
    document.getElementById('stars').innerHTML = doStars(moveCount);
    document.getElementById('timer').innerHTML = timeCounter('reset'); //stop counter

    deleteChildren(document.querySelector('.deck')); // remove all the deck HTML children

    /*
     * Create a list that holds all of your cards
     */

    // function to create l and li items
    // let TheCard = function(liClass1, liClass2, iClass1, iClass2) {
    //     this.liClass1 = liClass1;
    //     this.liClass2 = liClass2;
    //     this.iClass1 = iClass1;
    //     this.iClass2 = iClass2;
    // };

    let ACard = function(faClass) {
        this.faClass = faClass;
    };

    // create the card list from scratch
    let cardList = new Array();
    cardList[0] = new ACard('fa-diamond');
    cardList[1] = new ACard('fa-paper-plane-o');
    cardList[2] = new ACard('fa-anchor');
    cardList[3] = new ACard('fa-bolt');
    cardList[4] = new ACard('fa-cube');
    cardList[5] = new ACard('fa-leaf');
    cardList[6] = new ACard('fa-bicycle');
    cardList[7] = new ACard('fa-bomb');
    cardList[8] = new ACard('fa-diamond');
    cardList[9] = new ACard('fa-paper-plane-o');
    cardList[10] = new ACard('fa-anchor');
    cardList[11] = new ACard('fa-bolt');
    cardList[12] = new ACard('fa-cube');
    cardList[13] = new ACard('fa-leaf');
    cardList[14] = new ACard('fa-bicycle');
    cardList[15] = new ACard('fa-bomb');

    shuffle(cardList);

    // Build a dom fragment for the list & Insert it into the list
    let deck = document.querySelector('.deck');
    let fragment = document.createDocumentFragment();
    let elementLi;
    let elementI;
    let faId;

    for (let i = 0; i < 16; i++) {
        elementLi = document.createElement('li');
        elementLi.classList.add('card');
        faId = document.createAttribute('fa-id');
        faId.value = cardList[i].faClass;
        elementLi.setAttributeNode(faId);
        elementI = document.createElement('i');
        elementI.classList.add('fa');
        elementI.classList.add(cardList[i].faClass);
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
    console.log(element);

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
 * eventHandler
 *
 * Throw out the events that we don't want and determine if it's first or second card1
 *
 * Input:
 * - the event
 * 
 */
function eventHandler(event) {
    let ele; // event element
    let domAttr;

    // card = the associated element & get class
    ele = event.target;
    domAttr = ele.getAttribute('class');
    console.log('filterEvent - tagname = ' + ele.tagName + ' attribute = ' + domAttr);

    // For testing - force a win
    if (ele.tagName == 'IMG') {
        console.log('filterEvent - found IMG');
        showModal();
        return;
    };
    // For testing - force a win

    // See if this is a game reset request
    if (domAttr.includes('repeat')) {
        restartGame();
        return;
    } else if (!(domAttr.includes('card'))) {

        // This must be an event that should be ignored - not 'card' or ' restart'
        console.log('filterEvent - discard this event - tagname = ' + event.target.tagName);
        return;
    }

    // here for card - push it onto clicked list and set attributes
    cCards.push(ele);
    if (cCards.length != 2) {

        // first card
        cCards[0].classList.add('open', 'show', 'clicked');
    } else {

        // second card 
        doMoveCount(); //increase and display moveCount
        document.getElementById('stars').innerHTML = doStars(moveCount);

        // second card - check if match
        if (cCards[0].getAttribute('fa-id') == cCards[1].getAttribute('fa-id')) {
            // we have a match
            cCards[1].classList.add('open', 'show', 'match', 'clicked');
            cCards[0].classList.add('open', 'show', 'match', 'clicked');

            // clear clicked list
            cCards.pop(ele);
            cCards.pop(ele);

            // here to check for all cards match = end of game 
            if (gameDone()) {

                // we are done - winner!
                showModal();
            };
        } else {

            // not a match
            cCards[1].classList.add('open', 'show', 'clicked');
            shakeThem(cCards[0], cCards[1]);

            // wait for 1 seconds then hide cards
            setTimeout(function() {
                cCards[0].classList.remove('open', 'show', 'clicked'); // hide first card
                cCards[1].classList.remove('open', 'show', 'clicked'); // hide second card

                // clear the clicked list
                cCards.pop(ele);
                cCards.pop(ele);
            }, 1000);
        };
    };
};

/*
 * Handles the number of moves counter
 */
function doMoveCount() {
    console.log('We have a pair - moveCount = ' + moveCount);
    if (moveCount++ == 0) {
        document.getElementById('timer').innerHTML = timeCounter('start');
        document.querySelector('.moves').innerHTML = moveCount + ' Move';
    } else {
        document.querySelector('.moves').innerHTML = moveCount + ' Moves';
    };
};

/*
 * Check if game is complete
 * 
 * Return true if game done
 */
function gameDone() {
    let matched = document.querySelectorAll(".match");
    return (matched.length === 16);
};

/*
 * ShakeThem - animate the two provided elements
 */
function shakeThem(element1, element2) {
    // shake element left and right.
    let ind = 1;
    const originalStyle1 = element1.style.cssText;
    const originalStyle2 = element2.style.cssText;

    // console.log ('originalStyle = ' + originalStyle);
    element1.style.position = 'relative';
    element2.style.position = 'relative';

    function theShake() {
        ind++;
        if (ind < 20) {
            if (ind % 2 == 0) {
                element1.style.left = '-2px';
                element2.style.left = '-2px';
            } else {
                element1.style.left = '2px';
                element2.style.left = '2px';
            };
            setTimeout(theShake, 50);
        } else {
            element1.style.cssText = originalStyle1;
            element2.style.cssText = originalStyle2;
        };
    };

    theShake();
};

// setInterval(shake, 10); //Set shorter interval for faster shake
function shake() {
    if (keepShaking == true) {
        if (box1Left1 < originalLeftPos + 5) { // "+5" = The shake distance. Go right. 
            box1Left1++;
            document.getElementById("box1").style.left = box1Left1 + "px";
            box1Left2 = box1Left1;
        }
        if (box1Left1 >= (originalLeftPos + 5)) { // Go left. 
            box1Left2--;
            document.getElementById("box1").style.left = box1Left2 + "px";
        }
        if (box1Left2 == originalLeftPos) { box1Left1 = box1Left2; } // Go Right Again 
    }
}
/*
 * Display stars
 */
function doStars(moveCount) {
    const fsStar = "<i class='fa fa-star'></i>";
    let starString = fsStar;
    console.log('doStars');
    console.log('doStars - ' + starString);

    if (moveCount < 12) {
        starString = starString + fsStar;
    };

    if (moveCount < 18) {
        starString = starString + fsStar;
    };

    console.log('doStars - ' + starString);
    return starString;
}
/*
 *
 * timeCounter
 *
 * Calulate and format the timer string
 * input = action
 *      action = 'start' - start interval timer if intervalId = 0 and return string
 *      action = 'stop' - clear interval timer and and return string
 *          if this is first call (game start) then force time to zero
 *      action = 'reset' - clear interval timer and and return zero string
 *      action = 'display' - return string
 * return - timer string
 *
 */

function timeCounter(action) {
    let disp;
    let date = new Date();
    let nowTime;
    let lapsedTime;
    let hours;
    let minutes;
    let seconds;

    switch (action) {
        case 'reset':
            {
                console.log('reset timeCounter - startTime = ', startTime);
                startTime = Math.round(date.getTime() / 1000); // force zero time
            };

        case 'stop':
            {
                if (intervalId == 0) {
                    startTime = Math.round(date.getTime() / 1000); // force zero time
                };

                clearInterval(intervalId);
                intervalId = 0;
                break;
            };

        case 'start':
            {
                console.log('Start timeCounter - startTime = ', startTime);
                if (intervalId != 0) {
                    alert('timeCounter - Already started = ');
                } else {

                    // Start the counter timer
                    startTime = Math.round(date.getTime() / 1000);
                    console.log('Start timeCounter - startTime = ', startTime);
                    intervalId = setInterval(function() {
                        document.getElementById('timer').innerHTML =
                            timeCounter('display');
                    }, 1000);
                };
            };

        case 'display':
            {
                console.log('Display timeCounter - startTime = ', startTime);
            };
    };

    // format the timer string and return it
    nowTime = Math.round(date.getTime() / 1000);

    // console.log('total lapsed seconds - ' + lapsedTime) ; //make seconds
    lapsedTime = nowTime - startTime;
    hours = Math.floor(lapsedTime / 3600);
    lapsedTime %= 3600; // remainder = seconds after hours removed
    minutes = Math.floor(lapsedTime / 60);
    seconds = Math.floor(lapsedTime % 60);

    // Strings with leading zeroes
    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');
    console.log('timer string = ' + 'H: ' + hours + ' M: ' +
        minutes + ' S: ' + seconds + ' ');
    return ('H: ' + hours + ' M: ' + minutes + ' S: ' + seconds + ' ');
};

/*
 *
 * showModal
 *
 */
function showModal() {
    console.log('showModal');
    document.getElementById('move-cnt').innerHTML = 'Number of moves: ' +
        moveCount;
    document.getElementById('game-time').innerHTML = 'Game time:  ' +
        timeCounter('stop');
    console.log('showModal - rating: ' + doStars(moveCount));
    document.getElementById('game-rating').innerHTML = 'Game rating: ' +
        doStars(moveCount);
    document.querySelector('.modal-bg').style.display = 'flex';
};

/*
 *
 * hideModal
 *
 */
function hideModal() {
    console.log('hideModal');
    document.querySelector('.modal-bg').style.display = 'none';
};

/*
 *
 * modalRestart
 *
 */
function modalRestart() {
    console.log('restartModal');
    document.querySelector('.modal-bg').style.display = 'none';
    restartGame();
};
/*
 *
 * quitGame
 *
 */
function quitGame() {
    console.log('quitGame');
    document.querySelector('.modal-bg').style.display = 'none';
    document.querySelector('.stop-screen').style.display = 'flex';
};