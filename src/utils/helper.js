import axios from "axios";
import { apiInstance } from "./backend/axiosConfig";

export const selectedName = (blockchainType, isSoltoToken, tokenName) => {
  if (blockchainType === "ETH") {
    return isSoltoToken ? "ETH" : tokenName;
  } else {
    return isSoltoToken ? "SOL" : tokenName;
  }
}

export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) {
    return "Invalid input";
  }

  const absNum = Math.abs(num);
  let formatted;

  if (absNum >= 1e9) {
    formatted = (num / 1e9).toFixed(1) + "B"; // Billions
  } else if (absNum >= 1e6) {
    formatted = (num / 1e6).toFixed(1) + "M"; // Millions
  } else if (absNum >= 1e3) {
    formatted = (num / 1e3).toFixed(1) + "K"; // Thousands
  } else {
    formatted = num.toString(); // Less than 1K
  }

  return formatted;
}


export const fetchUsdPrice = async () => {
  try {

    const response = await apiInstance.get('trade/get-sol-price-in-usd');
    const solPrice = response.data.data.solPrice;

    return { solPrice: solPrice };
  } catch (error) {
    // setError('Error fetching price data');
    console.error('Error fetching price:', error);
  }
};

//need to make this call centralized
export const fetchUsdPriceEth = async () => {
  try {

    const response = await apiInstance.get('trade/get-eth-price-in-usd');
    const ethPrice = response?.data?.data?.ethPrice;
console.log("eth-price-from-backend",ethPrice)
    return { ethPrice: ethPrice };
  } catch (error) {
    // setError('Error fetching price data');
    console.error('Error fetching price:', error);
  }
};


