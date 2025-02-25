import ConnectWallet from "./connectWallet";
import { contractABI } from "../utils/contractABI";
import { contractAddress } from "../utils/contractAddress";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { useState } from "react";
import '/src/App.css'


function Liquidity(){

  const [poolAddress, setPoolAddress] = useState("");
  const [poolInfo, setPoolInfo] = useState<{
    poolAddress?: string;
    liquidity?: bigint;
    tokenA?: string;
    tokenB?: string;
    fee?: number;
    tokenASymbol?: string;
    tokenBSymbol?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  
  //getLiquidity function
  const getLiquidity = async function getLiquidity(poolAddress: string) {
    console.log("using address: ", poolAddress);
    try {
      setLoading(true);
      setShowInfo(false);
      setError(null);
      const ethereumProvider: any = await detectEthereumProvider();
      if (!ethereumProvider) {
        throw new Error("Please install MetaMask to use this feature.");
      }

      // function validateAddress(address: string): string {
      //   try {
      //     return ethers.getAddress(address); // This automatically checks and returns a checksummed address
      //   } catch (error) {
      //     throw new Error("Invalid address format");
      //   }
      // }
      
      //const provider = new ethers.BrowserProvider(ethereumProvider);
      //const signer = await provider.getSigner();
      const signer = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/t0q4rmOWqfNSwebEsVtHyqYzVK3mFZSU")
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const validatedAddress = ethers.getAddress(poolAddress);
      const liquidity = await contract.getLiquidity(validatedAddress);
      console.log("Liquidity:", liquidity);

      const info = {
        poolAddress: liquidity.poolAddress,
        liquidity: liquidity.liquidity,
        tokenA: liquidity.tokenA,
        tokenB: liquidity.tokenB,
        fee: liquidity.fee,
        tokenASymbol: liquidity.tokenASymbol,
        tokenBSymbol: liquidity.tokenBSymbol,
      };
      setPoolInfo(info);
      setShowInfo(true);

      // Save to local storage
      const history = JSON.parse(localStorage.getItem("history") || "[]");
      history.push(info);
      localStorage.setItem("history", JSON.stringify(history));
    } catch (err: any) {
      console.error("Error getting liquidity:", err);
      setError(err.message || "An error occurred while fetching liquidity information.");
    } finally {
      setLoading(false);
    }
  }
return (
  <>
    <div>
      <ConnectWallet />
    </div>
    <h1>Welcome to PoolEnd</h1>
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
    <p className="read-the-docs">
      Enter pool address
    </p>
    <input
      type="text"
      placeholder="Enter pool address"
      value={poolAddress}
      onChange={(e) => setPoolAddress(e.target.value)}
    /> <br />
    <button onClick={() => getLiquidity(poolAddress)} disabled={loading || !poolAddress} >
      {loading ? "Loading..." : "Get Liquidity"}
      </button>
      {error && <p className="error">{error}</p>}
      {showInfo && poolInfo && (
        <div>
          <h2>Liquidity Information</h2>
          <p>Pool Address: {poolInfo.poolAddress}</p>
          <p>Liquidity</p>
          <p>Token A: {poolInfo.tokenA}</p>
          <p>Token B: {poolInfo.tokenB}</p>
          <p>Fee: {poolInfo.fee !== undefined ? poolInfo.fee / 10000 : 'N/A'} </p>
          <p>Token A Symbol: {poolInfo.tokenASymbol}</p>
          <p>Token B Symbol: {poolInfo.tokenBSymbol}</p>
          </div>
          )}
  </>
)
  }export default Liquidity;