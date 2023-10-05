import React from 'react';
import ServerSidebarHeader from './ServerSidebarHeader';
import db from '@/lib/db';
import { redirect } from 'next/navigation';
import { currentProfile } from '@/lib/current-profile';
import { ChannelType } from '@prisma/client';

type Props = {
	serverId: string;
};

export default async function ServerSidebar({ serverId }: Props) {
	const profile = await currentProfile();
	if (!profile) return redirect('/');

	const server = await db.server.findUnique({
		where: {
			id: serverId,
		},
		include: {
			channels: {
				orderBy: {
					createdAt: 'asc',
				},
			},
			members: {
				include: {
					profile: true,
				},
				orderBy: {
					role: 'asc',
				},
			},
		},
	});

	if (!server) return redirect('/');

	const textChannels = server.channels.filter(channel => channel.type === ChannelType.TEXT);
	const audioChannels = server.channels.filter(channel => channel.type === ChannelType.AUDIO);
	const videoChannels = server.channels.filter(channel => channel.type === ChannelType.VIDEO);

	const members = server.members.filter(member => member.profileId !== profile.id);

	const role = server.members.find(member => member.profileId === profile.id)?.role;

	return (
		<div className="flex flex-col h-full w-full dark:bg-[#2b2d31] text-primary bg-[#f2f3f5]">
            <ServerSidebarHeader server={server} role={role} />
            
		</div>
	);
}