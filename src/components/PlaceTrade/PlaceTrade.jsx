import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ethImg from '../../assets/icons/eth.png';
import solImg from '../../assets/icons/sol.webp';
import { BuyToken } from '../../utils/api';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrades } from '../../features/tradesSlice';
import { selectCoinById } from '../../features/coinSlice';


const PlaceTrade = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const coin = useSelector((state) => selectCoinById(state, id));

    const [showSOGs, setShowSOGs] = useState(false);
    const [amount, setAmount] = useState('');

    const handleSwitchClick = () => {
        setShowSOGs(!showSOGs);
    };

    const handlePlaceTrade = async () => {
        try {
            const response = await BuyToken({
                account_type: 'solana',
                amount: parseFloat(amount),
                token_amount: 1,
                token_id: id,
                type: 'buy'
            });
            if (response.status === 201) {
                toast.success('Buy Successful');
                dispatch(fetchTrades(id));
            }
        } catch (error) {
            toast.error(error.message);
            console.error(error.message);
        }
    };

    return (
        <div className='border flex justify-center items-center w-full '>
            <div className='relative w-full border-t-[1px] border-t-[#fff] border-l-[5px] border-l-[#fff] border-r-[2px] border-r-[#353535] border-b-[2px] border-b-[#353535]'>
                <div className='absolute top-0 left-0 h-[5px] w-full bg-white'></div>
                <div className='secondary-bg p-[14px]'>
                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>

                            <div className='w-full flex flex-col pb-4 pt-2'>
                                <div className='rounded'>
                                    <div className='flex gap-1 px-3'>
                                        <button className='text-[16px] SegoeUi text-[#fff] font-normal text-left bg-[#7539F4] SegoeUi w-full px-3 py-2 rounded'>
                                            Buy
                                        </button>
                                        <button className='text-[16px] SegoeUi text-[#fff] font-normal text-left bg-[#5F16BC] SegoeUi w-full px-2 py-1 rounded'>
                                            Sell
                                        </button>
                                    </div>

                                    <div className='flex justify-between gap-3 px-3 pt-[35px]'>
                                        <span
                                            className='SegoeUi bg-[#4E496E] px-2 py-1 rounded text-xs text-[#9CA3AF] font-semibold cursor-pointer'
                                            onClick={handleSwitchClick}
                                        >
                                            {showSOGs ? 'switch to 646464' : 'switch to SOL'}
                                        </span>
                                        <span className='SegoeUi bg-[#4E496E] px-2 py-1 rounded text-xs text-[#9CA3AF] font-semibold cursor-pointer'>
                                            Set max slippage
                                        </span>
                                    </div>

                                    <div className='flex justify-between gap-3 px-3 pt-[15px]'>
                                        {!showSOGs && (
                                            <div className='w-full Inter'>
                                                <div className='w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                                    <div className='flex w-full justify-between border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                                        <input
                                                            type="number"
                                                            name="amount"
                                                            value={amount}
                                                            onChange={(e) => setAmount(e.target.value)}
                                                            className='w-full px-2 py-3 pr-4'
                                                        />
                                                        <div className='w-fit flex items-center gap-1 bg-white'>
                                                            <span className='text-black font-semibold text-sm SegoeUi'>
                                                                SOL
                                                            </span>
                                                            <img
                                                                src={solImg}
                                                                className='w-[30px] mr-5'
                                                                alt='SOL'
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button className='themeBtn Inter w-fit mt-5 mx-auto' onClick={handlePlaceTrade}>
                                    <span>Place Trade</span>
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
