import React from 'react'

const Navbar = (): React.ReactElement => {

    const handleSignup = () => {

    }

    return (
        <div className='h-20 bg-[#98DBC6] flex items-center justify-between px-8'>
            <div className='text-2xl font-bold'>Futflare</div>
            <button className='font-bold bg-[#F6E278] hover:bg-[#f6e178c7] transition-all duration-300 rounded-md px-4 py-2' onClick={handleSignup}>Signup</button>
        </div>
    )
}

export default Navbar
