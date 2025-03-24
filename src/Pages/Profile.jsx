import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import rocket from '../assets/icons/rocket.png';
import InputField from '../components/Global/InputField';
import { fetchProfile, updateProfile, setProfile } from '../features/profileSlice'; // Ensure this path is correct
import { toast } from 'react-toastify';
import BoxHeader from '../components/Global/BoxHeader';
import ToggleButton from '../components/Global/ToggleButton';
import { useLoading } from '../context/LoadingContext';
import { updateProfileSettings, uploadImage } from '../utils/api';
import { MdEdit } from "react-icons/md";
import { ImSpinner8 } from "react-icons/im";
import { useParams } from 'react-router-dom';
import { FaXTwitter } from 'react-icons/fa6';

const Profile = () => {
    const dispatch = useDispatch();
    const { isButtonDisabled, disableButtonTemporarily } = useLoading();
    const profile = useSelector((state) => state.profile);
    const [uploadingImage, setUploadingImage] = useState(false);
    const { link } = useParams();
    console.log("profsss", profile)
    const [isEditing, setIsEditing] = useState(false);
    console.log("selfish", link);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    const handleEditProfile = async () => {
        disableButtonTemporarily();
        try {
            const data = await dispatch(updateProfile({
                user_name: profile.username,
                bio: profile.bio,
                x_link: profile.x_link,
                profile_photo: profile.profilePhoto,
            })).unwrap();
            dispatch(fetchProfile());
            toast.success(data?.message, { autoClose: 1000 });

            setIsEditing(false);
        } catch (error) {
            console.log("error", error)
            toast.error(error?.message || 'Error updating profile', { autoClose: 1000 });
        }
    };


    console.log("profilewss", profile)

    const handleXProfile = async (link) => {
        disableButtonTemporarily();
        try {
            const data = await dispatch(updateProfile({
                user_name: profile.username,
                bio: profile.bio,
                x_link: link,
                profile_photo: profile.profilePhoto,
            })).unwrap();
            dispatch(fetchProfile());
            toast.success(data?.message, { autoClose: 1000 });

            setIsEditing(false);
        } catch (error) {
            console.log("error", error)
            toast.error(error?.message || 'Error updating profile', { autoClose: 1000 });
        }
    };

    useEffect(() => {
        if (!link) return
        console.log("this is the link", link)
        handleChange('x_link', link)
        handleXProfile(link)

    }, [link])

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveChanges = () => {
        handleEditProfile();
    };

    const handleChange = (field, value) => {
        dispatch(setProfile({ ...profile, [field]: value }));
    };

    const handleSettingsChange = async (value, settingName) => {

        try {
            const data = await updateProfileSettings({ value, settingName })

            if (data?.status === 200) {
                dispatch(fetchProfile());
                toast.success(data?.message, { autoClose: 1000 });
            }


            setIsEditing(false);
        } catch (error) {
            console.log("error geeked out", error)
            toast.error(error.response?.data?.message || 'Error updating profile', { autoClose: 1000 });
        }
    }

    const formattedDate = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '';

    const handlePhotoChange = async (file) => {

        if (file) {
            setUploadingImage(true)
            const formData = new FormData();
            formData.append('profile_photo', file);

            try {
                const data = await uploadImage(formData);
                dispatch(setProfile({ ...profile, ["profilePhoto"]: data?.imageUrl }));

                toast.success("Image uploaded. Please save changes.");
            } catch (error) {
                setUploadingImage(false)
                console.error("Error uploading image:", error.message);
                toast.error(`Error uploading image: ${error.message}`);
            } finally {
                setUploadingImage(false)
                // Reset file input to allow re-uploading the same file
                e.target.value = null;
            }
        }
    }

    //x-auth-function
    const handleLogin = () => {
        console.log("hello---");
        window.open("http://13.60.36.211:5000/user/twitter", "_blank");
    };


    return (
        <div className='border flex justify-center items-center py-[55px] px-2 sm:px-4 w-full'>
            <div className='relative w-full max-w-[830px] border-t-[5px] border-t-[#fff] border-l-[5px] border-l-[#fff] border-r-[2px] border-r-[#353535] border-b-[2px] border-b-[#353535]'>
                <div className='absolute top-0 left-0 h-[5px] w-full bg-white'></div>
                <BoxHeader label='Edit Profile' />
                <div className='secondary-bg p-[10px] sm:p-[14px]'>
                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                            <div className='w-full flex flex-col gap-9 px-[10px] py-[30px] sm:p-[30px]'>
                                <ManageProfile
                                    isEditing={isEditing}
                                    profile={profile}
                                    onPhotoChange={handlePhotoChange}
                                    updatingImage={uploadingImage}
                                />
                                <InputField
                                    label="Username:"
                                    value={profile.username}
                                    onChange={(e) => handleChange('username', e.target.value)}
                                    disabled={!isEditing} // Only disable when not editing
                                />
                                <InputField
                                    label="Bio:"
                                    value={profile.bio}
                                    onChange={(e) => handleChange('bio', e.target.value)}
                                    disabled={!isEditing} // Only disable when not editing
                                />
                                {profile?.x_link ?
                                    <div className=' flex items-center gap-4'>
                                        <label className='formLabel min-w-auto md:min-w-[150px] text-right'>X:</label>
                                        {/* <button
                                            //onClick={handleConnectX}
                                            className="themeBtn SegoeUi w-fit"
                                        // disabled={connectingX}
                                        >
                                            <span > Connected </span>
                                        </button> */}
                                        {/* {profileState?.data?.data?.user?.x_link && */}
                                        <a href={profile?.x_link} className='bg-[#1DA1F2] p-2 rounded-md mt-1 text-white flex hover:scale-110 transition-all ease-in-out ' target="_blank" rel="noopener noreferrer" > <FaXTwitter />
                                            <span className="Inter text-xs ml-2">
                                                {profile?.x_link
                                                    ?.replace("https://twitter.com/", "")
                                                    .toUpperCase()}
                                            </span>
                                        </a>
                                        {/* } */}
                                        {/* <div className='PixelOperatorbold tracking-tight font-[24px]'>
                                            View
                                        </div> */}
                                    </div>
                                    : <div className='flex items-center gap-4'>
                                        <label className='formLabel min-w-auto md:min-w-[150px] text-right'>X:</label>
                                        <button
                                            //onClick={handleConnectX}
                                            className="themeBtn SegoeUi w-fit "
                                        // disabled={connectingX}
                                        >
                                            <span onClick={handleLogin}> Connect</span>
                                        </button>
                                    </div>}

                                <ToggleButton label="Hide Followers:" handleSettingsChange={handleSettingsChange} settingName={"hide_followers"} disableCheck={isEditing} isActivated={profile?.hide_followers} />
                                <ToggleButton label="Hide Following:" handleSettingsChange={handleSettingsChange} settingName={"hide_following"} disableCheck={isEditing} isActivated={profile?.hide_following} />
                                <ToggleButton label="Hide Coins Purchases:" handleSettingsChange={handleSettingsChange} settingName={"hide_purchase"} disableCheck={isEditing} isActivated={profile?.hide_purchase} />
                                <ToggleButton label="Notifications:" handleSettingsChange={handleSettingsChange} settingName={"hide_notification"} disableCheck={isEditing} isActivated={profile?.hide_notification} />

                                {/* Use the correct profile object */}
                                <InputField label="Member Since:" value={formattedDate} disabled={true} />
                                <div className='pl-0 md:pl-[165px]'>
                                    {isEditing ? (
                                        <button
                                            onClick={handleSaveChanges}
                                            className='themeBtn SegoeUi w-fit'
                                            disabled={isButtonDisabled}
                                        >
                                            <span>Save Changes</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleEditClick}
                                            className='themeBtn SegoeUi w-fit'
                                        >
                                            <span>Edit Profile</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;



const ManageProfile = ({ isEditing, profile, onPhotoChange, updatingImage }) => {
    const [isHovered, setIsHovered] = useState(false);
    const fileInputRef = useRef(null);

    const handleEditClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            onPhotoChange(file);
        }
    };
    return (
        <>
            {isEditing ? <div
                className="relative w-32 h-32 rounded-full overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Profile Image */}
                <img
                    src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${profile?.profilePhoto}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                />
                {updatingImage && <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <ImSpinner8 className="w-10 h-10 text-white animate-spin" />

                </div>}
                {/* Edit Button Overlay */}
                {!updatingImage && <button
                    onClick={handleEditClick}
                    className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity
                    ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                >
                    <MdEdit className="w-6 h-6 text-white" />
                </button>}

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div> :
                <div className="relative w-32 h-32 rounded-full overflow-hidden">
                    <img
                        src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${profile?.profilePhoto}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>}
        </>
    )
}