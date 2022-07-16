const main = async () => {
	const [owner, randomPerson] = await hre.ethers.getSigners();
	const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
	const waveContract = await waveContractFactory.deploy();
	await waveContract.deployed();

	console.log("WaveContract deployed to: ", waveContract.address);
	console.log("WaveContract deployed by: ", owner.address);

	let waveCount;
	waveCount = await waveContract.getTotalWaves();

	let waveTxn = await waveContract.wave();
	await waveTxn.wait();
	console.log("Our wave has been stored at: ", waveTxn.hash)
	waveCount = await waveContract.getTotalWaves();

	waveTxn = await waveContract.connect(randomPerson).wave();
	await waveTxn.wait();
	console.log("Our wave has been stored at: ", waveTxn.hash)
	waveCount = await waveContract.getTotalWaves();

	waveTxn = await waveContract.connect(randomPerson).wave();
	await waveTxn.wait();
	console.log("Our wave has been stored at: ", waveTxn.hash)
	waveCount = await waveContract.getTotalWaves();

	waveTxn = await waveContract.wave();
	await waveTxn.wait()
	console.log(`Our wave contract is deployed at ${waveTxn.hash} by User ${randomPerson.address}`);
	waveCount = await waveContract.getTotalWaves();


	waveTxn = await waveContract.connect(randomPerson).unwave();
	await waveTxn.wait();
	console.log(`The unwave transaction is store at ${waveTxn.hash}`)
	waveCount = await waveContract.getTotalWaves();
	console.log(`Updated wave count, after unwaving us is ${waveCount}`);

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