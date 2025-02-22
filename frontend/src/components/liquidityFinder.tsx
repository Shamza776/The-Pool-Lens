import ConnectWallet from "./connectWallet";
import { contractABI } from "../utils/contractABI";
import { contractAddress } from "../utils/contractAddress";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { useState } from "react";


function Liquidity(){

  const [poolAddress, setPoolAddress] = useState("");
  const [poolInfo, setPoolInfo] = useState<{
    poolAddress?: string;
    liquidity?: string;
    tokenA?: string;
    tokenB?: string;
    fee?: string;
    tokenASymbol?: string;
    tokenBSymbol?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  //getLiquidity function
  const getLiquidity = async function getLiquidity(poolAddress: string) {
    try {
      setLoading(true);
      setError(null);
      const ethereumProvider: any = await detectEthereumProvider();
      const provider = new ethers.BrowserProvider(ethereumProvider);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const liquidity = await contract.getLiquidity(poolAddress);

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
      Welcome to PoolEnd, your gateway to decentralized finance (DeFi) on the
      Ethereum network. Our platform empowers users to access
      pool addresses and retrieve detailed liquidity information
      from any provided pool address. Whether you're a seasoned
      DeFi enthusiast or just getting started, PoolEnd offers a seamless and intuitive experience.
    </p>
    <p>
      Pool Address Lookup: Easily find and verify pool addresses on the Ethereum 
      network.

      Liquidity Information: Access detailed liquidity data, including total liquidity,
      pool composition, and historical trends.
    </p>
    <p className="read-the-docs">
      Enter pool address
    </p>
    <input
      type="text"
      placeholder="Enter pool address"
      value={poolAddress}
      onChange={(e) => setPoolAddress(e.target.value)}
    />
    <button onClick={() => getLiquidity(poolAddress)} disabled={loading || !poolAddress} >
      {loading ? "Loading..." : "Get Liquidity"}
      </button>
      {error && <p className="error">{error}</p>}
      {poolInfo && (
        <div>
          <h2>Liquidity Information</h2>
          <p>Pool Address: {poolInfo.poolAddress}</p>
          <p>Liquidity</p>
          <p>Token A: {poolInfo.tokenA}</p>
          <p>Token B: {poolInfo.tokenB}</p>
          <p>Fee: {poolInfo.fee}</p>
          <p>Token A Symbol: {poolInfo.tokenASymbol}</p>
          <p>Token B Symbol: {poolInfo.tokenBSymbol}</p>
          </div>
          )}
  </>
)
  }export default Liquidity;