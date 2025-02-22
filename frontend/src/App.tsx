//import { useState } from 'react'

import './App.css'

function App() {


  return (
    <>
      <h1>Pool Lens</h1>
      <div className="card">
        <p>
          enter token A
        <input type="text" placeholder="Enter token A" />
        </p>
        <p>
          enter token B
        <input type="text" placeholder="Enter token B" />
        </p>
        <p>
          enter amount
          <input type="text" placeholder="Enter amount" />
      </p>
          <button>get pool address</button>
      </div>
      <p className="read-the-docs">
        Enter pool address
      </p>
      <input type="text" placeholder="Enter pool address" />
      <button>get liquidity</button>
    </>
  )
}

export default App
