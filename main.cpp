#include <iostream>
#include "Deck.h"
#include "Flashcard.h"

using namespace std;


void showMenu() {
	cout << endl;
	cout << "------------------------------" << endl;
	cout << "Flashcard Prototype v0.1" << endl;
	cout << "------------------------------" << endl;
	cout << "1. Print deck" << endl;
	cout << "2. Create flashcard" << endl;
	cout << "3. Remove flashcard" << endl;
	cout << "0. Exit" << endl;
	cout << endl;
}

int main() {
	// To be clear, this shit should not stay here
	// Im just trying to make basic functionality work
	// Adding a gui should be easier with stuff working

	Deck testDeck("Astronomy");

	Flashcard flashcardA("Earth", "The third planet from the sun and our home.");
	Flashcard flashcardB("Moon", "Earths only natural satelite, it is tidally locked to the Earth.");
	Flashcard flashcardC("Sun", "A yellow dwarf star that sits in the center of our solar system.");

	testDeck.addFlashcard(flashcardA);
	testDeck.addFlashcard(flashcardB);
	testDeck.addFlashcard(flashcardC);

	bool running = true;
	int choice = -1;

	while (running) {
		showMenu();
		
		if (!(cin >> choice)) {
			cout << "Please enter a valid input..." << endl;
			cin.clear();
			cin.ignore(numeric_limits<streamsize>::max(), '\n');
			continue;
		}

		switch (choice) {
			case 1:
				testDeck.printDeck();
				break;
			default:
				cout << "Please enter a valid choice." << endl;
				break;
		}
	}
	return 0;
}

