import React from 'react'
import logoSmall from '../../assets/icons/logoSmall.png'
import copy from '../../assets/icons/copy.png'

const HoldersTable = () => {
    return (
        <div>

            <h2 className='mb-[8px]'>Holders</h2>

            <table className="min-w-full border-collapse secondary-bg">
                <thead className='Inter text-left text-[#121212] text-sm'>
                    <tr className="border border-[#FFF]">
                        <th className="px-4 py-4">Address</th>
                        <th className="px-4 py-4">Amount</th>
                        <th className="px-4 py-4">Value</th>
                    </tr>
                </thead>
                <tbody className='Inter text-left'>

                    <tr className='border border-[#FFF] text-xs'>
                        <td className="px-4 py-4">
                            <div className='flex items-center gap-1'>
                                <span className='Inter text-[#671BBC] text-[12px] font-medium p-[2px] rounded-md'>0x000...0000</span>
                                <img src={copy} alt="" />
                            </div>
                        </td>
                        <td className="px-4 py-4">367.58K</td>
                        <td className="px-4 py-4">$66.80K</td>
                    </tr>
                    <tr className='border border-[#FFF] text-xs'>
                        <td className="px-4 py-4">
                            <div className='flex items-center gap-1'>
                                <span className='Inter text-[#671BBC] text-[12px] font-medium p-[2px] rounded-md'>0x000...0000</span>
                                <img src={copy} alt="" />
                            </div>
                        </td>
                        <td className="px-4 py-4">367.58K</td>
                        <td className="px-4 py-4">$66.80K</td>
                    </tr>
                    <tr className='border border-[#FFF] text-xs'>
                        <td className="px-4 py-4">
                            <div className='flex items-center gap-1'>
                                <span className='Inter text-[#671BBC] text-[12px] font-medium p-[2px] rounded-md'>0x000...0000</span>
                                <img src={copy} alt="" />
                            </div>
                        </td>
                        <td className="px-4 py-4">367.58K</td>
                        <td className="px-4 py-4">$66.80K</td>
                    </tr>

                </tbody>
            </table>
        </div>
    )
}

export default HoldersTable