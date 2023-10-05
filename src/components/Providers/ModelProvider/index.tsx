'use client';

import CreateChannelModel from '@/components/Models/createChannelModel';
import CreateServerModel from '@/components/Models/createServerModel';
import DeleteChannelModel from '@/components/Models/deleteChannelModel';
import DeleteServerModel from '@/components/Models/deleteServerModel';
import LeaveServerModel from '@/components/Models/deleteServerModel';
import EditChannelModel from '@/components/Models/editChannelModel';
import EditMembersModel from '@/components/Models/editMembersModel';
import EditServerModel from '@/components/Models/editServerModel';
import InvitePersonModel from '@/components/Models/invitePersonModel';

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
