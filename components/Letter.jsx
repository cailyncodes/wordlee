import * as React from 'react';
import cx from 'classnames';

import styles from '../styles/components/Letter.module.css';

const Letter = ({ letter, status }) => {
	const handleClick = () => {
		const event = new CustomEvent('keyboard-event', {
			detail: { letter },
			bubbles: true,
		});

		document.dispatchEvent(event);
	}

	return <div
		className={cx(styles.container,	{
			[styles.unused]: status === 'unused',
			[styles.action__enter]: status === 'enter',
			[styles.action__backspace]: status === 'backspace',
		})}
		onClick={handleClick}
	>
		{letter}
	</div>
}

export default Letter;
