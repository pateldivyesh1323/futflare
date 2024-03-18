import React from 'react'
import { useUserAuth } from '../providers/UserAuthProvider'

const Navbar = (): React.ReactElement => {

    const { login, logout, isAuthenticated } = useUserAuth();

    return (
        <div className='h-20 bg-vistablue flex items-center justify-between px-8 sticky top-0 shadow-lg shadow-icecold mb-4'>
            <div className='text-2xl text-red font-bold font-norican'>Futflare</div>
            {isAuthenticated ?
                <button className='font-bold bg-yellow hover:bg-[#f6e178c7] transition-all duration-300 rounded-md px-4 py-2' onClick={logout}>Logout</button> :
                <button className='font-bold bg-yellow hover:bg-[#f6e178c7] transition-all duration-300 rounded-md px-4 py-2' onClick={login}>Signin</button>
            }
        </div>
    )
}

export default Navbar
