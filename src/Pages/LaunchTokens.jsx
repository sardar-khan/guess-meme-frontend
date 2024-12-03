import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCoins } from '../features/coinSlice'; // Import fetchCoins action
import folder from '../assets/icons/Group 110.png';
import BoxHeader from '../components/Global/BoxHeader';
import InputField from '../components/Global/InputField';
import TextArea from '../components/Global/TextArea';
import { adminTokenAddress, createCoin, uploadImage } from '../utils/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LaunchTokenSol from '../components/LaunchTokenDeduct/LaunchTokenSol';
import LaunchTokenEth from '../components/LaunchTokenDeduct/LaunchTokenEth';
import { useAppKitAccount } from '@reown/appkit/react';
import WalletContext, { useWalletContext, WalletApi } from '../context/WalletContext';
import LaunchTokenPolygon from "../components/LaunchTokenDeduct/LaunchPolygonToken"


import { useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';

const LaunchTokens = () => {
    const dispatch = useDispatch();
    const { address, isConnected } = useAppKitAccount();
    const [name, setName] = useState('');
    const [ticker, setTicker] = useState('');
    const [revealTime, setRevealTime] = useState('');
    const [description, setDescription] = useState('');
    const [maxSupply, setMaxSupply] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const [currentDateTime, setCurrentDateTime] = useState(new Date().toISOString().slice(0, 16));
    const [sortOption, setSortOption] = useState('');
    const { data: balanceData } = useBalance({ address });
    const { data: hash, sendTransaction } = useSendTransaction();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: hash,
    });


    const { block_chain } = useContext(WalletContext);
    console.log("block_chainblock_chainblock_chain", block_chain)


    console.log("statuses", isConfirming, isConfirmed, hash);

    const [adminAddress, setAdminAddress] = useState('');

    useEffect(() => {
        const interval = setInterval(() => setCurrentDateTime(new Date().toISOString().slice(0, 16)), 60000);
        return () => clearInterval(interval);
    }, [adminAddress]);


    const handleLaunchTokenE = LaunchTokenPolygon(
        address,
        sendTransaction,
        balanceData?.formatted
    );

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (isConnected) {
            if (file) {
                const formData = new FormData();
                formData.append('profile_photo', file);
                setFileName(file.name);

                try {
                    const data = await uploadImage(formData);
                    setImageUrl(data.imageUrl);
                    toast.success('Image uploaded successfully!');
                } catch (error) {
                    console.log("errorerror", error.message)
                    toast.error(`Error uploading image: ${error.message}`);
                }
            }
        } else {
            toast.error('Connect Wallet First')
        }
    };

    useEffect(() => {
        if (isConfirmed && hash) { createEthCoin({ hash }) }

    }, [isConfirming, isConfirmed, hash])

    const handleSubmit = async () => {
        // if (!isConnected) {
        //     toast.error('Connect Wallet First')
        // }
        if (!name || !ticker || !imageUrl || !description || !revealTime) {

            toast.error('Please fill in all required fields: Name, Ticker, Image, Description, and Reveal Time.');
            return;
        }

        try {
            const formattedRevealTime = new Date(revealTime).toISOString();
            let transactionSuccess;
            if (block_chain === 'SOL') {
                transactionSuccess = await handleLaunchToken();

                console.log("transactionSuccess", transactionSuccess)
                if (!transactionSuccess) {
                    toast.error('Transaction failed. Please try again now.');
                    return;
                }

                // Step 2: If the transaction is successful, proceed with creating the coin
                const response = await createCoin({
                    name,
                    ticker,
                    description,
                    image: imageUrl,
                    max_supply: maxSupply,
                    twitter_link: 'https://twitter.com',
                    telegram_link: 'https://telegram.com',
                    website: 'https://website.com',
                    bonding_curve: 0,
                    max_buy_percentage: 0,
                    fee: 0,
                    timer: formattedRevealTime,
                });

                if (response.status === 200) {
                    toast.success(response.message);
                    resetForm();
                    dispatch(fetchCoins(sortOption));
                } else {
                    toast.error('Failed to create coin. Please try again.');
                }
            } else {
                transactionSuccess = await handleLaunchTokenE();

                console.log("transactionSuccess", hash)

            }
            // Step 1: First, call the handleLaunchToken function to send the transaction

        } catch (error) {
            toast.error('Error creating coin. Please try again.');
            console.error('Error creating coin:', error);
        }
    };


    const createEthCoin = async ({ hash }) => {
        try {
            const formattedRevealTime = new Date(revealTime).toISOString();
            if (hash) {


                // Step 2: If the transaction is successful, proceed with creating the coin
                const response = await createCoin({
                    name,
                    ticker,
                    description,
                    image: imageUrl,
                    max_supply: maxSupply,
                    twitter_link: 'https://twitter.com',
                    telegram_link: 'https://telegram.com',
                    website: 'https://website.com',
                    bonding_curve: 0,
                    max_buy_percentage: 0,
                    fee: 0,
                    timer: formattedRevealTime,
                });

                if (response.status === 200) {
                    toast.success(response.message);
                    resetForm();
                    dispatch(fetchCoins(sortOption));
                } else {
                    toast.error('Failed to create coin. Please try again.');
                }
            }
        } catch (error) {
            console.log("error while creating token", error)

        }
    }

    const resetForm = () => {
        setName('');
        setTicker('');
        setDescription('');
        setMaxSupply('');
        setRevealTime('');
        setImageFile(null);
        setImageUrl('');
        setFileName('');
    };

    const handleRevealTimeChange = (e) => {
        const inputValue = e.target.value;

        // Extract year from the input
        const [year, month, day] = inputValue.split(/[-T]/);

        // If the year is more than 4 digits, truncate it
        if (year && year.length > 4) {
            const correctedYear = year.slice(0, 4);
            const correctedValue = correctedYear + inputValue.slice(4);
            setRevealTime(correctedValue);
        } else {
            setRevealTime(inputValue);
        }
    };


    const restrictYearInput = (e) => {
        const { value } = e.target;

        // Extract year part
        const yearPart = value.split("-")[0];

        // Prevent entering more than 4 characters in the year part
        if (yearPart.length >= 4 && e.key >= '0' && e.key <= '9') {
            e.preventDefault();
        }
    };


    // const handleLaunchToken = async () => {
    //     try {
    //         console.log("hey i am truing")

    //         // Static recipient address
    //         const RECIPIENT_ADDRESS = new PublicKey('AiY7NhE4JSwLVs6XGBhvrr63GzFmnPZPXV71ewC4kptz');

    //         // Amount to send (0.3 SOL)
    //         const AMOUNT_TO_SEND = 0.03 * LAMPORTS_PER_SOL;

    //         console.log("connection", connection);
    //         console.log("walletprovider", walletProvider)
    //         // Check wallet balance
    //         const balance = await connection.getBalance(walletProvider.publicKey);
    //         if (balance < AMOUNT_TO_SEND) {
    //             throw Error('Not enough SOL in wallet to complete transaction');
    //         }

    //         // Create transfer instruction
    //         const transferInstruction = SystemProgram.transfer({
    //             fromPubkey: walletProvider.publicKey,
    //             toPubkey: RECIPIENT_ADDRESS,
    //             lamports: AMOUNT_TO_SEND
    //         });

    //         // Create and send transaction
    //         const tx = new Transaction().add(transferInstruction);
    //         tx.feePayer = walletProvider.publicKey;
    //         tx.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;

    //         // Sign and send transaction
    //         const tx_hash = await walletProvider.signAndSendTransaction(tx);
    //         console.log("tx-hash", tx_hash)


    //         console.log(`Sent ${AMOUNT_TO_SEND / LAMPORTS_PER_SOL} SOL to ${RECIPIENT_ADDRESS.toBase58()}`);

    //     } catch (Error) {
    //         console.log("error while transfering sol", Error)
    //     }
    // }
    // const handleLaunchToken = block_chain === 'SOL' ? LaunchTokenSol() : LaunchTokenEth();
    const handleLaunchToken = LaunchTokenSol();



    return (
        <div className='border flex justify-center items-center py-[55px] px-4 w-full pb-[100px]'>
            <div className='relative w-full max-w-[830px] border-t-[5px] border-t-[#fff] border-l-[5px] border-l-[#fff] border-r-[2px] border-r-[#353535] border-b-[2px] border-b-[#353535]'>
                <div className='absolute top-0 left-0 h-[5px] w-full bg-white'></div>

                <BoxHeader label='Launch Token' />

                <div className='secondary-bg p-[14px]'>
                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>

                            <div className='flex flex-col gap-9 p-[20px]'>

                                <div className='flex flex-col sm:flex-row gap-6 sm:gap-2'>
                                    <InputField label="Name:" value={name} onChange={(e) => setName(e.target.value)} checkRequired={true} />
                                    <InputField label="Ticker:" value={ticker} onChange={(e) => setTicker(e.target.value)} checkRequired={true} />
                                </div>

                                <div className='flex items-center gap-4'>
                                    <label htmlFor="imageUpload" className='formLabel min-w-auto md:min-w-[150px] text-right'>*Image:</label>
                                    <input
                                        type="file"
                                        id="imageUpload"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden" // Hide the default file input
                                    />
                                    <label htmlFor="imageUpload" className="cursor-pointer">
                                        <img src={folder} alt="Folder icon" />
                                    </label>
                                    {/* {imageUrl && <img src={imageUrl} alt="Uploaded" className="w-20 h-20 object-cover" />} */}
                                    {fileName && <span className="ml-2 text-gray-700">{fileName}</span>} {/* Display file name */}
                                </div>

                                <TextArea value={description} onChange={(e) => setDescription(e.target.value)} checkRequired={true} />

                                <div className='flex flex-col sm:flex-row gap-6 sm:gap-2'>

                                    <div className="flex flex-col sm:flex-row sm:items-center items-start gap-4">
                                        <label className="formLabel min-w-auto md:min-w-[150px] text-right">*Reveal Time:</label>
                                        <div className="h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]">
                                            <div className="h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]">
                                                <input
                                                    type="datetime-local"
                                                    value={revealTime}
                                                    onChange={handleRevealTimeChange}
                                                    onKeyDown={restrictYearInput} // Called on every keypress
                                                    className="inputClassName SegoeUi px-2 py-3 w-full"
                                                    min={currentDateTime}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* <InputField label="Initial Buy:" /> */}

                                </div>

                                {/* <InputField label="Supply:" value={maxSupply} onChange={(e) => setMaxSupply(e.target.value)} type='number' /> */}
                                <InputField label="Website (Optional):" />
                                <InputField label="Telegram (Optional):" />
                                <InputField label="Twitter (Optional):" />



                                <div className='mx-auto'>
                                    <button className='themeBtn SegoeUi w-fit' onClick={handleSubmit}><span>Launch Token</span></button>
                                </div>


                                {/* <div className='mx-auto'>
                                    <button className='themeBtn SegoeUi w-fit' onClick={handleLaunchToken}><span>Launch Token</span></button>
                                </div> */}
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LaunchTokens;
