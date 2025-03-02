// Import all images at the top of the file
import ethereumLogo from "../assets/ethereum.png";
import optimismLogo from "../assets/optimism.png";
import arbitrumLogo from "../assets/arbitrum.png";
import polygonLogo from "../assets/polygon.png";
import fantomLogo from "../assets/fantom.png";
import avalancheLogo from "../assets/avalanche.png";
import baseLogo from "../assets/base.png";


// Interface for type checking
interface Network {
    id: string;
    name: string;
    image: string;
    rpc: string;
}

const networks: Network[] = [
    {
        id: "Ethereum",
        name: "Ethereum Mainnet",
        image: ethereumLogo,
        rpc: "https://eth-mainnet.g.alchemy.com/v2/t0q4rmOWqfNSwebEsVtHyqYzVK3mFZSU"
    },
    {
        id: "OP Mainnet",
        name: "Optimism Mainnet",
        image: optimismLogo,
        rpc: "https://opt-mainnet.g.alchemy.com/v2/t0q4rmOWqfNSwebEsVtHyqYzVK3mFZSU"
    },
    {
        id: "Arbitrum",
        name: "Arbitrum Mainnet",
        image: arbitrumLogo,
        rpc: "https://arb-mainnet.g.alchemy.com/v2/t0q4rmOWqfNSwebEsVtHyqYzVK3mFZSU"
    },
    {
        id: "Polygon",
        name: "Polygon Mainnet",
        image: polygonLogo,
        rpc: "https://polygon-mainnet.g.alchemy.com/v2/t0q4rmOWqfNSwebEsVtHyqYzVK3mFZSU"
    },
    {
        id: "Fantom Opera",
        name: "Fantom Mainnet",
        image: fantomLogo,
        rpc: "https://fantom-mainnet.g.alchemy.com/v2/t0q4rmOWqfNSwebEsVtHyqYzVK3mFZSU"
    },
    {
        id: "Avalanche",
        name: "Avalanche Mainnet",
        image: avalancheLogo,
        rpc: "https://avalanche-mainnet.g.alchemy.com/v2/t0q4rmOWqfNSwebEsVtHyqYzVK3mFZSU"
    },
    {
        id: "Base",
        name: "Base Mainnet",
        image: baseLogo,
        rpc: "https://base-mainnet.g.alchemy.com/v2/t0q4rmOWqfNSwebEsVtHyqYzVK3mFZSU"
    }
];

export default networks;