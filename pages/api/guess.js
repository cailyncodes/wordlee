// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fs from "fs";
import path from "path";
import { shuffle } from "../../utils/random.js";

function getResponse(currentWord, guess) {
	const currentLetters = currentWord.split("");
	const guessLetters = guess.split("");

	const remainingIndices = [];

	const statuses = ['pending', 'pending', 'pending', 'pending', 'pending']; 

	for (let i = 0; i < guessLetters.length; ++i) {
		if (currentLetters[i] === guessLetters[i]) {
			statuses[i] = 'correct';
			currentLetters[i] = '';
		} else {
			remainingIndices.push(i);
		}
	}

	for (const i of remainingIndices) {
		const index = currentLetters.indexOf(guessLetters[i]);
		if (index >= 0) {
			statuses[i] = 'wrong-position';
			currentLetters[index] = '';
		} else {
			if (!currentWord.includes(guessLetters[i])) {
				statuses[i] = 'not-used';
			}
		}
	}


	// let lettersInWordAfterRemovingCorrect = currentWord.split("");
	// let numRemoved = 0;

	// for (let i = 0; i < currentWord.length; ++i) {
	// 	if (currentWord[i] === guess[i]) {
	// 		statuses[i] = 'correct';
	// 		lettersInWordAfterRemovingCorrect = lettersInWordAfterRemovingCorrect.filter((_,j) => i !== j + numRemoved);
	// 		++numRemoved;
	// 	}
	// 	if (!currentWord.includes(guess[i])) {
	// 		statuses[i] = 'not-used';
	// 	}
	// }

	// for (let i = 0; i < currentWord.length; ++i) {
	// 	if (statuses[i] === "pending") {
	// 		if (lettersInWordAfterRemovingCorrect.includes(guess[i])) {
	// 			statuses[i] = "wrong-position";
	// 		}
	// 	}
	// }

	return [
		{ letter: guess[0], status: statuses[0] },
		{ letter: guess[1], status: statuses[1] },
		{ letter: guess[2], status: statuses[2] },
		{ letter: guess[3], status: statuses[3] },
		{ letter: guess[4], status: statuses[4] },
	]
}

export default function handler(req, res) {
	const file = fs.readFileSync(path.join(process.cwd(), "data", "valid-words.txt"));
	const words = file.toString().split("\n");
	
	const { seed, level, guess } = req.query;

	const seedAsNumber = seed.split("").reduce((sum, letter) => letter.charCodeAt(0) + sum, 0)

	const sortedWords = shuffle(words, seedAsNumber);
	const currentWord = sortedWords[level - 1]
	const parsedGuess = guess.toUpperCase();

  res.status(200).json(getResponse(currentWord, parsedGuess));
}
