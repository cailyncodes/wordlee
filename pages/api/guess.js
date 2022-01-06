// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fs from "fs";
import path from "path";
import { shuffle } from "../../utils/random.js";

function getStatus(letter, position, currentWord) {
	if (currentWord[position - 1] === letter) {
		return "correct";
	}

	if (currentWord.includes(letter)) {
		return "wrong-position";
	}

	return "not-used";
}

export default function handler(req, res) {
	const file = fs.readFileSync(path.join(process.cwd(), "data", "valid-words.txt"));
	const words = file.toString().split("\n");
	
	const { seed, level, guess } = req.query;

	const seedAsNumber = seed.split("").reduce((sum, letter) => letter.charCodeAt(0) + sum, 0)

	const sortedWords = shuffle(words, seedAsNumber);
	const currentWord = sortedWords[level - 1]
	const parsedGuess = guess.toUpperCase();

  res.status(200).json([
		{ letter: parsedGuess[0], status: getStatus(parsedGuess[0], 1, currentWord) },
		{ letter: parsedGuess[1], status: getStatus(parsedGuess[1], 2, currentWord) },
		{ letter: parsedGuess[2], status: getStatus(parsedGuess[2], 3, currentWord) },
		{ letter: parsedGuess[3], status: getStatus(parsedGuess[3], 4, currentWord) },
		{ letter: parsedGuess[4], status: getStatus(parsedGuess[4], 5, currentWord) },
	]);
}
