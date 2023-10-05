'use client';
import { CreateChannelModel, CreateServerModel, InvitePersonModel } from '@/components/Models';

const ModelProvider = () => {
	return (
		<>
			<CreateServerModel />
			<CreateChannelModel />
			<InvitePersonModel />
		</>
	);
};

export default ModelProvider;
