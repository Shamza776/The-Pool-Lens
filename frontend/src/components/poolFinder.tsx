import { contractABI } from "../utils/contractABI";
import { contractAddress } from "../utils/contractAddress";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { useState } from "react";
import "/src/App.css";

function PoolFinder(){

    const [poolAddress, setPoolAddress] = useState("");
    const [tokenA, setTokenA] = useState("");
    const [tokenB, setTokenB] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const getPoolAddress = async function getPoolAddress(tokenA: string, tokenB: string, amount: string) {
        try {
            setLoading(true);
            const ethereumProvider: any = await detectEthereumProvider();
            const provider = new ethers.BrowserProvider(ethereumProvider);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const poolAddress = await contract.getPoolAddress(tokenA, tokenB, amount);
            setPoolAddress(poolAddress);
        } catch (err: any) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return(
        <div>
            <h1>Pool Finder</h1>
            <p>Enter token A</p>
            <input type="text" placeholder="Enter token A address" value={tokenA} onChange={(e) => setTokenA(e.target.value)} />
            <p>Enter token B</p>
            <input type="text" placeholder="Enter token B address"  value={tokenB} onChange={(e) => setTokenB(e.target.value)} />
            <p>Enter amount</p>
            <input type="text" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={() => getPoolAddress(tokenA, tokenB, amount)} disabled={loading}>
                {loading ? "Loading..." : "Get Pool Address"}
            </button>
            {poolAddress && 
                <p>Pool Address: {poolAddress}</p>}
        </div>
    )
}export default PoolFinder;