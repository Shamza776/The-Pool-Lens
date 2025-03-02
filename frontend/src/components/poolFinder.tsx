import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from 'react-router-dom';
import networks from "./networkData";
import LiskNetwork from "./liskNetwork";
import "./PoolFinder.css"; // Import the new CSS file

// Uniswap V3 Factory ABI (minimal version with getPool function)
const FACTORY_ABI = [
  "function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)"
];

// ERC20 ABI for getting token symbols
const ERC20_ABI = [
  "function symbol() external view returns (string)"
];

// Uniswap V3 Factory address on Ethereum mainnet
const FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

function PoolFinder() {
  const navigate = useNavigate();
  const [poolAddress, setPoolAddress] = useState("");
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [fee, setFee] = useState("3000"); // Default to 0.3% fee
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenASymbol, setTokenASymbol] = useState("");
  const [tokenBSymbol, setTokenBSymbol] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<any>(null);

  // Get selected network from localStorage
  useEffect(() => {
    const networkId = localStorage.getItem('selectedNetwork');
    if (!networkId) {
      alert("Please select a network first");
      navigate("/networks");
      return;
    }

    const network = networks.find((net: { id: string; }) => net.id === networkId);
    if (network) {
      setSelectedNetwork(network);
    } else {
      alert("Invalid network selected");
      navigate("/networks");
    }
  }, [navigate]);

  const getPoolAddress = async function(tokenA: string, tokenB: string, fee: string) {
    if (!selectedNetwork) {
      setError("No network selected. Please go back and select a network.");
      return;
    }
    
    if (!ethers.isAddress(tokenA)) {
      setError("Invalid token A address format");
      return;
    }

    if (!ethers.isAddress(tokenB)) {
      setError("Invalid token B address format");
      return;
    }

    const feeValue = parseInt(fee);
    if (isNaN(feeValue)) {
      setError("Fee must be a number");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setPoolAddress("");
      setTokenASymbol("");
      setTokenBSymbol("");

      // Connect to network
      const provider = new ethers.JsonRpcProvider(selectedNetwork.rpc);

      // Create factory contract instance
      const factoryContract = new ethers.Contract(
        FACTORY_ADDRESS, // Use the constant FACTORY_ADDRESS
        FACTORY_ABI, 
        provider
      );

      // Sort token addresses (Uniswap requires tokenA < tokenB)
      const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase() 
        ? [tokenA, tokenB] 
        : [tokenB, tokenA];

      // Get pool address
      const pool = await factoryContract.getPool(token0, token1, feeValue);
      
      // Check if pool exists
      if (pool === "0x0000000000000000000000000000000000000000") {
        setError("Pool doesn't exist for these tokens and fee");
        return;
      }

      setPoolAddress(pool);
      
      // Get token symbols
      try {
        const token0Contract = new ethers.Contract(token0, ERC20_ABI, provider);
        const token1Contract = new ethers.Contract(token1, ERC20_ABI, provider);
        
        const [symbol0, symbol1] = await Promise.all([
          token0Contract.symbol(),
          token1Contract.symbol()
        ]);
        
        // Display symbols in the original order the user entered
        if (tokenA.toLowerCase() === token0.toLowerCase()) {
          setTokenASymbol(symbol0);
          setTokenBSymbol(symbol1);
        } else {
          setTokenASymbol(symbol1);
          setTokenBSymbol(symbol0);
        }
      } catch (err) {
        console.log("Error getting token symbols:", err);
        // Continue even if we can't get the symbols
      }

      // Save to history
      const poolInfo = {
        poolAddress: pool,
        tokenA,
        tokenB,
        fee: feeValue,
        tokenASymbol,
        tokenBSymbol,
        network: selectedNetwork.id,
        timestamp: Date.now()
      };

      // Get existing history and add new entry
      const existingHistoryJSON = localStorage.getItem('poolHistory');
      const existingHistory = existingHistoryJSON ? JSON.parse(existingHistoryJSON) : [];
      const updatedHistory = [poolInfo, ...existingHistory].slice(0, 10);
      localStorage.setItem('poolHistory', JSON.stringify(updatedHistory));

    } catch (err: any) {
      console.log(err);
      setError(err.message || "Failed to find pool address");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedNetwork) {
    return <div className="pool-finder-container">Loading network data...</div>;
  }

  if (selectedNetwork.id === "Lisk") {
    return <LiskNetwork />;
  }

  return (
    <div className="pool-finder-container">
      <h1 className="page-title">Pool Finder</h1>
      <p className="page-description">
        Find a Uniswap V3 pool address by providing the token addresses and fee tier.
      </p>
      
      <div className="network-display">
        <img 
          src={selectedNetwork.image} 
          alt={selectedNetwork.name} 
          className="network-image" 
        />
        <span className="network-name">{selectedNetwork.name}</span>
      </div>

      <div className="form-container">
        <div className="input-group">
          <label className="input-label">Token A Address</label>
          <input 
            type="text" 
            className="token-input"
            placeholder="Enter token A address (e.g., 0x...)" 
            value={tokenA} 
            onChange={(e) => setTokenA(e.target.value)} 
          />
        </div>

        <div className="input-group">
          <label className="input-label">Token B Address</label>
          <input 
            type="text" 
            className="token-input"
            placeholder="Enter token B address (e.g., 0x...)" 
            value={tokenB} 
            onChange={(e) => setTokenB(e.target.value)} 
          />
        </div>

        <div className="input-group">
          <label className="input-label">Fee Tier</label>
          <select 
            className="fee-select"
            value={fee} 
            onChange={(e) => setFee(e.target.value)}
          >
            <option value="100">0.01%</option>
            <option value="500">0.05%</option>
            <option value="3000">0.3%</option>
            <option value="10000">1%</option>
          </select>
        </div>

        <button 
          className="find-button"
          onClick={() => getPoolAddress(tokenA, tokenB, fee)} 
          disabled={loading || !tokenA || !tokenB}
        >
          {loading ? "Searching..." : "Get Pool Address"}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {poolAddress && (
        <div className="result-container">
          <h2 className="result-title">Pool Found</h2>
          
          <div className="result-detail">
            <span className="result-label">Pool Address</span>
            <code className="result-value">{poolAddress}</code>
          </div>
          
          {(tokenASymbol && tokenBSymbol) && (
            <div className="result-detail">
              <span className="result-label">Pool Pair</span>
              <div className="pool-pair result-value">
                <span className="token-symbol">{tokenASymbol}</span>
                <span className="divider">/</span>
                <span className="token-symbol">{tokenBSymbol}</span>
              </div>
            </div>
          )}
          
          <div className="result-detail">
            <span className="result-label">Fee Tier</span>
            <span className="result-value">{Number(fee) / 10000}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PoolFinder;