import { useState } from "react";
import { ethers } from "ethers";
import "/src/App.css";

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
  const [poolAddress, setPoolAddress] = useState("");
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [fee, setFee] = useState("3000"); // Default to 0.3% fee
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenASymbol, setTokenASymbol] = useState("");
  const [tokenBSymbol, setTokenBSymbol] = useState("");

  const getPoolAddress = async function(tokenA: string, tokenB: string, fee: string) {
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

      // Connect to mainnet
      const provider = new ethers.JsonRpcProvider(
        "https://eth-mainnet.g.alchemy.com/v2/t0q4rmOWqfNSwebEsVtHyqYzVK3mFZSU"
      );

      // Create factory contract instance
      const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Pool Finder</h1>
      <p className="mb-2 text-gray-300">
        Find a Uniswap V3 pool address by providing the token addresses and fee tier.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <p className="mb-1 text-gray-200">Token A Address</p>
          <input 
            type="text" 
            className="w-full p-2 border rounded bg-gray-800 text-white border-gray-700"
            placeholder="Enter token A address (e.g., 0x...)" 
            value={tokenA} 
            onChange={(e) => setTokenA(e.target.value)} 
          />
        </div>

        <div>
          <p className="mb-1 text-gray-200">Token B Address</p>
          <input 
            type="text" 
            className="w-full p-2 border rounded bg-gray-800 text-white border-gray-700"
            placeholder="Enter token B address (e.g., 0x...)" 
            value={tokenB} 
            onChange={(e) => setTokenB(e.target.value)} 
          />
        </div>

        <div>
          <p className="mb-1 text-gray-200">Fee Tier</p>
          <select 
            className="w-full p-2 border rounded bg-gray-800 text-white border-gray-700"
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
          className="bg-orange-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-orange-700"
          onClick={() => getPoolAddress(tokenA, tokenB, fee)} 
          disabled={loading || !tokenA || !tokenB}
        >
          {loading ? "Loading..." : "Get Pool Address"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-900 border border-red-700 text-red-200 rounded">
          {error}
        </div>
      )}

      {poolAddress && (
        <div className="mt-4 p-4 border rounded border-gray-700 bg-gray-800">
          <h2 className="text-xl font-bold mb-2 text-orange-500">Pool Found!</h2>
          <div className="grid gap-2">
            <p><strong>Pool Address:</strong> {poolAddress}</p>
            {(tokenASymbol && tokenBSymbol) && (
              <p><strong>Pool Pair:</strong> {tokenASymbol} / {tokenBSymbol}</p>
            )}
            <p><strong>Fee Tier:</strong> {Number(fee) / 10000}%</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PoolFinder;