require("@nomiclabs/hardhat-waffle");
// Import and configure dotenv
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      // This value will be replaced on runtime
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    }
  }
};

// Version - 1 WavePortal Contract address on Rinkeby : 0x63c5e05E889548917d360c9C08c63987B740B72D
// Version - 2 WavePortal Contract address on Rinkeby : 0x05617cB6f00E149320eE4ab424F78eAD9Cad0bA7
// Version - 3 WavePortal Contract address on Rinkeby : 0xb84bA87fa9241E40c4F5AeEeEffFFAa651FB82d8
// Version - 4 WavePortal Contract address on Rinkeby : 0x413b28e594B650f7101e995da5Bf0E040F976077
// Version - 5 WavePortal Contract address on Rinkeby : 0xb4e699d885345CC96686fC42e2b9e543c66Af10B