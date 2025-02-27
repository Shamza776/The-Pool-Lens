import { useState } from "react";
import { useNavigate } from "react-router-dom";
import networks from "./networkData";

function DisplayNetworks() {
  const navigate = useNavigate();
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Select a Network</h1>
      <p className="mb-4 text-gray-300">
        Choose a network to interact with Uniswap V3 pools
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {networks.map((network: any) => (
          <div 
            key={network.id}
            className={`p-4 border rounded cursor-pointer transition-all ${
              selectedNetwork === network.id 
                ? "border-orange-500 bg-gray-700" 
                : "border-gray-700 bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => handleSelect(network.id)}
          >
            <div className="flex items-center mb-2">
              <img 
                src={network.image} 
                alt={network.name} 
                className="w-8 h-8 mr-2 rounded-full"
              />
              <p className="font-bold text-gray-200">{network.name}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedNetwork && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-200">What would you like to do?</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              className="bg-orange-600 text-white px-6 py-3 rounded hover:bg-orange-700"
              onClick={() => proceedToAction("findPool")}
            >
              Find Pool Address
            </button>
            <button 
              className="bg-orange-600 text-white px-6 py-3 rounded hover:bg-orange-700"
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