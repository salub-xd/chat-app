import { create } from 'zustand'

interface useRepostModalProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useEditModal = create<useRepostModalProps>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));