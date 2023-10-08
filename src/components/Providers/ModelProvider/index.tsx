'use client';

import {
	CreateChannelModel,
	CreateServerModel,
	DeleteChannelModel,
	DeleteMessageModel,
	DeleteServerModel,
	EditChannelModel,
	EditMembersModel,
	EditServerModel,
	InvitePersonModel,
	LeaveServerModel,
	MessageFileModel,
} from '@/components/Models';

const ModelProvider = () => {
	return (
		<>
			<CreateChannelModel />
			<CreateServerModel />
			<DeleteChannelModel />
			<DeleteMessageModel />
			<DeleteServerModel />
			<EditChannelModel />
			<EditMembersModel />
			<EditServerModel />
			<InvitePersonModel />
			<LeaveServerModel />
			<MessageFileModel />
		</>
	);
};

export default ModelProvider;
