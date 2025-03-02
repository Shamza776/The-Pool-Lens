import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ConnectWallet from "./connectWallet";
import networks from "./networkData";
import { useNavigate } from "react-router-dom";
// import ConnectLisk from "./lisk-Network";
import BookMark from "./bookMark";
import './PoolReader.css';

// Uniswap V3 Pool ABI (minimal version)
const POOL_ABI = [
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
  "function fee() external view returns (uint24)",
  "function liquidity() external view returns (uint128)"
];

const ERC20_ABI = [
  "function symbol() external view returns (string)"
];

type PoolInfo = {
  poolAddress: string;
  liquidity: string;
  tokenA: string;
  tokenB: string;
  fee: number;
  tokenASymbol: string;
  tokenBSymbol: string;
  timestamp: number; // Add timestamp for sorting by most recent
};

function PoolReader() {
  const [poolAddress, setPoolAddress] = useState("");
  const [poolInfo, setPoolInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<any>(null)

  const navigate = useNavigate()
  
  useEffect(() => {
    const networkId = localStorage.getItem("selectedNetwork");
    const network = networks.find((net: { id: string | null; }) => net.id === networkId);
    if(network) {
      setSelectedNetwork(network);
    } 
  }, []);
  const redirectToNetworkSelection = () => {
    navigate("/network");
  };

  const getLiquidity = async (address: string) => {
    if (!selectedNetwork) {
      setError("No network selected. Please go back and select a network.");
      return;
    }
    if (!ethers.isAddress(address)) { 
      setError("Invalid address format");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const provider = new ethers.JsonRpcProvider(selectedNetwork.rpc);

      // Create contract instances
      const poolContract = new ethers.Contract(address, POOL_ABI, provider);

      // Get pool data
      const [token0, token1, fee, liquidity] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.liquidity()
      ]);

      // Get token symbols
      const token0Contract = new ethers.Contract(token0, ERC20_ABI, provider);
      const token1Contract = new ethers.Contract(token1, ERC20_ABI, provider);
      
      const [symbol0, symbol1] = await Promise.all([
        token0Contract.symbol(),
        token1Contract.symbol()
      ]);

      const info: PoolInfo = {
        poolAddress,
        liquidity: liquidity.toString(),
        tokenA: token0,
        tokenB: token1,
        fee: Number(fee),
        tokenASymbol: symbol0,
        tokenBSymbol: symbol1,
        timestamp: Date.now() // Add current timestamp
      };

      setPoolInfo(info);
      
      // Get existing history from localStorage
      const existingHistoryJSON = localStorage.getItem('poolHistory');
      const existingHistory: PoolInfo[] = existingHistoryJSON ? JSON.parse(existingHistoryJSON) : [];
      
      // Add new entry to history and keep only the 10 most recent
      const updatedHistory = [info, ...existingHistory].slice(0, 10);
      
      // Save updated history to localStorage
      localStorage.setItem('poolHistory', JSON.stringify(updatedHistory));

    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Failed to fetch pool information");
    } finally {
      setLoading(false);
    }
  };

  // if (!selectedNetwork) {
  //   return <div className="loading-message">Loading...</div>;
  // }
  

  return (
    <div className="pool-finder-container">
      <h1 className="page-title">The Pool Lens</h1>
      <div className="wallet-container">
        <ConnectWallet />
      </div>
      
      <h1 className="welcome-title">Welcome to Pool Lens</h1>
      <p className="page-description">
        Welcome to Pool Lens! Our platform empowers users to access
        pool addresses and retrieve detailed liquidity information
        from any provided pool address. Whether you're a seasoned
        DeFi enthusiast or just getting started, PoolLens offers a seamless and intuitive experience.
      </p>
      <ol className="feature-list">
      <li>
          <strong className="feature-highlight">Network Selection:</strong> Navigate to Networks, select a network first!
        </li>
        <li>
          <strong className="feature-highlight">Pool Address Lookup:</strong> Enter a pool address from the selected network to verify its existence.
        </li>
        <li>
          <strong className="feature-highlight">Liquidity Information:</strong> Retrieve detailed liquidity information, including total liquidity, pool composition, and historical trends.
        </li>
        <li>
          <strong className="feature-highlight">Wallet Connection:</strong> Make sure to connect your Metamask wallet and switch to Lisk-Sepolia network to add a bookmark. 
        </li>
      </ol>
      {selectedNetwork ? (
        <div className="network-display">
          <img src={selectedNetwork.image} alt={selectedNetwork.name} className="network-image" />
          <p className="network-name">
            {selectedNetwork.name}
          </p>
          <button 
            className="change-network-button"
            onClick={redirectToNetworkSelection}
          >
            Change Network
          </button>
        </div>
      ) : (
        <div className="no-network-display">
          <p className="no-network-text">No network selected. Please select a network to use all features.</p>
          <button 
            className="select-network-button"
            onClick={redirectToNetworkSelection}
          >
            Select Network
          </button>
        </div>
      )}
      
      {/* <div className="network-display">
        <img src={selectedNetwork.image} alt={selectedNetwork.name} className="network-image" />
        <p className="network-name">
          {selectedNetwork.name}
        </p>
      </div> */}
      
      <div className="input-group">
        <p className="input-description">
          Enter a Uniswap V3 pool address to retrieve detailed liquidity information.
        </p>
        <input
          type="text"
          className="token-input"
          placeholder="Enter Uniswap V3 pool address"
          value={poolAddress}
          onChange={(e) => setPoolAddress(e.target.value)}
        />
      </div>

      <button
        className="find-button"
        onClick={() => getLiquidity(poolAddress)}
        disabled={loading || !poolAddress}
      >
        {loading ? "Loading..." : "Get Liquidity"}
      </button>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {poolInfo && (
        <div className="result-container">
          <h2 className="result-title">Pool Information</h2>
          <div className="result-details">
            <div className="result-detail">
              <span className="result-label">Pool Address:</span>
              <span className="result-value">{poolInfo.poolAddress}</span>
            </div>
            <div className="result-detail">
              <span className="result-label">Liquidity:</span>
              <span className="result-value">{poolInfo.liquidity}</span>
            </div>
            <div className="result-detail">
              <span className="result-label">Token A:</span>
              <span className="result-value">{poolInfo.tokenA} ({poolInfo.tokenASymbol})</span>
            </div>
            <div className="result-detail">
              <span className="result-label">Token B:</span>
              <span className="result-value">{poolInfo.tokenB} ({poolInfo.tokenBSymbol})</span>
            </div>
            <div className="result-detail">
              <span className="result-label">Fee Tier:</span>
              <span className="result-value">{poolInfo.fee / 10000}%</span>
            </div>
          </div>
          <BookMark poolAddress={poolInfo.poolAddress} />
        </div>
      )}
    </div>
  );
}

export default PoolReader;