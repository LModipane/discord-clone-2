'use client';
import {
	CreateChannelModel,
	CreateServerModel,
	DeleteServerModel,
	EditChannelModel,
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
			<EditChannelModel />
			<EditServerModel />
			<EditMembersModel />
			<InvitePersonModel />
			<LeaveServerModel />
		</>
	);
};

export default ModelProvider;
