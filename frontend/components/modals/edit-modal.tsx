"use client";

import React, { useState } from 'react'
import * as z from 'zod';
import axios from 'axios';

import { Modal } from '@/components/ui/modal';
import { useEditModal } from '@/hooks/use-edit-modal';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const formSchema = z.object({
    message: z.string().min(3, {
        message: "Name must be at least 2 characters.",
    }),
})

export function EditModal() {
    const editModal = useEditModal();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        try {
            setLoading(true);
            const response = await axios.post(`/api/stores`, values);
            toast.success('Success')
            window.location.assign(`${response.data.id}`)

        } catch (error:any) {
            toast.error('Something went wrong.')
        } finally {
            setLoading(false);
        }
    }


    return (
        <Modal title='Create Store' description='Add new a store to manage products.' isOpen={editModal.isOpen} onClose={editModal.onClose}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                    <Input placeholder="message" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                        <Button disabled={loading} variant={'outline'} onClick={editModal.onClose}>Close</Button>
                        <Button disabled={loading} type="submit">Continue</Button>
                    </div>
                </form>
            </Form>
        </Modal >
    )
}