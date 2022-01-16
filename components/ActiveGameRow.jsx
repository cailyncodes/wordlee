import styles from '../styles/components/GameRow.module.css';
import GameTile from './GameTile';
import { useState, useEffect } from 'react';

export default function ActiveGameRow({ submitGuess }) {
	const [input, setInput] = useState('     ');
	const [submitting, setSubmitting] = useState(false);

	const handleInput = (key) => {
		setInput((i) => {
			if (key === "Enter") {
				if (i.length === 5) {
					setSubmitting(true);
				}
				return i;
			}

			const numOfLetters = i.trim().length;
			if (numOfLetters > 0 && key === "Backspace") {
				return `${i.substring(0, numOfLetters - 1)} ${i.substring(numOfLetters)}`;
			}

			if (numOfLetters >= 5 || key === "Backspace") {
				return i;
			}
			
			return `${i.substring(0, numOfLetters)}${key.toLocaleUpperCase()}${i.substring(numOfLetters + 1)}`;

		});
	}

	useEffect(() => {
		const onscreenKeyboardListener = (e) => {
			handleInput(e.detail.letter);
		}

		const physicalKeyboardListener = (e) => {
			const isValid = 
				e.key === "Enter" ||
				e.key === "Backspace" ||
				(e.keyCode >= 65 && e.keyCode <= 90);

			if (isValid) {
				handleInput(e.key);
			}
		}

		document.addEventListener('keyboard-event', onscreenKeyboardListener)
		document.addEventListener('keyup', physicalKeyboardListener);

		return () => {
			document.removeEventListener('keyboard-event', onscreenKeyboardListener)
			document.removeEventListener("keyup", physicalKeyboardListener);
		}
	}, []);

	useEffect(() => {
		if (submitting) {
			setSubmitting(false);
			setInput('     ');
			submitGuess(input);
		}
	}, [submitting]);

	return <div className={styles.container}>
		{input.split('').map((letter, i) => <GameTile key={`active-${i}`} letter={letter} status="pending" />)}
	</div>
}
