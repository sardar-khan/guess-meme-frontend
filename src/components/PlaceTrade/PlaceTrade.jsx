import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ethImg from "../../assets/icons/eth.png";
import solImg from "../../assets/icons/sol.webp";
import { BuyToken } from "../../utils/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { fetchTrades } from "../../features/tradesSlice";
import { buyTokensOnBlockchain, calculateTokenEthValues, sellTokensOnBlockchain } from "./ether-trade-utils";
import { wallet, mintaddy, connection } from "./config";
import { buy, reteriveTokenDetails, sell, TokenPriceCalculations } from "./solanaBuySellFunction";
import { useAppKitAccount } from "@reown/appkit/react";
import { useWallet } from '@solana/wallet-adapter-react'
import { useAppKitProvider } from '@reown/appkit/react';

import LaunchTokenSol from "../LaunchTokenDeduct/LaunchTokenSol";
import LaunchTokenPolygon from "../LaunchTokenDeduct/LaunchPolygonToken";


import { useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import SetSlipPage from "../Modals/SetSlipPage";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";


const blockchainType = localStorage.getItem("blockchain") || "SOL";

// eslint-disable-next-line react/prop-types
const PlaceTrade = ({ coinData }) => {

  console.log("placeTrade COin data", coinData)
  //console.log("placeTrade COin data token_address", coinData?.token_address)

  // const tokenAddress_mint = coinData?.token_address ? new PublicKey(coinData.token_address) : null;
  let tokenAddress_mint = null;

  if (coinData?.token_address && blockchainType === 'SOL') {
    try {
      tokenAddress_mint = new PublicKey(coinData?.token_address);
    } catch (error) {
      console.error("Invalid token address:", coinData?.token_address, error);
      tokenAddress_mint = null;
    }
  } else {
    console.warn("Token address is missing in coinData.");
  }



  const { id } = useParams();
  const dispatch = useDispatch();
  const [isSlipPageOpen, setIsSlipPageOpen] = useState(false);
  const wallet = useWallet()
  const [showSOGs, setShowSOGs] = useState(false);

  // if (blockchainType === "ETH") {
  //   setShowSOGs(true)
  // }

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
  const [tokenToBuy, setTokenToBuy] = useState('')
  const [remaningTokens, setRemaningTokens] = useState('')
  const [solAmount, setSolAmount] = useState('')
  const [ethAmount, setEthAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const { walletProvider } = useAppKitProvider('solana');
  const [tradeType, setTradeType] = useState("buy"); // Default trade type is "buy"
  const { address, isConnected } = useAppKitAccount()
  const { data: balanceData } = useBalance({ address });
  const { data: hash, sendTransaction } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: hash,
  });


  console.log("coinDataPlaceTrade", coinData)
  // console.log("coinDataPlaceTrade data", coinData)

  //console.log("wallet-provider",walletProvider.publicKey);
  const result = useBalance({
    address: address,
  })
  const handleSwitchClick = async () => {

    setShowSOGs(!showSOGs);
    if (!showSOGs) {
      setAmount(tokenToBuy);
    } else {
      setAmount(solAmount);
    }
    // if (showSOGs) {
    //   setTokenToBuy(res?.tokensbuy)
    //   setAmount(val)
    //   console.log("sssssddd", showSOGs)
    // } else {
    //   setTokenToBuy(val)
    //   setAmount(res?.tokensbuy)
    //   console.log("sssssddd", showSOGs)
    // }
  };

  console.log("Wallet-provvv", walletProvider);

  //console.log("tokenToBuy", tokenToBuy)
  // calculate remaining token and maxtoken buy value
  const remaningAndMaxbuyTokens = async (tokenAddress) => {
    if (!walletProvider) {
      // return toast.error("Please connect your wallet");
      console.log("Please connect your wallet");
    }
    if (!tokenAddress) {
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
    if (blockchainType === "ETH") {
      setShowSOGs(false)
    }
  }, [])

  useEffect(() => {
    if (isConfirmed && hash) {

      buyCreatedCoin({ hash }

      )
    }

  }, [isConfirming, isConfirmed, hash])

  //console.log("solAmount",solAmount)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleTrade = async () => {
    setIsButtonDisabled(true);

    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 2000);

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);


    if (isConnected) {
      // if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      //   toast.error("Please enter a valid amount");
      //   return;
      // }
    }
    else {
      toast.error("Connect Wallet First");
      return;
    }

    setIsLoading(true);
    console.log("blockchainType and coinData?.status", blockchainType, 'and', coinData?.status)

    try {

      if (blockchainType === "SOL" && coinData?.status === "deployed" && tradeType === 'buy') {
        console.log("coinData?.status", coinData?.status)
        console.log("token to buy xox", tokenToBuy, solAmount);
        const buySuccess = await buy(walletProvider, tokenToBuy, tokenAddress_mint);
        // toast.success(`Transction Successfull: ${buySuccess}`)

        if (buySuccess) {
          console.log("buySuccess", buySuccess)
          setAmount('')
          setTokenToBuy('')
          setSolAmount('')

          const apiResponse = await BuyToken({
            account_type: 'solana',
            amount: parseFloat(tokenToBuy),
            token_amount: parseFloat(solAmount),
            token_id: id,
            type: tradeType,
            transaction_hash: buySuccess,
          });
          console.log("apiResponse", apiResponse)
          if (apiResponse?.status === 201) {
            toast.success(`Transction Successfull: ${buySuccess}`)
            // toast.success(
            // `${tradeType === "buy" ? "buy" : "sell"} saved successfully`);
            dispatch(fetchTrades(id)); // Fetch updated trades

          } else {
            throw new Error(
              `Failed to record ${tradeType} trade in the backend`
            );
          }


        }
        console.log("Purchase successful");
      }

      else if (blockchainType === "SOL" && coinData?.status === "deployed" && tradeType === 'sell') {

        const sellTrxHash = await sell(walletProvider, amount, tokenAddress_mint);
        console.log("sellTrxHash", sellTrxHash)

        if (sellTrxHash?.success) {
          setAmount('')
          setSolAmount('')
          setTokenToBuy('')
          // toast.success("Successfully Sell")
          const apiResponse = await BuyToken({
            account_type: 'solana',
            amount: parseFloat(amount), // no of tokens to be deducted
            token_amount: parseFloat(solAmount).toFixed(10), // amount of sol to be received 
            token_id: id,
            type: tradeType,
            transaction_hash: sellTrxHash?.data,
          });
          console.log("apiResponse", apiResponse)
          if (apiResponse?.status === 201) {
            toast.success(`Transction Successfull: ${sellTrxHash?.data}`)
            // toast.success(`Transction Successfull: ${SellSuccess?.data?.recentBlockhash}`)
            // toast.success(
            // `${tradeType === "buy" ? "buy" : "sell"} saved successfully`);
            dispatch(fetchTrades(id)); // Fetch updated trades

          } else {
            throw new Error(
              `Failed to record ${tradeType} trade in the backend`
            );
          }
        } else {
          toast.error(`${sellTrxHash?.error}`)
        }

      }

      else if (blockchainType === "SOL" && coinData?.status === 'created' && tradeType === 'buy') {

        let deductSOL = await handleLaunchToken(amount);

        if (deductSOL) {
          const apiResponse = await BuyToken({
            account_type: 'solana',
            amount: parseFloat(amount),
            token_amount: 0,
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

      else if (blockchainType === "ETH" || blockchainType === "POL" || blockchainType === "BNB" && coinData?.status === 'deployed') {
        console.log("ETH and deployed")
        const tokenAddress = coinData?.token_address;
        console.log("tokenAddress", tokenAddress)
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

        console.log("response sellTokensOnBlockchain", response)

        if (response?.success) {
          setAmount('')
          // toast.success(
          //   `${tradeType === "buy" ? "buy" : "Sell"} transaction successful`
          // );

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

          if (apiResponse?.status === 201) {
            toast.success(
              `${tradeType === "buy" ? "Buy" : "Sell"} Transaction successful`
              // `${tradeType === "buy" ? "buy" : "sell"} saved successfully`

            );
            dispatch(fetchTrades(id)); // Fetch updated trades
          } else {
            throw new Error(
              `Failed to record ${tradeType} trade in the backend`
            );
          }
        }
        else {
          throw new Error(
            response?.error || `Failed to ${tradeType} tokens on blockchain`
          );
        }
      }

      else if (blockchainType === "ETH" || blockchainType === "POL" || blockchainType === "BNB" && coinData?.status === 'created' && tradeType === 'buy') {
        console.log("ETH ****** created ****** buy")
        let deductETH = await handleLaunchTokenE();
        setAmount('')
        console.log("deductETH", deductETH)
        if (deductETH) {
          setAmount('')
          const apiResponse = await BuyToken({
            account_type: 'ethereum',
            amount: parseFloat(amount),
            token_amount: 1,
            token_id: id,
            type: tradeType,
            transaction_hash: deductETH,
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
        }

      }


      // else if (blockchainType === "ETH" && coinData?.status === 'deployed' && tradeType === 'sell') {
      //   console.log("ETH ****** deployed ****** sell")
      //   let sellEthtokens = await sellTokensOnBlockchain(tokenAddress, amount);
      //   // setAmount('')
      //   console.log("sellEthtokens", sellEthtokens)

      // }

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


  //calculate token values for buy
  const handleAmount = async (val) => {
    // setAmount(val)
    const res = await TokenPriceCalculations(
      coinData?.token_address,
      val === '' ? 0 : val, !showSOGs
    )
    console.log("result", res, !showSOGs)

    // console.log("valss",val, tokenCal?.data?.tokenPer1Sol,maxBuyTokens)
    //   console.log('called', val * tokenCal?.data?.tokenPer1Sol,userBalance)
    //                 //3 * 500000 = 150000                   1000000

    if (!showSOGs) {
      console.log("max buy check", res?.tokensbuy > maxBuyTokens, res?.tokensbuy, maxBuyTokens)
      if (res?.tokensbuy > maxBuyTokens) {

        return setAmountError((prevState) => ({
          ...prevState,
          error: true,
          reason: 'max buy exceeded',
        }))
        //toast.error("macbut exceeded")
      }
      console.log("Max token reserved check", res?.tokensbuy > remaningTokens, res?.tokensbuy, remaningTokens)
      if (           //3 * 500000 = 150000                   100000
        res?.tokensbuy > remaningTokens
      ) {
        return setAmountError((prevState) => ({
          ...prevState,
          error: true,
          reason: 'Max token reserved reached',
        }))

      }
      console.log("user-balanceddd", userBalance?.solBalance, val, val < userBalance?.solBalance)
      // 1 sol > 4 
      // 12348 >4 
      // res // 0.003 >3
      console.log("sol_state1", val < userBalance?.solBalance, val, userBalance?.solBalance)
      if (val < userBalance?.solBalance) {
        setSolAmount(val)
        setAmount(val)

        setTokenToBuy(res?.tokensbuy)
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
    else {
      console.log("max try")

      // setAmount(res?.tokensbuy)
      if (val > maxBuyTokens) {

        return setAmountError((prevState) => ({
          ...prevState,
          error: true,
          reason: 'max buy exceeded',
        }))
        //toast.error("macbut exceeded")
      }
      console.log("Max token reserved check", res?.tokensbuy > remaningTokens, res?.tokensbuy, remaningTokens)
      if (           //3 * 500000 = 150000                   100000
        val > remaningTokens
      ) {
        return setAmountError((prevState) => ({
          ...prevState,
          error: true,
          reason: 'Max token reserved reached',
        }))

      }
      console.log("user-balanceddd", userBalance?.solBalance, val, val < userBalance?.solBalance)
      // 1 sol > 4 
      // 12348 >4 
      // res // 0.003 >3
      console.log("sol_state", res?.tokensbuy < userBalance?.solBalance, res?.tokensbuy, userBalance?.solBalance)
      if (res?.tokensbuy < userBalance?.solBalance) {
        setSolAmount(res?.tokensbuy)
        setAmount(val)

        setTokenToBuy(val)
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


  }

  const calculateTokenEthOnchange = async (amount) => {
    if (isConnected) {
      setAmountError((prevState) => ({
        ...prevState,
        error: false,
        reason: '',
      }))
      setAmount(amount);
      try {
        const calculateEthValue = await calculateTokenEthValues(coinData?.token_address, amount);
        console.log("calculateEthValue", calculateEthValue);
        setEthAmount(calculateEthValue)
      } catch (error) {
        console.error("Error calculating ETH value:", error);
      }
    } else {
      setAmountError((prevState) => ({
        ...prevState,
        error: true,
        reason: 'Connect Wallet First',
      }))

    }
  };

  //console.log("amount error",amountError)
  const handleAmountSell = async (val) => {
    // setAmount(val)
    const res = await TokenPriceCalculations(
      coinData?.token_address,
      val === '' ? 0 : val, false
    )
    console.log("result", res, false)

    // 1 sol > 4 
    // 12348 >4 
    // res // 0.003 >3
    if (val <= userBalance?.tokenBalance) {
      setSolAmount(res?.tokensell)
      setAmount(val)

      setTokenToBuy(val)
      setAmountError((prevState) => ({
        ...prevState,
        error: false,
        reason: '',
      }))
    } else {

      setAmountError((prevState) => ({
        ...prevState,
        error: true,
        reason: `you don't have enough tokens`,
      }))
    }



  }

  //get user sol and token balance 
  const getUserBalances = async () => {
    try {
      if (!coinData?.token_address) { return }
      console.log("wallet-provider-in-blnc", walletProvider)
      console.log("Connnection", connection);
      //user-sol-balance
      const balance = await connection.getBalance(walletProvider.publicKey)

      //user-selected-token-balance
      const tokenMintAddress = new PublicKey(coinData?.token_address)

      const tokenAccounts =
        await connection.getParsedTokenAccountsByOwner(walletProvider.publicKey, {
          mint: tokenMintAddress,
        })
      console.log('tokens about to cook', tokenAccounts)
      let tokenBalance
      if (tokenAccounts?.value?.length > 0) {
        tokenBalance =
          tokenAccounts?.value[0]?.account?.data?.parsed?.info
            ?.tokenAmount.uiAmount
        //console.log('user-token-balance', balance)
      } else {
        // if (amount !== '') {
        //   setAmountError((prevState) => ({
        //     ...prevState,
        //     error: true,
        //     reason: `you don't have enough sol`,
        //   }))
        // }
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
  console.log("userBalance", userBalance)


  useEffect(() => {
    if (!amount) return;

    const interval = setInterval(async () => {
      try {
        const calculateEthValue = await calculateTokenEthValues(coinData?.token_address, amount);
        console.log("Polling calculateEthValue:", calculateEthValue);
        setEthAmount(calculateEthValue);
      } catch (error) {
        console.error("Error during polling:", error);
      }
    }, 5000); // Call every 5 seconds

    return () => clearInterval(interval);
  }, [amount, coinData?.token_address]);

  useEffect(() => {
    if (coinData?.token_address && walletProvider) {
      getUserBalances()
      remaningAndMaxbuyTokens(coinData?.token_address)
    }
  }, [amount, coinData, wallet, tokenToBuy, walletProvider, ethAmount])


  // buy sell calculations from the blockcahin-solana
  // useEffect(() => {
  //   if (!coinData?.token_address) return
  //   setTokenCal((prevState) => ({
  //     ...prevState,
  //     loading: true,
  // }))
  //   // Function to fetch token information
  //   const fetchTokenInformation = async () => {
  //     console.log("amountsss",amount)
  //       try {
  //           //  console.log("amount from feild",amount)
  //           const res = await TokenPriceCalculations(
  //             coinData?.token_address,
  //               amount === '' ? 0 : amount,
  //           )
  //           console.log('res-for-token-calculations', res)
  //           setTokenCal((prevState) => ({
  //               ...prevState,
  //               loading: false,
  //               data: res,
  //               success: true,
  //           }))
  //       } catch (error) {
  //           console.log('Error while calculating', error)
  //           setTokenCal((prevState) => ({
  //               ...prevState,
  //               loading: false,
  //               data: null,
  //               success: false,
  //           }))
  //       }
  //   }

  //   // Fetch token information initially
  //   fetchTokenInformation(coinData?.token_address)

  //   // Set up an interval to fetch token information every 5 seconds
  //   const intervalId = setInterval(fetchTokenInformation, 5000)

  //   // Clear the interval when the component unmounts or when `id` changes
  //   return () => clearInterval(intervalId)
  // }, [ amount, coinData?.token_address])



  console.log("amountamount", amount, "tokenToBuytokenToBuy", tokenToBuy)

  const handleBuyPercentage = (percentage) => {
    if(blockchainType === 'SOL'){
      const perctageSet = userBalance?.tokenBalance * (percentage / 100);
      setAmount(perctageSet);
      handleAmountSell(perctageSet)
  
      console.log("perctageSet", perctageSet, userBalance?.tokenBalance)
    }else{
      const perctageSet = userBalance?.solBalance * (percentage / 100);
      setAmount(perctageSet);
      handleAmount(perctageSet)
  
      console.log("perctageSet", perctageSet, userBalance?.solBalance)
    }
   
  }

  const handleSell = async () => {

    try {
      const res = await sellTokensOnBlockchain(tokenAddress, 1);
      // setResponse(res);
      console.log("Sell response:", res);
    } catch (error) {
      console.error("Error during sell transaction:", error);
      alert("Failed to sell tokens. Check console for more details.");
    } finally {
    }
  };


  // console.log("tokenToBuytokenToBuy", tokenToBuy)
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
                      onClick={() => { setTradeType("buy"); setAmount(''); setSolAmount('') }}
                    >
                      Buy
                    </button>
                    {coinData?.status != "created" && <button
                      className={`text-[16px] SegoeUi font-semibold text-center w-full px-3 py-2 rounded ${tradeType === "sell"
                        ? "bg-[#F87171] text-white"
                        : "bg-[#1F2937] text-[gray]"
                        }`}
                      onClick={() => { setTradeType("sell"); setShowSOGs(true); setAmount(''); setSolAmount('') }}
                    >
                      Sell
                    </button>}

                  </div>

                  <div className="flex justify-between gap-3 px-3 pt-[35px]">
                    {tradeType === 'buy' && blockchainType !== 'ETH' ?
                      <span
                        className="SegoeUi bg-[#4E496E] px-2 py-1 rounded text-xs text-[#9CA3AF] font-semibold cursor-pointer"
                        onClick={coinData?.status === "deployed" && handleSwitchClick}
                      >
                        {showSOGs ? `Switch to ${blockchainType}` : `Switch to ${coinData?.name}`}
                      </span>
                      :
                      <span></span>
                    }

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
                    {/* {!showSOGs && */}
                    <div className="w-full Inter">

                      {tradeType === 'buy' ?
                        <div className={`
                          // ? 'border border-red-500'
                          'border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'
                           w-full `}>
                          <div className="flex w-full justify-between border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]">
                            <input
                              type="number"
                              name="amount"
                              value={amount}
                              //  value={solAmount : }
                              onChange={(e) => {
                                const value = e.target.value;
                                if (blockchainType === 'SOL') {
                                  if (!value || Number(value) >= 0) {
                                    coinData?.status === "created" ? setAmount(value) : handleAmount(value);
                                  }
                                } else {
                                  // setAmount(value);
                                  coinData?.status === "created" ? setAmount(value) : calculateTokenEthOnchange(value);
                                }
                              }}

                              className="w-full px-2 py-3 pr-4"
                            />

                            <div className="w-fit flex items-center gap-1 bg-white">
                              <span className="whitespace-nowrap text-black font-semibold text-sm SegoeUi">
                                {!showSOGs && blockchainType !== 'ETH' ? blockchainType : coinData?.name}
                                {/* {blockchainType === "ETH" ? "ETH" : "SOL"} */}
                              </span>
                              {blockchainType === 'ETH' &&
                                <img
                                  src={
                                    showSOGs && `${import.meta.env.VITE_API_URL.slice(0, -1)}${coinData?.image}`
                                  }
                                  className="w-[30px] mr-7 rounded-full"
                                />
                              }
                              {blockchainType === 'SOL' &&
                                <img
                                  src={
                                    showSOGs
                                      ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${coinData?.image}`
                                      : (blockchainType === 'SOL' ? solImg : ethImg)
                                  }
                                  className="w-[30px] mr-7 rounded-full"
                                />
                              }
                            </div>
                          </div>


                        </div>
                        :
                        <div className={`
                          'border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'
                           w-full `}>
                          <div className="flex w-full justify-between border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]">
                            <input
                              type="number"
                              name="amount"
                              value={amount}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (!value || Number(value) >= 0) {
                                  // setAmount(value);
                                  calculateTokenEthOnchange(value);
                                  // handleAmountSell(value)
                                }
                              }}
                              className="w-full px-2 py-3 pr-4"
                            />

                            <div className="w-fit flex items-center gap-1 bg-white">
                              <span className="whitespace-nowrap text-black font-semibold text-sm SegoeUi">
                                {coinData?.name}
                              </span>
                              <img
                                src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${coinData?.image}`}
                                className="w-[30px] mr-7 rounded-full"
                              />
                            </div>
                          </div>

                        </div>
                      }
                    </div>
                    {/* } */}
                  </div>
                </div>

                {!showSOGs && tradeType === 'buy' &&
                  <div className='flex justify-start items-center gap-[3px] mt-3 ml-3'>
                    <span onClick={() => { setAmount(''); handleAmount('') }} className='Inter whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                      reset
                    </span>
                    <span onClick={() => { setAmount(0.1); handleAmount(0.1) }} className='Inter whitespace-nowrap px-1 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                      0.1 {blockchainType}
                    </span>
                    <span onClick={() => { setAmount(0.5); handleAmount(0.5) }} className='Inter whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                      0.5 {blockchainType}
                    </span>
                    <span onClick={() => { setAmount(1); handleAmount(1) }} className='Inter whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                      1 {blockchainType}
                    </span>
                  </div>
                }
                {tradeType === 'sell' &&
                  <div className='flex justify-start items-center gap-[3px] mt-3 ml-3'>
                    <span onClick={() => { setAmount(''); handleBuyPercentage('') }} className='Inter whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                      reset
                    </span>
                    <span onClick={() => { handleBuyPercentage(25) }} className='Inter whitespace-nowrap px-1 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                      25 %
                    </span>
                    <span onClick={() => { handleBuyPercentage(50) }} className='Inter whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                      50 %
                    </span>
                    <span onClick={() => { handleBuyPercentage(75) }} className='Inter whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                      75 %
                    </span>
                    <span onClick={() => { handleBuyPercentage(100) }} className='Inter whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                      100 %
                    </span>
                  </div>
                }

                {amount != '' && tokenToBuy != '' && tokenToBuy != '0' && tokenToBuy != 0 && blockchainType == "SOL" && <p p className="mt-2 ml-3">{!showSOGs ? tokenToBuy : solAmount} {showSOGs ? blockchainType : coinData?.name}</p>}
                {amount != '' && <p p className="mt-2 ml-3">{ethAmount} {blockchainType}</p>}

                {amountError.error && <p className="text-red-700 mt-2 ml-3">{amountError.reason}</p>}

                <button
                  className="themeBtn Inter w-fit mt-5 mx-auto"
                  onClick={handleTrade}
                  disabled={isLoading || amountError.error || isButtonDisabled}
                >
                  <span>{isLoading ? "Processing..." : "Trade"}</span>
                </button>
                {/* <button
                  className="themeBtn Inter w-fit mt-5 mx-auto"
                  onClick={handleSell}
                >
                  <span>Sell</span>
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default PlaceTrade;

