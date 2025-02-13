import React, { useEffect, useState } from 'react';
import ethImg from "../assets/icons/eth.png";
import solImg from "../assets/icons/sol.webp";
import { buy, reteriveTokenDetails, retrieveTokenMetaData, TokenPriceCalculations } from './PlaceTrade/solanaBuySellFunction';
import { BuyToken, getCoinByWalletAddress, viewCoin } from '../utils/api';

import { useDispatch } from "react-redux";
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { selectedName } from '../utils/helper';
import { useWalletContext } from '../context/WalletContext';
import { toast } from 'react-toastify';
import { connection } from './PlaceTrade/config';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { fetchTrades } from '../features/tradesSlice';
import { useBalance, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { calculateTokenEthValues, evmTokenInfo, getPayAbleEtherAmount } from './PlaceTrade/ether-trade-utils';
import { GetContractConfiguration } from '../web3/EvmConfig';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';



const DirectBuyEth = ({ isOpen, onClose }) => {

    const { address, isConnected } = useAppKitAccount()
    const [tokenAddress, setTokenAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [isButtonDisabled,setIsButtonDisabled] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [tokenToBuy, setTokenToBuy] = useState('');
    const blockchainType = localStorage.getItem("blockchain") || "SOL";
    const [isSoltoToken, setIsSoltoToken] = useState(false);
    const [coinData, setCoinData] = useState(null);
    const [ethAmount , setEthAmount] = useState('')
    const [contractInfo, setContractInfo] = useState('')
    const { walletProvider } = useAppKitProvider('solana');
    const [amountError, setAmountError] = useState({
        error: false,
        reason: '',
    })
    const dispatch = useDispatch();
    const { block_chain } = useWalletContext()

    const userNativeBalance = useBalance({
        address: address,
      })

    

    if (!isOpen) return null;

 //save buy transaction to backend
 

    const handleAddresChange = (e) => {
        setTokenAddress(e.target.value);
        getCoinByWalletAddress(e.target.value).then((res) => {
            if (res.status === 200) {
                 
                setCoinData(res.data)
            } else {
                setCoinData(null);
            }
        })

    }


   
   

   
    

    const closeModal = () => {
        onClose();
        setTokenAddress('');
        setAmount('');
        setTokenToBuy('');
        setEthAmount('');
        setIsLoading(false);
    }


    return (
        <div
            className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
            style={{ zIndex: '2000' }}
          
        >
            <div
                className='bg-[#A49DD2] p-5 z-[1000] rounded-lg w-[90%] max-w-md'
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className='text-lg font-semibold mb-3'>Direct Buy</h3>

                {/* Input Fields */}
                <div className='flex flex-col gap-2'>
                    {/* Token Address Input */}
                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                        <input
                            type='text'
                            className='w-full px-2 py-3'
                            placeholder='Token Address'
                            value={tokenAddress}
                            onChange={handleAddresChange}
                        />
                    </div>

                    {/* {coinData && <SwitchBuyToken
                        tokenName={coinData?.name}
                        isSoltoToken={isSoltoToken}
                        setIsSoltoToken={setIsSoltoToken}
                    />} */}

                    {/* Amount Input */}
                    {/* <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                        <input
                            type='number'
                            className='w-full px-2 py-3'
                            placeholder='Enter Amount'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div> */}
                    <div className="w-full Inter">
                        <div className="w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]">
                            <div className="flex w-full justify-between border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]">
                                <input
                                    type="number"
                                    name="amount"
                                    value={amount }
                                    placeholder='Amount'
                                    className="w-full px-2 py-3 pr-4"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (!value || Number(value) >= 0) {
                                            setAmount(value) 
                                        }
                                    }}
                                />
                                <div className="w-fit flex items-center gap-1 bg-white">
                                    <span className="text-black font-semibold text-sm SegoeUi">
                                        {selectedName(block_chain, isSoltoToken, coinData?.name)}
                                    </span>
                                    {coinData ? <SelectedImage
                                        isSoltoToken={isSoltoToken}
                                        block_chain={block_chain}
                                        imageUrl={coinData?.image}
                                        tokenName={coinData?.name}
                                    /> :
                                        <img
                                            src={blockchainType === "ETH" ? ethImg : solImg}
                                            className="w-[30px] mr-5"
                                            alt={blockchainType === "ETH" ? "ETH" : "SOL"}
                                        />}
                                </div>
                            </div>
                        </div>
                        {coinData && <PriceCalculations
                            amount={amount}
                            setAmount={setAmount}
                            isSoltoToken={isSoltoToken}
                            tokenToBuy={tokenToBuy}
                            setTokenToBuy={setTokenToBuy}
                            tokenName={coinData?.name}
                            tokenAddress={coinData?.token_address}
                            walletProvider={walletProvider}
                            amountError={amountError}
                            setAmountError={setAmountError}
                            ethAmount={ethAmount}
                            setEthAmount={setEthAmount}
                            coinData={coinData}
                            isButtonDisabled={isButtonDisabled}
                            block_chain={block_chain}
                            userNativeBalance={userNativeBalance}
                            isConnected={isConnected}
                            address={address}
                            contractInfo={contractInfo}
                            setContractInfo={setContractInfo}
                            
                        />}
                    </div>
                </div>

                {/* Buttons */}
               < BuyButtons
               isLoading={isLoading}
               closeModal={closeModal}
               coinData={coinData}
               amount={amount}
               setAmount={setAmount}
               isButtonDisabled={isButtonDisabled}
               setIsButtonDisabled={setIsButtonDisabled}
               block_chain={block_chain}
               userNativeBalance={userNativeBalance}
               isConnected={isConnected}
               address={address}
               contractInfo={contractInfo}
               setContractInfo={setContractInfo}
               setEthAmount={setEthAmount}
               />
             
            </div>
        </div>
    );
};

