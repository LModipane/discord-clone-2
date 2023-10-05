import { currentProfilePages } from '@/lib/current-profile-pages';
import db from '@/lib/db';
import { NextApiResponseServerIo } from '@/types';
import { NextApiRequest } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
	try {
		if (req.method !== 'POST') return res.status(405).json({ error: 'Bad Request' });

		const profile = await currentProfilePages(req);
		if (!profile) return res.status(401).json({ error: 'unauthorized' });

		const { content, fileUrl } = req.body;
		const { serverId, channelId } = req.query;

		if (!serverId || !channelId || !content) return res.status(400).json('Bad Request');

		const server = await db.server.findFirst({
			where: {
				id: serverId as string,
				members: {
					some: {
						profileId: profile.id,
					},
				},
			},
			include: {
				members: true,
			},
		});

		if (!server) return res.status(404).json({ error: ' not found' });

		const channel = await db.channel.findFirst({
			where: {
				id: channelId as string,
				serverId: serverId as string,
			},
		});

		if (!channel) return res.status(404).json({ error: 'not found' });

		const member = server.members.find(member => member.profileId === profile.id);
		if (!member) return res.status(404).json({ error: 'unautherised' });

		const message = await db.message.create({
			data: {
				content,
				fileUrl,
				channelId: channelId as string,
				memberId: member.id,
			},
			include: {
				member: {
					include: {
						profile: true,
					},
				},
			},
		});

		//emit socket event:
		const channelKey = `chat:${channelId}:messages`;
		res?.socket?.server?.io?.emit(channelKey, message);

		return res.status(200).json(message);
	} catch (error) {
		console.log('Failed to post message', error);
		return res.status(500).json({ error: 'internal server error' });
	}
}
