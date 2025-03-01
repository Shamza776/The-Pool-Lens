import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "dotenv/config";
import "ts-node";
import "@typechain/hardhat";
import "hardhat-deploy";
import * as dotenv from "dotenv";
dotenv.config();

// console.log("Sepolia Network URL:", process.env.SEPOLIA_NETWORK_URL);
// console.log("Private Key:", process.env.PRIVATE_KEY);

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  paths: {
    sources: "./contracts",
    tests: "./tests",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {
      // forking: {
      //   url: process.env.ALCHEMY_NETWORK_URL || "",
      //   blockNumber: 17000000,
      // },
    },
    localhost:{
      url: "http://127.0.0.1:8545",
    },
    "lisk-sepolia": {
      url: process.env.SEPOLIA_NETWORK_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    "ethereum-sepolia":{
      url: process.env.SEPOLIA_NETWORK_URL_ETH || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    }
  }
};
export default config;
