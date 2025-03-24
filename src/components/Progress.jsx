import React from 'react'
import { BsLightningCharge } from "react-icons/bs";
import { useNotificationContext } from '../context/NotificationContext';
import { Link } from 'react-router-dom';
import { useWalletContext } from '../context/WalletContext';

const Progress = ({ title, progress, pusherProgress, status, poolId, isBondingCurve }) => {

    const { block_chain } = useWalletContext()
    return (
        <div>
            <div className='flex justify-between items-end w-full mt-[7px] '>
                {/* <h5 className='PixelOperatorbold text-[16px] md:text-[15px]'>Progress:</h5> */}
                <h2 className='mb-[8px] text-[12px] md:!text-[20px]'>{title}: {pusherProgress ? pusherProgress : progress}%</h2>
            </div>

            <div className='relative overflow-hidden bg-[#dbdae4] h-[20px]'>
                <div
                    className='absolute bg-[#15C570] h-full '
                    style={{ width: `${pusherProgress ? parseFloat(pusherProgress) : parseFloat(progress)}%` }}
                ></div>

            </div>
            {status === "bonding" && poolId && block_chain === 'SOL' &&
                <VeiwOnRaydium poolId={poolId} />

            }
            {status === "bonding" && poolId && block_chain === 'ETH' &&
                
                (<ViewOnUniSwap poolId={poolId} />)

            }
            {/* isBondingCurve <span className='SegoeUi text-xs font-base'>graduate this coin to raydium at $81,026 market cap. <br/>there is 1 SOL in the bonding curve.</span> */}
        </div>
    )
}

export default Progress


const VeiwOnRaydium = ({ poolId }) => {
    return (
        <div className='Inter text-[#515151] font-semibold flex items-center pt-1 gap-2 tracking-wider  text-xs'>

            <BsLightningCharge className='text-yellow-800 text-[16px]' />
            <span> raydium pool seeded! view on raydium</span>

            <a className='underline hover:text-blue-700 text-blue-700/50' href=
                {` https://explorer.solana.com/address/${poolId}?cluster=devnet`}> here</a>

        </div>
    )
}

const ViewOnUniSwap = ({ poolId }) => {
    return (
        <div className='Inter text-[#515151] font-semibold flex items-center pt-1 gap-2 tracking-wider  text-xs' >

            <BsLightningCharge className='text-yellow-800 text-[16px]' />
            <span> uniswap pool seeded! view on uniswap</span>

            <a className='underline hover:text-blue-700 text-blue-700/50' href=
                {` https://explorer.solana.com/address/${poolId}?cluster=devnet`}> here</a>
        </div >
    )
}