import cx from 'classnames';
import styles from '../styles/components/GameTile.module.css';

export default function GameTile({ letter, status }) {
	return <div className={cx(styles.container, styles[status])}>
		{letter}
	</div>
}
