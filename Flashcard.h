#ifndef Flashcard_H
#define Flashcard_H

#include <string>

class Flashcard {
public:
	Flashcard(std::string newTerm = "", std::string newDef = "");

	std::string getTerm() const;
	std::string getDef() const;


	void setTerm(std::string newTerm);
	void setDef(std::string newDef);

private:
	std::string term;
	std::string def;
};

#endif