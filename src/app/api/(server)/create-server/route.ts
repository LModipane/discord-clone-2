import { currentProfile } from '@/lib/current-profile';
import db from '@/lib/db';
import { createServerFormSchema } from '@/types/formschema';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
	try {
		const profile = await currentProfile();
		if (!profile) return new NextResponse('Unauthorized', { status: 401 });

		const body = await req.json();
		const { imageUrl, name } = createServerFormSchema.parse(body);

		await db.server.create({
			data: {
				profileId: profile.id,
				name,
				imageUrl,
				inviteCode: uuidv4(),
				channels: {
					create: [{ name: 'general', profileId: profile.id }],
				},
				members: {
					create: [{ profileId: profile.id, role: 'ADMIN' }],
				},
			},
		});

		return new NextResponse('Successfully created server', { status: 200 });
	} catch (error) {
		if (error instanceof ZodError) {
			console.log('ZodError: ', error);
			return new NextResponse('Bad Request!!!!', { status: 400 });
		}
		console.log('failed to Create Server', error);
		return new NextResponse('internal server error!!!!', { status: 500 });
	}
}
