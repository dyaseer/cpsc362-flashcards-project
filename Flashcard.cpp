#include "Flashcard.h"
#include <string>

using namespace std;

Flashcard::Flashcard(string newTerm, string newDef) : term(newTerm), def(newDef) {}

string Flashcard::getTerm() const {
	return term;
}

string Flashcard::getDef() const {
	return def;
}

void Flashcard::setTerm(string newTerm) {
	term = newTerm;
}

void Flashcard::setDef(string newDef) {
	def = newDef;
}