'use client';
import {
	CreateChannelModel,
	CreateServerModel,
	EditMembersModel,
	EditServerModel,
	InvitePersonModel,
} from '@/components/Models';

const ModelProvider = () => {
	return (
		<>
			<CreateChannelModel />
			<CreateServerModel />
			<EditServerModel />
			<EditMembersModel />
			<InvitePersonModel />
		</>
	);
};

export default ModelProvider;
