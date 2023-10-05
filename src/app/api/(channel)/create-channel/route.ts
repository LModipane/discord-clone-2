import { currentProfile } from '@/lib/current-profile';
import db from '@/lib/db';
import { createChannelFormSchema } from '@/types/formschema';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(req: Request) {
	try {
		const profile = await currentProfile();
		if (!profile) return new NextResponse('Unauthenticated', { status: 401 });

		const body = await req.json();
		//pare request
		const { type, name } = createChannelFormSchema.parse(body);
		const { searchParams } = new URL(req.url);
		const serverId = searchParams.get('serverId');

		if (!serverId || !type || !name) return new NextResponse('BAD request', { status: 400 });

		if (name === 'general') return new NextResponse('Bad request', { status: 400 });

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
					create: {
						profileId: profile.id,
						name,
						type,
					},
				},
			},
		});

		return new NextResponse('Successfully created current user server!!!', { status: 200 });
	} catch (error) {
		if (error instanceof ZodError) {
			return new NextResponse('BAD request', { status: 400 });
		}
		console.log('Failed to create channel', error);
		return new NextResponse('internal error', { status: 500 });
	}
}
