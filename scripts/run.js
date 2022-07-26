const main = async () => {
	const [_, randomPerson] = await hre.ethers.getSigners();
	const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
	const waveContract = await waveContractFactory.deploy();
	await waveContract.deployed();

	console.log("WaveContract deployed to: ", waveContract.address);
	console.log("WaveContract deployed by: ", _.address);

	let waveCount;
	waveCount = await waveContract.getTotalWaves();

	let waveTxn = await waveContract.wave("Hi buddy!");
	await waveTxn.wait();
	console.log("Our wave has been stored at: ", waveTxn.hash)
	waveCount = await waveContract.getTotalWaves();

	waveTxn = await waveContract.connect(randomPerson).wave("Hello Bro!");
	await waveTxn.wait();
	console.log("Our wave has been stored at: ", waveTxn.hash)
	waveCount = await waveContract.getTotalWaves();

	waveTxn = await waveContract.connect(randomPerson).wave("Hola Amigo!");
	await waveTxn.wait();
	console.log("Our wave has been stored at: ", waveTxn.hash)
	waveCount = await waveContract.getTotalWaves();

	waveTxn = await waveContract.wave("What's up mate!");
	await waveTxn.wait()
	waveCount = await waveContract.getTotalWaves();
	console.log(`Updated wave count, after waving us is ${waveCount}`);

	let allWaves = await waveContract.getAllWaves();
	console.log(allWaves);
}

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}

runMain();