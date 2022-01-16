import * as React from 'react';
import Letter from './Letter';

import styles from '../styles/components/Keyboard.module.css';
import { isLetterAvailable } from '../utils/keyboard';

const KEYBOARD_LAYOUT = [
	['Q','W','E','R','T','Y','U','I','O','P'],
	['A','S','D','F','G','H','J','K','L'],
	['Z','X','C','V','B','N','M'],
	['Enter', 'Backspace']
];

const Keyboard = ({ gameState }) => {

	const getStatus = (letter) => {
		if (letter === 'Enter') {
			return 'enter';
		}

		if (letter === 'Backspace') {
			return 'backspace';
		}

		return isLetterAvailable(gameState, letter) ? '' : 'unused';
	}

	return <div className={styles.container}>
		{KEYBOARD_LAYOUT.map((row, i) => {
			return <div key={i}>
				{row.map(letter => {
					const status = getStatus(letter);
					return <Letter key={letter} letter={letter} status={status} />;
				})}
			</div>
		})}
	</div>
}

export default Keyboard;
