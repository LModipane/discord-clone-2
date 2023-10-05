import { currentProfile } from '@/lib/current-profile';
import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
	try {
		const profile = await currentProfile();
		if (!profile) return new NextResponse('unauthenticated', { status: 401 });

		const { serverId } = params;
		if (!serverId) return new NextResponse('BAD REQUEST', { status: 400 });

		await db.server.update({
			where: {
				id: serverId,
				profileId: {
					not: profile.id,
				}, //this line enusre that admin doean leave
			},
			data: {
				members: {
					deleteMany: {
						profileId: profile.id,
					},
				},
			},
		});

		return new NextResponse('Successfully deleted', { status: 200 });
	} catch (error) {
		console.log('Failed to Leave Server', error);
		return new NextResponse('internal server error', { status: 500 });
	}
}
