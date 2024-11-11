import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchTopHolders } from '../../features/tradesSlice';  // Adjust path if necessary
import { selectCoinById } from '../../features/coinSlice';  // Adjust path if necessary
import copy from '../../assets/icons/copy.png';

const HoldersTable = () => {
    const { id } = useParams();
    const coin = useSelector((state) => selectCoinById(state, id));
    const dispatch = useDispatch();

    const { holders, holdersLoading, holdersError } = useSelector((state) => state.trades);

    useEffect(() => {
        if (coin?.coin?.token_address) {
            dispatch(fetchTopHolders(coin.coin.token_address));
        }
    }, [coin, dispatch]);

    if (holders.length <= 0) return <div>No data Found</div>;

    if (holdersLoading) return <div className='w-full flex justify-center items-center gap-2'><div className='loader'></div></div>;

    if (holdersError) return <div>Error: {holdersError}</div>;


    return (
        <div>
            <h2 className='mb-[8px]'>Holders</h2>
            <table className="min-w-full border-collapse secondary-bg">
                <thead className='Inter text-left text-[#121212] text-sm'>
                    <tr className="border border-[#FFF]">
                        <th className="px-4 py-4">Address</th>
                        <th className="px-4 py-4">Supply</th>
                    </tr>
                </thead>
                <tbody className='Inter text-left'>
                    {holders.map((holder, index) => (
                        <tr key={index} className='border border-[#FFF] text-xs'>
                            <td className="px-4 py-4">
                                <div className='flex items-center gap-1'>
                                    <span className='Inter text-[#671BBC] text-[12px] font-medium p-[2px] rounded-md'>{holder.user_name}</span>
                                    <img src={copy} alt="copy icon" />
                                </div>
                            </td>
                            <td className="px-4 py-4">{holder.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HoldersTable;
