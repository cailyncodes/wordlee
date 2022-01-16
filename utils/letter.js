export const LETTERS = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z',
];

export const LETTER_MASK_MAP = LETTERS.reduce(
	(map, letter, i) => {
		map[letter] = (1 << i);
		return map;
	},
	{}
);

export const LETTER_OFFSET = 'A'.charCodeAt(0);

export const ALL_POSSIBLE = (1 << 26) - 1;
