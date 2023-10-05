import { currentProfile } from '@/lib/current-profile';
import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { serverId: string } }) {
	try {
		const profile = await currentProfile();
		if (!profile) return new NextResponse('unauthorized', { status: 400 });

		const { serverId } = params;
		if (!serverId) return new NextResponse('bad request', { status: 400 });

		await db.server.deleteMany({
			where: {
				id: serverId,
			},
		});

		return new NextResponse('success', { status: 200 });
	} catch (error) {
		console.log('Failed to delete server', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
