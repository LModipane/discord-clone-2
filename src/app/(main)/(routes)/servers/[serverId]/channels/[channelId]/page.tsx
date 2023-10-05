import { currentProfile } from '@/lib/current-profile';
import db from '@/lib/db';
import { redirectToSignIn, redirectToSignUp } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { ChatHeader, ChatInput, ChatMessages } from '@/components/Chat';

type Props = {
	params: {
		serverId: string;
		channelId: string;
	};
};

export default async function ChannelPage({ params }: Props) {
	const profile = await currentProfile();
	if (!profile) return redirectToSignIn();

	const channel = await db.channel.findUnique({
		where: {
			id: params.channelId,
		},
	});

	const member = await db.member.findFirst({
		where: {
			profileId: profile?.id,
			serverId: params?.serverId,
		},
	});

	if (!channel || !member) return redirect('/');

	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
			<ChatHeader name={channel.name} serverId={channel.serverId} type="channel" />
			<ChatMessages
				member={member}
				name={channel.name}
				type="channel"
				apiUrl="/api/message"
				socketUrl="/api/socket/message"
				socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
				paramKey="channelId"
				paramValue={channel.id}
				chatId={channel.id}
			/>
			<ChatInput
				name={channel.name}
				apiUrl="/api/socket/message"
				query={{ channelId: channel.id, serverId: channel.serverId }}
				type="channel"
			/>
		</div>
	);
}
