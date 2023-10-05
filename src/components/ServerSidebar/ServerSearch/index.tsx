'use client';

import ActionTooltip from '@/components/ActionTooltip';
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command';

import { Search } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Props = {
	data: {
		label: string;
		type: 'channel' | 'member';
		data:
			| {
					id: string;
					icon: React.ReactNode;
					name: string;
			  }[]
			| undefined;
	}[];
};

const ServerSearch = ({ data }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	useEffect(() => {
		const keysDown = (event: KeyboardEvent) => {
			if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				setIsOpen(true);
			}
		};

		document.addEventListener('keydown', keysDown);
		return () => document.removeEventListener('keydown', keysDown);
	}, []);

	const router = useRouter();
	const params = useParams();

	const onClick = ({ id, type }: { id: string; type: 'channel' | 'member' }) => {
		setIsOpen(false);
		if (type === 'channel') {
			return router.push(`servers/${params?.serverId}/channels/${id}`);
		}

		if (type === 'member') return router.push(`servers/${params?.serverId}/conversations/${id}`);
	};
	return (
		<>
			<ActionTooltip align="center" side="right" label="crtl + k">
				<button
					className="group p-2 rounded-lg flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition border-2 border-zinc-800/70 shadow-sm "
					onClick={() => setIsOpen(true)}>
					<Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
					<p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
						Search
					</p>
				</button>
			</ActionTooltip>
			<CommandDialog open={isOpen} onOpenChange={setIsOpen}>
				<CommandInput placeholder="Search all channels and or members" />
				<CommandEmpty>No Result Found</CommandEmpty>
				{data.map(({ label, data, type }) => {
					if (!data?.length) return null;
					return (
						<CommandGroup key={label} heading={label}>
							{data?.map(({ id, icon, name }) => (
								<CommandItem key={id} onSelect={() => onClick({ id, type })}>
									{icon}
									<span>{name}</span>
								</CommandItem>
							))}
						</CommandGroup>
					);
				})}
			</CommandDialog>
		</>
	);
};

export default ServerSearch;
