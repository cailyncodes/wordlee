import cookies from 'cookie-cutter';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Board from '../components/Board';
import Keyboard from '../components/Keyboard';
import styles from '../styles/pages/Game.module.css';
import { DEFAULT_GAME_STATE } from '../utils/game';
import { MODES } from '../utils/modes';

export default function Game({ seed, level, modeName }) {
	const router = useRouter();
	const [data, setData] = useState([]);
	const [gameState, setGameState] = useState(DEFAULT_GAME_STATE);
	const [guess, setGuess] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const [guessCount, setGuessCount] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const mode = MODES[modeName];
	const [timer, setTimer] = useState(mode.timePerLevel);
	const [error, setError] = useState('');

	useEffect(() => {
		const userAgent = window.navigator.userAgent.toLowerCase();
		const isMobile = userAgent.includes("android")
			|| userAgent.includes("iphone")
			|| userAgent.includes("ipod")
			|| userAgent.includes("ipad");
		setIsMobile(isMobile)
	}, []);

	const submitGuess = async (newGuess) => {
		setSubmitting(true);
		setError('');
		setGuess(newGuess);
	}

	useEffect(() => {
		if (submitting) {
			const submit = async () => {
				const response = await fetch(
					`/api/guess?seed=${seed}&level=${level}&guess=${guess}&gameState=${gameState}&mode=${modeName}`
				);
				const guessResponse = await response.json();
				setSubmitting(false);

				if (guessResponse.error) {
					setError(guessResponse.error);
				} else {
					const guessData = guessResponse.data;
					const newGameState = guessResponse.gameState;
					setData(d => [...d, guessData]);
					setGuessCount(g => ++g);
					setIsCorrect(guessData.reduce((isCorrect, letter) => isCorrect && letter.status === "correct", true));
					setGameState(newGameState);
					setGuess("");
				}
			}

			void submit();
		}
	}, [submitting]);

	useEffect(() => {
		if (timer && timer > 0) {
			setTimeout(() => setTimer(t => --t), 1000);
		}
	}, [timer]);

	const handleNextLevel = () => {
		setData([]);
		setGuessCount(0);
		setIsCorrect(false);
		cookies.set(seed, +level+1, { secure: false });
		router.reload();
	}

  return (
    <div className={styles.container}>
      <Head>
        <title>Wordlee | A game for word nerds</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Wordlee
        </h1>
				<h2 className={styles.subtitle}>Seed: {seed} | Level: {level}</h2>

				{((guessCount === 6 && !isCorrect) || (timer !== null && timer <= 0)) ? (
					<div style={{ display: "flex", width: "50%", margin: "0 auto", flexDirection: "column", alignItems: "center" }}>
						<p>Game over</p>
						<h3>Final Score: {(level - 1)}</h3>
						<p>Try again with a different seed.</p>
						<button onClick={() => router.push('/')}>Restart</button>
					</div>
				) : (
					<>
						{mode.timePerLevel && <h3 className={styles.subtitle}>Timer: {timer}</h3>}
						<Board submitGuess={submitGuess} data={data} />
						{error && <p style={{ display: "flex", width: "50%", margin: "0 auto", flexDirection: "column", alignItems: "center" }}>{error}</p>}
						<div style={{ display: "flex", width: "50%", margin: "0 auto", flexDirection: "column", alignItems: "center" }}>
							{isCorrect && <p>Woo! You did it! Way to go!</p>}
							{isCorrect &&
								<>
									<p>Let&apos;s try the next round!</p>
									<button onClick={handleNextLevel}>Level {+level + 1}</button>
								</> 
							}
						</div>
						{isMobile && <div>
							<Keyboard gameState={gameState} />
						</div>}
					</>
				)}
      </main>
    </div>
  )
}

export function getServerSideProps(context) {
	const { req: { cookies }, query: { seed, mode: modeName } } = context;

	if (!seed) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			}
		}
	}

	const level = cookies[seed.toLowerCase()] || "1";

	return {
		props: {
			seed: seed.toLowerCase(),
			modeName: modeName ? modeName.toLowerCase() : 'easy',
			level,
		}
	}
}
