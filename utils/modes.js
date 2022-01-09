import { ERROR_CODES } from "./errors";
import { assessGuess, isValidWord } from "./guess";

const allRestrictions = (currentGuess, allWords, currentWord, prevGuess) => {
	if (!isValidWord(allWords, currentGuess)) {
		return ERROR_CODES.NOT_A_WORD;
	}

	const previousAssessment = assessGuess(currentWord, prevGuess);

	let i = 0;
	for (const letterStatus of previousAssessment) {
		if (letterStatus.status === 'correct') {
			if (currentGuess[i] !== currentWord[i]) {
				return ERROR_CODES.IGNORES_RESTRICTIONS;
			}
		} else if (letterStatus.status === 'wrong-position') {
			if (currentGuess[i] === letterStatus.letter) {
				return ERROR_CODES.IGNORES_RESTRICTIONS;
			}
			if (!currentGuess.includes(letterStatus.letter)) {
				return ERROR_CODES.IGNORES_RESTRICTIONS;
			}

			// TODO: Unhanded case about multiple wrong-position letters
			// e.g. Correct word = CANAL | Prev guess = ALPHA | New guess = LANES
			// New guess should have at least two As
		} else if (letterStatus.status === 'not-used') {
			if (currentGuess.includes(letterStatus.letter)) {
				return ERROR_CODES.IGNORES_RESTRICTIONS;
			}
		} else /* pending */ {
			// TODO
		}
		++i;
	}
}

export const MODE_NAME = {
	CASUAL: 'casual', // 6 guesses, no guess restriction, non-words allowed
	EASY: 'easy', // 6 guesses, no guess restriction, only valid words allowed
	INTERMEDIATE: 'intermediate', // 6 guesses, no guess restriction, only valid words allowed, timer
	HARD: 'hard', // 6 guesses, guess restriction, only valid words allowed, no timer
	ADVANCED: 'advanced', // 6 guesses, guess restriction, only valid words allowed, timer
}

export const CASUAL = {
	name: MODE_NAME.CASUAL,
	description: 'You have 6 guesses per level and there are no restrictions on your guesses.',
	guessCount: 6,
	guessValidator: () => undefined,
	timePerLevel: null,
};

export const EASY = {
	name: MODE_NAME.EASY,
	description: 'You have 6 guesses per level and every guess must be an actual word.',
	guessCount: 6,
	guessValidator: (currentGuess, allWords) => {
		if (!isValidWord(allWords, currentGuess)) {
			return ERROR_CODES.NOT_A_WORD;
		}
	},
	timePerLevel: null,
}

export const INTERMEDIATE = {
	name: MODE_NAME.INTERMEDIATE,
	description: 'You have 6 guesses per level and every guess must be an actual word. Each level has a 3 minute timer.',
	guessCount: 6,
	guessValidator: (currentGuess, allWords) => {
		if (!isValidWord(allWords, currentGuess)) {
			return ERROR_CODES.NOT_A_WORD;
		}
	},
	timePerLevel: 180,
};

export const HARD = {
	name: MODE_NAME.HARD,
	description:  'You have 6 guesses per level and every guess must be a word and logically follow from the hints in your previous guess.',
	guessCount: 6,
	guessValidator: allRestrictions,
	timePerLevel: null,
}

export const ADVANCED = {
	name: MODE_NAME.ADVANCED,
	description:  'You have 6 guesses per level and every guess must be a word and logically follow from the hints in your previous guess. Each level has a 2 minute timer.',
	guessCount: 6,
	guessValidator: allRestrictions,
	timePerLevel: 5,
}

export const MODES = {
	[MODE_NAME.CASUAL]: CASUAL,
	[MODE_NAME.EASY]: EASY,
	[MODE_NAME.INTERMEDIATE]: INTERMEDIATE,
	[MODE_NAME.HARD]: HARD,
	[MODE_NAME.ADVANCED]: ADVANCED,
}
