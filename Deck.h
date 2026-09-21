#ifndef Deck_H
#define Deck_H

#include "Flashcard.h"
#include <string>
#include <vector>

class Deck {
public:
	void addFlashcard(Flashcard newCard);

	void printDeck() const;
private:
	std::vector<Flashcard> deck;
};

#endif