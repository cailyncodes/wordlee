import { LETTER_MASK_MAP } from "./letter";

export const isLetterAvailable = (gameState, letter) => {
	const bitMask = LETTER_MASK_MAP[letter];

	let isAvailable = false;

	for (const letterState of gameState) {
		isAvailable |= ((letterState & bitMask) !== 0);
	}

	return isAvailable;
}
