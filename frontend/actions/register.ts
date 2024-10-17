'use server';

import * as z from 'zod';
import axios from 'axios';
import { RegisterSchema } from '@/schemas';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    try {
        console.log(values);
        
        const response = await axios.post(`${process.env.NEXT_BACKEND_URL}/userapi/registeruser`, { name:values.name,username:values.username,email:values.email,password:values.password });
        console.log(response);
        
        return { success: "User registered sucessfully!" };

  } catch (error: any) {
    // Catch any axios or backend error
    if (error.response && error.response.data) {
      // Return error message from the backend
      return { error: error.response.data.error };
    } else {
      // Return generic error message
      return { error: 'Something went wrong. Please try again.' };
    }
  }
};