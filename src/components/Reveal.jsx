import React from 'react'
import LaunchCard from './LaunchCard'

const Reveal = () => {
    return (
        <div className='p-2 pt-10 md:p-10'>
            <h2 className=''>Reveals</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                <LaunchCard setSpace="medium" />
                <LaunchCard setSpace="medium" />
                <LaunchCard setSpace="medium" />
                <LaunchCard setSpace="medium" />
                <LaunchCard setSpace="medium" />
                <LaunchCard setSpace="medium" />
            </div>
        </div>
    )
}

export default Reveal