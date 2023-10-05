import { currentProfile } from '@/lib/current-profile';
import db from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
	params: { inviteCode: string };
};

export default async function InvitePage({ params }: Props) {
	const profile = await currentProfile();
	if (!profile) return redirect('/');

	if (!params.inviteCode) return redirect('/');

	const existingServer = await db.server.findFirst({
		where: {
			inviteCode: params.inviteCode,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	});

	if (existingServer) return redirect(`/servers/${existingServer.id}`);

	const server = await db.server.update({
		where: {
			inviteCode: params.inviteCode,
		},
		data: {
			members: {
				create: [{ profileId: profile.id }],
			},
		},
	});

	if (server) return redirect(`/servers/${server.id}`);

	return null;
}
