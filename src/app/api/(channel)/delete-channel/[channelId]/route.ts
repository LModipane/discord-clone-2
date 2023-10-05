import { currentProfile } from '@/lib/current-profile';
import db from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {
	try {
		const profile = await currentProfile();
		if (!profile) return new NextResponse('unauthorized', { status: 401 });

		const { searchParams } = new URL(req.url);
		const serverId = searchParams.get('serverId');
		const { channelId } = params;

		if (!serverId || !channelId) return new NextResponse('bad request', { status: 400 });

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
					delete: {
						id: channelId,
						name: {
							not: 'general',
						},
					},
				},
			},
		});

		return new NextResponse('success', { status: 200 });
	} catch (error) {
		console.log('failed to delete channel', error);
		return new NextResponse('internal server error', { status: 500 });
	}
}
