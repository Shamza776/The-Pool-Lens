import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
//import  ConnectWallet  from './components/connectWallet';
import PoolFinder from './components/poolFinder';
import Liquidity from './components/liquidityFinder';
import History from './components/history';


function App() {
  return (
    <>
    <Router>
        <div>
          <nav>
            <Link to="/liquidityFinder">Liquidity</Link>
            <Link to="/pool">Pool</Link>
            <Link to="/history">History</Link>
          </nav>
          <Routes>
            <Route path="/liquidityFinder" element={<Liquidity />} />
            <Route path="/pool" element={<PoolFinder />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </Router>
    
    </>
  )
}

export default App;
