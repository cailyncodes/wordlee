import GameRow from "./GameRow";
import ActiveGameRow from "./ActiveGameRow";

export default function Board({ submitGuess, data }) {
	const arrayOfIndices = [0,1,2,3,4,5];

	return <div style={{ justifySelf: "center" }}>
		{arrayOfIndices.slice(0, data.length).map(index => {
			return <GameRow key={index} position={index} data={data[index]} />
		})}
		{data.length < arrayOfIndices.length && <ActiveGameRow submitGuess={submitGuess} />}
		{data.length < arrayOfIndices.length && arrayOfIndices.slice(data.length + 1).map(index => {
			return <GameRow key={index} position={index} data={[
				{ status: 'pending' },
				{ status: 'pending' },
				{ status: 'pending' },
				{ status: 'pending' },
				{ status: 'pending' },
			]} />
		})}
	</div>
}