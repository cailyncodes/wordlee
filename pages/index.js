import Head from 'next/head'
import styles from '../styles/pages/Home.module.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { MODES, MODE_NAME } from '../utils/modes';

export default function Home() {
	const [seed, setSeed] = useState('');
	const [modeName, setModeName] = useState('');
	const [mode, setMode] = useState();
	const router = useRouter();

	useEffect(() => {
		if (modeName) {
			setMode(MODES[modeName]);
		}
	}, [modeName]);

	const handleStart = () => {
		router.push(`/game?seed=${seed}&mode=${modeName}`)
	}

  return (
    <div className={styles.container}>
      <Head>
				<title>Wordlee | A game for word nerds</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Wordlee
        </h1>

        <p className={styles.description}>
          Get started by entering a seed to play with friends and race to the top!
        </p>

				<div className={styles.seed}>
					<input name="seed" placeholder="Seed" onInput={e => setSeed(e.target.value || '')} />
					<br />
					<select onInput={(e) => setModeName(e.target.value)}>
						<option value="">Choose a difficulty</option>
						<option value={MODE_NAME.CASUAL}>Casual</option>
						<option value={MODE_NAME.EASY}>Easy</option>
						<option value={MODE_NAME.INTERMEDIATE}>Intermediate</option>
						<option value={MODE_NAME.HARD}>Hard</option>
						<option value={MODE_NAME.ADVANCED}>Advanced</option>
					</select>
					<p>Difficulty Rating: {mode?.description || '<please select a difficulty>'}</p>
					<br />
					<button onClick={handleStart} disabled={!modeName}>Start</button>
				</div>
			</main>
    </div>
  )
}
