'use client';
import ActionTooltip from '@/components/ActionTooltip';
import { ModelType, useModel } from '@/hooks/useModelhook';
import { cn } from '@/lib/utils';
import { Channel, MemberRole, Server, ChannelType } from '@prisma/client';
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

type Props = {
	channel: Channel;
	server: Server;
	role?: MemberRole;
};

const iconMap = {
	[ChannelType.TEXT]: Hash,
	[ChannelType.AUDIO]: Mic,
	[ChannelType.VIDEO]: Video,
};

const ServerChannel = ({ channel, server, role }: Props) => {
	const params = useParams();
	const router = useRouter();
	const Icon = iconMap[channel.type];
	const { onOpen } = useModel();

	const onClick = () => {
		router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
	};

	const onAction = (event: React.MouseEvent, action: ModelType) => {
		event.stopPropagation();
		onOpen(action, { channel, server });
	};
	return (
		<button
			className={cn(
				'group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
				params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700',
			)}
			onClick={onClick}>
			<Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
			<div className=" flex items-center max-w-[7.5rem]">
				<p className="overflow-hidden text-ellipsis">{channel.name}</p>
			</div>
			{role !== MemberRole.GUEST && channel.name !== 'general' && (
				<div className="ml-auto flex items0center gap-x-2">
					<ActionTooltip label="Edit">
						<Edit
							className="h-4 w-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
							onClick={event => onAction(event, 'edit-channel')}
						/>
					</ActionTooltip>
					<ActionTooltip label="Remove">
						<Trash
							className="h-4 w-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
							onClick={event => onAction(event, 'delete-channel')}
						/>
					</ActionTooltip>
				</div>
			)}
			{channel.name === 'general' && (
				<Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
			)}
		</button>
	);
};

export default ServerChannel;
