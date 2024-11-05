'use client'

import React, { useCallback } from 'react'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export const Social = () => {

    const router = useRouter();

    const handleClick = useCallback(async (cred: CredentialResponse) => {
        const googleToken = cred.credential;
        // console.log(googleToken);
        try {
            await axios.post('http://localhost:5000/userapi/auth/google', { token: googleToken }, { withCredentials: true });
            // console.log(response.data);
            router.push('/');
        } catch (error: any) {
            console.log(error.message);
        }
    }, [router]);

    return (
        <div className='flex items-center justify-center '>
            <GoogleLogin onSuccess={handleClick} size={'large'} width={'390px'} shape={'square'} />
        </div>
    )
}