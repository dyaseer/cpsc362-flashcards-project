#include <iostream>
#include "Deck.h"
#include "Flashcard.h"

using namespace std;

int main() {
	Deck testDeck;

	Flashcard flashcardA("Earth", "The third planet from the sun and our home.");
	Flashcard flashcardB("Moon", "Earths only natural satelite, it is tidally locked to the Earth.");
	Flashcard flashcardC("Sun", "A yellow dwarf star that sits in the center of our solar system.");

	testDeck.addFlashcard(flashcardA);
	testDeck.addFlashcard(flashcardB);
	testDeck.addFlashcard(flashcardC);

	testDeck.printDeck();

	return 0;
}