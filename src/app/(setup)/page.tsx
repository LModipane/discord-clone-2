import { ThemeToggle } from '@/components';
import { initializeProfile } from '@/lib/initialise-profile';
import { redirectToSignIn } from '@clerk/nextjs';
import db from '@/lib/db';
import { redirect } from 'next/navigation';
import { InitialModel } from '@/components/Models';

export default async function Home() {
	//get users profile
	const profile = await initializeProfile();
	if (!profile) return redirectToSignIn();
	//find server that users is appart of
	const server = await db.server.findFirst({
		where: {
			members: {
				some: {
					profileId: profile?.id,
				},
			},
		},
	});
	//if user is part of server navigate them to server page
	if (server) return redirect(`/servers/${server.id}`);
	//if user is not part of server render create server module
	return <InitialModel />;
}
