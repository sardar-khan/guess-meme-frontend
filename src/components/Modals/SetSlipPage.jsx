import React, { useState } from 'react';
import CardWrapper from '../CardWrapper/CardWrapper';

const SetSlipPage = ({ isOpen, onClose ,setSlipage,setPriorityFee}) => {
    const [slippage, setSlippage] = useState('');
    const [error, setError] = useState("");


    const handleSlippageChange = (e) => {
        let value = e.target.value;

        // Allow only numbers
        if (!/^\d*\.?\d*$/.test(value)) return;

        // Prevent negative numbers
        if (value < 0) {
            value = "";
        }

        // Set limit
        if (value > 4) {
            setError("warning: setting your slippage too high may result in bots front-running your trades. we highly recommend turning on front-running protection if you have high slippage.");
           
        } else {
            setError(""); // Clear error if valid
        }
        if(value > 25){
            value =25
        }

        setSlippage(value);
        setSlipage(value);
    };
    const handleBlur = () => {
        if (slippage === "" || slippage < 0) {
            setSlippage("0");
            setSlipage("0");
        }
    };
    if (!isOpen) return null;

    return (
        <div
            className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
            style={{ zIndex: 2000 }}
            onClick={onClose}
        >
            <div
                className='z-[1000] w-[90%] max-w-lg'
                onClick={(e) => e.stopPropagation()}
            >
                <CardWrapper>
                    <div
                        className='bg-[#A49DD2] p-5'
                    >
                        <h5 className='text-[#000000] font-bold PixelOperatorbold mb-1'>Set max. slippage (%)</h5>
                        <input type="number"value={slippage} className='rounded' onChange={handleSlippageChange} />
                       
                        <p className='text-[#000000] text-base leading-4 font-bold PixelOperator my-2'>This is the maximum amount of slippage you are willing to accept when placing trades</p>
                        {error && <p className="text-red-500 text-[18px] mt-1">{error}</p>}

                        <h3 className='text-[#000000] font-bold PixelOperatorbold mb-1'>Enable front-running protection:</h3>
                        <h3 className='text-[#000000] font-bold PixelOperatorbold mb-1'>Priority fee</h3>
                        <input type="number" className='rounded' onChange={((e)=>{setPriorityFee(e.target.value)})} />
                        <p className='text-[#000000] text-base leading-4 font-bold PixelOperator my-2'>A higher priority fee will make your transactions confirm faster. This is the transaction fee that you pay to the solana network on each trade.</p>


                        <button className='themeBtn w-fit mx-auto mt-6' onClick={onClose}>
                            <span className='PixelOperatorbold text-lg font'>
                                Close
                            </span>
                        </button>
                    </div>
                </CardWrapper>
            </div>
        </div>
    );
};

export default SetSlipPage;
