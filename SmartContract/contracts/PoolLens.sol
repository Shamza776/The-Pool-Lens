// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// import "hardhat/console.sol";

//interface for UniswapV3Factory -- FUNCTION NEEDED
interface IUniswapV3Factory {
    function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address);
}

//interface for UniswapV3Pool -- functions needed from the V3POOL
interface IUniswapV3Pool {
    function token0() external view returns (address);
    function token1() external view returns (address);
    function fee() external view returns (uint24);
    function liquidity() external view returns (uint128);
    
}

//interface for erc20 symbol lookup
interface IERC20Metadata {
    function symbol() external view returns (string memory);
}


contract PoolLens {
    //Uniswap V3 Factory contract address(ethereum mainnet)
    //address public constant FACTORY_ADDRESS = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
    address public constant FACTORY_ADDRESS = 0x0227628f3F023bb0B980b67D528571c95c6DaC1c;

    struct Info{ 
        address poolAddress;
        uint128 liquidity;
        address tokenA;
        address tokenB;
        uint24 fee;
        string  tokenASymbol;
        string tokenBSymbol;
    }

   function getPoolAddress(address tokenA, address tokenB, uint24 fee) external view returns (address pool){
    pool = IUniswapV3Factory(FACTORY_ADDRESS).getPool(tokenA, tokenB, fee);
    return pool;
   }

    function getLiquidity(address poolAddress) external view returns (Info memory){
        require(poolAddress != address(0), "Pool address cannot be zero");
        
        Info memory info;
        info.poolAddress = poolAddress;
        info.tokenA = IUniswapV3Pool(poolAddress).token0();
        info.tokenB = IUniswapV3Pool(poolAddress).token1();
        info.fee = IUniswapV3Pool(poolAddress).fee();
        info.tokenASymbol = IERC20Metadata(info.tokenA).symbol();
        info.tokenBSymbol = IERC20Metadata(info.tokenB).symbol();
        info.liquidity = IUniswapV3Pool(poolAddress).liquidity();

         return info;

    }
   
}
