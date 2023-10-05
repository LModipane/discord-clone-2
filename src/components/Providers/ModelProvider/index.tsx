'use client';
import {
	CreateChannelModel,
	CreateServerModel,
	EditServerModel,
	InvitePersonModel,
} from '@/components/Models';

const ModelProvider = () => {
	return (
		<>
			<CreateChannelModel />
			<CreateServerModel />
			<EditServerModel />
			<InvitePersonModel />
		</>
	);
};

export default ModelProvider;
