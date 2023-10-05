import { Server } from '@prisma/client';
import { create } from 'zustand';

type ModelType = 'create-server' | 'invite-person';

type ModelData = {
	server?: Server;
};

type ModelStore = {
	type: ModelType | null;
	isOpen: boolean;
	data: ModelData;
	onOpen: (type: ModelType, data?: ModelData) => void;
	onClose: () => void;
};

export const useModel = create<ModelStore>(set => ({
	type: null,
	isOpen: false,
	data: {},
	onOpen: (type: ModelType, data: ModelData = {}) => set({ isOpen: true, type: type, data }),
	onClose: () => set({ isOpen: false, type: null, data: {} }),
}));
