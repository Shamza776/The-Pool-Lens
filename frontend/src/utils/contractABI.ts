export const contractABI = [
    {
      "inputs": [],
      "name": "FACTORY_ADDRESS",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "poolAddress",
          "type": "address"
        }
      ],
      "name": "getLiquidity",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "poolAddress",
              "type": "address"
            },
            {
              "internalType": "uint128",
              "name": "liquidity",
              "type": "uint128"
            },
            {
              "internalType": "address",
              "name": "tokenA",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "tokenB",
              "type": "address"
            },
            {
              "internalType": "uint24",
              "name": "fee",
              "type": "uint24"
            },
            {
              "internalType": "string",
              "name": "tokenASymbol",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "tokenBSymbol",
              "type": "string"
            }
          ],
          "internalType": "struct PoolLens.Info",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenA",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenB",
          "type": "address"
        },
        {
          "internalType": "uint24",
          "name": "fee",
          "type": "uint24"
        }
      ],
      "name": "getPoolAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "pool",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]