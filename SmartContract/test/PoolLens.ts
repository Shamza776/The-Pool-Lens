import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

console.log("Test file is being read!")

describe("PoolLens", function () {

  this.timeout(60000);

  let poolLens: any;
  let  owner: any;

  const USDC = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
  const WETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
  const KNOWN_POOL = "0x5B8B635C2665791cf62fe429cB149EaB42A3cEd8"; // USDC/WETH 0.3% POOL

  before(async function (){
    console.log("Before hook is running")
    //enable forking from the mainnet
    await hre.network.provider.request({
      method: "hardhat_reset",
      params: [{
        forking: {
          jsonRpcUrl: process.env.ALCHEMY_NETWORK_URL,
          blockNumber: 17000000,
        }
      }],
  });
});
  beforeEach(async function () {
    console.log("Before each hook is running")
    const PoolLensFactory = await hre.ethers.getContractFactory("PoolLens");
    poolLens = await PoolLensFactory.deploy();
    console.log("PoolLens deployed to:", poolLens.address);
    //await poolLens.deployed();
    [owner] = await hre.ethers.getSigners();
    console.log("Signer address fetched");
  });

  describe("getPoolAddress", function () {
    it("should return the pool address for USD/WETH", async function (){
      console.log("USDC/WETH 0.3% POOL");
      const poolAddress = await poolLens.getPoolAddress(USDC, WETH, 3000);
      console.log("Pool address", poolAddress);
      expect(poolAddress).to.equal(KNOWN_POOL);
    })
  })

  describe("getLiquidity", function (){
    it("should return the liquidity information for the pool", async function (){
      console.log("liquidity information for the pool")
      const info = await poolLens.getLiquidity(KNOWN_POOL);
      console.log("Liquidity info", info);

      console.log("TokenA:", info.tokenA);
      console.log("TokenB:", info.tokenB);
      console.log("Fee:", info.fee);
      console.log("Liquidity:", info.liquidity.toString());
      console.log("TokenA Symbol:", info.tokenASymbol);
      console.log("TokenB Symbol:", info.tokenBSymbol);

      expect(info.tokenA).to.equal(USDC);
      expect(info.tokenB).to.equal(WETH);
      expect(info.fee).to.equal(3000);
      expect(info.liquidity).to.be.gt(0);
      expect(info.tokenASymbol).to.equal("USDC");
      expect(info.tokenBSymbol).to.equal("WETH");
    })
  })
 
})
