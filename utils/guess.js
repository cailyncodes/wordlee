export const GUESS_STATUS = {
	CORRECT: 'correct',
	WRONG_POSITION: 'wrong-position',
	NOT_USED: 'not-used',
	PENDING: 'pending',
}

export const assessGuess = (currentWord, guess) => {
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

	return [
		{ letter: guess[0], status: statuses[0] },
		{ letter: guess[1], status: statuses[1] },
		{ letter: guess[2], status: statuses[2] },
		{ letter: guess[3], status: statuses[3] },
		{ letter: guess[4], status: statuses[4] },
	]
}

export const isValidWord = (allWords, currentGuess) => {
	return allWords.includes(currentGuess);
}
