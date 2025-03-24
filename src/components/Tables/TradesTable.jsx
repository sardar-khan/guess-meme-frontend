import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrades } from '../../features/tradesSlice';
import logoSmall from '../../assets/icons/logoSmall.png';
import { useNotificationContext } from '../../context/NotificationContext';

const TradesTable = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { trades, loading, error } = useSelector((state) => state.trades);

    const { pusherAfterTrade } = useNotificationContext();
    // latestTrades

    useEffect(() => {
        dispatch(fetchTrades(id));
        // }, [dispatch, id]);
    }, []);

    console.log("trades-dead", trades)
    // console.log("trades-dead 1", )

    if (loading) return <div className='w-full flex justify-center items-center gap-2'><div className='loader'></div></div>;
    if (error) return <div>No Trades Found</div>;

    return (
        <div>
            <h2 className='mb-[8px]'>Trades</h2>
            <div className='w-full overflow-x-scroll md:overflow-hidden'>
                <table className="w-[500px] md:w-full min-w-full border-collapse secondary-bg flex flex-col">
                    {/* Table Header */}
                    <thead className="Inter text-left text-[#121212] text-sm flex w-full">
                        <tr className="border border-[#FFF] text-left w-full flex">
                            <th className="px-4 py-4 w-[47%]">Account</th>
                            <th className="py-4 w-[30%]">{trades[0]?.token_id?.name}</th>
                            <th className="py-4 w-[10%]">Type</th>
                            <th className="py-4 w-[40%]">Date</th>
                            <th className="py-4 w-[40%]">Transaction</th>
                        </tr>
                    </thead>

                    {/* Table Body with Custom Scrollbar */}
                    <tbody className="Inter text-left overflow-y-auto flex flex-col custom-scrollbar">
                    {/* <tbody className="Inter text-left max-h-[150px] overflow-y-auto flex flex-col custom-scrollbar"> */}
                        {(pusherAfterTrade ? pusherAfterTrade?.latestTrades?.data : trades).map((trade) => (
                            <tr key={trade._id} className="border-b border-[#FFF] text-xs flex w-full">
                                {/* Account */}
                                <td className=" px-4 py-4 w-[47%] flex items-center gap-1">
                                    <Link to={`/profile/${trade?.account?._id}`} className="flex items-center gap-1">
                                        <img
                                            className="w-6 h-6 rounded-full"
                                            src={trade?.account?.profile_photo === "https://ibb.co/7zrpRwk"
                                                ? logoSmall
                                                : `${import.meta.env.VITE_API_URL.slice(0, -1)}${trade?.account?.profile_photo}`
                                            }
                                            alt="Profile"
                                        />
                                        <span className="Inter text-black text-[10px] font-medium p-[2px] rounded-md bg-[#8E8DC7] hover:underline">
                                            {trade.account.user_name}
                                        </span>
                                    </Link>
                                </td>

                                <td className=" py-4 w-[30%]">{trade?.amount}</td>

                                {/* Trade Type */}
                                <td className={`${trade.type === 'buy' ? 'text-[#347d4f]' : 'text-[#964343]'} font-bold py-4 w-[10%]`}>{trade.type}</td>

                                {/* Date */}
                                <td className="py-4 w-[40%]">{new Date(trade.created_at).toLocaleString()}</td>
                                <td className="py-4 w-[40%]">{trade?.transaction_hash.slice(0, 6)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default TradesTable;
