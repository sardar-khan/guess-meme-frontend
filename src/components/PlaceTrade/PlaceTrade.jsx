import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ethImg from "../../assets/icons/eth.png";
import solImg from "../../assets/icons/sol.webp";
import { BuyToken } from "../../utils/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { fetchTrades } from "../../features/tradesSlice";
import { buyTokensOnBlockchain, sellTokensOnBlockchain } from "./ether-trade-utils";
import { wallet, mintaddy, connection } from "./config";
import { buy, reteriveTokenDetails, TokenPriceCalculations } from "./solanaBuySellFunction";
import { useAppKitAccount } from "@reown/appkit/react";
import { useWallet } from '@solana/wallet-adapter-react'
import { useAppKitProvider } from '@reown/appkit/react';

import LaunchTokenSol from "../LaunchTokenDeduct/LaunchTokenSol";
import LaunchTokenPolygon from "../LaunchTokenDeduct/LaunchPolygonToken";


import { useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import SetSlipPage from "../Modals/SetSlipPage";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";



// eslint-disable-next-line react/prop-types
const PlaceTrade = ({ coinData }) => {

  const tokenAddress_mint = coinData?.token_address ? new PublicKey(coinData.token_address) : null;


  const { id } = useParams();
  const dispatch = useDispatch();
  const [isSlipPageOpen, setIsSlipPageOpen] = useState(false);
  const wallet = useWallet()
  const [showSOGs, setShowSOGs] = useState(false);
  const [amount, setAmount] = useState("");
  const [userBalance, setUserBalance] = useState({
    tokenBalance: null,
    solBalance: null,
})
  const [tokenCal, setTokenCal] = useState({
    data: null,
    loading: false,
    success: false,
})
 const [tokenInfo, setTokenInfo] = useState({
        loading: false,
        success: false,
        data: null,
    })
  const [amountError, setAmountError] = useState({
    error: false,
    reason: '',
})
  const [maxBuyTokens, setMaxBuyTokens] = useState('')
  const [remaningTokens, setRemaningTokens] = useState('')
  const [solAmount, setSolAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const { walletProvider } = useAppKitProvider('solana');
  const [tradeType, setTradeType] = useState("buy"); // Default trade type is "buy"
  const { address, isConnected } = useAppKitAccount()
  const { data: balanceData } = useBalance({ address });
  const { data: hash, sendTransaction } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: hash,
  });

 const blockchainType = localStorage.getItem("blockchain") || "SOL";

  console.log("coinDataPlaceTrade", coinData?.token_address)
  console.log("coinDataPlaceTrade data", coinData)

  console.log("wallet-provider",walletProvider.publicKey);

  const result = useBalance({
    address: address,
  })
  const handleSwitchClick = () => {
    setShowSOGs(!showSOGs);
  };

  useEffect(() => {
    if(coinData?.token_address ){
      remaningAndMaxbuyTokens(coinData?.token_address)
    }
    

  }, [amount,coinData,wallet])

  const remaningAndMaxbuyTokens = async ( tokenAddress) => {
    if(!walletProvider){
      return toast.error("Please connect your wallet");
    }
    if(!tokenAddress){
      return toast.error("Token address not found!")
    }
    try {
      const res = await reteriveTokenDetails(walletProvider, tokenAddress);
      console.log("result from the tokens", res);


      const maxBuyPercentage = 100
      const percentage = (res?.totalTokens * maxBuyPercentage) / 100;
      
      console.log("percentage", percentage);
      setMaxBuyTokens(percentage)
      setRemaningTokens(res?.remainingTokens)

    } catch (error) {
      console.log("error while fetching token details", error)

    }
  }

  const handleLaunchToken = LaunchTokenSol()

  const handleLaunchTokenE = LaunchTokenPolygon(
    address,
    sendTransaction,
    balanceData?.formatted,
    amount
  );

  useEffect(() => {
    if (isConfirmed && hash) {

      buyCreatedCoin({ hash }

      )
    }

  }, [isConfirming, isConfirmed, hash])

  console.log("solAmount",solAmount)

  const handleTrade = async () => {
    if (isConnected) {
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
    }
    else {
      toast.error("Connect Wallet First");
      return;
    }

    setIsLoading(true);
    console.log("blockchainType and coinData?.status", blockchainType, 'and', coinData?.status)

    try {

      if (blockchainType === "SOL" && coinData?.status === "deployed") {
        console.log("coinData?.status", coinData?.status)

        const buySuccess = await buy(walletProvider, amount, tokenAddress_mint);
        // toast.success(`Transction Successfull: ${buySuccess}`)

        if (buySuccess) {
          toast.success(`Transction Successfull: ${buySuccess}`)
        }

        // if (buySuccess) {
        //   setAmount('')

        //   const apiResponse = await BuyToken({
        //     account_type: 'solana',
        //     amount: parseFloat(amount),
        //     token_amount: 1,
        //     token_id: id,
        //     type: tradeType,
        //     transaction_hash: buySuccess,
        //   });

        //   if (apiResponse?.status === 200) {
        //     toast.success(`Transction Successfull: ${buySuccess}`)
        //     // toast.success(
        //     // `${tradeType === "buy" ? "buy" : "sell"} saved successfully`);
        //     dispatch(fetchTrades(id)); // Fetch updated trades

        //   } else {
        //     throw new Error(
        //       `Failed to record ${tradeType} trade in the backend`
        //     );
        //   }


        // }
        console.log("Purchase successful");
      }

      else if (blockchainType === "SOL" && coinData?.status === 'created') {

        let deductSOL = await handleLaunchToken(amount);

        if (deductSOL) {
          const apiResponse = await BuyToken({
            account_type: 'solana',
            amount: parseFloat(amount),
            token_amount: 1,
            token_id: id,
            type: tradeType,
          });

          if (apiResponse?.status === 200) {
            toast.success(`${tradeType === "buy" ? "buy" : "sell"} successful`);
            setAmount('')
            dispatch(fetchTrades(id));
          } else {
            throw new Error(`Failed to ${tradeType} tokens`);
          }
        } else {
          toast.error('Transaction failed. Please try again now.');
        }


      }

      else if (blockchainType === "ETH" && coinData?.status === 'deployed') {

        const tokenAddress = coinData?.token_address;
        // const tokenAddress = coinData?.token_address;

        if (!tokenAddress) {
          throw new Error("Token address is not available");
        }

        let response;

        if (tradeType === "buy") {
          response = await buyTokensOnBlockchain(tokenAddress, amount);
          console.log("response buyTokensOnBlockchain", response)
        }
        else if (tradeType === "sell") {
          response = await sellTokensOnBlockchain(tokenAddress, amount);
        }
        console.log("response buyTokensOnBlockchain", response)
        if (response?.success) {
          toast.success(
            `${tradeType === "buy" ? "buy" : "sell"} transaction successful`
          );

          // Update backend after successful blockchain transaction
          const type = blockchainType.toLowerCase() === 'eth' ? 'ethereum' : ''

          const apiResponse = await BuyToken({
            account_type: type,
            amount: parseFloat(amount),
            token_amount: 1,
            token_id: id,
            type: tradeType,
            transaction_hash: response?.transactionHash
          });

          if (apiResponse?.status === 200) {
            toast.success(
              `${tradeType === "buy" ? "buy" : "sell"} saved successfully`
            );
            dispatch(fetchTrades(id)); // Fetch updated trades
          } else {
            throw new Error(
              `Failed to record ${tradeType} trade in the backend`
            );
          }
        } else {
          throw new Error(
            response?.error || `Failed to ${tradeType} tokens on blockchain`
          );
        }
      }

      else if (blockchainType === "ETH" && coinData?.status === 'created') {

        let deductETH = await handleLaunchTokenE();
        console.log("deductETH", deductETH)
        if (deductETH) {
          setAmount('')
          //   const apiResponse = await BuyToken({
          //     account_type: 'ethereum',
          //     amount: parseFloat(amount),
          //     token_amount: 1,
          //     token_id: id,
          //     type: tradeType,
          //     transaction_hash: deductETH,
          //   });

          //   if (apiResponse?.status === 200) {
          //     toast.success(
          //       `${tradeType === "buy" ? "buy" : "sell"} saved successfully`
          //     );
          //     dispatch(fetchTrades(id)); // Fetch updated trades
          //   } else {
          //     throw new Error(
          //       `Failed to record ${tradeType} trade in the backend`
          //     );
          //   }
        }

      }


      else {
        // Non-ETH blockchain logic
        // const apiResponse = await BuyToken({
        //   account_type: blockchainType.toLowerCase(),
        //   amount: parseFloat(amount),
        //   token_amount: 1,
        //   token_id: id,
        //   type: tradeType,
        // });

        // if (apiResponse?.status === 201) {
        //   toast.success(`${tradeType === "buy" ? "buy" : "sell"} successful`);
        //   dispatch(fetchTrades(id));
        // } else {
        //   throw new Error(`Failed to ${tradeType} tokens`);
        // }
      }


    } catch (error) {
      toast.error(error.message || `Error placing ${tradeType} trade`);
      console.error(`Error during ${tradeType}:`, error);
    } finally {
      setIsLoading(false);
    }
  };


  const buyCreatedCoin = async ({ hash }) => {
    try {
      const type = blockchainType.toLowerCase() === 'eth' ? 'ethereum' : ''

      if (hash) {
        const apiResponse = await BuyToken({
          account_type: type,
          amount: parseFloat(amount),
          token_amount: 1,
          token_id: id,
          type: tradeType,
          transaction_hash: hash,
        });

        if (apiResponse?.status === 200) {
          toast.success(`${tradeType === "buy" ? "buy" : "sell"} successful`);
          dispatch(fetchTrades(id));
        } else {
          throw new Error(`Failed to ${tradeType} tokens`);
        }
      } else {
        toast.error('Transaction failed. Please try again now.');
      }

    } catch (error) {

    }
  }
  
  const handleAmount = async (val) => {
    await getUserBalances()
    console.log("valss",val, tokenCal?.data?.tokenPer1Sol,maxBuyTokens)
      console.log('called', val * tokenCal?.data?.tokenPer1Sol,userBalance)
    if (parseFloat(val * tokenCal?.data?.tokenPer1Sol) > maxBuyTokens) {

        return setAmountError((prevState) => ({
            ...prevState,
            error: true,
            reason: 'max buy exceeded',
        }))
        toast.error("macbut exceeded")
    }
    if (
        parseFloat(val * tokenCal?.data?.tokenPer1Sol) > remaningTokens
    ) {
        return setAmountError((prevState) => ({
            ...prevState,
            error: true,
            reason: 'Max token reserved reached',
        }))
        toast.error("macbut exceeded")
    }
    if (val < userBalance?.solBalance) {
        setSolAmount(val)
        setAmount(val * tokenCal?.data?.tokenPer1Sol)
        setTokenToBuy(val * tokenCal?.data?.tokenPer1Sol)
        setAmountError((prevState) => ({
            ...prevState,
            error: false,
            reason: '',
        }))
    } else {
        setAmountError((prevState) => ({
            ...prevState,
            error: true,
            reason: `you don't have enough sol`,
        }))
    }
}

const getUserBalances = async () => {
  try {
    if(!coinData?.token_address){return toast.error("echipoya")}
     

      //user-sol-balance
      const balance = await connection.getBalance(walletProvider.publicKey)

      //user-selected-token-balance
      const tokenMintAddress = new PublicKey(coinData?.token_address)

      const tokenAccounts =
          await connection.getParsedTokenAccountsByOwner(walletProvider.publicKey, {
              mint: tokenMintAddress,
          })
       console.log('tokens', tokenAccounts)
      let tokenBalance
      if (tokenAccounts?.value?.length > 0) {
          tokenBalance =
              tokenAccounts?.value[0]?.account?.data?.parsed?.info
                  ?.tokenAmount.uiAmount
          //console.log('user-token-balance', balance)
      } else {
          if (amount !== '') {
              setAmountError((prevState) => ({
                  ...prevState,
                  error: true,
                  reason: `you don't have enough sol`,
              }))
          }
      }
      //console.log("roken-bal-bal",tokenBalance)
      setUserBalance((prevState) => ({
          ...prevState,
          solBalance: balance / LAMPORTS_PER_SOL,
          tokenBalance: tokenBalance === undefined ? 0 : tokenBalance,
      }))
  } catch (error) {
      console.log('error while fetching user balance', error)
  }
}




useEffect(() => {
  if (!coinData?.token_address) return
  setTokenCal((prevState) => ({
    ...prevState,
    loading: true,
}))
  // Function to fetch token information
  const fetchTokenInformation = async () => {
      try {
          //  console.log("amount from feild",amount)
          const res = await TokenPriceCalculations(
            coinData?.token_address,
              amount === '' ? 0 : amount,
          )
          console.log('res-for-token-calculations', res)
          setTokenCal((prevState) => ({
              ...prevState,
              loading: false,
              data: res,
              success: true,
          }))
      } catch (error) {
          console.log('Error while calculating', error)
          setTokenCal((prevState) => ({
              ...prevState,
              loading: false,
              data: null,
              success: false,
          }))
      }
  }
  
  // Fetch token information initially
  fetchTokenInformation(coinData?.token_address)

  // Set up an interval to fetch token information every 5 seconds
  const intervalId = setInterval(fetchTokenInformation, 5000)

  // Clear the interval when the component unmounts or when `id` changes
  return () => clearInterval(intervalId)
}, [ amount, coinData?.token_address])




  return (
    <div className="border flex justify-center items-center w-full ">
      <div className="relative w-full border-t-[1px] border-t-[#fff] border-l-[5px] border-l-[#fff] border-r-[2px] border-r-[#353535] border-b-[2px] border-b-[#353535]">
        <div className="absolute top-0 left-0 h-[5px] w-full bg-white"></div>
        <div className="secondary-bg p-[14px]">
          <div className="h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]">
            <div className="h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]">
              <div className="w-full flex flex-col pb-4 pt-2">
                <div className="rounded">
                  <div className="flex gap-1 px-3">
                    <button
                      className={`text-[16px] SegoeUi font-semibold text-center w-full px-3 py-2 rounded ${tradeType === "buy"
                        ? "bg-[#4ADE80] text-[#202020]"
                        : "bg-[#1F2937] text-[gray]"
                        }`}
                      onClick={() => setTradeType("buy")}
                    >
                      Buy
                    </button>
                    <button
                      className={`text-[16px] SegoeUi font-semibold text-center w-full px-3 py-2 rounded ${tradeType === "sell"
                        ? "bg-[#F87171] text-white"
                        : "bg-[#1F2937] text-[gray]"
                        }`}
                      onClick={() => setTradeType("sell")}
                    >
                      Sell
                    </button>

                  </div>

                  <div className="flex justify-between gap-3 px-3 pt-[35px]">
                    <span
                      className="SegoeUi bg-[#4E496E] px-2 py-1 rounded text-xs text-[#9CA3AF] font-semibold cursor-pointer"
                      onClick={handleSwitchClick}
                    >
                      {showSOGs ? "Switch to ETH" : "Switch to SOL"}
                    </span>
                    <div>
                      <span
                        className="SegoeUi bg-[#4E496E] px-2 py-1 rounded text-xs text-[#9CA3AF] font-semibold cursor-pointer"
                        onClick={() => setIsSlipPageOpen(true)}
                      >
                        Set max slippage
                      </span>

                      {/* SetSlipPage Modal */}
                      <SetSlipPage
                        isOpen={isSlipPageOpen}
                        onClose={() => setIsSlipPageOpen(false)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between gap-3 px-3 pt-[15px]">
                    {!showSOGs && (
                      <div className="w-full Inter">
                        <div className="w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]">
                          <div className="flex w-full justify-between border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]">
                            <input
                              type="number"
                              name="amount"
                              value={solAmount}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (!value || Number(value) >= 0) {
                                 // setAmount(value);
                                  handleAmount(value)
                                }
                              }}
                              className="w-full px-2 py-3 pr-4"
                            />
                            <div className="w-fit flex items-center gap-1 bg-white">
                              <span className="whitespace-nowrap text-black font-semibold text-sm SegoeUi">
                                {coinData?.name}
                                {/* {blockchainType === "ETH" ? "ETH" : "SOL"} */}
                              </span>
                              <img
                                // src={blockchainType === "ETH" ? ethImg : solImg}
                                src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${coinData?.image}`}
                                className="w-[30px] mr-7 rounded-full"
                              // alt={blockchainType === "ETH" ? "ETH" : "SOL"}
                              />
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className="themeBtn Inter w-fit mt-5 mx-auto"
                  onClick={handleTrade}
                  disabled={isLoading}
                >
                  <span>{isLoading ? "Processing..." : "Trade"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceTrade;

