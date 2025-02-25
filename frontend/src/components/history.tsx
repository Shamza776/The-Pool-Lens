import { useEffect, useState } from "react";

type PoolInfo = {
  poolAddress: string;
  liquidity: string;
  tokenA: string;
  tokenB: string;
  fee: number;
  tokenASymbol: string;
  tokenBSymbol: string;
  timestamp: number;
};

function History() {
  const [history, setHistory] = useState<PoolInfo[]>([]);

  // Load history from localStorage when the component mounts
  useEffect(() => {
    const savedHistory = localStorage.getItem('poolHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Format the timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Search History</h1>
      
      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item, index) => (
            <div key={index} className="p-4 border rounded border-gray-700 bg-gray-800">
              <h3 className="text-xl font-bold mb-2 text-orange-500">{item.tokenASymbol}/{item.tokenBSymbol} Pool</h3>
              <div className="grid gap-2">
                <p><strong>Searched on:</strong> {formatDate(item.timestamp)}</p>
                <p><strong>Pool Address:</strong> {item.poolAddress}</p>
                <p><strong>Liquidity:</strong> {item.liquidity}</p>
                <p><strong>Token A:</strong> {item.tokenA} ({item.tokenASymbol})</p>
                <p><strong>Token B:</strong> {item.tokenB} ({item.tokenBSymbol})</p>
                <p><strong>Fee Tier:</strong> {item.fee / 10000}%</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-300">No search history available</p>
      )}
    </div>
  );
}

export default History;