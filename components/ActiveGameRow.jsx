import styles from '../styles/components/GameRow.module.css';
import GameTile from './GameTile';
import { useState, useEffect } from 'react';

export default function ActiveGameRow({ submitGuess }) {
	const [input, setInput] = useState('     ');
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const listener = (e) => {
			setInput(i => {
				const numOfLetters = i.trim().length;

				if (e.key === "Enter") {
					setSubmitting(true);
					return i;
				}

				if (numOfLetters > 0 && e.key === "Backspace") {
					return `${i.substring(0, numOfLetters - 1)} ${i.substring(numOfLetters)}`;
				}

				if (e.keyCode < 65 || e.keyCode > 90 || numOfLetters >= 5) {
					return i;
				}
				
				return `${i.substring(0, numOfLetters)}${e.key.toLocaleUpperCase()}${i.substring(numOfLetters + 1)}`;
			})
		}

		document.addEventListener('keyup', listener);

		return () => {
			document.removeEventListener("keyup", listener);
		}
	}, []);

	useEffect(() => {
		if (submitting) {
			setSubmitting(false);
			setInput('     ');
			submitGuess(input);
		}
	}, [submitting]);

	return <div className={styles.container} onClick={() => document.getElementById("input").focus()}>
		<input id="input" type="hidden" />
		{input.split('').map((letter, i) => <GameTile key={`active-${i}`} letter={letter} status="pending" />)}
	</div>
}
