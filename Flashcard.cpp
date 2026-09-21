#include "Flashcard.h"
#include <string>

using namespace std;

string Flashcard::getTerm() const {
	return term;
}

string Flashcard::getDef() const {
	return def;
}

bool Flashcard::isFlipped() const {
	return flipped;
}

void Flashcard::setTerm(string newTerm) {
	term = newTerm;
}

void Flashcard::setDef(string newDef) {
	def = newDef;
}