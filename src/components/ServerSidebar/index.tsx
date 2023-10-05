import React from 'react';
import ServerSidebarHeader from './ServerSidebarHeader';
import db from '@/lib/db';
import { redirect } from 'next/navigation';
import { currentProfile } from '@/lib/current-profile';
import { ChannelType } from '@prisma/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import ServerSearch from './ServerSearch';
import { roleMap } from '@/constants/icon-maps';
import { Separator } from '@/components/ui/separator';
import ServerSection from './ServerSection';
import { Mic, Hash, Video } from 'lucide-react';
import ServerChannel from './ServerChannel';
import { ServerMember } from './ServerMember';

type Props = {
	serverId: string;
};

const iconMap = {
	[ChannelType.AUDIO]: <Mic className="w-4 h-4 mr-2" />,
	[ChannelType.TEXT]: <Hash className="w-4 h-4 mr-2" />,
	[ChannelType.VIDEO]: <Video className="w-4 h-4 mr-2" />,
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
			<ScrollArea className="flex-1 px-3">
				<div className="mt-2">
					<ServerSearch
						data={[
							{
								label: 'Text Channels',
								type: 'channel',
								data: textChannels?.map(channel => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap[channel.type],
								})),
							},
							{
								label: 'Voice Channels',
								type: 'channel',
								data: audioChannels?.map(channel => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap[channel.type],
								})),
							},
							{
								label: 'Video Channels',
								type: 'channel',
								data: videoChannels?.map(channel => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap[channel.type],
								})),
							},
							{
								label: 'Members',
								type: 'member',
								data: members?.map(member => ({
									id: member.id,
									name: member.profile.name,
									icon: roleMap[member.role],
								})),
							},
						]}
					/>
				</div>
				<Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />
				{!!textChannels.length && (
					<div className="mb-2">
						<ServerSection
							sectionType="channel"
							channelType={ChannelType.TEXT}
							role={role}
							label="Text Channel"
						/>
						{textChannels.map(channel => (
							<ServerChannel key={channel.id} channel={channel} server={server} role={role} />
						))}
					</div>
				)}
				{!!audioChannels.length && (
					<div className="mb-2">
						<ServerSection
							sectionType="channel"
							channelType={ChannelType.AUDIO}
							role={role}
							label="Voice Channel"
						/>
						{audioChannels.map(channel => (
							<ServerChannel key={channel.id} channel={channel} server={server} role={role} />
						))}
					</div>
				)}
				{!!videoChannels.length && (
					<div className="mb-2">
						<ServerSection
							sectionType="channel"
							channelType={ChannelType.VIDEO}
							role={role}
							label="Video Channel"
						/>
						{videoChannels.map(channel => (
							<ServerChannel key={channel.id} channel={channel} server={server} role={role} />
						))}
					</div>
				)}
				{!!members.length && (
					<div className="mb-2">
						<ServerSection sectionType="member" role={role} label=" Members" server={server} />
						{members.map(member => (
							<ServerMember key={member.id} member={member} />
						))}
					</div>
				)}
			</ScrollArea>
		</div>
	);
}
