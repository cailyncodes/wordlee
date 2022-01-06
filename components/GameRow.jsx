import styles from '../styles/components/GameRow.module.css';
import GameTile from './GameTile';

export default function GameRow({ data, position }) {
	return <div className={styles.container}>
		{data.map(({ letter, status }, i) => <GameTile key={`${position}-${i}`} letter={letter} status={status} />)}
	</div>
}
