import EthContractAbi  from "./EthContractAbi.json"
export const EthConfig = {
    "ContractAddress": "0xd951dADe512Dd4C7e74FCcE5B756Bf591Bac3436",
    "Abi": EthContractAbi
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
          ethereumNetworks = [bscTestnet];
          break;
        default:
          ethereumNetworks = [];
      }
}