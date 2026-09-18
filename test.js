class Flashcard {
    constructor(term, def) {
        this._term = term;
        this._def = def;
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
}

function test() {
    console.log("Running test...");
    
    newCard = new Flashcard("Destiny", "a predetermined course of events often held to be an irresistible power or agency");

    console.log("Test finished.");
}

test();
