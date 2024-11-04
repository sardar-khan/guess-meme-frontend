import React, { useEffect, useState } from 'react';
import logoSmall from '../../assets/icons/logoSmall.png';
import copy from '../../assets/icons/copy.png';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoins, selectCoinById } from '../../features/coinSlice';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const HoldersTable = () => {
    const { id } = useParams();
    const coin = useSelector((state) => selectCoinById(state, id));
    const [holders, setHolders] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCoins());
    }, [dispatch]);

    useEffect(() => {
        if (coin) {
            // Call the top holders API
            axios.post(`${import.meta.env.VITE_API_URL}user/top-holders`, {
                token_address: "CqCBN6PkYu6wZ1bZczVU14wwW2XZCZ3jNhdMymy7uifA"
            })
                .then((response) => {
                    console.log("Top holders data:", response.data);
                    if (response.data.status === 200) {
                        setHolders(response.data.data);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching top holders:", error);
                });
        }
    }, [coin]);


    // if (!coin) {
    //     return <div>No coin found with that ID.</div>;
    // }

    return (
        <div>
            <h2 className='mb-[8px]'>Holders</h2>

            <table className="min-w-full border-collapse secondary-bg">
                <thead className='Inter text-left text-[#121212] text-sm'>
                    <tr className="border border-[#FFF]">
                        <th className="px-4 py-4">Address</th>
                        <th className="px-4 py-4">Amount</th>
                        {/* <th className="px-4 py-4">Value</th> */}
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
                            {/* <td className="px-4 py-4">Value Placeholder</td>  */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default HoldersTable;
