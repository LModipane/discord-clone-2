'use client';
import {
	CreateChannelModel,
	CreateServerModel,
	DeleteServerModel,
	EditMembersModel,
	EditServerModel,
	InvitePersonModel,
} from '@/components/Models';

const ModelProvider = () => {
	return (
		<>
			<CreateChannelModel />
			<CreateServerModel />
			<DeleteServerModel />
			<EditServerModel />
			<EditMembersModel />
			<InvitePersonModel />
		</>
	);
};

export default ModelProvider;
