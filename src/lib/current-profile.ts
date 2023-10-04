import { auth } from '@clerk/nextjs';
import db from './db';
import { type Profile } from '@prisma/client';

//this function is responsible for fetching the profile for the current user
export const currentProfile = async (): Promise<Profile | null | undefined> => {
	try {
		const { userId } = await auth();
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
