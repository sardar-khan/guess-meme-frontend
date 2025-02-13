import { ethers } from "ethers";
import abi from "../../web3/EthContractAbi.json";
import TokenAbi from "../../web3/TokenAbi.json";
import { toast } from "react-toastify";
import { ethereumTokenInfo, getBuySellInEthBuy, getBuySellInTokensBuy } from "./TokenPriceCalculations";
import { data } from "autoprefixer";
import evmTokenAbi from "../../web3/evmtokenabi.json";
import { error } from "highcharts";
import { b } from "./utils";
import { calculateBondingCurveProgress } from "./solanaBuySellFunction";

// Contract Address
const CONTRACT_ADDRESS = "0xE2D4cEA37961EA559815830642152AbFE7a87EC5";

// Connect to the factory contract
export const getFactoryContract = async () => {


  // Initialize provider from MetaMask
  const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/014624cb65e2436b867f49ef0a3c84e3");

  const factoryContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
  return factoryContract;
};

export const getTokenContract = async (tokenAddress) => {


  // Initialize provider from MetaMask
  const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/014624cb65e2436b867f49ef0a3c84e3");

  const factoryContract = new ethers.Contract(tokenAddress, evmTokenAbi, provider);
  return factoryContract;
};

export const gettokenDetails = async (tokenAddress) => {

}
// Function to buy tokens

export const calculateTokenEthValues = async (tokenAddress, amount, isDeployed) => {
  try {
    if (!isDeployed) {
       
      const data = await ethereumTokenInfo();
       
      const virtualSolReserves = BigInt(data?.virtualSolReserves);
      const virtualTokenReserves = BigInt(data?.virtualTokenReserves);

      const k = virtualSolReserves * virtualTokenReserves;


      const pricesInToken = getBuySellInEthBuy(amount, k, virtualSolReserves, virtualTokenReserves)
      return pricesInToken

    } else {
      const factoryContract = await getFactoryContract();
      const formattedAmount = ethers.utils.parseUnits(amount.toString(), 18);

      const payableAmount = await factoryContract.buyQuote(tokenAddress, formattedAmount);
      const fee = await factoryContract.calculateBuyFee(tokenAddress, formattedAmount);
       
      const ethToPay = ethers.BigNumber.from(payableAmount).add(
        ethers.BigNumber.from(fee)
      );
       
      return ethers.utils.formatEther(ethToPay);
    }
  } catch (error) {
    console.error("Error calculating token ETH values:", error);
    throw error; // Rethrow if needed
  }

};

// function toBigInt(value) {

//   if (typeof value === "string") {
//     value = Number(value); // Convert string to number first
//   }
//    
// }
export const calculateEthTokenValue = async(tokenAddress, amount, isDeployed)=>{
  try {

       
      const data = await tokenBondingCurveInfoWei(tokenAddress)
       
       
      const amountInWei =ethers.utils.parseEther(amount?.toString())
       
       const amountinBI =  BigInt(amountInWei?.toString());
        

      const virtualEthReserves = BigInt(data?.virtualEthReserves);
      const virtualTokenReserves = BigInt(data?.virtualTokenReserves);
      const k_supply = virtualEthReserves * virtualTokenReserves;
       

      const buyTokensAgainstSol = Number(
        virtualTokenReserves - (k_supply / (virtualEthReserves + amountinBI))
    );
   
   
    return buyTokensAgainstSol / 1000000000000000000;

     


  } catch (error) {
    console.error("Error calculating token ETH values:", error);
    throw error; // Rethrow if needed
  }
}


export const tokenToEthConversion = async (useReadContract, tokenAddress, amount, contractInfo) => {
  try {
    const formattedAmount = ethers.utils.parseUnits(amount.toString(), 18);
    const SelectedAbi = contractInfo.Abi
    const contractAddress = contractInfo.ContractAddress;
    const result = useReadContract({
      abi: SelectedAbi,
      address: contractAddress,
      functionName: 'buyQuote',
      args: [
        "0x7D3Fb449FbD018af1898c13e0c3b5382aF20501d",
        formattedAmount
      ],
    })
    const payableAmount = BigInt(buyQuoteResult);
    const fee = BigInt(feeResult);

    const ethToPay = payableAmount + fee; // Summing up the ETH amount and fee

     
    return (Number(ethToPay) / 10 ** 18).toString(); // Return as string for consistency
  } catch (error) {
    console.error("Error calculating token ETH values:", error);
    throw error; // Rethrow if needed
  }
};

