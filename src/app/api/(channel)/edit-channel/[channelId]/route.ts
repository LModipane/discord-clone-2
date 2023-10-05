import { currentProfile } from '@/lib/current-profile';
import db from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { channel } from 'diagnostics_channel';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { channelId: string } }) {
	try {
		const profile = await currentProfile();
		if (!profile) return new NextResponse('unauthenticated', { status: 401 });

		const { channelId } = params;
		const { searchParams } = new URL(req.url);
		const serverId = searchParams.get('serverId');
		const { name, type } = await req.json();

		if (!channelId || !serverId) return new NextResponse('bad request', { status: 400 });

		await db.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: {
							in: [MemberRole.ADMIN, MemberRole.MODERATOR],
						},
					},
				},
			},
			data: {
				channels: {
					update: {
						where: {
							id: channelId,
							NOT: { name: 'general' },
						},
						data: {
							name,
							type,
						},
					},
				},
			},
		});

		return new NextResponse('success', { status: 200 });
	} catch (error) {
		console.log('failed to edit channel', error);
		return new NextResponse('internal server error', { status: 500 });
	}
}
