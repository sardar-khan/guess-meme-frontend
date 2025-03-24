import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTopHolders, viewCoins } from '../../utils/api';
import copy from '../../assets/icons/copy.png';
import Loader from '../Loader';
import { toast } from 'react-toastify';
import { useNotificationContext } from '../../context/NotificationContext';
import { returnBondingCurveAddress } from '../PlaceTrade/solanaBuySellFunction';
import axios from 'axios';
import { useWalletContext } from '../../context/WalletContext';
import { tokenBondingCurveInfo } from '../PlaceTrade/ether-trade-utils';
import { formatNumber } from '../../utils/helper';

const HoldersTable = ({ coinData }) => {
    const { id, tokenid } = useParams();
    const [holders, setHolders] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [coins, setCoins] = useState();
    const { block_chain } = useWalletContext()
    const [loading, setLoading] = useState(true);
    const [devAdd, setDevAdd] = useState('')
    const [bondingTokens, setBondingTokens] = useState("")
    const [error, setError] = useState(null);
    const [disabledCopy, setDisabledCopy] = useState({});
    const { pusherAfterTrade } = useNotificationContext();
    const [tokenHolders, setTokenHolders] = useState({
        loading: false,
        success: false,
        data: null,
    })

    console.log("tokenss-show", id, tokenid)




    useEffect(() => {
        if (!tokenid && !coinData) return
        block_chain === "SOL" ? getTokenLargestAccounts(tokenid) : getErc20TokenHoldings(tokenid)
    }, [tokenid, coinData])


    async function getTokenLargestAccounts(tokenMintAddress) {

        setTokenHolders((prevState) => ({
            ...prevState,
            loading: true,
            data: null,
            success: false,
        }))

        const url = import.meta.env.VITE_API_HELEIUS
        console.log("check-urls", url)
        const headers = {
            'Content-Type': 'application/json',
        }
        const data = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenLargestAccounts',
            params: [tokenMintAddress],
        }

        try {
            // const tokenAta = await getAta(wallet, tokenMintAddress)
            // //console.log('tokenAta', tokenAta)
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
            })

            if (response.ok) {

                const result = await response.json()

                setBondingTokens(result?.result?.value[0]?.uiAmount);
                console.log("jojo", result?.result?.value[0]?.uiAmount)




                const userAta = await returnBondingCurveAddress(tokenMintAddress, coinData?.creator?.wallet_address)

                setDevAdd(userAta)
                console.log("macho-man", result?.result?.value)
                setTokenHolders((prevState) => ({
                    ...prevState,
                    loading: false,
                    data: result?.result?.value,
                    success: true,
                }))
            } else {
                console.error(
                    `Error: Failed to fetch data with status code ${response.status}`,
                )
                setTokenHolders((prevState) => ({
                    ...prevState,
                    loading: false,
                    data: null,
                    success: false,
                }))
                return null
            }
        } catch (error) {
            console.error(`Error in fetching holders: ${error}`)
            setTokenHolders((prevState) => ({
                ...prevState,
                loading: false,
                data: null,
                success: false,
            }))
            return null
       
        } finally {
            setLoading(false)
        }
    }



const getErc20TokenHoldings = async (token_address) => {
    try {
        setTokenHolders((prevState) => ({
            ...prevState,
            loading: true,
            data: null,
            success: false,
        }))
        const response = await axios.get(
            `${import.meta.env.VITE_API_MORALIS_BASE_URL}/erc20/${token_address}/owners?chain=sepolia&order=DESC&limit=20`,
            {
                headers: {
                    'accept': 'application/json',
                    'X-API-Key': import.meta.env.VITE_MORALIS_API_KEY
                }
            }
        );

        // Handle the response data as needed
        setDevAdd(coinData?.creator?.wallet_address);
        const bondingCurveHolding = await tokenBondingCurveInfo(tokenid)
        console.log("address", tokenid)
        console.log("uiAmount", parseFloat(bondingCurveHolding?.realTokenReserves))
        let erc20Holdings = response.data.result?.map((item) => ({
            address: item?.owner_address,
            uiAmount: parseFloat(item?.balance_formatted) || 0
        })) || [];
        erc20Holdings.unshift({
            address: tokenid,
            uiAmount: parseFloat(bondingCurveHolding?.realTokenReserves) || 0
        });
        console.log("erc20-response-hodling", erc20Holdings);
        setTokenHolders((prevState) => ({
            ...prevState,
            loading: false,
            data: erc20Holdings,
            success: false,
        }))
        return erc20Holdings;
    } catch (error) {
        console.error('Error fetching ERC-20 token holdings:', error);
        setTokenHolders((prevState) => ({
            ...prevState,
            loading: false,
            data: null,
            success: false,
        }))
        return null;

    } finally {
        setLoading(false)
    }
};

