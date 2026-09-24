class Flashcard {
    constructor(term, def, hint) {
        this._term = term;
        this._def = def;
        this._hint = hint;
    }

    get term() {
        return this._term;
    }

    get def() {
        return this._def;
    }

    set term(newTerm) {
        this._term = newTerm;
    }

    set def(newDef) {
        this._def = newDef;
    }

    set hint(hint) {
        this._hint = hint;
    }
}

class FlashDeck {
    constructor(name) {
        this._name = name;
        this._deck = new Map();
    }

    get name() {
        return this._name;
    }

    get deck() {
        return this._deck;
    }

    set name(newName) {
        this._name = newName;
    }

    addcard(flashcard) {
        this._deck.set(flashcard.term, flashcard);
    }

    removecard(flashcard) {
        this._deck.delete(flashcard.term);
    }


}

const testDeck = new FlashDeck("Test");
const form = document.getElementById('flashcard-form');
const container = document.getElementById('deck-container');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const termValue = document.getElementById('term-input').value;
    const defValue = document.getElementById('def-input').value;

    const newCard = new Flashcard(termValue, defValue, "");
    testDeck.addcard(newCard);

    const cardDiv = document.createElement('div');
    cardDiv.className = 'flashcard-card';

    cardDiv.innerHTML = `
        <h2>${newCard.term}</h3>
        <p>${newCard.def}</p>
    `;

    container.appendChild(cardDiv);

    form.reset();
});

// function test() {
//     console.log("Running test...");
    
//     newCard = new Flashcard("Destiny", "a predetermined course of events often held to be an irresistible power or agency", "Fate.");

//     newDeck = new FlashDeck("deck1");

//     console.log(newDeck.name);

//     newDeck.addcard(newCard);

//     console.log(newDeck.deck.get("Destiny"))

//     newDeck.removecard(newCard);


//     console.log("Test finished.");


// }

// test();
