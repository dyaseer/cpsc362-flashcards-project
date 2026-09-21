#include "Deck.h"
#include "Flashcard.h"
#include <iostream>
#include <string>
#include <vector>

using namespace std;

void Deck::addFlashcard(Flashcard newCard) {
	deck.push_back(newCard);
}

void Deck::printDeck() const {
	cout << "Printing flashcards..." << endl;
	for (const auto& card : deck) {
		cout << card.getTerm() << ": " << card.getDef() << endl;
	}
}