export const buyTokensOnBlockchain = async (tokenAddress, amount, walletBalance) => {
  try {
    if (!tokenAddress || !ethers.utils.isAddress(tokenAddress) || amount == '') {
      throw new Error(`Invalid token address: ${tokenAddress}`);
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();
    const walletBalance = await provider.getBalance(walletAddress);


    const formattedAmount = ethers.utils.parseUnits(amount.toString(), 18);

    const factoryContract = await getFactoryContract();

     
    const payableAmount = await factoryContract.buyQuote(tokenAddress, formattedAmount);
    const fee = await factoryContract.calculateBuyFee(tokenAddress, formattedAmount);
     
    // Add payableAmount and fee
    // const ethToPay = ethers.BigNumber.from(payableAmount).add(
    //   ethers.BigNumber.from(fee)
    // );
    const ethToPay = ethers.BigNumber.from(payableAmount).add(ethers.BigNumber.from(fee));

     

     
     

    // if (walletBalance.lt(ethToPay)) {
    if (ethers.utils.formatEther(walletBalance) < ethers.utils.formatEther(ethToPay)) {
      console.error("Insufficient balance to complete the transaction.");
      return { success: false, error: "Insufficient balance." };
      // toast.error("Insufficient balance to complete the transaction.")
    }


     
    const tx = await factoryContract.buyTokens(tokenAddress, formattedAmount, {
      value: ethToPay,
    });
    await tx.wait();

     
    return { success: true, transactionHash: tx.hash };


  } catch (error) {
    console.error("Error buying tokens on blockchain:", error);
    return { success: false, error: error.message };
  }
};

export const getReturnedEthAmountonSell = async (tokenAddress, amount) => {
  try {
     
    const tokenContract = await getTokenContract(tokenAddress);
     
    const decimals = await tokenContract.decimals();
     

    const formattedAmount = ethers.utils.parseUnits(amount.toString(), decimals);
     
    const factoryContract = await getFactoryContract();
     
    const payableAmount = await factoryContract.sellQuote(tokenAddress, formattedAmount);
     
     
    return ethers.utils.formatEther(payableAmount);
  } catch (error) {
     
  }
}

export const getPayAbleEtherAmount = async (tokenAddress, amount, walletBalance) => {
   
  try {
    if (!tokenAddress || !ethers.utils.isAddress(tokenAddress) || amount == '') {
      throw new Error(`Invalid token address: ${tokenAddress}`);
    }


    const formattedAmount = ethers.utils.parseUnits(amount.toString(), 18);

    const factoryContract = await getFactoryContract();

     
     
    const payableAmount = await factoryContract.buyQuote(tokenAddress, formattedAmount?.toString());
     
    const fee = await factoryContract.calculateBuyFee(tokenAddress, formattedAmount?.toString());
     
    const feeInEther = ethers.utils.formatEther(fee?.toString());
    const payableAmountInEther = ethers.utils.formatEther(payableAmount);
     


    const ethToPayFloat = parseFloat(payableAmount) + parseFloat(fee);
     
    const ethToPay = ethers.utils.formatEther(ethToPayFloat);
     


    return {
      success: true,
      data: ethToPayFloat,
      error: false
    }




  } catch (error) {
    console.error("Error buying tokens on blockchain:", error);
    return { success: false, data: null, error: error.message };
  }

}

export const sellTokensOnBlockchain = async (tokenAddress, amount) => {
  try {
    if (!tokenAddress || !ethers.utils.isAddress(tokenAddress)) {
      throw new Error(`Invalid token address: ${tokenAddress}`);
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const tokenContract = new ethers.Contract(tokenAddress, TokenAbi, signer);

    const decimals = await tokenContract.decimals();
    const formattedAmount = ethers.utils.parseUnits(amount.toString(), decimals);

    const tokenBalance = await tokenContract.balanceOf(signer.getAddress());
     

    if (tokenBalance.lt(formattedAmount)) {
      throw new Error("Insufficient token balance.");
    }

    const factoryContract = await getFactoryContract();

    const currentAllowance = await tokenContract.allowance(
      signer.getAddress(),
      CONTRACT_ADDRESS
    );
     

    if (currentAllowance.lt(formattedAmount)) {
       
      const approvalTx = await tokenContract.approve(CONTRACT_ADDRESS, formattedAmount);
      await approvalTx.wait();
      // toast.success("Approval successful:", approvalTx.hash);
       
    }

     
    const tx = await factoryContract.sellTokens(tokenAddress, formattedAmount, {
      gasLimit: ethers.utils.hexlify(200000), // Adjust as needed
    });
    await tx.wait();
    // toast.success("Sell transaction successful:", tx.hash);
     

    return { success: true, transactionHash: tx.hash };
  } catch (error) {
    console.error("Error selling tokens on blockchain:", error);
    return { success: false, error: error.message };
  }
};
export const sellTokensInfo = async (tokenAddress, address, amount, contractInfo) => {
  try {
     

    const tokenContract = await getTokenContract(tokenAddress);

    const decimals = await tokenContract.decimals();
    const formattedAmount = ethers.utils.parseUnits(amount.toString(), decimals);

    const tokenBalance = await tokenContract.balanceOf(address);

    if (tokenBalance.lt(formattedAmount)) {
      throw new Error("Insufficient token balance.");
    }

    const factoryContract = await getFactoryContract();

    const currentAllowance = await tokenContract.allowance(
      address,
      contractInfo?.ContractAddress
    );
     
     
    return {
      success: true,
      error: null,
      decimals: decimals,
      tokenInWei: formattedAmount?.toString(),
      userTokenBalance: tokenBalance?.toString(),
      doesUserHasEnoughToken: tokenBalance.lt(formattedAmount),
      currentAllowance: currentAllowance?.toString(),
      doesContractHasAllowance: formattedAmount.lt(currentAllowance),
    }


  } catch (error) {
    console.error("Error selling tokens on blockchain:", error);
    return { success: false, error: error.message };
  }
};

export const buyTokensEthereum = async (tokenAddress, sendTransaction, balance, tokens, ethAmount) => {
  try {
    const userBalance = balance ? parseFloat(balance) : 0;
    if (userBalance < ethAmount) {
      toast.error("Insufficient balance in wallet!");
      return false;
    }





  } catch (error) {
     
  }
}


export const evmTokenInfo = async (tokenAddress, address) => {
  try {
     
    const factoryContract = await getFactoryContract();
    const tokenContract = await getTokenContract(tokenAddress);
    const userTokenHoldings = await tokenContract.balanceOf(address);
    const bondingCurveInfo = await factoryContract.bondingCurve(tokenAddress);
    const tokenInfo = {
      virtualTokenReserves: String(ethers.utils.formatEther(bondingCurveInfo[0].toString())),
      virtualEthReserves: String(ethers.utils.formatEther(bondingCurveInfo[1].toString())),
      realTokenReserves: String(ethers.utils.formatEther(bondingCurveInfo[2].toString())),
      realEthReserves: String(ethers.utils.formatEther(bondingCurveInfo[3].toString())),
      totalSupply: String(ethers.utils.formatEther(bondingCurveInfo[4].toString())),
      userTokenHoldings: String(ethers.utils.formatEther(userTokenHoldings.toString())),
      maxSupplyPercentage: bondingCurveInfo[5].toString(),
      isCompleted: bondingCurveInfo[6].toString(),
    }
     
    return tokenInfo

  } catch (error) {
     
  }
}

export const tokenBondingCurveInfoWei = async (tokenAddress, address) => {
  try {
    const factoryContract = await getFactoryContract();
    const bondingCurveInfo = await factoryContract.bondingCurve(tokenAddress);
    const tokenInfo = {
      virtualTokenReserves:bondingCurveInfo[0].toString(),
      virtualEthReserves:bondingCurveInfo[1].toString(),
      realTokenReserves:bondingCurveInfo[2].toString(),
      realEthReserves:bondingCurveInfo[3].toString(),
      totalSupply:bondingCurveInfo[4].toString(),
      maxSupplyPercentage: bondingCurveInfo[5].toString(),
      isCompleted: bondingCurveInfo[6].toString(),
    }
     
    return tokenInfo

  } catch (error) {
     
  }
}

export const tokenBondingCurveInfo = async (tokenAddress, address) => {
  try {
    const factoryContract = await getFactoryContract();
    const bondingCurveInfo = await factoryContract.bondingCurve(tokenAddress);
    const tokenInfo = {
      virtualTokenReserves: String(ethers.utils.formatEther(bondingCurveInfo[0].toString())),
      virtualEthReserves: String(ethers.utils.formatEther(bondingCurveInfo[1].toString())),
      realTokenReserves: String(ethers.utils.formatEther(bondingCurveInfo[2].toString())),
      realEthReserves: String(ethers.utils.formatEther(bondingCurveInfo[3].toString())),
      totalSupply: String(ethers.utils.formatEther(bondingCurveInfo[4].toString())),
      maxSupplyPercentage: bondingCurveInfo[5].toString(),
      isCompleted: bondingCurveInfo[6].toString(),
    }
     
    return tokenInfo

  } catch (error) {
     
  }
}
const calculateBondingCurveProgressPer = (remainingTokens, initialRealTokenReserves) => {
  // Calculate the Bonding Curve Progress
  return ((initialRealTokenReserves - remainingTokens) * 100) / initialRealTokenReserves;
};
export const calculateEthBondingCurveProgress = async (tokenAddress) => {
  try {
    const bondingCurveInfo = await tokenBondingCurveInfo(tokenAddress);
     
    const initialRealTokenReserves = 800_000_000; // Fixed initial reserve from your requirements
    const bondingCurveProgress =  calculateBondingCurveProgressPer(bondingCurveInfo.realTokenReserves, initialRealTokenReserves);
     
    return { bondingCurveProgress: bondingCurveProgress.toFixed(2) }

  } catch (error) {
     
  }
}