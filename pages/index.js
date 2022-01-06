import Head from 'next/head'
import styles from '../styles/pages/Home.module.css'
import { useState } from 'react'
import { useRouter } from 'next/router';

export default function Home() {
	const [seed, setSeed] = useState('');
	const router = useRouter();

	const handleStart = () => {
		router.push(`/game?seed=${seed}`)
	}

  return (
    <div className={styles.container}>
      <Head>
        <title>Wordlee</title>
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
					<button onClick={handleStart}>Start</button>
				</div>
			</main>
    </div>
  )
}
