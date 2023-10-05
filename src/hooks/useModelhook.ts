import { create } from 'zustand';

type ModelType = 'create-server';

type ModelStore = {
	type: ModelType | null;
	isOpen: boolean;
	onOpen: (type: ModelType) => void;
	onClose: () => void;
};

export const useModel = create<ModelStore>(set => ({
	type: null,
	isOpen: false,
	onOpen: (type: ModelType) => set({ isOpen: true, type: type }),
	onClose: () => set({ isOpen: false, type: null }),
}));
