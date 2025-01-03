import React, { useEffect, useState } from 'react';
import ethImg from "../../assets/icons/eth.png";
import solImg from "../../assets/icons/sol.webp";
import { useAppKitProvider } from '@reown/appkit/react';
import { toast } from 'react-toastify';
import { reterieveUserSolanaBalance } from '../PlaceTrade/solanaBuySellFunction';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';



const CreatorBuyToken = ({ isOpen, onClose, tokenName, amount, setAmount, handleLaunchToken,userSolBalnace ,setIsCreatingCoin}) => {
    const blockchainType = localStorage.getItem("blockchain") || "SOL";
    const { walletProvider } = useAppKitProvider('solana');

    const [accountSolBalance, setAccountSolBalance] = useState({
        reason: "0",
        hasError: 0,
    });

    if (!isOpen) return null;

    const deployToken = () => {
        if (!amount) {
            toast("please enter amount to buy", { type: "error" });
            return;
        }
        setIsCreatingCoin(true);
        onClose();
        handleLaunchToken();
    }

  console.log("userSolBalnace",userSolBalnace);
  

  
    return (
        <div
            className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
            style={{ zIndex: '2000' }}
            onClick={onClose}
        >
            <div
                className='bg-[#A49DD2] p-5 z-[1000] rounded-lg w-[90%] max-w-md'
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className='text-lg font-semibold mb-3'>Buy {tokenName}</h3>

                {/* Input Fields */}
                <div className='flex flex-col gap-2'>


                    <div className="w-full Inter">
                        <div className="w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]">
                            <div className="flex w-full justify-between border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]">
                                <input
                                    type="number"
                                    name="amount"
                                    value={amount}
                                    placeholder='Amount'
                                    className="w-full px-2 py-3 pr-4"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (!value || Number(value) >= 0) {
                                            setAmount(value);
                                        }
                                    }}
                                />
                                <div className="w-fit flex items-center gap-1 bg-white">
                                    <span className="text-black font-semibold text-sm SegoeUi">
                                        {blockchainType === "ETH" ? "ETH" : "SOL"}
                                    </span>
                                    <img
                                        src={blockchainType === "ETH" ? ethImg : solImg}
                                        className="w-[30px] mr-5"
                                        alt={blockchainType === "ETH" ? "ETH" : "SOL"}
                                    />
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    {userSolBalnace>amount?null:<div className="text-red-500 text-xs">Insufficient balance</div>}
                </div>

                {/* Buttons */}
                <div className='flex flex-col sm:flex sm:flex-row justify-end mt-4 gap-1 sm:gap-3'>
                    <button
                        onClick={onClose}
                        className='w-full sm:w-fit px-4 py-2 bg-gray-300 sm:!text-base text-xs'
                    >
                        Cancel
                    </button>
                    <button
                        className='themeBtn w-full sm:w-fit'
                        onClick={() => {
                            console.log("amount", amount);

                            // Use integer arithmetic by working with lamports directly.
                            // const amt = Math.round((parseFloat(amount) + 0.03) * 1e9); // Multiply by 1e9 and round to nearest integer
                            // console.log("amt in SOL (including 0.03):", (amt / 1e9)); // For display purposes
                            // console.log("lamports", amt); // Final lamports value
                            userSolBalnace>amount&&
                            deployToken();
                        }}
                    >
                        <span className='!text-xs sm:!text-base'>Buy</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatorBuyToken;
