// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { setGlobalDispatcher, Agent } from "undici";

// Set a global dispatcher with a custom timeout
setGlobalDispatcher(new Agent({
  connect: { timeout: 60000 } // Set timeout to 60 seconds
}));

const PoolLensModule = buildModule("PoolLensModule", (m) => {
  const poolLens = m.contract("PoolLens");
  return { poolLens };
});

export default PoolLensModule;
