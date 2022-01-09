import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/pages/Game.module.css'
import Board from '../components/Board';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import cookies from 'cookie-cutter';
import { MODES } from '../utils/modes';

export default function Game({ seed, level, modeName }) {
	const router = useRouter();
	const [data, setData] = useState([]);
	const [prevGuess, setPrevGuess] = useState("");
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
				const guessResponse = await (await fetch(
					`/api/guess?seed=${seed}&level=${level}&guess=${guess}&previousGuess=${prevGuess}&mode=${modeName}`
				)).json();

				setSubmitting(false);

				if (guessResponse.error) {
					setError(guessResponse.error);
				} else {
					const guessData = guessResponse.data;
					setData(d => [...d, guessData]);
					setGuessCount(g => ++g);
					setIsCorrect(guessData.reduce((isCorrect, letter) => isCorrect && letter.status === "correct", true));
					setPrevGuess(guess);
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

				{(guessCount > 6 || (timer !== null && timer <= 0)) ? (
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
						{isMobile && <div>
							<input style={{ width: '100%' }} value="" placeholder="Tap here on mobile to bring up keyboard" />
						</div>}
						<div style={{ display: "flex", width: "50%", margin: "0 auto", flexDirection: "column", alignItems: "center" }}>
							{isCorrect && <p>Woo! You did it! Way to go!</p>}
							{isCorrect &&
								<>
									<p>Let&apos;s try the next round!</p>
									<button onClick={handleNextLevel}>Level {+level + 1}</button>
								</> 
							}
						</div>
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
