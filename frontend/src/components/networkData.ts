// interface Network {
//     id: string;
//     name: string;
//     image: string;
//     rpc: string;
// };

const networks : any = [
    {
        id: "Ethereum",
        name: "Ethereum Mainnet",
        image: "../assets/ethereum.png",
        rpc: "https://eth-mainnet.g.alchemy.com/v2/t0q4rmOWqfNSwebEsVtHyqYzVK3mFZSU"
    },
    {
        id: "OP Mainnet",
        name: " Optimism Mainnet",
        image:"frontend\src\assets\optimism.png" ,
        rpc: "https://opt-mainnet.g.alchemy.com/v2/t0q4rmOWqfNSwebEsVtHyqYzVK3mFZSU"
    },
    {
        id: "Arbitrum",
        name: "Arbitrum Mainnet",
        image: "frontend\src\assets\arbitrum.png",
        rpc: "https://arb-mainnet.g.alchemy.com/v2/t0q4rmOWqfNSwebEsVtHyqYzVK3mFZSU"
    },
    {
        id: "Polygon",
        name: "Polygon Mainnet",
        image: "frontend\src\assets\polygon.png",
        rpc: "https://polygon-mainnet.g.alchemy.com/v2/t0q4rmOWqfNSwebEsVtHyqYzVK3mFZSU"
        
    },
    {
        id: "Fantom Opera",
        name: "Fantom Mainnet",
        image: "frontend\src\assets\fantom.png",
        rpc: "https://fantom-mainnet.g.alchemy.com/v2/t0q4rmOWqfNSwebEsVtHyqYzVK3mFZSU"
    },
    {
        id: "Avalanche",
        name: "Avalanche Mainnet",
        image:"frontend\src\assets\avalanche.png",
        rpc: "https://avalanche-mainnet.g.alchemy.com/v2/t0q4rmOWqfNSwebEsVtHyqYzVK3mFZSU"
    },
    {
        id : "Base",
        name: "Base Mainnet",
        image: "frontend\src\assets\base.png",
        rpc: "https://base-mainnet.g.alchemy.com/v2/t0q4rmOWqfNSwebEsVtHyqYzVK3mFZSU"
    },
    {
        id: "Lisk",
        name: "Lisk Sepolia",
        image: "frontend\src\assets\lisk.png",
    }
]
export default networks;