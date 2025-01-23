import { ethers } from "ethers";
import abi from "../../web3/abi.json";
import TokenAbi from "../../web3/TokenAbi.json";
import { toast } from "react-toastify";

// Contract Address
const CONTRACT_ADDRESS = "0x93C27bA75a1480ac1a7aE7ea9887D5Ee8AFf6942";

// Connect to the factory contract
export const getFactoryContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  // Initialize provider from MetaMask
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

  const signer = provider.getSigner(); // Get the connected signer from MetaMask
  const factoryContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer, { gasLimit: 10000000 });
  return factoryContract;
};


// Function to buy tokens

export const calculateTokenEthValues = async (tokenAddress, amount) => {
  try {
    const factoryContract = await getFactoryContract();
    const formattedAmount = ethers.utils.parseUnits(amount.toString(), 18);

    const payableAmount = await factoryContract.buyQuote(tokenAddress, formattedAmount);
    const fee = await factoryContract.calculateBuyFee(tokenAddress, formattedAmount);
    console.log("payableAmount onchange", payableAmount);
    const ethToPay = ethers.BigNumber.from(payableAmount).add(
      ethers.BigNumber.from(fee)
    );
    console.log("Total ETH to pay Onchange:", ethers.utils.formatEther(ethToPay));
    return ethers.utils.formatEther(ethToPay);
  } catch (error) {
    console.error("Error calculating token ETH values:", error);
    throw error; // Rethrow if needed
  }
};


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

    console.log("Total ETH to pay Onchange:", Number(ethToPay) / 10 ** 18); // Log ETH value in readable format
    return (Number(ethToPay) / 10 ** 18).toString(); // Return as string for consistency
  } catch (error) {
    console.error("Error calculating token ETH values:", error);
    throw error; // Rethrow if needed
  }
};

export const buyTokensOnBlockchain = async (tokenAddress, amount) => {
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

    console.log("Fetching quote and fee...");
    const payableAmount = await factoryContract.buyQuote(tokenAddress, formattedAmount);
    const fee = await factoryContract.calculateBuyFee(tokenAddress, formattedAmount);
    console.log("payableAmount", payableAmount)
    // Add payableAmount and fee
    // const ethToPay = ethers.BigNumber.from(payableAmount).add(
    //   ethers.BigNumber.from(fee)
    // );
    const ethToPay = ethers.BigNumber.from(payableAmount).add(ethers.BigNumber.from(fee));

    console.log("Total ETH to pay:", ethers.utils.formatEther(ethToPay));

    console.log("Wallet Balance (ETH):", ethers.utils.formatEther(walletBalance));
    console.log("ETH Required to Buy Tokens:", ethers.utils.formatEther(ethToPay));

    // if (walletBalance.lt(ethToPay)) {
    if (ethers.utils.formatEther(walletBalance) < ethers.utils.formatEther(ethToPay)) {
      console.error("Insufficient balance to complete the transaction.");
      return { success: false, error: "Insufficient balance." };
      // toast.error("Insufficient balance to complete the transaction.")
    }


    console.log("Executing buy transaction...");
    const tx = await factoryContract.buyTokens(tokenAddress, formattedAmount, {
      value: ethToPay,
    });
    await tx.wait();

    console.log("Buy transaction successful:", tx.hash);
    return { success: true, transactionHash: tx.hash };


  } catch (error) {
    console.error("Error buying tokens on blockchain:", error);
    return { success: false, error: error.message };
  }
};


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
    console.log("Token Balance:", ethers.utils.formatUnits(tokenBalance, decimals));

    if (tokenBalance.lt(formattedAmount)) {
      throw new Error("Insufficient token balance.");
    }

    const factoryContract = await getFactoryContract();

    const currentAllowance = await tokenContract.allowance(
      signer.getAddress(),
      CONTRACT_ADDRESS
    );
    console.log("Current Allowance:", ethers.utils.formatUnits(currentAllowance, decimals));

    if (currentAllowance.lt(formattedAmount)) {
      console.log("Setting new allowance...");
      const approvalTx = await tokenContract.approve(CONTRACT_ADDRESS, formattedAmount);
      await approvalTx.wait();
      // toast.success("Approval successful:", approvalTx.hash);
      console.log("Approval successful:", approvalTx.hash);
    }

    console.log("Executing sell transaction...");
    const tx = await factoryContract.sellTokens(tokenAddress, formattedAmount, {
      gasLimit: ethers.utils.hexlify(200000), // Adjust as needed
    });
    await tx.wait();
    // toast.success("Sell transaction successful:", tx.hash);
    console.log("Sell transaction successful:", tx.hash);

    return { success: true, transactionHash: tx.hash };
  } catch (error) {
    console.error("Error selling tokens on blockchain:", error);
    return { success: false, error: error.message };
  }
};

