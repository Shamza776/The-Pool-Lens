import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ConnectWallet from "./connectWallet";
import networks from "./networkData";
import {  useNavigate } from "react-router-dom";
import ConnectLisk from "./lisk-Network";

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

function MainnetPoolLens() {
  const [poolAddress, setPoolAddress] = useState("");
  const [poolInfo, setPoolInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<any>(null)

  const navigate = useNavigate()
  useEffect( () => {
    const networkId = localStorage.getItem("selectedNetwork");
    // if(!selectedNetwork){
    //   alert("Please select Network first")
    //   return;
    // }

    const network = networks.find((net: { id: string | null; })  => net.id === networkId);
    if(network) {
      setSelectedNetwork(network);
    } else {
      alert("Invalid network selected");
      navigate("/networks");
    }
  }, [])
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

      // Connect to mainnet
      // const provider = new ethers.JsonRpcProvider(
      //   "https://eth-mainnet.g.alchemy.com/v2/t0q4rmOWqfNSwebEsVtHyqYzVK3mFZSU" 
      // );
      const provider = new ethers.JsonRpcProvider(selectedNetwork.rpc)

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
    if (!selectedNetwork) {
      return <div>Loading...</div>;
    }
    if (selectedNetwork.id === "Lisk") {
      return <ConnectLisk />;
    }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-orange-600">The Pool Lens</h1>
      <div>
        <ConnectWallet />
      </div>
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Welcome to Pool Lens</h1>
      <p className="mb-4 text-gray-300">
        Welcome to Pool Lens! Our platform empowers users to access
        pool addresses and retrieve detailed liquidity information
        from any provided pool address. Whether you're a seasoned
        DeFi enthusiast or just getting started, PoolLens offers a seamless and intuitive experience.
      </p>
      <ol className="mb-6 space-y-2">
        <li>
          <strong className="text-gray-200">Pool Address Lookup:</strong> Enter a pool address to verify its existence.
        </li>
        <li>
          <strong className="text-gray-200">Liquidity Information:</strong> Retrieve detailed liquidity information, including total liquidity, pool composition, and historical trends.
        </li>
      </ol>
      <div className="flex items-center">
          <img src={selectedNetwork.image} alt={selectedNetwork.name} className="w-6 h-6 mr-2" />
          <p className="text-gray-200">
            <span className="font-bold">{selectedNetwork.name}</span> Network Selected
          </p>
      </div>
      
      <div className="mb-4">
      <p className="mb-4 text-gray-300">
        Enter a Uniswap V3 pool address to retrieve detailed liquidity information.
      </p>
        <input
          type="text"
          className="w-full p-2 border rounded bg-gray-800 text-white border-gray-700"
          placeholder="Enter Uniswap V3 pool address"
          value={poolAddress}
          onChange={(e) => setPoolAddress(e.target.value)}
        />
      </div>

      <button
        className="bg-orange-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-orange-700"
        onClick={() => getLiquidity(poolAddress)}
        disabled={loading || !poolAddress}
      >
        {loading ? "Loading..." : "Get Liquidity"}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-900 border border-red-700 text-red-200 rounded">
          {error}
        </div>
      )}

      {poolInfo && (
        <div className="mt-4 p-4 border rounded border-gray-700 bg-gray-800">
          <h2 className="text-xl font-bold mb-2 text-orange-500">Pool Information</h2>
          <div className="grid gap-2">
            <p><strong>Pool Address:</strong> {poolInfo.poolAddress}</p>
            <p><strong>Liquidity:</strong> {poolInfo.liquidity}</p>
            <p><strong>Token A:</strong> {poolInfo.tokenA} ({poolInfo.tokenASymbol})</p>
            <p><strong>Token B:</strong> {poolInfo.tokenB} ({poolInfo.tokenBSymbol})</p>
            <p><strong>Fee Tier:</strong> {poolInfo.fee / 10000}%</p>
          </div>
        </div>
      )}
      {/* { if network selected is lisk */}
        {/* {selectedNetwork.id === "Lisk" ? (
          <ConnectLisk/>
        )
      } */}
    </div>
  );
}

export default MainnetPoolLens;