import { ServerSidebar } from '@/components';
import React from 'react';

type Props = {
	params: { serverId: string };
	children: React.ReactNode;
};

export default function layout({ params, children }: Props) {
	return (
		<div className="h-full ">
			<div className="fixed inset-y-0 z-20 flex-col hidden h-full md:flex w-60">
				<ServerSidebar serverId={params?.serverId} />
			</div>
			<main className="h-full md:pl-60">{children}</main>
		</div>
	);
}
