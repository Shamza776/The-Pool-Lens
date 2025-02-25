import { useEffect, useState } from "react";

type PoolInfo = {
    poolAddress: string;
    liquidity: string;
    tokenA: string;
    tokenB: string;
    fee: number;
    tokenASymbol: string;
    tokenBSymbol: string;
};

function History(){
    const [history, setHistory] = useState<PoolInfo | null>(null)
    useEffect(() => {
        const savedInfo = localStorage.getItem('history');
        if(savedInfo){
            setHistory(JSON.parse(savedInfo));
        }
    })

    return (
        <div>
          <h1>History</h1>
          {history ? (
            <div className="mt-4 p-4 border rounded">
              <h2 className="text-xl font-bold mb-2">Pool Information</h2>
              <div className="grid gap-2">
                <p><strong>Pool Address:</strong> {history.poolAddress}</p>
                <p><strong>Liquidity:</strong> {history.liquidity.toString()}</p>
                <p><strong>Token A:</strong> {history.tokenA} ({history.tokenASymbol})</p>
                <p><strong>Token B:</strong> {history.tokenB} ({history.tokenBSymbol})</p>
                <p><strong>Fee Tier:</strong> {history.fee / 10000}%</p>
              </div>
            </div>
          ) : (
            <p>No history available</p>
          )}
        </div>
      );
}
export default History;