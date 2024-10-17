import Cookies from 'js-cookie';

export const cookie = ()=>{
    const token = Cookies.get('token');  // Retrieve JWT from cookies

    return token;
} 