console.log("tokenHolders", tokenHolders)



const handleCopy = (address) => {
    navigator.clipboard.writeText(address).then(() => {
        toast.success('Address copied!');
        setDisabledCopy((prev) => ({ ...prev, [address]: true }));

        setTimeout(() => {
            setDisabledCopy((prev) => ({ ...prev, [address]: false }));
        }, 3000);
    }).catch(() => {
        toast.error('Failed to copy address!');
    });
};

if (loading) {
    return <Loader />;
}

// if (error) {
//     // return <div>Error: {error}</div>;
// }
// if (holders.length === 0) return <div>No Data Found</div>;
// if (tokenHolders?.data?.length === 0) return <div>No holders Found</div>;

function calculateHoldingsPercentage(userAmount) {

    const percentage = (userAmount / 1000000000) * 100;
    return percentage.toFixed(2);
}
console.log("umaid", coinData, devAdd)


return (
    <div>
        <h2 className='mb-[8px]'>Holders</h2>

        <div className='w-full overflow-x-scroll md:overflow-hidden'>
            <table className="secondary-bg w-[500px] md:w-full min-w-full border-collapse secondary-bg flex flex-col">
                <thead className='Inter text-left text-[#121212] text-sm flex w-full'>
                    <tr className="border border-[#FFF] text-left w-full flex">
                        <th className="px-4 py-4 w-2/3">Address</th>
                        <th className="px-4 py-4 w-1/3">Supply</th>
                    </tr>

                </thead>
                <tbody className='Inter text-left max-h-[150px] overflow-y-auto flex flex-col custom-scrollbar'>


                    {tokenHolders?.data?.map((holder, index) => (
                        <tr key={index} className='border-b border-[#FFF] text-xs w-full flex '>
                            <td className="px-4 py-4 w-2/3">
                                <div className='flex items-center gap-1'>
                                    {block_chain === 'SOL' ? <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={`https://solscan.io/account/${holder?.address}?cluster=devnet`}
                                    >
                                        <div className='Inter hover:underline cursor-pointer text-[#671BBC] text-[12px] font-medium p-[2px] rounded-md'>
                                            {`${holder?.address?.slice(0, 6)}...${holder?.address?.slice(-4)}`}
                                        </div>
                                    </a> :
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href={`https://sepolia.etherscan.io/address/${holder?.address}`}
                                        >
                                            <div className='Inter cursor-pointer hover:underline text-[#671BBC] text-[12px] font-medium p-[2px] rounded-md'>
                                                {`${holder?.address?.slice(0, 6)}...${holder?.address?.slice(-4)}`}
                                            </div>
                                        </a>
                                    }

                                    {/* Bonding Curve Address Display */}
                                    {block_chain === 'SOL' ? (
                                        holder?.address === coinData?.bonding_curve && (
                                            <div className='flex flex-col items-center justify-center'>🏦 (bonding curve) </div>
                                        )
                                    ) : (
                                        holder?.address === tokenid && (
                                            <span>🏦 (bonding curve)</span>
                                        )
                                    )}

                                    {/* Developer Address Display */}
                                    {block_chain === 'SOL' ? (
                                        holder?.address === devAdd && <span>🤵‍♂️ (dev)</span>
                                    ) : (
                                        holder?.address === String(devAdd).toLowerCase() && <span>🤵‍♂️ (dev)</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-4 w-1/3 flex gap-1 ">
                                {calculateHoldingsPercentage(holder?.uiAmount)} %

                                {/* Show UI Amount below if it's the bonding curve address */}
                                {block_chain === 'SOL' ? (
                                    holder?.address === coinData?.bonding_curve && (
                                        <div className="text-[#671BBC] text-[10px] ">
                                            ({formatNumber(holder.uiAmount)})
                                        </div>
                                    )
                                ) : (
                                    holder?.address === tokenid && (
                                        <div className="text-[#671BBC] text-[10px] ">
                                            ({formatNumber(holder.uiAmount)})
                                        </div>
                                    )
                                )}
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    </div>

);
}

export default HoldersTable;
