import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCoins } from '../features/coinSlice'; // Import fetchCoins action
import folder from '../assets/icons/Group 110.png';
import BoxHeader from '../components/Global/BoxHeader';
import InputField from '../components/Global/InputField';
import TextArea from '../components/Global/TextArea';
import { createCoin, uploadImage } from '../utils/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppKitAccount } from '@reown/appkit/react';

const LaunchTokens = () => {
    const dispatch = useDispatch();
    const { address, isConnected } = useAppKitAccount()
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

    useEffect(() => {
        const interval = setInterval(() => setCurrentDateTime(new Date().toISOString().slice(0, 16)), 60000);
        return () => clearInterval(interval);
    }, []);

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

    const handleSubmit = async () => {
        if (!name || !ticker || !imageUrl || !description || !revealTime) {
            toast.error('Please fill in all required fields: Name, Ticker, Image, Description, and Reveal Time.');
            return;
        }

        try {
            const formattedRevealTime = new Date(revealTime).toISOString();
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
                dispatch(fetchCoins(sortOption)); // Trigger fetchCoins with sortOption to update coin list
            } else {
                toast.error('Failed to create coin. Please try again.');
            }
        } catch (error) {
            toast.error('Error creating coin. Please try again.');
            console.error('Error creating coin:', error);
        }
    };

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
                                        <label className='formLabel min-w-auto md:min-w-[150px] text-right'><>*</>Reveal Time:</label>
                                        <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                            <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                                <input
                                                    type="datetime-local"
                                                    value={revealTime}
                                                    onChange={(e) => setRevealTime(e.target.value)}
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



                                <div className='sm:pl-[166px]'>
                                    <button className='themeBtn SegoeUi w-fit' onClick={handleSubmit}><span>Launch Token</span></button>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LaunchTokens;
