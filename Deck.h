#ifndef Deck_H
#define Deck_H

#include "Flashcard.h"
#include <string>
#include <vector>

class Deck {
public:
	Deck(std::string newName = ""): name(newName) {};

	void addFlashcard(Flashcard newCard);

	void printDeck() const;
private:
	std::string name;
	std::vector<Flashcard> deck;
};

#endif