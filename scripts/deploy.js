const main = async () => {
	const [deployer] = await hre.ethers.getSigners();
	const accountBalance = await deployer.getBalance();

	console.log("Our current deployer account is: ", deployer.address);
	console.log("Deployer account balance: ", accountBalance.toString());

	const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
	const waveContract = await waveContractFactory.deploy({
		value: hre.ethers.utils.parseEther("0.001"),
	});
	await waveContract.deployed();

	console.log("WavePortal contract is deployed at address: ", waveContract.address)
}

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.error(error)
		process.exit(1);
	}
}

runMain();