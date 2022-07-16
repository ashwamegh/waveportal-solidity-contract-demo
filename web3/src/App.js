import './App.css';

function App() {
  const wave = () => {
    alert("Waved at me");
  }

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

            <button style={{ padding: '1rem', color: '#fff', background: '#000', outline: 'none', fontSize: '1.5rem' }} className="waveButton" onClick={wave}>
              Wave at Me
            </button>
          </section>
        </aside>
      </main>
    </div>
  );
}

export default App;
