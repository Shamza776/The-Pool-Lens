// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const PoolLensModule = buildModule("PoolLensModule", (m) => {
  

  const poolLens = m.contract("PoolLens", [], {
    
  });

  return { poolLens };
});

export default PoolLensModule;
