import React from 'react'
import logoSmall from '../../assets/icons/logoSmall.png'

const TradesTable = () => {
    return (
        <div>

            <h2 className='mb-[8px]'>Trades</h2>

            <table className="min-w-full border-collapse secondary-bg">
                <thead className='Inter text-left text-[#121212] text-sm'>
                    <tr className="border border-[#FFF]">
                        <th className="px-4 py-4">Account</th>
                        <th className="px-4 py-4">Type</th>
                        <th className="px-4 py-4">Date</th>
                    </tr>
                </thead>
                <tbody className='Inter text-left'>

                    <tr className='border border-[#FFF] text-xs'>
                        <td className="px-4 py-4">
                            <div className='flex items-center gap-1 ml-[-8px]'>
                                <img src={logoSmall} alt="" />
                                <span className='Inter text-black text-[10px] font-medium p-[2px] rounded-md bg-[#8E8DC7]'>FoykzN (dev)</span>
                            </div>
                        </td>
                        <td className="px-4 py-4">sell</td>
                        <td className="px-4 py-4">13h ago</td>
                    </tr>
                    <tr className='border border-[#FFF] text-xs'>
                        <td className="px-4 py-4">
                            <div className='flex items-center gap-1 ml-[-8px]'>
                                <img src={logoSmall} alt="" />
                                <span className='Inter text-black text-[10px] font-medium p-[2px] rounded-md bg-[#B8F4F6]'>9nPRwy</span>
                            </div>
                        </td>
                        <td className="px-4 py-4">Buy</td>
                        <td className="px-4 py-4">13h ago</td>
                    </tr>
                    <tr className='border border-[#FFF] text-xs'>
                        <td className="px-4 py-4">
                            <div className='flex items-center gap-1 ml-[-8px]'>
                                <img src={logoSmall} alt="" />
                                <span className='Inter text-black text-[10px] font-medium p-[2px] rounded-md bg-[#FB8BAF]'>GbJzaR</span>
                            </div>
                        </td>
                        <td className="px-4 py-4">Buy</td>
                        <td className="px-4 py-4">13h ago</td>
                    </tr>

                </tbody>
            </table>
        </div>
    )
}

export default TradesTable