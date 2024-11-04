import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logoSmall from '../../assets/icons/logoSmall.png';
import axios from 'axios';

const TradesTable = () => {
    const { id } = useParams();
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}trade/view/${id}`);
                if (response.data.status === 200) {
                    setTrades(response.data.data);
                    console.log("Trades data:", response.data.data);
                } else {
                    throw new Error("Failed to fetch trades");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrades();
    }, [id]);

    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error}</div>;

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
                    {trades.slice(0, 3).map((trade) => (
                        <tr key={trade._id} className='border border-[#FFF] text-xs'>
                            <td className="px-4 py-4">
                                <div className='flex items-center gap-1 ml-[-8px]'>
                                    <img src={`http://localhost:5000${trade?.token_id?.image}`} alt="" className="w-6 h-6 rounded-full" />
                                    <span className='Inter text-black text-[10px] font-medium p-[2px] rounded-md bg-[#8E8DC7]'>
                                        {trade.account.user_name}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-4">{trade.type}</td>
                            <td className="px-4 py-4">{new Date(trade.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TradesTable;
