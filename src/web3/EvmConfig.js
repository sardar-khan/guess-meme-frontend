import EthContractAbi  from "./EthContractAbi.json"
import tokenAbi from "./evmtokenabi.json"
export const BscConfig = {
    "ContractAddress": "0x20c09aCCe0cAe954715B30AD421D2836BEdA58Db",
    "Abi": EthContractAbi,
    "tokenAbi":tokenAbi
}
export const EthConfig = {
  "ContractAddress": "0xb70488520517bcF99e7C60536A6899a882b89a55",
  "Abi": EthContractAbi,
  "tokenAbi":tokenAbi
}



export const GetContractConfiguration = async(blockchain)=>{
    switch (blockchain) {
        case "ETH":
           return EthConfig
          break;
        case "POL":
          ethereumNetworks = [polygonAmoy];
          break;
        case "BNB":
          return BscConfig
          break;
        default:
          ethereumNetworks = [];
      }
}