// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fs from "fs";
import path from "path";
import { assessGuess, updateGameState } from "../../utils/guess.js";
import { MODES, MODE_NAME } from "../../utils/modes.js";
import { shuffle } from "../../utils/random.js";

export default function handler(req, res) {
	const { cookies } = req;
	const allWordsfile = fs.readFileSync(path.join(process.cwd(), "data", "all_words.txt"));
	const validWordsfile = fs.readFileSync(path.join(process.cwd(), "data", "valid-words.txt"));
	const allWords = allWordsfile.toString().split("\n");
	const validWords = validWordsfile.toString().split("\n");
	
	const { seed, level, guess, mode: modeName, gameState: gameStateStr } = req.query;
	const gameState = gameStateStr.split(',').map(Number);

	const mode = MODES[modeName || MODE_NAME.EASY];

	const seedAsNumber = seed.split("").reduce((sum, letter) => letter.charCodeAt(0) + sum, 0)
	const sortedWords = shuffle(validWords, seedAsNumber);
	const currentWord = sortedWords[level - 1];
	const parsedGuess = guess.toUpperCase();

	const guessValidation = mode.guessValidator(parsedGuess, allWords, currentWord, gameState);

	if (guessValidation) {
		return res.status(200).json({
			error: guessValidation
		});
	}

	const data = assessGuess(currentWord, parsedGuess);
	const newGameState = updateGameState(currentWord, parsedGuess, gameState);

	return res.status(200).json({ data, gameState: newGameState });
}
