// 'use client';

// import * as z from 'zod';
// import axios from 'axios';
// import { LoginSchema} from '@/schemas';

// export const login = async (values: z.infer<typeof LoginSchema>) => {
//   try {
//     // console.log(values);

//     const response = await axios.post(`http://localhost:5000/userapi/loginuser`, { email: values.email, password: values.password }, { withCredentials: true });
//     // const { token, user } = response.data;
//     console.log(response.data);

//     // Store the token (in localStorage or cookies)
//     // localStorage.setItem('token', token);


//     // return { user, token };
//     // if(response.data.error){
//     //   console.log(response.data.error);
//     // }

//     return { success: "User login sucessfully!" };

//   } catch (error: any) {
//     // Catch any axios or backend error
//     if (error.response && error.response.data) {
//       // Return error message from the backend
//       return { error: error.response.data.error };
//     } else {
//       // Return generic error message
//       return { error: 'Something went wrong. Please try again.' };
//     }
//   }
// };