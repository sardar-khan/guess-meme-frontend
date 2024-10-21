import React from 'react'
import logoSmall from '../../assets/icons/logoSmall.png'
import cmtImg from '../../assets/images/cmtImg.png'
import cmtImg2 from '../../assets/images/cmtImg2.png'

const ChatRoom = () => {
    return (
        <>
            <h2>ChatRoom</h2>
            <div className='mt-3'>

                <div className='secondary-bg p-[4px] pb-2'>
                    <div className='flex items-center gap-2'>
                        <img src={logoSmall} alt="" />
                        <span className='Inter text-black text-[10px] font-medium p-[2px] rounded-md bg-[#8E8DC7]'>FoykzN (dev)</span>
                    </div>
                    <div className='flex gap-3'>
                        <div className='w-[128px] h-[128px]'>
                            <img src={cmtImg} className='w-full h-full' alt="" />
                        </div>
                        <div className="w-[calc(100%-128px)]">
                            <h5 className='Inter text-[#121212] text-sm font-bold'>GOD PEPE (ticker: GODPE)</h5>
                            <p className='Inter text-xs font-normal'>
                                Conquer the meme universe with GODPEPE. The legend of the God of all Memes, his rule unchallenged, his influence eternal, as he
                                continued to reign over the vast and wondrous realms of Solana. He will never let us down, UP only. "when all else fails, GOD doesn't" -
                                Pepesalm 73:26
                            </p>
                        </div>
                    </div>
                </div>

                <button className='themeBtn w-fit px-5 SegoeUi mt-5'><span>Referral</span></button>



            </div>
        </>
    )
}

export default ChatRoom