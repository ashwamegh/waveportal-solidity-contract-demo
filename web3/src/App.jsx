import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [currentAccount, setCurrentAccount] = useState(null)

  const checkMetaMask = () => {
    const { ethereum } = window;

    if (ethereum) {
      console.log("We have the ethereum object: ", ethereum);
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
        } else {
          console.log("No authorized account found!")
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

  const wave = () => {
    alert("Waved at me");
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="App">
      <video style={{ width: 'auto', height: '100vh' }} autoPlay loop muted id="bg-video">
        <source src="/man-door-animation.mp4" type="video/mp4" />
      </video>
      <main>
        <aside>
          <section>
            <div style={{ fontSize: '3rem', marginBottom: '2rem' }}>
              👋 Hey there!
            </div>

            <div style={{ fontSize: '2rem', width: '20rem', marginBottom: '2rem' }}>
              I am ashwamegh, The Flying Horse!
              Would you like to wave at me!
            </div>

            {
              !currentAccount &&
              <button style={{ marginRight: '1rem', padding: '1rem', color: '#fff', background: '#000', outline: 'none', fontSize: '1.5rem' }} onClick={connectWallet}>
                Connect Wallet
              </button>
            }

            <button style={{ padding: '1rem', color: '#fff', background: '#000', outline: 'none', fontSize: '1.5rem' }} onClick={wave}>
              Wave at Me
            </button>

          </section>
        </aside>
      </main>
    </div>
  );
}

export default App;
