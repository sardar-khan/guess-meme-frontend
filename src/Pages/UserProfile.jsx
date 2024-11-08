import React from 'react'
import userprofileImg from '../assets/images/userprofile.png'

const UserProfile = () => {
    return (
        <div className='max-w-[650px] mx-auto'>
            <div className='relative mt-2 '>
                <div className='absolute top-0 left-0 h-[5px] w-full bg-white'></div>
                <div className='absolute top-0 left-0 h-full w-[5px] bg-white'></div>
                <div className='absolute bottom-[1px] right-[1px] z-10 h-[98%] w-[8px] bg-[#7D73BF]'></div>
                <div className='absolute bottom-0 right-0 w-[99.2%] h-[5px] bg-[#7D73BF]'></div>
                <div className='absolute top-0 right-0 h-[100%] w-[3px] bg-[#353535]'></div>
                <div className='absolute bottom-0 right-0 h-[1px] w-full bg-[#353535]'></div>

                <div className='secondary-bg w-full border-[3px] border-l-[15px] border-t-[8px] border-r-[15px] border-b-[15px] border-[#A49DD2]'>

                    <div className='h-full w-full border-[3px] p-2 border-b-[5px] border-r-[5px] border-[#353535] border-b-[#FFFFFF] border-r-[#FFFFFF]'>

                        <div className={`relative bg-white w-full min-h-full border-[3px] border-b-[4px] border-r-[4px] border-[#353535] border-b-[#CBC7E5] border-r-[#CBC7E5] after:absolute after:h-[1px] after:w-full after:top-0 after:left-0 after:bg-[white]`}>
                            <div className={`md:p-[15px] p-[5px] min-h-full border-[5px] border-t-[#7D73BF] border-l-[#7D73BF] border-b-[#fff] border-r-[#fff]`}>
                                
                                <div className='flex items-start gap-4'>
                                    <img src={userprofileImg} className='w-[50px] h-[50px]' alt="" />
                                    <div>
                                        <h5 className=''>@4Ehei4</h5>
                                        <p>4 followers</p>
                                        <p>Lfg</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default UserProfile