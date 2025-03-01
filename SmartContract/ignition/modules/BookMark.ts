// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { setGlobalDispatcher, Agent } from "undici";

// Set a global dispatcher with a custom timeout
setGlobalDispatcher(new Agent({
  connect: { timeout: 60000 } // Set timeout to 60 seconds
}));

const BookMarkModule = buildModule("BookMarkModule", (m) => {
  const bookMark = m.contract("BookMark");
  return { bookMark };
});

export default BookMarkModule;
