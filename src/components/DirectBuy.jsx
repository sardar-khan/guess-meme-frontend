import React, { useState } from 'react';
import ethImg from "../assets/icons/eth.png";
import solImg from "../assets/icons/sol.webp";


const DirectBuy = ({ isOpen, onClose }) => {
    const [tokenAddress, setTokenAddress] = useState('');
    const [amount, setAmount] = useState('');

    if (!isOpen) return null;

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
                <h3 className='text-lg font-semibold mb-3'>Direct Buy</h3>

                {/* Input Fields */}
                <div className='flex flex-col gap-2'>
                    {/* Token Address Input */}
                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                        <input
                            type='text'
                            className='w-full px-2 py-3'
                            placeholder='Enter Token Address'
                            value={tokenAddress}
                            onChange={(e) => setTokenAddress(e.target.value)}
                        />
                    </div>

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
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-2 py-3 pr-4"
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
                            console.log({ tokenAddress, amount });
                            onClose();
                        }}
                    >
                        <span className='!text-xs sm:!text-base'>Buy</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DirectBuy;
