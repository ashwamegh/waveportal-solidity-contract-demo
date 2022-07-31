import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AvatarGenerator } from "random-avatar-generator";

import abi from "./utils/WavePortal.json";
import "./App.css";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [wavePortalContract, setWavePortalContract] = useState(null);
  const [totalWaveCounts, setTotalWaveCounts] = useState(0);
  const [wavingStatus, setWavingStatus] = useState(false);
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState('');

  const generator = new AvatarGenerator();

  // WavePortal Contract Address
  const contractAddress = "0xb4e699d885345CC96686fC42e2b9e543c66Af10B";

  // Reference contents of the contract abi
  const { abi: contractABI } = abi;

  const checkMetaMask = () => {
    const { ethereum } = window;

    if (ethereum) {
      // console.log("We have the ethereum object: ", ethereum);
      return true;
    } else {
      console.log("Please make sure, you have MetaMask!");
      return false;
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (checkMetaMask()) {
        const { ethereum } = window;
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          const account = accounts[0];
          setCurrentAccount(account);
          console.log("Found an authorized account: ", account);
          return true;
        } else {
          console.log("No authorized account found!");
          return false;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (checkMetaMask()) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          const account = accounts[0];
          setCurrentAccount(account);
          console.log("Account connected: ", account);
        } else {
          console.log("Failed connecting account");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllWaves = async () => {
    if (wavePortalContract) {
      const waves = await wavePortalContract.getAllWaves();

      /*
       * We only need address, timestamp, and message in our UI so let's
       * pick those out
       */
      const wavesCleaned = [];
      waves.forEach((wave) => {
        wavesCleaned.push({
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        });
      });

      // set the position for messages with latest entry
      wavesCleaned.reverse();

      setAllWaves(wavesCleaned);
      return true;
    } else {
      return 0;
    }
  };

  const getTotalWaveCount = async () => {
    if (wavePortalContract) {
      const totalWaveCount = await wavePortalContract.getTotalWaves();
      const totalWaveCountNumber = totalWaveCount.toNumber();
      setTotalWaveCounts(totalWaveCountNumber);
      return totalWaveCountNumber;
    } else return 0;
  };

  const wave = async (event) => {
    event.preventDefault()

    try {
      if (checkMetaMask() && currentAccount && wavePortalContract) {
        if (!message) {
          Swal.fire({
            title: "Please enter your message to send waves 😞",
            html: '<iframe src="https://giphy.com/embed/7VHV66bRjGRSo" width="480" height="279" frameBorder="0"></iframe>',
            icon: "warning",
            showConfirmButton: false,
            showCloseButton: true,
          });
          return;
        }

        let waveCount = await getTotalWaveCount();
        console.log("Reading total wave count at...", waveCount);
        Swal.fire({
          title: "🚀 Transaction in Progress",
          html: '<iframe src="https://giphy.com/embed/T3Bs3vgaoUoH9Pdqs0" width="480" height="480" frameBorder="0"></iframe>',
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        // Code to wave from Smart Contract
        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining....", waveTxn.hash);
        Swal.fire({
          title: "Mining in Progress...",
          html: '<iframe src="https://giphy.com/embed/5C3Zrs5xUg5fHV4Kcf" width="480" height="480" frameBorder="0"></iframe>',
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        setWavingStatus("Miners are mining your wave...");

        const data = await waveTxn.wait();
        console.log(data);
        console.log("Mined....", waveTxn.hash);
        Swal.fire({
          title: "🤑 Mined & Waved",
          html: `Click hash to see your transaction: <a href="https://rinkeby.etherscan.io/tx/${waveTxn.hash}" target="_blank">${waveTxn.hash}</a><br><br><iframe src="https://giphy.com/embed/b5L1Lt3k4hGNDZWVIw" width="480" height="269" frameBorder="0"></iframe>`,
          type: "success",
          showConfirmButton: false,
          showCloseButton: true,
        });
        setWavingStatus(false);

        waveCount = await getTotalWaveCount();
        console.log("Retrieving total wave count....", waveCount);
        getAllWaves();
      } else {
        console.log("Check MetaMask and Connect your wallet!");
        Swal.fire({
          title: "Wallet not Connected!",
          html: 'Check MetaMask and Connect your wallet! <br><br><iframe src="https://giphy.com/embed/gmslqIqkiMbgrvBqhZ" width="480" height="270" frameBorder="0"></iframe>',
          icon: "warning",
          showConfirmButton: false,
          showCloseButton: true,
        });
      }
    } catch (error) {
      if (error.reason) {
        Swal.fire({
          title: "Oops 🤐",
          html: `${error.reason.split(":")[1].trim()} <br><br> <iframe src="https://giphy.com/embed/3ohzdYJK1wAdPWVk88" width="480" height="270" frameBorder="0"></iframe>`,
          icon: "error",
          showConfirmButton: false,
          showCloseButton: true,
        });
      }
      console.error(error);
    }
  };

  const runEffect = async () => {
    const isWalletConnected = await checkIfWalletIsConnected();
    if (isWalletConnected) {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      setWavePortalContract(contract);
    }
    return true;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    runEffect();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getTotalWaveCount();
    getAllWaves();
  }, [wavePortalContract]);

  return (
    <div className="App">
      <main>
        <form onSubmit={wave} className="wave-editor">
          <textarea
            name="wave-message"
            cols="63"
            rows="10"
            placeholder={`👋 Hey there, I am Ashwamegh!! Would you like to wave at me${totalWaveCounts > 0
              ? ", along with " + totalWaveCounts + " waver(s)!"
              : "!"
              }`}
            onChange={(event) => setMessage(event.target.value)}
          ></textarea>
          <div
            style={{ display: "flex", justifyContent: "end", padding: "1rem" }}
          >
            <div>
              {!currentAccount && (
                <button type="primary" onClick={connectWallet}>Connect 💰</button>
              )}
              <button type="submit" onClick={wave}>
                {wavingStatus ? "waving..." : "Wave"}
              </button>
            </div>
          </div>
        </form>

        {allWaves.length > 0 && (
          <section className="app-info messages">
            {allWaves.map((wave, index) => {
              return (
                <div
                  className="message-wrapper"
                  key={index}
                  style={{ marginTop: "2rem", padding: "0.5rem" }}
                >
                  <figure>
                    <img
                      src={generator.generateRandomAvatar()}
                      alt="Random Avatar"
                    />
                  </figure>
                  <div style={{ width: '100%' }}>
                    <div className="message-tags">
                      <span className="message-tag">Address:</span>{" "}
                      <span className="message-tag-data">{wave.address}</span>
                    </div>
                    <div className="message-tags">
                      <span className="message-tag">Message:</span>{" "}
                      <span className="message-tag-data">{wave.message}</span>
                    </div>
                    <div
                      className="message-tags"
                      style={{ display: "flex", justifyContent: "end", fontSize: '0.75rem', color: '#525252' }}
                    >
                      <span className="message-tag-data">
                        {wave.timestamp.toLocaleString()} 📅
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
