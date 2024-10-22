import React from 'react'
import rocket from '../assets/icons/rocket.png'
import minimize from '../assets/icons/minimize.png'
import maximize from '../assets/icons/maximize.png'
import cross from '../assets/icons/cross.png'

const Profile = () => {
    return (
        <div className='border flex justify-center items-center py-[55px] px-2 sm:px-4 w-full'>

            <div className='relative w-full max-w-[830px] border-t-[5px] border-t-[#fff] border-l-[5px] border-l-[#fff] border-r-[2px] border-r-[#353535] border-b-[2px] border-b-[#353535]'>
                <div className='absolute top-0 left-0 h-[5px] w-full bg-white'></div>

                <div className='flex items-center justify-between gap-1 px-4 py-1 primary-bg'>
                    <div className='flex items-center gap-1'>
                        <span className='PixelOperator text-white text-[31px] !font-normal pl-2'>Profile</span>
                    </div>
                    <div className='flex items-center gap-1 cursor-pointer'>
                        <img src={minimize} alt="" />
                        <img src={maximize} alt="" />
                        <img src={cross} alt="" />
                    </div>
                </div>

                <div className='secondary-bg p-[10px] sm:p-[14px]'>

                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>

                            <div className='flex flex-col gap-9 px-[10px] py-[30px] sm:p-[30px]'>

                                <div className='flex flex-col sm:flex-row sm:items-center items-start gap-4'>
                                    <label htmlFor="" className='formLabel min-w-auto md:min-w-[150px] text-right'>Username:</label>

                                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                            <input type="text" name="" id="" className='w-full px-2 py-3' />
                                        </div>
                                    </div>
                                </div>


                                <div className='flex flex-col sm:flex-row sm:items-center items-start gap-4'>
                                    <label htmlFor="" className='formLabel min-w-auto md:min-w-[150px] text-right'>Bio:</label>

                                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                            <input type="text" name="" id="" className='w-full px-2 py-3' />
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col sm:flex-row sm:items-center items-start gap-4'>
                                    <label htmlFor="" className='formLabel min-w-auto md:min-w-[150px] text-right'>Hide Followers:</label>
                                    <div className='flex items-center gap-4 w-full sm:w-auto'>
                                        <div className='themeBtn Inter w-full min-w-fit sm:min-w-[168px] flex items-center gap-2'>
                                            <span>Yes</span>
                                        </div>
                                        <div className='themeBtn Inter w-full min-w-fit sm:min-w-[168px] flex items-center gap-2'>
                                            <span>No</span>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col sm:flex-row sm:items-center items-start gap-4'>
                                    <label htmlFor="" className='formLabel min-w-auto md:min-w-[150px] text-right'>Hide Following:</label>
                                    <div className='flex items-center gap-4 w-full sm:w-auto'>
                                        <div className='themeBtn Inter w-full min-w-fit sm:min-w-[168px] flex items-center gap-2'>
                                            <span>Yes</span>
                                        </div>
                                        <div className='themeBtn Inter w-full min-w-fit sm:min-w-[168px] flex items-center gap-2'>
                                            <span>No</span>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col sm:flex-row sm:items-center items-start gap-4'>
                                    <label htmlFor="" className='formLabel min-w-auto md:min-w-[150px] text-right'>Hide Coins<br /> Purchases:</label>
                                    <div className='flex items-center gap-4 w-full sm:w-auto'>
                                        <div className='themeBtn Inter w-full min-w-fit sm:min-w-[168px] flex items-center gap-2'>
                                            <span>Yes</span>
                                        </div>
                                        <div className='themeBtn Inter w-full min-w-fit sm:min-w-[168px] flex items-center gap-2'>
                                            <span>No</span>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col sm:flex-row sm:items-center items-start gap-4'>
                                    <label htmlFor="" className='formLabel min-w-auto md:min-w-[150px] text-right'>Hide Deployed<br />Chain</label>
                                    <div className='flex items-center gap-4 w-full sm:w-auto'>
                                        <div className='themeBtn Inter w-full min-w-fit sm:min-w-[168px] flex items-center gap-2'>
                                            <span>Yes</span>
                                        </div>
                                        <div className='themeBtn Inter w-full min-w-fit sm:min-w-[168px] flex items-center gap-2'>
                                            <span>No</span>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col sm:flex-row sm:items-center items-start gap-4'>
                                    <label htmlFor="" className='formLabel min-w-auto md:min-w-[150px] text-right'>Notifications:</label>
                                    <div className='flex items-center gap-4 w-full sm:w-auto'>
                                        <div className='themeBtn Inter w-full min-w-fit sm:min-w-[168px] flex items-center gap-2'>
                                            <span>Yes</span>
                                        </div>
                                        <div className='themeBtn Inter w-full min-w-fit sm:min-w-[168px] flex items-center gap-2'>
                                            <span>No</span>
                                        </div>
                                    </div>
                                </div>


                                <div className='flex flex-col sm:flex-row sm:items-center items-start gap-4'>
                                    <label htmlFor="" className='formLabel min-w-auto md:min-w-[150px] text-right'>Trust Score:</label>

                                    <div className='w-full'>
                                        <div className='w-full flex flex-col items-center bg-[#7E78AA] p-1'>
                                            <div className='relative overflow-hidden bg-[#E9E9E9] h-[17.442px] w-full after:absolute after:bg-[#15C570] after:w-[100px] after:h-[full] after:bottom-[-5px] after:left-[0px] after:top-[0px]'></div>
                                        </div>
                                        <div className='flex justify-end items-end w-full'>
                                            <h5 className='PixelOperatorbold text-[12px] md:text-[13px] mt-1'>70/100</h5>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col sm:flex-row sm:items-center items-start gap-4'>
                                    <label htmlFor="" className='formLabel min-w-auto md:min-w-[150px] text-right'>Member Since:</label>

                                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                            <input type="text" name="" id="" className='w-full px-2 py-3' />
                                        </div>
                                    </div>

                                </div>


                                <div className='pl-0 md:pl-[186px]'>
                                    <button className='themeBtn SegoeUi w-fit'><span>Save Changes</span></button>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Profile;