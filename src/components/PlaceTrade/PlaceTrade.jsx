import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ethImg from "../../assets/icons/eth.png";
import solImg from "../../assets/icons/sol.webp";
import { BuyToken } from "../../utils/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { fetchTrades } from "../../features/tradesSlice";
import { buyTokensOnBlockchain, calculateEthTokenValue, calculateTokenEthValues, evmTokenInfo, getPayAbleEtherAmount, getReturnedEthAmountonSell, sellTokensInfo, sellTokensOnBlockchain } from "./ether-trade-utils";
import { useAppKitAccount } from "@reown/appkit/react";
import { useWallet } from '@solana/wallet-adapter-react';
import { useWriteContract } from 'wagmi'
import WalletContext from '../../context/WalletContext';
import { useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import SetSlipPage from "../Modals/SetSlipPage";
import { GetContractConfiguration } from "../../web3/EvmConfig";
import { ethers } from "ethers";


const blockchainType = localStorage.getItem("blockchain") || "SOL";

// eslint-disable-next-line react/prop-types
const PlaceTrade = ({ coinData }) => {


  let tokenAddress_mint = coinData?.token_address
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isSlipPageOpen, setIsSlipPageOpen] = useState(false);
  const wallet = useWallet()
  const [showSOGs, setShowSOGs] = useState(false);
  const [amount, setAmount] = useState("");

  const [tokenInfo, setTokenInfo] = useState({
    loading: false,
    success: false,
    data: null,
  })
  const [amountError, setAmountError] = useState({
    error: false,
    reason: '',
  })
  const [tokenToBuy, setTokenToBuy] = useState('')
  const [solAmount, setSolAmount] = useState('')
  const [ethAmount, setEthAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [tradeType, setTradeType] = useState("buy"); // Default trade type is "buy"
  const { address, isConnected } = useAppKitAccount()
  const { data: balanceData } = useBalance({ address });
  const [contractInfo, setContractInfo] = useState('')
  const [toastId, setToastId] = useState(null)
  const { block_chain } = useContext(WalletContext);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const currentChain = block_chain === "BNB" ? "bsc" : "sepolia"


  //buy-tokens-blockchain-calls
  const { data: buyTxHash, writeContract: useBuyTokens, error: errorInBuy, reset: resetBuyEvent } = useWriteContract()
  const { isLoading: isBuying, isSuccess: isBuyed, data: txData } = useWaitForTransactionReceipt({
    hash: buyTxHash,
  });

  //allowance-blockchain-calls
  const { data: allowanceHash, writeContract: giveAllowance, error: errorInAllowance, reset: resetAllowanceEvent } = useWriteContract()
  const { isLoading: allowanceInProcess, isSuccess: isAllowanced, data: txAllowanceData } = useWaitForTransactionReceipt({
    hash: allowanceHash,
  });


  //selltoksn-blockchain-calls
  const { data: sellHash, writeContract: sellTokens, error: errorInSell, reset: resetSellEvent } = useWriteContract()
  const { isLoading: isSelling, isSuccess: isSold, data: txSellData } = useWaitForTransactionReceipt({
    hash: sellHash,
  });



  const userNativeBalance = useBalance({
    address: address,
  })

  const handleSwitchClick = async () => {
    setAmount('')
    setAmountError((prevState) => ({
      ...prevState,
      error: false,
      reason: '',
    }))
    setEthAmount('')
    setShowSOGs(!showSOGs);
    if (!showSOGs) {
      setAmount(tokenToBuy);
    } else {
      setAmount(solAmount);
    }
  };
  // amount is being treated as amount user inputs in tokens 
  //load contract configuration
  useEffect(() => {
    if (coinData?.token_address && address) {
      evmTokenInfo(coinData?.token_address, address).then((res) => {
        setTokenInfo((prevState) => ({
          ...prevState,
          loading: false,
          success: true,
          data: res,
        }))
      })
    }

    GetContractConfiguration(block_chain).then(async (res) => {

      setContractInfo(res);
    })
  }, [coinData?.token_address, address, isButtonDisabled])
  //save buy transaction to backend
  useEffect(() => {
    if (isBuyed && txData) {
      buyCreatedCoin({ buyTxHash, txData })
    }
  }, [isBuying, isBuyed, txData])
  //give tokenAllowance to contract
  useEffect(() => {
    if (isAllowanced && txAllowanceData && txAllowanceData?.status === "success") {

      sellTokensBlockChain()
    }
  }, [allowanceInProcess, isAllowanced, txAllowanceData])

  //sell token on blockchain--------------
  useEffect(() => {
    if (isSold && txSellData) {
      saveSellTransaction({ sellHash, txSellData })
    }
  }, [isSelling, isSold, txSellData])

  //handle errors-------------------------
  useEffect(() => {
    if (errorInBuy) {
      console.log("error in buy bc ",errorInBuy)
      const errorMessage = errorInBuy?.message?.split("\n")[0] || "Transaction failed";
      toast.error(errorMessage);
      resetBuyEvent();
      setIsButtonDisabled(false);
    }
  }, [errorInBuy]);
  
  useEffect(() => {
    if (errorInAllowance) {
      console.log("error in  allwance ",errorInAllowance)
      const errorMessage = errorInAllowance?.message?.split("\n")[0] || "Transaction failed";
      toast.error(errorMessage);
      resetAllowanceEvent();
      setIsButtonDisabled(false);
    }
  }, [errorInAllowance]);
  
  useEffect(() => {
    if (errorInSell) {
      console.log("error in sell  ",errorInSell)
      const errorMessage = errorInSell?.message?.split("\n")[0] || "Transaction failed";
      toast.error(errorMessage);
      resetSellEvent();  // Fixed the reset function to match the error type
      setIsButtonDisabled(false);
    }
  }, [errorInSell]);

  const handleTrade = async () => {

    if (!isConnected) {
      toast.error("Connect Wallet First");
      return;
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return toast.error("Please enter a valid amount")

    try {
      setIsButtonDisabled(true)
      if (tradeType === "buy") {

        handleBuyTokens(showSOGs ? amount : ethAmount, coinData?.token_address)
      } else {
        handleSellTokens(amount, coinData?.token_address)

      }


    } catch (error) {
      setIsButtonDisabled(false)
      toast.error(error.message || `Error placing ${tradeType} trade`);
      console.error(`Error during ${tradeType}:`, error);
    }
  };


  const handleBuyTokens = async (amount, tokenAddress) => {
    try {

      const formattedAmount = ethers.utils.parseUnits(amount.toString(), 18);
      const payAbleAmountEther = await getPayAbleEtherAmount(tokenAddress, amount, balanceData?.formatted)
      if (!payAbleAmountEther?.success) { return setIsButtonDisabled(false) }

      const SelectedAbi = contractInfo.Abi
      const contractAddress = contractInfo.ContractAddress

      const payAmount = payAbleAmountEther?.data


      useBuyTokens({
        address: contractAddress,
        abi: SelectedAbi,
        functionName: 'buyTokens',
        args: [
          tokenAddress,
          formattedAmount,
        ],
        value: payAmount?.toString()

      })

    } catch (error) {
      setIsButtonDisabled(false)

      // setIsCreatingCoin(false);
      // if (toastId) { toast.update(toastId, { render: "Failed to buy Tokens", type: "error", isLoading: false, autoClose: 3000 }); }

    }
  }

  const buyCreatedCoin = async ({ buyTxHash, txData }) => {
    try {

      if (txData?.status === "success" && buyTxHash) {
        const apiResponse = await BuyToken({
          account_type: currentChain,
          amount: parseFloat(amount),
          token_amount: "0",
          token_id: coinData?._id,
          type: "buy",
          transaction_hash: buyTxHash,
        });


        if (apiResponse?.status === 201) {
          setAmount('')
          setEthAmount('')
          setIsButtonDisabled(false)
          resetBuyEvent()

          toast.success(`${tradeType === "buy" ? "Buy" : "Sell"} successful`);
          dispatch(fetchTrades(id));
        } else {
          throw new Error(`Failed to Buy tokens`);

        }
      } else {
        setIsButtonDisabled(false)
        toast.error('Transaction failed. Please try again.');
        resetBuyEvent()

      }

    } catch (error) {
      setIsButtonDisabled(false)
      resetBuyEvent()

    }
  }

  const handleAmount = async (val) => {
    setSolAmount(val)
    setAmount(val)
  }


  function hasElevenDigits(amount) {
    return /^\d{11}$/.test(amount.toString());
  }

  const calculateTokenEthOnchange = async (amount) => {
    if (isConnected) {
      setAmountError((prevState) => ({
        ...prevState,
        error: false,
        reason: '',
      }))
      if (hasElevenDigits(amount)) {
        setIsButtonDisabled(false)

        return setAmountError((prevState) => ({
          ...prevState,
          error: true,
          reason: 'Max token reserves reached',
        }))
      }
      setAmount(amount);
      try {
        const calculateEthValue = showSOGs ? await calculateTokenEthValues(coinData?.token_address, amount, true) : await calculateEthTokenValue(coinData?.token_address, amount, true);

        setEthAmount(calculateEthValue)

        showSOGs ? handleTokenstoEthCheck(amount, tokenInfo?.data?.realTokenReserves, userNativeBalance?.data?.formatted, calculateEthValue) : handleEthtoTokensCheck(amount, tokenInfo?.data?.realTokenReserves, userNativeBalance?.data?.formatted, calculateEthValue)

      } catch (error) {
        console.error("Error calculating ETH value:", error);
      }
    } else {
      setIsButtonDisabled(false)
      setAmountError((prevState) => ({
        ...prevState,
        error: true,
        reason: 'Connect Wallet First',
      }))

    }
  };

  const handleEthtoTokensCheck = async (amount, realTokenReserves, userNativeBalance, tokentoGet) => {

    if (parseFloat(tokentoGet) > parseFloat(realTokenReserves)) {
      setIsButtonDisabled(false)
      setAmountError((prevState) => ({
        ...prevState,
        error: true,
        reason: 'Max token reserves reached',
      }))

    }
    if (parseFloat(amount) > parseFloat(userNativeBalance)) {
      setIsButtonDisabled(false)
      setAmountError((prevState) => ({
        ...prevState,
        error: true,
        reason: 'You dont have enough balance',
      }))

    }
  }
  const handleTokenstoEthCheck = async (amount, realTokenReserves, userNativeBalance, eth) => {

    if (parseFloat(amount) > parseFloat(realTokenReserves)) {
      setIsButtonDisabled(false)
      setAmountError((prevState) => ({
        ...prevState,
        error: true,
        reason: 'Max token reserves reached',
      }))

    }
    if (parseFloat(eth) > parseFloat(userNativeBalance)) {
      setIsButtonDisabled(false)
      setAmountError((prevState) => ({
        ...prevState,
        error: true,
        reason: 'You dont have enough balance',
      }))

    }

  }
  //calculate eth values for sell
  const handleAmountSell = async (val) => {


    if (parseFloat(val) > parseFloat(tokenInfo?.data?.userTokenHoldings)) {
      setIsButtonDisabled(false)
      return setAmountError((prevState) => ({
        ...prevState,
        error: true,
        reason: `You have max token Holdings of ${tokenInfo?.data?.userTokenHoldings} tokens`,
      }))
    } else {
      setAmountError((prevState) => ({
        ...prevState,
        error: false,
        reason: ``,
      }))
    }
    setAmount(val)
    const result = await getReturnedEthAmountonSell(coinData?.token_address, val)
    setEthAmount(result)


  }

  const handleBuyPercentage = (percentage) => {

    const perctageSet = parseFloat(tokenInfo?.data?.userTokenHoldings) * (percentage / 100);
    setAmount(perctageSet);
    handleAmountSell(perctageSet)



  }

  const handleSellTokens = async (amount, tokenAddress) => {

    try {
      const res = await sellTokensInfo(tokenAddress, address, amount, contractInfo)

      if (res?.success) {
        if (!res?.doesContractHasAllowance) {
          const SelectedAbi = contractInfo.tokenAbi
          const contractAddress = contractInfo.ContractAddress


          giveAllowance({
            address: tokenAddress,
            abi: SelectedAbi,
            functionName: 'approve',
            args: [
              contractAddress,
              res?.tokenInWei,
            ],
          })
        } else {
          sellTokensBlockChain()
        }

      } else {
        // 
        throw new Error(`Error while fetching token info ${JSON.stringify(res?.error)} `)
      }


    } catch (error) {
      console.error("Error during sell transaction:", error);
      const errorMessage = error?.message || "An unknown error occurred";

      toast.error(errorMessage);
      //alert("Failed to sell tokens. Check console for more details.");
    } finally {
    }
  };

  const sellTokensBlockChain = async () => {
    try {

      const SelectedAbi = contractInfo.Abi
      const contractAddress = contractInfo.ContractAddress
      const formattedAmount = ethers.utils.parseUnits(amount.toString(), 18);
      sellTokens({
        address: contractAddress,
        abi: SelectedAbi,
        functionName: 'sellTokens',
        args: [
          coinData?.token_address,
          formattedAmount?.toString(),
        ],
      })
    } catch (error) {
      setIsButtonDisabled(false)

    }

  }

  const saveSellTransaction = async ({ sellHash, txSellData }) => {
    try {
      if (txSellData?.status === "success" && sellHash) {
        const apiResponse = await BuyToken({
          account_type: currentChain,
          amount: parseFloat(amount),
          token_amount: "0",
          token_id: coinData?._id,
          type: "sell",
          transaction_hash: sellHash,
        });


        if (apiResponse?.status === 201) {
          setAmount('')
          setEthAmount('')
          setIsButtonDisabled(false)
          toast.success(`${tradeType === "buy" ? "Buy" : "Sell"} successful`);
          dispatch(fetchTrades(id));
          resetSellEvent()
        } else {
          throw new Error(`Failed to Buy tokens`);

        }
      } else {
        setIsButtonDisabled(false)
        resetSellEvent()
        toast.error('Transaction failed. Please try again.');

      }
    } catch (error) {
      resetSellEvent()
      setIsButtonDisabled(false)
    }
  }

  const selectTradeTab = (type) => {
    setTradeType(type);
    setAmountError((prevState) => ({
      ...prevState,
      error: false,
      reason: "",
    }))
    setAmount('');
    setSolAmount('')
    type === "buy" ? setShowSOGs(false) : setShowSOGs(true);



  }

  const resetStates = () => {
    setAmount('');
    handleAmount('');
    setEthAmount('');
    setAmountError((prevState) => ({
      ...prevState,
      error: false,
      reason: ``,
    }))
  }

  const handleSetAmount = (amount) => {
    setAmount(amount); handleAmount(amount); calculateTokenEthOnchange(amount)
  }


  //false  = amount in eth & true = amount in tokens
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
                      onClick={() => { selectTradeTab('buy') }}
                    >
                      Buy
                    </button>
                    {<button
                      className={`text-[16px] SegoeUi font-semibold text-center w-full px-3 py-2 rounded ${tradeType === "sell"
                        ? "bg-[#F87171] text-white"
                        : "bg-[#1F2937] text-[gray]"
                        }`}
                      onClick={() => { selectTradeTab("sell") }}
                    >
                      Sell
                    </button>}

                  </div>

                  <div className="flex justify-end gap-3 px-3 pt-[35px]">
                    {tradeType === 'buy' ?
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
                      {/* <span
                        className="SegoeUi bg-[#4E496E] px-2 py-1 rounded text-xs text-[#9CA3AF] font-semibold cursor-pointer"
                        onClick={() => setIsSlipPageOpen(true)}
                      >
                        Set max slippage
                      </span> */}

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
                                if (!value || Number(value) >= 0) {
                                  calculateTokenEthOnchange(value);
                                }
                              }}

                              className="w-full px-2 py-3 pr-4"
                            />

                            <div className="w-fit flex items-center gap-1 bg-white">
                              {coinData?.status !== "created" ? <span className="whitespace-nowrap text-black font-semibold text-sm SegoeUi">
                                {!showSOGs && blockchainType !== 'Evm' ? "ETH" : coinData?.name}

                              </span> : <></>}
                              {coinData?.status !== "created" ? <img
                                src={
                                  showSOGs ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${coinData?.metadata?.image}` : `${ethImg}`
                                }
                                className="w-[30px] mr-7 rounded-full"
                              /> : <></>}


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
                                  //calculateTokenEthOnchange(value);
                                  handleAmountSell(value)
                                }
                              }}
                              className="w-full px-2 py-3 pr-4"
                            />

                            <div className="w-fit flex items-center gap-1 bg-white">
                              {coinData?.status !== "created" ? <span className="whitespace-nowrap text-black font-semibold text-sm SegoeUi">
                                {coinData?.name}
                              </span> : <></>}
                              {coinData?.status !== "created" ? <img
                                src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${coinData?.image}`}
                                className="w-[30px] mr-7 rounded-full"
                              /> : <></>}
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
                    <span onClick={resetStates}
                      className='Inter whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                      reset
                    </span>
                    <span onClick={() => { handleSetAmount(0.1) }} className='Inter whitespace-nowrap px-1 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                      0.1 {blockchainType}
                    </span>
                    <span onClick={() => { handleSetAmount(0.5) }} className='Inter whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                      0.5 {blockchainType}
                    </span>
                    <span onClick={() => { handleSetAmount(1) }} className='Inter whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                      1 {blockchainType}
                    </span>
                  </div>
                }
                {tradeType === 'sell' &&
                  <div className='flex justify-start items-center gap-[3px] mt-3 ml-3'>
                    <span onClick={() => {
                      setAmount(''); handleBuyPercentage(''); setAmountError((prevState) => ({
                        ...prevState,
                        error: false,
                        reason: ``,
                      }))
                    }} className='Inter whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
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

                {amount != '' && tokenToBuy != '' && tokenToBuy != '0' && tokenToBuy != 0 && blockchainType == "SOL" && <p p className="mt-2 ml-3">{!showSOGs ? tokenToBuy : solAmount} {showSOGs ? blockchainType : coinData?.status !== "created" ? coinData?.name : "tokens"}</p>}
                {amount != '' && <p p className="mt-2 ml-3">{ethAmount} {blockchainType}</p>}

                {amountError.error && <p className="text-red-700 mt-2 ml-3">{amountError.reason}</p>}

                <button
                  className={`themeBtn Inter w-fit mt-5 mx-auto ${isButtonDisabled ? 'animate-pulse' : 'animate-none'}`}
                  onClick={handleTrade}
                  disabled={amountError.error || isButtonDisabled}
                >
                  <span>{isButtonDisabled ? "Processing..." : "Trade"}</span>
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

