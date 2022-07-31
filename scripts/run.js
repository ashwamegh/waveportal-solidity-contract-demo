const main = async () => {
	const [_, randomPerson] = await hre.ethers.getSigners();
	const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
	const waveContract = await waveContractFactory.deploy({
		value: hre.ethers.utils.parseEther("0.1")
	});
	await waveContract.deployed();

	console.log("WaveContract deployed to: ", waveContract.address);
	console.log("WaveContract deployed by: ", _.address);

	let contractBalance = await hre.ethers.provider.getBalance(waveContract.address)
	console.log("Wave Contract Balance is: ", hre.ethers.utils.formatEther(contractBalance));

	let waveCount;
	waveCount = await waveContract.getTotalWaves();

	let waveTxn = await waveContract.wave("Hi buddy!");
	await waveTxn.wait();
	console.log("Our wave has been stored at: ", waveTxn.hash)
	waveCount = await waveContract.getTotalWaves();
	/*
	* Get Contract balance to see what happened!
	*/
	contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
	console.log(
		"Contract balance:",
		hre.ethers.utils.formatEther(contractBalance)
	);

	waveTxn = await waveContract.connect(randomPerson).wave("What's up mate!");
	await waveTxn.wait()
	waveCount = await waveContract.getTotalWaves();
	console.log(`Updated wave count, after waving us is ${waveCount}`);
	/*
	* Get Contract balance to see what happened!
	*/
	contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
	console.log(
		"Contract balance:",
		hre.ethers.utils.formatEther(contractBalance)
	);

	waveTxn = await waveContract.wave("Throw error on this message!");
	await waveTxn.wait()
	waveCount = await waveContract.getTotalWaves();
	console.log(`Updated wave count, after waving us is ${waveCount}`);
	/*
	* Get Contract balance to see what happened!
	*/
	contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
	console.log(
		"Contract balance:",
		hre.ethers.utils.formatEther(contractBalance)
	);

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