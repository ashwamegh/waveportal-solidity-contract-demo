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

  // WavePortal Contract Address
  const contractAddress = '0x63c5e05E889548917d360c9C08c63987B740B72D';

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
        const waveTxn = await wavePortalContract.wave();
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

        await waveTxn.wait();
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
  useEffect(() => { getTotalWaveCount() }, [wavePortalContract])

  return (
    <div className="App">
      {/** wavingStatus && <WaveLoader wavingStatus={wavingStatus}></WaveLoader> **/}
      <main>
        <section id='app-info'>
          <div style={{ fontSize: '3rem', marginBottom: '2rem' }}>
            👋 Hey there!
          </div>

          <div style={{ fontSize: '2rem', marginBottom: '2rem' }}>
            I am ashwamegh, The Flying Horse!
            Would you like to wave at me{totalWaveCounts > 0 ? <span>, along with <span>{totalWaveCounts}</span> wavers!</span> : '!'}
          </div>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {
              !currentAccount &&
              <button onClick={connectWallet}>
                Connect Wallet
              </button>
            }

            <button onClick={wave}>
              {wavingStatus ? 'waving...' : 'Wave at Me'}
            </button>
          </div>

        </section>
      </main>
    </div>
  );
}

function WaveLoader({ wavingStatus }) {
  return (
    <div
      style={{ fontSize: '3rem', position: 'absolute', zIndex: 10, height: '100vh', width: '100%', backgroundColor: 'rgb(240 255 255 / 90%)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <span className="wave">👋</span>
      <span style={{ padding: '3rem' }}>{wavingStatus}</span>
    </div >
  )
}

export default App;
