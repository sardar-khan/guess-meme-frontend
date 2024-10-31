import React, { useEffect, useState } from 'react';
import rocket from '../assets/icons/rocket.png';
import InputField from '../components/Global/InputField';
import { editProfile, viewProfile } from '../utils/api';
import { toast } from 'react-toastify';
import BoxHeader from '../components/Global/BoxHeader';
import ToggleButton from '../components/Global/ToggleButton';
import { useLoading } from '../context/LoadingContext';

const Profile = () => {
    const { isButtonDisabled, disableButtonTemporarily } = useLoading();
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        username: '',
        profilePhoto: '',
        trustScore: '',
        bio: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await viewProfile();
                const { user_name, profile_photo, bio, trust_score, member_since } = data.data;
                setProfileData(data.data);
                setProfile({
                    username: user_name,
                    profilePhoto: profile_photo,
                    bio,
                    trustScore: trust_score
                });
                console.log("viewProfile data:", data.data);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchProfile();
    }, []);

    const handleEditProfile = async () => {
        // Disable the button when saving changes
        disableButtonTemporarily();

        try {
            const data = await editProfile({
                user_name: profile.username,
                bio: profile.bio,
                profile_photo: profile.profilePhoto
            });
            console.log('Profile updated successfully:', data);
            toast.success(data?.message, { autoClose: 1000 });
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating profile', { autoClose: 1000 });
            console.error('Error updating profile:', error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveChanges = () => {
        handleEditProfile();
    };

    const handleChange = (field, value) => {
        setProfile(prevProfile => ({
            ...prevProfile,
            [field]: value
        }));
    };

    return (
        <div className='border flex justify-center items-center py-[55px] px-2 sm:px-4 w-full'>
            <div className='relative w-full max-w-[830px] border-t-[5px] border-t-[#fff] border-l-[5px] border-l-[#fff] border-r-[2px] border-r-[#353535] border-b-[2px] border-b-[#353535]'>
                <div className='absolute top-0 left-0 h-[5px] w-full bg-white'></div>
                <BoxHeader label='Profile' />
                <div className='secondary-bg p-[10px] sm:p-[14px]'>
                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                            <div className='flex flex-col gap-9 px-[10px] py-[30px] sm:p-[30px]'>
                                <InputField
                                    label="Username:"
                                    value={profile.username}
                                    onChange={(e) => handleChange('username', e.target.value)}
                                    disabled={!isEditing}
                                />
                                <InputField
                                    label="Bio:"
                                    value={profile.bio}
                                    onChange={(e) => handleChange('bio', e.target.value)}
                                    disabled={!isEditing}
                                />
                                <ToggleButton label="Hide Followers:" />
                                <ToggleButton label="Hide Following:" />
                                <ToggleButton label="Hide Coins Purchases:" />
                                <ToggleButton label="Hide Deployed Chain:" />
                                <ToggleButton label="Notifications:" />
                                <div className='flex flex-col sm:flex-row sm:items-center items-start gap-4'>
                                    <label className='formLabel min-w-auto md:min-w-[150px] text-right'>Trust Score:</label>
                                    <div className='w-full'>
                                        <div className='w-full flex flex-col items-center bg-[#7E78AA] p-1'>
                                            <div className={`relative overflow-hidden bg-[#E9E9E9] h-[17.442px] w-full after:absolute after:bg-[#15C570] after:w-[${profile.trustScore}] after:h-[full] after:bottom-[-5px] after:left-[0px] after:top-[0px]`}></div>
                                        </div>
                                        <div className='flex justify-end items-end w-full'>
                                            <h5 className='PixelOperatorbold text-[12px] md:text-[13px] mt-1'>{profile.trustScore}/100</h5>
                                        </div>
                                    </div>
                                </div>
                                <InputField label="Member Since:" value={profileData?.member_since || ""} disabled={true} />
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
                                            <span>Edit</span>
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
}

export default Profile;
