import ConnectWallet from "./connectWallet";
import { contractABI } from "../utils/contractABI";
import { contractAddress } from "../utils/contractAddress";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { useState } from "react";

function ConnectLisk() {
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

    const connectLisk = async (poolAddress: string) => {
        try {
            setLoading(true);
            setError(null);
            setShowInfo(false);
            
            const ethereumProvider: any = await detectEthereumProvider();
            if (!ethereumProvider) {
                throw new Error("Please install MetaMask to use this feature.");
            }
            
            const provider = new ethers.BrowserProvider(ethereumProvider);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const validatedAddress = ethers.getAddress(poolAddress);
            const liquidity = await contract.connectLisk(validatedAddress);
            
            console.log("liquidity: ", liquidity);

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
            console.error(err);
            setError(err.message || "An error occurred while connecting to Lisk");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div>
                <ConnectWallet />
            </div>
            <div>Connecting to Lisk Sepolia</div>
            <p className="read-the-docs">
                Enter pool address
            </p>
            <input
                type="text"
                placeholder="Enter pool address"
                value={poolAddress}
                onChange={(e) => setPoolAddress(e.target.value)}
            /> <br />
            <button onClick={() => connectLisk(poolAddress)} disabled={loading || !poolAddress}>
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
    );
}

export default ConnectLisk;