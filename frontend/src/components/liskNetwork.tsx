import { useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { contractAddress } from "../utils/contractAddress";
import detectEthereumProvider from "@metamask/detect-provider";
import "/src/App.css";


function LiskNetwork() {
    const [poolAddress, setPoolAddress] = useState("");
    const [tokenA, setTokenA] = useState("");
    const [tokenB, setTokenB] = useState("");
    const [fee, setFee] = useState("3000"); // Default to 0.3% fee
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tokenASymbol, setTokenASymbol] = useState("");
    const [tokenBSymbol, setTokenBSymbol] = useState("");
  
    const findLiskPool = async (tokenA: string, tokenB: string, fee: string) => {
      try {
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
  
        setLoading(true);
        setError(null);
        setPoolAddress("");
        setTokenASymbol("");
        setTokenBSymbol("");
  
        // Connect to Lisk network via MetaMask
        const ethereumProvider: any = await detectEthereumProvider();
        if (!ethereumProvider) {
          throw new Error("Please install MetaMask to use this feature.");
        }
        
        const provider = new ethers.BrowserProvider(ethereumProvider);
        const signer = await provider.getSigner();
        
        // Use the contract to find the pool
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        
        // Sort token addresses (Uniswap requires tokenA < tokenB)
        const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase() 
          ? [tokenA, tokenB] 
          : [tokenB, tokenA];
        
        // Call the contract method to find the pool
        const result = await contract.findPool(token0, token1, feeValue);
        
        // Check if pool exists
        if (result.poolAddress === "0x0000000000000000000000000000000000000000") {
          setError("Pool doesn't exist for these tokens and fee on Lisk");
          return;
        }
        
        setPoolAddress(result.poolAddress);
        
        // Set token symbols from the contract response
        if (tokenA.toLowerCase() === token0.toLowerCase()) {
          setTokenASymbol(result.token0Symbol);
          setTokenBSymbol(result.token1Symbol);
        } else {
          setTokenASymbol(result.token1Symbol);
          setTokenBSymbol(result.token0Symbol);
        }
        
        // Save to history
        const poolInfo = {
          poolAddress: result.poolAddress,
          tokenA,
          tokenB,
          fee: feeValue,
          tokenASymbol: result.token0Symbol,
          tokenBSymbol: result.token1Symbol,
          network: "Lisk",
          timestamp: Date.now()
        };
  
        // Get existing history and add new entry
        const existingHistoryJSON = localStorage.getItem('poolHistory');
        const existingHistory = existingHistoryJSON ? JSON.parse(existingHistoryJSON) : [];
        const updatedHistory = [poolInfo, ...existingHistory].slice(0, 10);
        localStorage.setItem('poolHistory', JSON.stringify(updatedHistory));
        
      } catch (err: any) {
        console.error("Error:", err);
        setError(err.message || "Failed to find pool address on Lisk network");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-orange-600">Lisk Network Pool Finder</h1>
        <p className="mb-2 text-gray-300">
          Find a Uniswap V3 pool address on Lisk Sepolia by providing the token addresses and fee tier.
        </p>
        <div className="flex items-center mb-4">
          <img src="../assets/lisk.png" alt="Lisk" className="w-6 h-6 mr-2" />
          <p className="text-gray-200">
            <span className="font-bold">Lisk Sepolia</span> Network Selected
          </p>
        </div>
  
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
            onClick={() => findLiskPool(tokenA, tokenB, fee)} 
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
export default LiskNetwork;