export default DirectBuyEth;


const SwitchBuyToken = ({ tokenName, isSoltoToken, setIsSoltoToken }) => {
    return (

        <div className='flex Inter items-center justify-end'>
            <button onClick={(() => { setIsSoltoToken(!isSoltoToken) })} className='text-base  tracking ease-in-out transition-all duration-300 hover:bg-purple-500 hover:text-white p-1.5 rounded-md mb-2'>
                switch to {isSoltoToken ? tokenName : "SOL"}
            </button>
        </div>
    );
}



const SelectedImage = ({ isSoltoToken, block_chain, imageUrl, tokenName }) => {
 
    return (
        <> {block_chain !== "SOL" ?
            <img
                src={isSoltoToken ? ethImg : `${import.meta.env.VITE_API_URL.slice(0, -1)}${imageUrl}`}
                className="w-[30px] mr-5"
                alt={selectedName(block_chain, isSoltoToken, tokenName)}
            /> :
            <img
                src={isSoltoToken ? solImg : `${import.meta.env.VITE_API_URL.slice(0, -1)}${imageUrl}`}
                className="w-[30px] mr-5"
                alt={selectedName(block_chain, isSoltoToken, tokenName)}
            />

        }</>
    );

}


const PriceCalculations = ({ amount, setAmount, isSoltoToken, tokenToBuy, setTokenToBuy, tokenName, tokenAddress, walletProvider , amountError , setAmountError,ethAmount,setEthAmount , coinData , isButtonDisabled ,block_chain,userNativeBalance,address,isConnected,contractInfo, setContractInfo}) => {
    const [price, setPrice] = useState({});
    const [remaningTokens, setRemaningTokens] = useState('')
    const [maxBuyTokens, setMaxBuyTokens] = useState('')
    const [userBalance, setUserBalance] = useState({
        tokenBalance: null,
        solBalance: null,
    })
    const [tokenInfo, setTokenInfo] = useState({
        loading: false,
        success: false,
        data: null,
      })
       

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
        }, [coinData?.token_address, address,isButtonDisabled])
   //  
    //fetch price conversions for token
    // const fetchPrice = async () => {


    //     try {
    //         //const res1 = await tokenToEthConversion(useReadContract,"0x7D3Fb449FbD018af1898c13e0c3b5382aF20501d", tokenToBuy,contractInfo)
    //         const res = await TokenPriceCalculations(
    //             tokenAddress,
    //             isSoltoToken ? amount === '' ? 0 : amount : tokenToBuy === '' ? 0 : tokenToBuy,
    //             isSoltoToken,
    //             true
    //         );
    //          
            
    //         setPrice(res);
    //         isSoltoToken ? setTokenToBuy(res?.tokensbuy) : setAmount(res?.tokensbuy)
    //          
    //          
    //         checkBuyConditions(parseFloat(tokenToBuy), parseFloat   (amount))
    //         // Store the response in state to render it
    //     } catch (error) {
    //         console.error("Error fetching token price:", error);
    //     }
    // }

    // const remaningAndMaxbuyTokens = async (tokenAddress) => {
    //     if (!walletProvider) {
    //          
    //     }
    //     if (!tokenAddress) {
    //         return toast.error("Token address not found!")
    //     }
    //     try {
    //         const res = await reteriveTokenDetails(walletProvider, tokenAddress);
    //          
    //         const maxBuyPercentage = 100
    //         const percentage = (res?.totalTokens * maxBuyPercentage) / 100;

    //         setMaxBuyTokens(percentage)
    //         setRemaningTokens(res?.remainingTokens)
    //     } catch (error) {
    //          

    //     }
    // }

    // const getUserBalances = async () => {
    //     try {
    //         if (!tokenAddress) { return }
    //          
    //         //user-sol-balance
    //         const balance = await connection.getBalance(walletProvider.publicKey)

    //         //user-selected-token-balance
    //         const tokenMintAddress = new PublicKey(tokenAddress)

    //         const tokenAccounts =
    //             await connection.getParsedTokenAccountsByOwner(walletProvider.publicKey, {
    //                 mint: tokenMintAddress,
    //             })
    //          
    //         let tokenBalance
    //         if (tokenAccounts?.value?.length > 0) {
    //             tokenBalance =
    //                 tokenAccounts?.value[0]?.account?.data?.parsed?.info
    //                     ?.tokenAmount.uiAmount
    //             // 
    //         } else {
    //         }
    //         setUserBalance((prevState) => ({
    //             ...prevState,
    //             solBalance: balance / LAMPORTS_PER_SOL,
    //             tokenBalance: tokenBalance === undefined ? 0 : tokenBalance,
    //         }))
    //     } catch (error) {
    //          
    //     }
    // }

   
    // const checkBuyConditions = (tokens ,sol) => {
    //      
    //      
    //     if (!walletProvider) {
    //         return setAmountError((prevState) => ({
    //             ...prevState,
    //             error: true,
    //             reason: 'Please connect your wallet!',
    //         }))
    //     }
    //      
    //     if (tokens > maxBuyTokens) {
    //         return setAmountError((prevState) => ({
    //             ...prevState,
    //             error: true,
    //             reason: 'max buy exceeded',
    //         }))
    //     }

    //      
    //     if (tokens > remaningTokens) {
    //         return setAmountError((prevState) => ({
    //             ...prevState,
    //             error: true,
    //             reason: 'Max token reserved reached',
    //         }))
    //     }
    //      
    //     if (sol > userBalance?.solBalance) {
    //         setAmountError((prevState) => ({
    //             ...prevState,
    //             error: true,
    //             reason: 'Not Enough Sol Balance',
    //         }))
    //     }else{
    //         setAmountError((prevState) => ({
    //             ...prevState,
    //             error: false,
    //             reason: '',
    //         }))
    //     }
    // }

    function hasElevenDigits(amountCheck) {
        return /^\d{11}$/.test(amountCheck.toString());
      }
    useEffect(() => {
         
       if(amount) calculateTokenEthOnchange(amount)
    }, [amount]);



    const calculateTokenEthOnchange = async (amount) => {
        if (isConnected) {
          setAmountError((prevState) => ({
            ...prevState,
            error: false,
            reason: '',
          }))
          if (hasElevenDigits(amount)) {
    
            return setAmountError((prevState) => ({
              ...prevState,
              error: true,
              reason: 'Max token reserves reached',
            }))
          }
          setAmount(amount);
          try {
            const calculateEthValue = await calculateTokenEthValues(coinData?.token_address, amount, true);
             
            setEthAmount(calculateEthValue)
             
            if (parseFloat(amount) > parseFloat(tokenInfo?.data?.realTokenReserves)) {
              setAmountError((prevState) => ({
                ...prevState,
                error: true,
                reason: 'Max token reserves reached',
              }))
    
            }
            if (parseFloat(calculateEthValue) > parseFloat(userNativeBalance?.data?.formatted)) {
              setAmountError((prevState) => ({
                ...prevState,
                error: true,
                reason: 'You dont have enough balance',
              }))
    
            }
    
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

    return (
        <div className='pt-2'>
           
                <div  className='flex flex-col'>
                <span> {ethAmount} ETH</span>
                {amountError.error && <p className="text-red-700 mt-2 ">{amountError.reason}</p>}
                </div>
            
        </div>
    );
}


const BuyButtons = ({isLoading , closeModal, coinData,amount,setAmount,isButtonDisabled,setIsButtonDisabled,block_chain,userNativeBalance,address,isConnected,contractInfo, setContractInfo,setEthAmount})=>{
  const currentChain = block_chain === "BNB" ? "bsc" : "sepolia"

   
     
     //buy-tokens-blockchain-calls
     const { data: buyTxHash, writeContract: useBuyTokens } = useWriteContract()
     const { isLoading: isBuying, isSuccess: isBuyed, data: txData } = useWaitForTransactionReceipt({
       hash: buyTxHash,
     });


     useEffect(() => {
        if (isBuyed && txData) {
          buyCreatedCoin({ buyTxHash, txData })
        }
      }, [isBuying, isBuyed, txData])


      
     const buyTokens = async (amount, tokenAddress ) => {
        try {
           
          const formattedAmount = ethers.utils.parseUnits(amount.toString(), 18);
          const payAbleAmountEther = await getPayAbleEtherAmount(tokenAddress, amount, userNativeBalance?.data?.formatted)
           
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
            value: payAmount
    
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
              closeModal()
              setIsButtonDisabled(false)
    
              toast.success(`Buy  successful`);
              dispatch(fetchTrades(id));
            } else {
              throw new Error(`Failed to Buy tokens`);
    
            }
          } else {
            setIsButtonDisabled(false)
            toast.error('Transaction failed. Please try again.');
    
          }
    
        } catch (error) {
          setIsButtonDisabled(false)
           
        }
      }
    return(
        <div className='flex flex-col sm:flex sm:flex-row justify-end mt-4 gap-1 sm:gap-3'>
        <button
            onClick={closeModal}
            className='w-full sm:w-fit px-4 py-2 bg-gray-300 sm:!text-base text-xs'
        >
            Cancel
        </button>
        <button
            disabled={isButtonDisabled}
            className={`themeBtn w-full sm:w-fit ${isButtonDisabled ? "animate-pulse" : "animate-none"} ease-in-out transition-all duration-300`}
            onClick={(()=>{buyTokens(amount,coinData?.token_address)})}
        >
            <span className={`'!text-xs sm:!text-base`}>{isButtonDisabled ? "In Process..." : "Buy"}</span>
        </button>
    </div>
    )
}