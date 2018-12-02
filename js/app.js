/*
 * Declare script wide variables
 */

let moveCount = 0; // count total number of pairs tried
let allElements;
let startTime;
let intervalId = 0; // id of the interval for the timer
let cCards = []; // list for clicked cards

/** 
 * Start processing here
 */
restartGame();
allElements = document.querySelectorAll(".container");
allElements[0].addEventListener("click", eventHandler);

/** 
 * Functions below
 */

/**
 * @description Perform all game reset activities (also used at start of game)
 *
 */
function restartGame() {
    moveCount = 0;

    // Clear the score panel
    document.querySelector(".moves").innerHTML = moveCount + " Moves";
    document.getElementById("stars").innerHTML = doStars(moveCount);
    document.getElementById("timer").innerHTML = timeCounter("reset"); //stop counter

    deleteChildren(document.querySelector(".deck")); // remove all the deck HTML children

    // ensure the clicked list is empty
    popList(cCards);

    // Create a list that holds all the cards - LI & I
    let ACard = function(faClass) {
        this.faClass = faClass;
    };

    // create the card list from scratch
    let cardList = new Array();
    cardList[0] = new ACard("fa-diamond");
    cardList[1] = new ACard("fa-paper-plane-o");
    cardList[2] = new ACard("fa-anchor");
    cardList[3] = new ACard("fa-bolt");
    cardList[4] = new ACard("fa-cube");
    cardList[5] = new ACard("fa-leaf");
    cardList[6] = new ACard("fa-bicycle");
    cardList[7] = new ACard("fa-bomb");
    cardList[8] = new ACard("fa-diamond");
    cardList[9] = new ACard("fa-paper-plane-o");
    cardList[10] = new ACard("fa-anchor");
    cardList[11] = new ACard("fa-bolt");
    cardList[12] = new ACard("fa-cube");
    cardList[13] = new ACard("fa-leaf");
    cardList[14] = new ACard("fa-bicycle");
    cardList[15] = new ACard("fa-bomb");

    shuffle(cardList);

    // Build a dom fragment for the list & Insert it into the list
    let deck = document.querySelector(".deck");
    let fragment = document.createDocumentFragment();
    let elementLi;
    let elementI;
    let faId;

    for (let i = 0; i < 16; i++) {
        elementLi = document.createElement("li");
        elementLi.classList.add("card");
        faId = document.createAttribute("fa-id");
        faId.value = cardList[i].faClass;
        elementLi.setAttributeNode(faId);
        elementI = document.createElement("i");
        elementI.classList.add("fa");
        elementI.classList.add(cardList[i].faClass);
        elementLi.appendChild(elementI);
        fragment.appendChild(elementLi);
    };
    deck.appendChild(fragment); // add fragment to the dom
}

/**
 * @description Delete all of the given element's childnodes 
 *
 * @param {*} element
 */
function deleteChildren(element) {
    // As long as element has a child node, remove it
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    };
}

/**
 * @description Shuffle the list of cards in the given array 
 *              Shuffle function from http://stackoverflow.com/a/2450976
 *
 * @param {*} array
 * @returns shuffled array
 */
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
    };
    return array;
}

/**
 * @description Handle all the events and perform main game function
 *              Discard irrelavant events
 *
 * @param {*} event
 * @returns Nothing
 */
function eventHandler(event) {
    let ele; // event element
    let domAttr;

    // card = the associated element & get class
    ele = event.target;
    domAttr = ele.getAttribute("class");

    // See if this is a game reset request
    if (domAttr.includes("repeat")) {
        restartGame();
        return;
    } else if (!domAttr.includes("card")) {
        // This must be an event that should be ignored - not 'card'
        return;
    }

    // here for card - push it onto clicked list and set display attributes
    cCards.push(ele);
    if (cCards.length != 2) {
        // first card
        cCards[0].classList.add("open", "show", "clicked");
    } else {
        // second card
        doMoveCount(); //increase and display moveCount
        document.getElementById("stars").innerHTML = doStars(moveCount);

        // check if cards match
        if (cCards[0].getAttribute("fa-id") == cCards[1].getAttribute("fa-id")) {
            // we have a match
            cCards[1].classList.add("open", "show", "match", "clicked");
            cCards[0].classList.add("open", "show", "match", "clicked");
            animate(cCards[0], cCards[1], "tada");

            // clear the clicked list
            popList(cCards);

            // here to check for all cards match = end of game
            if (gameDone()) {
                // we are done - winner!
                showModal();
            };
        } else {
            // not a match
            cCards[1].classList.add("open", "show", "clicked");
            animate(cCards[0], cCards[1], "shaking");

            // wait for 1 seconds then hide cards
            setTimeout(function() {
                cCards[0].classList.remove("open", "show", "clicked"); // hide first card
                cCards[1].classList.remove("open", "show", "clicked"); // hide second card

                // clear the clicked list
                popList(cCards);
            }, 1000);
        };
    };
}

