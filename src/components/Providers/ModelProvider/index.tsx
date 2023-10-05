'use client';
import {
	CreateChannelModel,
	CreateServerModel,
	DeleteServerModel,
	EditMembersModel,
	EditServerModel,
	InvitePersonModel,
	LeaveServerModel,
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
			<LeaveServerModel />
		</>
	);
};

export default ModelProvider;
