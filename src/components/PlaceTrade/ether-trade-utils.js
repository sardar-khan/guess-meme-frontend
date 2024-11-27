import { ethers } from "ethers";
import abi from "../../web3/abi.json";

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
  const factoryContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  return factoryContract;
};

// Function to buy tokens
export const buyTokensOnBlockchain = async (tokenAddress, amount) => {
  try {
    if (!tokenAddress || !ethers.utils.isAddress(tokenAddress)) {
      throw new Error(`Invalid token address: ${tokenAddress}`);
    }

    const factoryContract = await getFactoryContract();

    console.log("Fetching quote and fee...");
    const payableAmount = await factoryContract.buyQuote(tokenAddress, amount);
    const fee = await factoryContract.calculateBuyFee(tokenAddress, amount);

    const ethToPay = ethers.BigNumber.from(payableAmount).add(
      ethers.BigNumber.from(fee)
    );
    console.log("Total ETH to pay:", ethers.utils.formatEther(ethToPay));

    console.log("Executing buy transaction...");
    const tx = await factoryContract.buyTokens(tokenAddress, amount, {
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

// Function to sell tokens
export const sellTokensOnBlockchain = async (tokenAddress, amount) => {
  try {
    const factoryContract = await getFactoryContract();
    const signer = factoryContract.signer; // Retrieve the signer from the contract
    const tokenContract = new ethers.Contract(tokenAddress, abi, signer);

    console.log("Approving tokens for sale...");
    const tokensToSell = ethers.utils.parseUnits(amount.toString(), 18); // Convert amount to token units
    const approvalTx = await tokenContract.approve(
      CONTRACT_ADDRESS,
      tokensToSell
    );
    await approvalTx.wait();
    console.log("Approval transaction successful:", approvalTx.hash);

    console.log("Executing sell transaction...");
    const tx = await factoryContract.sellTokens(tokenAddress, tokensToSell);
    await tx.wait();

    console.log("Sell transaction successful:", tx.hash);
    return { success: true, transactionHash: tx.hash };
  } catch (error) {
    console.error("Error selling tokens on blockchain:", error);
    return { success: false, error: error.message };
  }
};
