import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/pages/Game.module.css'
import Board from '../components/Board';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import cookies from 'cookie-cutter';

export default function Game({ seed, level }) {
	const router = useRouter();
	const [data, setData] = useState([]);
	const [guess, setGuess] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const [guessCount, setGuessCount] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const [timer, setTimer] = useState(120);

	useEffect(() => {
		const isMobile = window.navigator.userAgent.toLowerCase().includes("android") || window.navigator.userAgent.toLowerCase().includes("iphone") || window.navigator.userAgent.toLowerCase().includes("ipod") || window.navigator.userAgent.toLowerCase().includes("ipad")
		setIsMobile(isMobile)
	}, []);

	const submitGuess = async (guess) => {
		setSubmitting(true)
		setGuess(guess);
	}

	useEffect(() => {
		if (submitting) {
			const submit = async () => {
				const guessResponse = await (await fetch(`/api/guess?seed=${seed}&level=${level}&guess=${guess}`)).json();
				
				setData(d => [...d, guessResponse]);
				setGuessCount(g => ++g);
				setIsCorrect(guessResponse.reduce((isCorrect, letter) => isCorrect && letter.status === "correct", true));
				setSubmitting(false);
				setGuess("");
			}

			void submit();
		}
	}, [submitting]);

	useEffect(() => {
		if (timer > 0) {
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
				

				{guessCount === 6 ? (
					<div style={{ display: "flex", width: "50%", margin: "0 auto", flexDirection: "column", alignItems: "center" }}>
						<p>Game over</p>
						<h3>Final Score: {(level - 1)}</h3>
						<p>Try again with a different seed.</p>
						<button onClick={() => router.push('/')}>Restart</button>
					</div>
				) : (
					<>
						{/* <h3 className={styles.subtitle}>Timer: {timer}</h3> */}
						<Board submitGuess={submitGuess} data={data} />
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
	const { req: { cookies }, query: { seed } } = context;

	const level = cookies[seed.toLowerCase()] || "1";

	if (!seed) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			}
		}
	}

	return {
		props: {
			seed: seed.toLowerCase(),
			level,
		}
	}
}
