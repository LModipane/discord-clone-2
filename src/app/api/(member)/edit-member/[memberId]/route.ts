import { currentProfile } from '@/lib/current-profile';
import db from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { memberId: string } }) {
	try {
		const profile = await currentProfile();
		if (!profile) return new NextResponse('Unauthenticated', { status: 401 });

		const { role }: { role: MemberRole } = await req.json();
		const { searchParams } = new URL(req.url);

		const serverId = searchParams.get('serverId');
		const { memberId } = params;
		if (!serverId || !memberId) return new NextResponse('Bad Request', { status: 400 });

		const server = await db.server.update({
			where: {
				id: serverId,
				profileId: profile.id, //this line insure that only the admin can update the server
			},
			data: {
				members: {
					update: {
						where: {
							id: memberId,
							profileId: {
								not: profile.id,
							}, //this line ensure that the admin can change its role
						},
						data: {
							role,
						},
					},
				},
			},
			include: {
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

		return NextResponse.json(server);
	} catch (error) {
		console.log('failed to patch Role', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function DELETE(req: Request, { params }: { params: { memberId: string } }) {
	try {
		const profile = await currentProfile();
		if (!profile) return new NextResponse('Unauthenticated', { status: 401 });

		const { searchParams } = new URL(req.url);
		const serverId = searchParams.get('serverId');
		const { memberId } = params;

		if (!serverId || !memberId) return new NextResponse('Bad Request', { status: 400 });

		const server = await db.server.update({
			where: {
				id: serverId,
			},
			data: {
				members: {
					deleteMany: {
						id: memberId,
						profileId: {
							not: profile.id,
						}, //this ensures that ADMIN doesn't delete itself
					},
				},
			},
			include: {
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

		return NextResponse.json(server);
	} catch (error) {
		console.log('failed to delete member', error);
		return new NextResponse('internal server error', { status: 500 });
	}
}
