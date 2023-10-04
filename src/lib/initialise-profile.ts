import 'server-only';
import { redirectToSignIn, currentUser } from '@clerk/nextjs';
import type { Profile } from '@prisma/client';
import db from './db';

/**
 * This method is used to initialise users profile information
 * @returns Users Profile
 */

export const initializeProfile = async (): Promise<Profile | undefined> => {
	try {
		//get user from clerk db
		const user = await currentUser();
		//if there is no user in clerk db redirct person to sign-in page
		if (!user) return redirectToSignIn();
		//get profile of user from planet scale database
		const profile = await db.profile.findUnique({
			where: {
				userId: user.id,
			},
		});
		//if there is a profile return that profile
		if (profile) return profile;
		//if there is no profile create a new profile
		const newProfile = await db.profile.create({
			data: {
				userId: user.id,
				name: `${user.firstName}_${user.lastName}`,
				imageUrl: user.imageUrl,
				email: user.emailAddresses[0].emailAddress,
			},
		});
		//finally return the new profile
		return newProfile;
	} catch (error) {
		console.log('Opps, failed to initialize profile');
	}
};
