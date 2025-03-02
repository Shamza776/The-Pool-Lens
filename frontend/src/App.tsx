import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
//import  ConnectWallet  from './components/connectWallet';
import PoolFinder from './components/poolFinder';
//import Liquidity from './components/liquidityFinder';
import History from './components/history';
import MainnetPoolLens from './components/PoolReader';
import DisplayNetworks from './components/network';
import BookMarkedList from './components/viewBookMark';


function App() {
  return (
    <>
    <Router>
        <div>
          <nav>
            <Link to="/PoolReader">Liquidity</Link>
            <Link to="/pool">Pool</Link>
            <Link to= "/BookMarkedList">Bookmarked</Link>
             <Link to="/history">History</Link> 
            <Link to="/network">Network</Link>
          </nav>
          <Routes>
            <Route path="/PoolReader" element={<MainnetPoolLens/>} />
            <Route path="/pool" element={<PoolFinder />} />
            <Route path="/BookMarkedList" element={<BookMarkedList />} />
           <Route path="/history" element={<History />} /> 
            <Route path="/network" element={<DisplayNetworks/>} />
          </Routes>
        </div>
      </Router>
    
    </>
  )
}

export default App;
