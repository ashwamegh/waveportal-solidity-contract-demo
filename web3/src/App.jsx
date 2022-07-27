import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import abi from './utils/WavePortal.json';
import './App.css';

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [wavePortalContract, setWavePortalContract] = useState(null);
  const [totalWaveCounts, setTotalWaveCounts] = useState(0);
  const [wavingStatus, setWavingStatus] = useState(false);
  const [allWaves, setAllWaves] = useState([]);

  // WavePortal Contract Address
  const contractAddress = '0x05617cB6f00E149320eE4ab424F78eAD9Cad0bA7';

  // Reference contents of the contract abi
  const { abi: contractABI } = abi

  const checkMetaMask = () => {
    const { ethereum } = window;

    if (ethereum) {
      // console.log("We have the ethereum object: ", ethereum);
      return true;
    } else {
      console.log("Please make sure, you have MetaMask!");
      return false
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (checkMetaMask()) {
        const { ethereum } = window;
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          const account = accounts[0];
          setCurrentAccount(account)
          console.log("Found an authorized account: ", account)
          return true;
        } else {
          console.log("No authorized account found!")
          return false;
        }
      }

    } catch (error) {
      console.error(error)
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (checkMetaMask()) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

        if (accounts.length > 0) {
          const account = accounts[0];
          setCurrentAccount(account)
          console.log("Account connected: ", account);
        } else {
          console.log("Failed connecting account")
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getAllWaves = async () => {
    if (wavePortalContract) {
      const waves = await wavePortalContract.getAllWaves();

      /*
      * We only need address, timestamp, and message in our UI so let's
      * pick those out
      */
      const wavesCleaned = [];
      waves.forEach(wave => {
        wavesCleaned.push({
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message
        });
      });

      // set the position for messages with latest entry
      wavesCleaned.reverse();

      setAllWaves(wavesCleaned);
      return true;
    } else {
      return 0;
    }
  }

  const getTotalWaveCount = async () => {
    if (wavePortalContract) {
      const totalWaveCount = await wavePortalContract.getTotalWaves();
      const totalWaveCountNumber = totalWaveCount.toNumber();
      setTotalWaveCounts(totalWaveCountNumber);
      return totalWaveCountNumber
    } else return 0;
  }

  const wave = async () => {
    try {
      if (checkMetaMask() && currentAccount && wavePortalContract) {
        const { value: message } = await Swal.fire({
          title: "Add your Message 🔥",
          text: "Write something interesting, use emojis too:",
          input: 'text',
          showCancelButton: true,
          confirmButtonText: 'Hit it 👋',
          cancelButtonText: 'Make me sad!'
        });

        if (!message) {
          Swal.fire({
            title: "Made me sad 😞",
            text: "Please enter your message to send waves!",
            icon: 'warning',
            showConfirmButton: false,
            showCloseButton: true
          })
          return;
        }

        let waveCount = await getTotalWaveCount();
        console.log("Reading total wave count at...", waveCount);
        Swal.fire({
          title: '🚀 Transaction in Progress',
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        })
        // Code to wave from Smart Contract
        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining....", waveTxn.hash);
        Swal.fire({
          title: '👋 Miners are mining your wave...',
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        })
        setWavingStatus("Miners are mining your wave...");

        const data = await waveTxn.wait();
        console.log(data)
        console.log("Mined....", waveTxn.hash);
        Swal.fire({
          title: '🤑 Mined & Waved',
          html: `Click hash to see your transaction: <a href="https://rinkeby.etherscan.io/tx/${waveTxn.hash}" target="_blank">${waveTxn.hash}</a>`,
          type: 'success',
          showConfirmButton: false,
          showCloseButton: true
        })
        setWavingStatus(false);

        waveCount = await getTotalWaveCount();
        console.log("Retrieving total wave count....", waveCount);
        getAllWaves();
      } else {
        console.log("Check MetaMask and Connect your wallet!");
        Swal.fire({
          title: "Wallet not Connected!",
          text: "Check MetaMask and Connect your wallet!",
          icon: 'warning',
          showConfirmButton: false,
          showCloseButton: true
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const runEffect = async () => {
    const isWalletConnected = await checkIfWalletIsConnected();
    if (isWalletConnected) {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      setWavePortalContract(contract);
    }
    return true;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { runEffect() }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { getTotalWaveCount(); getAllWaves(); }, [wavePortalContract])

  return (
    <div className="App">
      <main>
        <section className='app-info'>
          <div style={{ fontSize: '3rem', marginBottom: '2rem', fontWeight: 700 }}>
            👋 Hey there!
          </div>

          <div style={{ fontSize: '2rem', marginBottom: '2rem' }}>
            I am ashwamegh, The Flying Horse!
            Would you like to wave at me{totalWaveCounts > 0 ? <span>, along with <span>{totalWaveCounts}</span> wavers!</span> : '!'}
          </div>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {
              !currentAccount &&
              <button style={{ fontSize: '1.5rem' }} onClick={connectWallet}>
                Connect Wallet
              </button>
            }

            <button onClick={wave}>
              {wavingStatus ? 'waving...' : 'Wave'}
            </button>
          </div>

        </section>


        {allWaves.length > 0 && <section className='app-info messages'>
          {allWaves.map((wave, index) => {
            return (
              <div className='message-wrapper' key={index} style={{ marginTop: "2rem", padding: "0.5rem" }}>
                <div className='message-tags'><span className='message-tag'>Address:</span> <span className='message-tag-data'>{wave.address}</span></div>
                <div className='message-tags'><span className='message-tag'>Time:</span> <span className='message-tag-data'>{wave.timestamp.toString()}</span></div>
                <div className='message-tags'><span className='message-tag'>Message:</span> <span className='message-tag-data'>{wave.message}</span></div>
              </div>)
          })}
        </section>}
      </main>
    </div>
  );
}

export default App;
