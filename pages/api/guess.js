// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fs from "fs";
import path from "path";
import { assessGuess } from "../../utils/guess.js";
import { MODES, MODE_NAME } from "../../utils/modes.js";
import { shuffle } from "../../utils/random.js";

export default function handler(req, res) {
	const file = fs.readFileSync(path.join(process.cwd(), "data", "all_words.txt"));
	const words = file.toString().split("\n");
	
	const { seed, level, guess, previousGuess, mode: modeName } = req.query;

	const mode = MODES[modeName || MODE_NAME.EASY];

	const seedAsNumber = seed.split("").reduce((sum, letter) => letter.charCodeAt(0) + sum, 0)
	const sortedWords = shuffle(words, seedAsNumber);
	const currentWord = sortedWords[level - 1]
	const parsedGuess = guess.toUpperCase();
	const parsedPreviousGuess = previousGuess ? previousGuess.toUpperCase() : '';

	const guessValidation = mode.guessValidator(parsedGuess, words, currentWord, parsedPreviousGuess);
	if (guessValidation) {
		return res.status(200).json({
			error: guessValidation
		});
	}
	
	const response = assessGuess(currentWord, parsedGuess);

	return res.status(200).json({
		data: response
	});
}
