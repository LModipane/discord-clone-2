'use client';
import ActionTooltip from '@/components/ActionTooltip';
import { useModel } from '@/hooks/useModelhook';
import { ServerWithMembersWithProfile } from '@/types';
import { ChannelType, MemberRole } from '@prisma/client';
import { Plus, Settings } from 'lucide-react';

import React from 'react';

type Props = {
	label: string;
	role?: MemberRole;
	sectionType: 'channel' | 'member';
	channelType?: ChannelType;
	server?: ServerWithMembersWithProfile;
};
const ServerSection = ({ label, sectionType, channelType, role, server }: Props) => {
	const { onOpen } = useModel();
	return (
		<div className="flex items-center justify-between py-2">
			<p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">{label}</p>
			{role !== MemberRole.GUEST && sectionType === 'channel' && (
				<ActionTooltip label="Create Channel" side="top">
					<button
						onClick={() => onOpen('create-channel', { channelType })}
						className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
						<Plus className="h-4 w-4" />
					</button>
				</ActionTooltip>
			)}
			{role === MemberRole.ADMIN && sectionType === 'member' && (
				<ActionTooltip label="Manage Members" side="top">
					<button
						onClick={() => onOpen('edit-member', { server })}
						className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
						<Settings className="h-4 w-4" />
					</button>
				</ActionTooltip>
			)}
		</div>
	);
};

export default ServerSection;
