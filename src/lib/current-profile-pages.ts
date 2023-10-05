import { getAuth } from '@clerk/nextjs/server';
import db from './db';
import { type Profile } from '@prisma/client';
import { NextApiRequest } from 'next';

//this function is responsible for fetching the profile for the current user
export const currentProfilePages = async (
	req: NextApiRequest,
): Promise<Profile | null | undefined> => {
	try {
		const { userId } = await getAuth(req);
		if (!userId) return null;

		const profile = await db.profile.findUnique({
			where: {
				userId,
			},
		});

		return profile;
	} catch (error) {
		console.log('Failed to get current profile!!!');
	}
};
