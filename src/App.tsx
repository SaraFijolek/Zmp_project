import { useState } from 'react'
import './App.css'

function App() {
  const [visits,setVisits ] = useState(0)

  return (
    <>
      <h1>Witaj w mojej mojej aplikacji </h1>
        <p>Bardzo miło cię spotkać </p>
        <p>dobrze że wpadłeś </p>
        <div className="card">
            <button onClick={() => setVisits(visits + 1)}>
                Liczba odwiedzających: {visits}
            </button>
        </div>
    </>
  );
}



export default App
