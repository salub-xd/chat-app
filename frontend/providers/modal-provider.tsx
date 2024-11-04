'use client';

import React, { useState, useEffect } from 'react'
import { EditModal } from '@/components/modals/edit-modal';

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <EditModal />
        </>
    )
}