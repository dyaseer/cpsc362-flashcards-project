#include <iostream>
#include "Flashcard.h"

using namespace std;

int main() {
	Flashcard newCard("Alpha", "The first letter in the greek alphabet.");

	cout << "Term: " << newCard.getTerm() << endl;
	cout << "Definition: " << newCard.getDef() << endl;

	cout << "Changing flashcard data..." << endl;

	newCard.setDef("Something random blah blah blah.");

	cout << "Term: " << newCard.getTerm() << endl;
	cout << "Definition: " << newCard.getDef() << endl;

	return 0;
}