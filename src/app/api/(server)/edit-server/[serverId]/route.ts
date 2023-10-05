import { currentProfile } from '@/lib/current-profile';
import db from '@/lib/db';
import { createServerFormSchema } from '@/types/formschema';

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function PATCH (req: Request, { params }: { params: { serverId: string } }) {
	console.log('Hello');
	try {
		const profile = await currentProfile();
		if (!profile) return new NextResponse('Unauthorized', { status: 401 });

		const body = await req.json();
		const { imageUrl, name } = createServerFormSchema.parse(body);

		await db.server.update({
			where: {
				id: params?.serverId,
				profileId: profile.id,
			},
			data: {
				name,
				imageUrl,
			},
		});

		return new NextResponse('success', { status: 200 });
	} catch (error) {
		if (error instanceof ZodError) {
			console.log('Bad Request: ', error);
			return new NextResponse('Bad Request', { status: 400 });
		}

		console.log('failed to edit server!!!', error);
		return new NextResponse('Interval Error!!!', { status: 500 });
	}
}
