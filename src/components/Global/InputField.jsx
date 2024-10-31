import React from 'react';

const InputField = ({ label, placeholder = "", value, onChange, disabled = false }) => {
    return (
        <div className='flex flex-col sm:flex-row sm:items-center items-start gap-4'>
            <label className='formLabel min-w-auto md:min-w-[150px] text-right'>{label}</label>

            <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                    <input 
                        type="text" 
                        value={value} 
                        placeholder={placeholder} 
                        onChange={onChange} 
                        disabled={disabled}
                        className={`w-full px-2 py-3 ${disabled ? 'bg-gray-200' : ''}`} // Optional styling for disabled state
                    />
                </div>
            </div>
        </div>
    );
}

export default InputField;
