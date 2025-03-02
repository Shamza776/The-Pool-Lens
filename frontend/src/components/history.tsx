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
  
  // Handle removing an item from history
  const handleRemove = (index: number) => {
    const updatedHistory = [...history];
    updatedHistory.splice(index, 1);
    setHistory(updatedHistory);
    
    // Update localStorage with the new history
    localStorage.setItem('poolHistory', JSON.stringify(updatedHistory));
  };
  
  return (
    <div className="pool-finder-container">
      <h1 className="page-title">Search History</h1>
      
      {history.length > 0 ? (
        <div className="history-list">
          {history.map((item, index) => (
            <div key={index} className="result-container">
              <div className="result-header">
                <h2 className="result-title">
                  {item.tokenASymbol}/{item.tokenBSymbol} Pool
                </h2>
                <button 
                  className="remove-button" 
                  onClick={() => handleRemove(index)}
                  aria-label="Remove from history"
                >
                  Remove
                </button>
              </div>
              <div className="result-details">
                <div className="result-detail">
                  <span className="result-label">Searched on:</span>
                  <span className="result-value">{formatDate(item.timestamp)}</span>
                </div>
                <div className="result-detail">
                  <span className="result-label">Pool Address:</span>
                  <span className="result-value">{item.poolAddress}</span>
                </div>
                <div className="result-detail">
                  <span className="result-label">Liquidity:</span>
                  <span className="result-value">{item.liquidity}</span>
                </div>
                <div className="result-detail">
                  <span className="result-label">Token A:</span>
                  <span className="result-value">{item.tokenA} ({item.tokenASymbol})</span>
                </div>
                <div className="result-detail">
                  <span className="result-label">Token B:</span>
                  <span className="result-value">{item.tokenB} ({item.tokenBSymbol})</span>
                </div>
                <div className="result-detail">
                  <span className="result-label">Fee Tier:</span>
                  <span className="result-value">{item.fee / 10000}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-history-message">
          No search history available
        </div>
      )}
    </div>
  );
}

export default History;