/**
 * @description Handles the number of moves counter int the score section
 *
 */
function doMoveCount() {
    if (moveCount++ == 0) {
        document.getElementById("timer").innerHTML = timeCounter("start");
        document.querySelector(".moves").innerHTML = moveCount + " Move";
    } else {
        document.querySelector(".moves").innerHTML = moveCount + " Moves";
    };
}

/**
 * @description Check if game is complete 
 *
 * @returns true if complete
 */
function gameDone() {
    let matched = document.querySelectorAll(".match");
    return matched.length === 16;
}

/**
 * @description Empty the list of cards in the given list
 *
 * @param {*} list
 */
function popList(list) {
    while (list.length > 0) {
        list.pop();
    };
}

/**
 * @description Apply the given effect to the two provided elements
 *              used on pairs of cards
 *              wait for 1.5 seconds before removing the affects again
 *
 * @param {*} el1 First card
 * @param {*} el2 Second card
 * @param {*} effect class name of the css class that peforms the animation
 */
function animate(el1, el2, effect) {
    el1.classList.add(effect);
    el2.classList.add(effect);
    setTimeout(function() {
        el1.classList.remove(effect);
        el2.classList.remove(effect);
    }, 1500);
}

/**
 * @description compile a list of stars for score displays  
 *
 * @param {*} moveCount count of the of "pairs" tried so far
 * @returns string containing HTML that displays the stars 
 */
function doStars(moveCount) {
    const fsStar = "<i class='fa fa-star'></i>";
    let starString = fsStar;
    if (moveCount < 12) {
        starString = starString + fsStar;
    };

    if (moveCount < 18) {
        starString = starString + fsStar;
    };

    return starString;
}

/**
 * @description Perform all function required to achieve the time counter displays
 *
 * @param {*} action:
 *              = 'start' - start interval timer if intervalId = 0 and return string
 *              = 'stop' - clear interval timer and and return string
 *                  if this is first call (game start) then force time to zero
 *              = 'reset' - clear interval timer and and return zero string
 *              = 'display' (default) - format and return string
 * @returns formatted "time" string 
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
        case "reset":
            {
                startTime = Math.round(date.getTime() / 1000); // force zero time
            };

        case "stop":
            {
                if (intervalId == 0) {
                    startTime = Math.round(date.getTime() / 1000); // force zero time
                };

                clearInterval(intervalId);
                intervalId = 0;
                break;
            };

        case "start":
            {
                if (intervalId != 0) {
                    alert("timeCounter - Already started = ");
                } else {
                    // Start the counter timer
                    startTime = Math.round(date.getTime() / 1000);
                    intervalId = setInterval(function() {
                        document.getElementById("timer").innerHTML = timeCounter("display");
                    }, 1000);
                };
            };
    };

    // format the timer string and return it
    nowTime = Math.round(date.getTime() / 1000);

    lapsedTime = nowTime - startTime;
    hours = Math.floor(lapsedTime / 3600);
    lapsedTime %= 3600; // remainder = seconds after hours removed
    minutes = Math.floor(lapsedTime / 60);
    seconds = Math.floor(lapsedTime % 60);

    // Strings with leading zeroes
    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    return "H: " + hours + " M: " + minutes + " S: " + seconds + " ";
}


/**
 * @description Display end of game modal
 *
 */
function showModal() {
    // wait for 1 second then display modal
    setTimeout(function() {
        document.getElementById("move-cnt").innerHTML =
            "Number of moves: " + moveCount;
        document.getElementById("game-time").innerHTML =
            "Game time:  " + timeCounter("stop");
        document.getElementById("game-rating").innerHTML =
            "Game rating: " + doStars(moveCount);
        document.querySelector(".modal-bg").style.display = "flex";
    }, 1000);
}

/**
 * @description Hide the end of game modal
 *
 */
function hideModal() {
    document.querySelector(".modal-bg").style.display = "none";
}

/**
 * @description Hide the end of game modal and restart the game
 *
 */
function modalRestart() {
    document.querySelector(".modal-bg").style.display = "none";
    restartGame();
}

/**
 * @description Quit the game
 *
 */
function quitGame() {
    document.querySelector(".modal-bg").style.display = "none";
    document.querySelector(".stop-screen").style.display = "flex";
}