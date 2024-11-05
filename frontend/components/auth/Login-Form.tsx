"use client";

// import { CardWrapper } from '@/components/auth/card-wrapper';
import { LoginSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { FormError } from '@/components/auth/form-error';
import { FormSuccess } from '@/components/auth/form-success';
// import { login } from '@/actions/login';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';
import { BsGoogle } from 'react-icons/bs';
import axios from 'axios';
import { Social } from './social-login';

const LoginForm = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!"
        : "";

    // const [showTwoFactor, setShowTwoFactor] = useState(false);

    const [isPending, setIsPending] = useState<boolean | undefined>();
    const [isError, setIsError] = useState<string | undefined>("");
    const [isSuccess, setIsSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setIsError("");
        setIsSuccess("");
        try {
            setIsPending(true);
            await axios.post(`http://localhost:5000/userapi/loginuser`, { email: values.email, password: values.password }, { withCredentials: true });
            // const data =  response;
            // setIsSuccess(response.data?.success);
            setIsSuccess("User login sucessfully");
            form.reset();
            router.push('/');
            setIsPending(false);

        } catch (error: any) {
            if (error.response && error.response.data) {
                // Return error message from the backend
                setIsError(error.response.data.error)
            } else {
                // Return generic error message
                setIsError('Something went wrong!')
            }
            setIsPending(false);
        }
    };


    return (
        <div className="mt-20 mb-20 max-w-md mx-4 px-4 py-8 border rounded-md sm:mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Login</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} type='email' placeholder="johndoe@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className='flex justify-between items-center'>
                                    <FormLabel>Password</FormLabel>
                                    <Button
                                        disabled={isPending}
                                        size={"sm"}
                                        variant={"link"}
                                        className='px-0 font-normal'
                                    >
                                        <Link
                                            href={'/auth/reset'}
                                        >
                                            Forget Password?
                                        </Link>
                                    </Button>

                                </div>
                                <FormControl>
                                    <Input disabled={isPending} type='password' placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                                <Button
                                    disabled={isPending}
                                    size={"sm"}
                                    variant={"link"}
                                    className='flex items-center justify-center p-0 font-normal'>
                                    <Link
                                        href={'/register'}
                                    >
                                        Dont have account?
                                    </Link>
                                </Button>
                            </FormItem>
                        )}
                    />

                    <FormError message={isError || urlError} />
                    <FormSuccess message={isSuccess} />
                    <Button disabled={isPending} type="submit" className='w-full bg-white border text-black hover:bg-gray-50 hover:opacity-90' >
                        {isPending && <ClipLoader color="black" size={20} className="mr-2" />}
                        Sign in with Email
                    </Button>
                    <div className="flex items-center justify-center ">
                        <div className="border-t border-gray-300 flex-grow"></div>
                        <span className="mx-2 text-sm text-gray-500">OR CONTINUE WITH</span>
                        <div className="border-t border-gray-300 flex-grow"></div>
                    </div>
                    <Social>
                        
                    </Social>
                </form>
            </Form>
        </div>
    )
}

export default LoginForm;
