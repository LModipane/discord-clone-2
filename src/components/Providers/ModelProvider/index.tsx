'use client';

import {
	CreateChannelModel,
	CreateServerModel,
	DeleteChannelModel,
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
			<DeleteChannelModel />
			<DeleteServerModel />
			<EditChannelModel />
			<EditMembersModel />
			<EditServerModel />
			<InvitePersonModel />
			<LeaveServerModel />
		</>
	);
};

export default ModelProvider;
