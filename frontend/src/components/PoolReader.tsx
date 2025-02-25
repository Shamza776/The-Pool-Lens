import { useState } from "react";
import { ethers } from "ethers";
import ConnectWallet from "./connectWallet";

// Uniswap V3 Pool ABI (minimal version )
const POOL_ABI = [
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
  "function fee() external view returns (uint24)",
  "function liquidity() external view returns (uint128)"
];

const ERC20_ABI = [
  "function symbol() external view returns (string)"
];

function MainnetPoolLens() {
  const [poolAddress, setPoolAddress] = useState("");
  const [poolInfo, setPoolInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLiquidity = async (poolAddress: string) => {
    if (!ethers.isAddress(poolAddress)) { 
      setError("Invalid address format");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Connect to mainnet
      const provider = new ethers.JsonRpcProvider(
        "https://eth-mainnet.g.alchemy.com/v2/t0q4rmOWqfNSwebEsVtHyqYzVK3mFZSU" 
      );

      // Create contract instances
      const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);

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

      const info = {
        poolAddress,
        liquidity: liquidity,
        tokenA: token0,
        tokenB: token1,
        fee: Number(fee),
        tokenASymbol: symbol0,
        tokenBSymbol: symbol1
      };

      setPoolInfo(info);

    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Failed to fetch pool information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mainnet Pool Lens</h1>
      <div>
      <ConnectWallet />
    </div>
    <h1>Welcome to Pool Lens</h1>
    <p>
      Welcome to PoolLens, your gateway to decentralized finance (DeFi) on the
      Ethereum network. Our platform empowers users to access
      pool addresses and retrieve detailed liquidity information
      from any provided pool address. Whether you're a seasoned
      DeFi enthusiast or just getting started, PoolLens offers a seamless and intuitive experience.
    </p>
    <p>
    <ol>
      <li>
        <strong>Pool Address Lookup:</strong> Enter a pool address to verify its existence on the Ethereum network.
      </li>
      <li>
        <strong>Liquidity Information:</strong> Retrieve detailed liquidity information, including total liquidity, pool composition, and historical trends.
      </li>
    </ol>
      </p>
      
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Enter Uniswap V3 pool address"
          value={poolAddress}
          onChange={(e) => setPoolAddress(e.target.value)}
        />
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={() => getLiquidity(poolAddress)}
        disabled={loading || !poolAddress}
      >
        {loading ? "Loading..." : "Get Liquidity"}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {poolInfo && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-bold mb-2">Pool Information</h2>
          <div className="grid gap-2">
            <p><strong>Pool Address:</strong> {poolInfo.poolAddress}</p>
            <p><strong>Liquidity:</strong> {poolInfo.liquidity.toString()}</p>
            <p><strong>Token A:</strong> {poolInfo.tokenA} ({poolInfo.tokenASymbol})</p>
            <p><strong>Token B:</strong> {poolInfo.tokenB} ({poolInfo.tokenBSymbol})</p>
            <p><strong>Fee Tier:</strong> {poolInfo.fee / 10000}%</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainnetPoolLens;