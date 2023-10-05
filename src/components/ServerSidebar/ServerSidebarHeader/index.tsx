'use client';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useModel } from '@/hooks/useModelhook';
import { ServerWithMembersWithProfile } from '@/types';
import { MemberRole } from '@prisma/client';
import { ChevronDown, LogOut, Plus, PlusCircle, Settings, Trash, Users } from 'lucide-react';
import React from 'react';

type Props = {
	server: ServerWithMembersWithProfile;
	role?: MemberRole;
};

const ServerSidebarHeader = ({ server, role }: Props) => {
	const { onOpen } = useModel();
	const isAdmin = role === MemberRole.ADMIN;
	const isModerator = role === MemberRole.MODERATOR || role === MemberRole.ADMIN;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="focus:outline-none" asChild>
				<button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
					{server.name}
					<ChevronDown className="h-5 w-5 ml-auto" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
				{isModerator && (
					<>
						<DropdownMenuItem
							className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
							onClick={() => onOpen('invite-person', { server })}>
							Invite People
							<Plus className="ml-auto" />
						</DropdownMenuItem>
						<DropdownMenuItem
							className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
							onClick={() => onOpen('create-channel')}>
							Create Channels
							<PlusCircle className="ml-auto" />
						</DropdownMenuItem>
					</>
				)}
				{isAdmin && (
					<>
						<DropdownMenuItem
							className=" px-3 py-2 text-sm cursor-pointer"
							onClick={() => onOpen('edit-server', { server })}>
							Server Settings
							<Settings className="ml-auto" />
						</DropdownMenuItem>
						<DropdownMenuItem
							className=" px-3 py-2 text-sm cursor-pointer"
							onClick={() => onOpen('edit-member', { server })}>
							Manage Members
							<Users className="ml-auto" />
						</DropdownMenuItem>
						<DropdownMenuItem
							className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
							onClick={() => onOpen('delete-server', { server })}>
							Delete server
							<Trash className="ml-auto" />
						</DropdownMenuItem>
						<DropdownMenuSeparator />
					</>
				)}

				{!isAdmin && (
					<DropdownMenuItem
						className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
						onClick={() => onOpen('leave-server', { server })}>
						Leave server
						<LogOut className="ml-auto" />
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ServerSidebarHeader;
