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
import { useEffect, useState } from 'react';

const ModelProvider = () => {
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<>
			<CreateChannelModel />
			<CreateServerModel />
			<DeleteChannelModel />
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
