import { ethers } from "ethers";
import abi from "../../web3/EthContractAbi.json";
import TokenAbi from "../../web3/TokenAbi.json";
import routerAbi from "./routerAbi.json"
import { toast } from "react-toastify";
import { ethereumTokenInfo, getBuySellInEthBuy, getBuySellInTokensBuy } from "./TokenPriceCalculations";
import evmTokenAbi from "../../web3/evmtokenabi.json";
import { fetchUsdPriceEth } from "../../utils/helper";

// Contract Address
let CONTRACT_ADDRESS = "0xb70488520517bcF99e7C60536A6899a882b89a55";

// Connect to the factory contract
export const getFactoryContract = async () => {


  // Initialize provider from MetaMask
  const provider = new ethers.providers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com")
  //("https://sepolia.infura.io/v3/014624cb65e2436b867f49ef0a3c84e3");

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

      const payableAmount = await factoryContract.buyQuoteWithFee(tokenAddress, formattedAmount);
      // const fee = await factoryContract.calculateBuyFee(tokenAddress, formattedAmount);


      const ethToPay = ethers.BigNumber.from(payableAmount)

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
export const calculateEthTokenValue = async (tokenAddress, amount, isDeployed) => {
  try {


    const data = await tokenBondingCurveInfoWei(tokenAddress)


    const amountInWei = ethers.utils.parseEther(amount?.toString())

    const amountinBI = BigInt(amountInWei?.toString());


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
  console.log("amount", amount)
  try {
    if (!tokenAddress || !ethers.utils.isAddress(tokenAddress) || amount == '') {
      throw new Error(`Invalid token address: ${tokenAddress}`);
    }


    const formattedAmount = ethers.utils.parseUnits(amount.toString(), 18);

    const factoryContract = await getFactoryContract();
    const payableAmount = await factoryContract.buyQuoteWithFee(tokenAddress, formattedAmount?.toString());


    return {
      success: true,
      data: payableAmount,
      error: false
    }
  } catch (error) {
    console.error("Error buying tokens on blockchain:", error);
    toast.dismiss()
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
    console.log("userTokenHoldings", userTokenHoldings?.toString())
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
    console.log("token-infos", tokenInfo)
    return tokenInfo

  } catch (error) {

  }
}



const calculateBondingCurveProgressPer = (remainingTokens, initialRealTokenReserves) => {
  // Calculate the Bonding Curve Progress
  return ((initialRealTokenReserves - remainingTokens) * 100) / initialRealTokenReserves;
};
const calculateKingOfTheHillProgress = (remainingTokens, initialRealTokenReserves) => {
  // Calculate the Bonding Curve Progress
  return ((initialRealTokenReserves - remainingTokens) * 100) / initialRealTokenReserves;
};

// const calculateBondingCurveProgressPer = (tokenTotalSupply, realTokenReserves) => {
//         const reservedTokens = new BN(206900000).mul(new BN(1000_000_000_000_000_000));
//         const initialRealTokenReserves = tokenTotalSupply.sub(reservedTokens);
//         const bondingCurveProgress = new BN(100).sub(realTokenReserves.mul(new BN(100)).div(initialRealTokenReserves))

//         return bondingCurveProgress.toString(10)
//     };
const calculateProgress = (currentTokenValue, minValue, maxValue) => {

  const progress = ((currentTokenValue - minValue) / (maxValue - minValue)) * 100;
  return progress.toFixed(2); // Return the progress percentage as a string with 2 decimal places
}

export const tokenBondingCurveInfoWei = async (tokenAddress, address) => {
  try {
    const factoryContract = await getFactoryContract();
    const bondingCurveInfo = await factoryContract.bondingCurve(tokenAddress);

    const tokenInfo = {
      virtualTokenReserves: bondingCurveInfo[0].toString(),
      virtualEthReserves: bondingCurveInfo[1].toString(),
      realTokenReserves: bondingCurveInfo[2].toString(),
      realEthReserves: bondingCurveInfo[3].toString(),
      totalSupply: bondingCurveInfo[4].toString(),
      maxSupplyPercentage: bondingCurveInfo[5].toString(),
      isCompleted: bondingCurveInfo[6].toString(),
    }

    return tokenInfo

  } catch (error) {

  }
}

export const tokenBondingCurveInfo = async (tokenAddress) => {
  try {
    const factoryContract = await getFactoryContract();
    const bondingCurveInfo = await factoryContract.bondingCurve(tokenAddress);

    const tokenInfo = {
      virtualTokenReserves: String(ethers.utils.formatEther(bondingCurveInfo[0].toString())),
      virtualEthReserves: String(ethers.utils.formatEther(bondingCurveInfo[1].toString())),
      realTokenReserves: String(ethers.utils.formatEther(bondingCurveInfo[2].toString())),
      realTokesReservesBn: BigInt(bondingCurveInfo[2]?._hex),
      realEthReserves: String(ethers.utils.formatEther(bondingCurveInfo[3].toString())),
      totalSupply: String(ethers.utils.formatEther(bondingCurveInfo[4].toString())),
      maxSupplyPercentage: bondingCurveInfo[5].toString(),
      isCompleted: bondingCurveInfo[6].toString(),
    }

    return tokenInfo

  } catch (error) {

  }
}

export const calculateEthBondingCurveProgress = async (tokenAddress) => {
  try {

    const bondingCurveInfo = await tokenBondingCurveInfo(tokenAddress);
    const initialRealTokenReserves = 793100000; // Fixed initial reserve from your requirements
    const bondingCurveProgress = calculateBondingCurveProgressPer(bondingCurveInfo.realTokenReserves, initialRealTokenReserves);

    const remainingTokens = parseFloat(bondingCurveInfo?.realTokenReserves);
    let calaculateToken;
    if (remainingTokens < 396550000) {
      calaculateToken = 396550000
    } else {
      calaculateToken = remainingTokens
    }
    // const totalTokens = parseFloat(tokenTotalSupplyStr / 1000000);
    const minValue = 793100000; // 0% progress
    const maxValue = 396550000; // 100% progress
    const kingOfTheHillProgress = calculateProgress(calaculateToken, minValue, maxValue)

    return {
      // bondingCurveProgress: bondingCurveProgress.toFixed(2),
      bondingCurveProgress: bondingCurveProgress?.toFixed(2),
      kingOfTheHillProgress: kingOfTheHillProgress
    }

  } catch (error) {
    console.log("error while calculating bc prog eth", error)
  }
}


export const marketCapCalEth = async (tokenAddress, priceInUsd, setMarketCap) => {
  try {
    console.log("i am hittig market cap", tokenAddress, setMarketCap)
    setMarketCap(prevState => ({
      ...prevState,
      loading: true
    }));


    //fetch 1 token price

    // const data = await ethereumTokenInfo();

    // const virtualSolReserves = BigInt(data?.virtualSolReserves);
    // const virtualTokenReserves = BigInt(data?.virtualTokenReserves);
    // const k = virtualSolReserves * virtualTokenReserves;

    const oneTokenPrice = await calculateTokenEthValues(tokenAddress, 1, true)
    //fetch sol price in usd
    // const priceInUsd = await fetchUsdPriceEth();
    //calculate 1 token price in usd
    const tokenPriceInUsd = priceInUsd?.ethPrice * oneTokenPrice

    // mul by billion to get the current market cap of token
    const marketCap = tokenPriceInUsd * 1000000000
    setMarketCap(prevState => ({
      ...prevState,
      loading: false,
      data: marketCap
    }));

  } catch (error) {
    console.log("error while market-cap", error)
    setMarketCap(prevState => ({
      ...prevState,
      loading: false,
      data: ""
    }));
  }
}



export const fetchTransactionDetails = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com")
    const hash = "0xc688aeaa1f8f1e130c2ab558f3ee46aa63daa946c007784d11cf7cc13bb28fa0";

    // Get transaction details
    const tx = await provider.getTransaction(hash);
    console.log("Transaction Details:", tx);

    // Get transaction receipt (includes logs & status)
    const receipt = await provider.getTransactionReceipt(hash);
    console.log("Transaction Receipt:", receipt);

    // Check transaction success
    if (receipt) {
      if (receipt.status === 1) {
        console.log("✅ Transaction was successful!");
      } else {
        console.log("❌ Transaction failed.");
      }

      // Display emitted events (logs)
      console.log("📢 Emitted Events:");
      receipt.logs.forEach((log, index) => {
        console.log(`Event ${index + 1}:`, log);
      });
    } else {
      console.log("Transaction is still pending.");
    }

  } catch (error) {
    console.error("❌ Error fetching transaction details:", error);
  }
};


export const getUniswapMarketCap = async (tokenAddress, ethInUsd, setMarketCap) => {
  try {
    
    const address = "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3";

    const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/014624cb65e2436b867f49ef0a3c84e3");

    const routerContract = new ethers.Contract(address, routerAbi, provider);

    const amountIn = ethers.utils.parseUnits("1", 18); // 1 token (18 decimals)
    const path = ["0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", tokenAddress]; // Token addresses

    const fechedPrice = await routerContract.getAmountsIn(amountIn, path);
   
    const priceString = fechedPrice[0]?.toString() || "0";

    const priceInEth = ethers.utils.formatEther(priceString)
    

    const priceInUsd = ethInUsd.ethPrice * priceInEth?.toString()
 

    const marketCap = priceInUsd*1000000000

    setMarketCap(prevState => ({
      ...prevState,
      loading: false,
      data: marketCap
    }));


  } catch (error) {
    console.log("error while fetchig unisawap market cap", error)
  }
}