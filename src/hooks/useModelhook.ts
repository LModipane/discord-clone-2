import { ChannelType, Server, Channel } from '@prisma/client';
import { create } from 'zustand';

export type ModelType =
	| 'create-server'
	| 'create-channel'
	| 'edit-server'
	| 'edit-member'
	| 'invite-person'
	| 'delete-server'
	| 'leave-server'
	| 'edit-channel'
	| 'delete-channel'
	| 'delete-message'
	| 'message-file';

type ModelData = {
	server?: Server;
	channelType?: ChannelType;
	channel?: Channel;
	apiUrl?: string;
	query?: Record<string, any>;
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
