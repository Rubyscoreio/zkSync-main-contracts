import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "solidity-docgen";

import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";

import "tsconfig-paths/register";

import "./tasks/index";

function typedNamedAccounts<T>(namedAccounts: { [key in string]: T }) {
  return namedAccounts;
}

const zkSyncTestnet =
  process.env.NODE_ENV == "test"
    ? {
        url: "http://localhost:3050",
        ethNetwork: "http://localhost:8545",
        zksync: true,
      }
    : {
        url: "https://zksync2-testnet.zksync.dev",
        ethNetwork: "goerli",
        zksync: true,
        verifyURL: "https://zksync2-testnet-explorer.zksync.dev/contract_verification", // Verification endpoint
      };

const config: HardhatUserConfig = {
  zksolc: {
    version: "1.3.16", // Uses latest available in https://github.com/matter-labs/zksolc-bin/
    settings: {},
  },
  solidity: {
    version: "0.8.21",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: "types/typechain-types",
  },
  networks: {
    hardhat: {
      zksync: true,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      zksync: false,
    },
    zkSyncTestnet,
    zkSyncMainnet: {
      url: "https://mainnet.era.zksync.io",
      ethNetwork: "mainnet", // Can also be the RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      zksync: true,
      verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification", // Verification endpoint
      gasPrice: 2100000000,
    },
  },
  namedAccounts: typedNamedAccounts({
    deployer: 0,
    admin: "0x0d0D5Ff3cFeF8B7B2b1cAC6B6C27Fd0846c09361",
    minter: "0x381c031baa5995d0cc52386508050ac947780815",
    operator: "0x381c031baa5995d0cc52386508050ac947780815",
  }),
  docgen: {
    exclude: ["./mocks"],
    pages: "files",
  },
  watcher: {
    test: {
      tasks: [{ command: "test", params: { testFiles: ["{path}"] } }],
      files: ["./test/**/*"],
      verbose: true,
    },
  },
  gasReporter: {
    enabled: false,
    coinmarketcap: "",
    currency: "USD",
    token: "ETH",
    gasPrice: 28,
  },
};

export default config;
