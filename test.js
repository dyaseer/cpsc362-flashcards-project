class Flashcard {
    constructor(term, def) {
        this.term = term;
        this.def = def;
    }

    get term() {
        return this.term;
    }

    get def() {
        return this.def;
    }

    set term(newTerm) {
        this.term = newTerm;
    }

    set def(newDef) {
        this.def = newDef;
    }
}

function test() {
    console.log("Running test...");
    
    newCard = new Flashcard("Destiny", "a predetermined course of events often held to be an irresistible power or agency");

    console.log("Test finished.");
}

test();