const fs = require('fs')
const path = require('path')

async function main(readFileName, writeFileName) {
	const file = fs.readFileSync(path.join(process.cwd(), readFileName)).toString();
	const lines = file.split("\n");
	const words = lines.filter(line => !line.includes("#")).map(line => line.split("\t")[0]);
	const validWords = words.filter(word => word.length === 5).map(s => s.toUpperCase());
	const writeFilePath = path.join(process.cwd(), writeFileName);
	fs.writeFileSync(writeFilePath, validWords.join("\n"))
}

main(process.argv[2], process.argv[3]);
