import { useState } from "react";
import { useNavigate } from "react-router-dom";
import networks from "./networkData";
import "./NetworkSelection.css"; // Import the new CSS file

function DisplayNetworks() {
  const navigate = useNavigate();
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(
    localStorage.getItem('selectedNetwork')
  );
  
  const handleSelect = (networkId: string) => {
    // Save selected network to localStorage
    localStorage.setItem('selectedNetwork', networkId);
    setSelectedNetwork(networkId);
  };
  
  const proceedToAction = (action: string) => {
    if (!selectedNetwork) {
      alert("Please select a network first");
      return;
    }
    
    // Navigate to the appropriate page based on user's choice
    if (action === "findPool") {
      navigate("/pool");
    } else if (action === "checkLiquidity") {
      navigate("/PoolReader");
    }
  };
  
  return (
    <div className="network-container">
      <h1 className="page-title">Select a Network</h1>
      <p className="page-subtitle">
        Choose a network to interact with Uniswap V3 pools
      </p>
      
      <div className="networks-grid">
        {networks.map((network: any) => (
          <div
            key={network.id}
            className={`network-card ${
              selectedNetwork === network.id ? "selected" : ""
            }`}
            onClick={() => handleSelect(network.id)}
          >
            <img
              src={network.image}
              alt={network.name}
              className="network-image"
            />
            <p className="network-name">{network.name}</p>
          </div>
        ))}
      </div>
      
      {selectedNetwork && (
        <div className="actions-container">
          <h2 className="actions-title">What would you like to do?</h2>
          <div className="actions-buttons">
            <button
              className="action-button"
              onClick={() => proceedToAction("findPool")}
            >
              Find Pool Address
            </button>
            <button
              className="action-button"
              onClick={() => proceedToAction("checkLiquidity")}
            >
              Check Pool Liquidity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayNetworks;