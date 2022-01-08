import styles from '../styles/components/GameRow.module.css';
import GameTile from './GameTile';
import { useState, useEffect } from 'react';
import { normalizeInputEvent } from '../utils/events';

export default function ActiveGameRow({ submitGuess }) {
	const [input, setInput] = useState('     ');
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const listener = (e) => {
			setInput(i => {
				const numOfLetters = i.trim().length;

				if (e.ignore) {
					return i;
				}

				if (e.data) {
					e.key = e.data.toUpperCase();
					e.keyCode = e.key.charCodeAt(0);
				}

				if (!e.key) {
					return i;
				}

				if (e.key === "Enter") {
					if (i.length === 5) {
						setSubmitting(true);
					}
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

		const l = e => listener(normalizeInputEvent(e));

		document.addEventListener('keyup', l);
		document.addEventListener('input', l);

		return () => {
			document.removeEventListener("keyup", l);
			document.addEventListener('input', l);
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
