import { User } from '@/types'
import React from 'react'

interface SelectUserProps {
    selectedUser: User;
}

export const ChatHeader: React.FC<SelectUserProps> = ({ selectedUser }) => {
    return (
        <header className="bg-black text-white p-4 ">
            <h1 className="text-xl font-semibold">
                {selectedUser.name}
            </h1>
        </header>
    )
}