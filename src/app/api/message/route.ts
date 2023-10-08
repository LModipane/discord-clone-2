import { currentProfile } from '@/lib/current-profile';
import db from '@/lib/db';
import { Message } from '@prisma/client';
import { NextResponse } from 'next/server';

const MESSAGES_BATCH_SIZE = 10;

export async function GET(req: Request) {
	try {
		const profile = await currentProfile();
		if (!profile) return new NextResponse('Unauthorized', { status: 401 });

		const { searchParams } = new URL(req.url);
		const cursor = searchParams.get('cursor'); //this is the cursor method for infinite loading
		const channelId = searchParams.get('channelId');

		if (!channelId) return new NextResponse('Bad Request', { status: 400 });

		let messages: Message[] = [];

		if (cursor) {
			messages = await db.message.findMany({
				take: MESSAGES_BATCH_SIZE,
				skip: 1,
				cursor: {
					id: cursor,
				},
				where: {
					channelId,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
				orderBy: {
					createdAt: 'desc',
				},
			});
		} else {
			messages = await db.message.findMany({
				take: MESSAGES_BATCH_SIZE,
				where: {
					channelId,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
				orderBy: {
					createdAt: 'desc',
				},
			});
		}

		let nextCursor = null;
		if (messages.length === MESSAGES_BATCH_SIZE) nextCursor = messages[MESSAGES_BATCH_SIZE - 1].id;

		return NextResponse.json({
			items: messages,
			nextCursor,
		});
	} catch (error) {
		console.log('failed to get messages', error);
		return new NextResponse('internal server error', { status: 500 });
	}
}
