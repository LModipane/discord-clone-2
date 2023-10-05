'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useModel } from '@/hooks/useModelhook';
import { cn } from '@/lib/utils';
import { MemberWithProfile, ServerWithMembersWithProfile } from '@/types';
import { MemberRole, Server } from '@prisma/client';
import axios from 'axios';

import {
	Axe,
	Check,
	Loader2,
	MoreVertical,
	Shield,
	ShieldAlert,
	ShieldCheck,
	ShieldQuestion,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import { useState } from 'react';

export const roleIconMap = {
	ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
	MODERATOR: <ShieldCheck className="h-4 w-4" />,
	GUEST: null,
};

//this component is responsible for prompting the user create their own server with image and name
const ManageMembersModel = () => {
	//this hook is used to open the create server model
	const { isOpen, onClose, type, data, onOpen } = useModel();
	const [selectedId, setSelectedId] = useState('');

	const { server } = data as { server: ServerWithMembersWithProfile };
	//we will need to open the model when the type of model is create model and when the model is open
	const isModelOpen = isOpen && type === 'edit-member';

	return (
		<Dialog open={isModelOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">Manage Members</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						{server?.members.length} Members
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="mt-8 max-h-[420px] pr-6">
					{server?.members.map(member => (
						<div className="flex items-center gap-x-2 mb-6" key={member.id}>
							<UserAvatar src={member.profile.imageUrl} />
							<div className="flex flex-col gap-y-1">
								<div className="text-xs font-semibold flex items-center gap-x-1">
									{member.profile.name}
									{roleIconMap[member.role]}
								</div>
								<p className="text-xs text-zinc-500">{member.profile.email}</p>
							</div>
							{server.profileId !== member.profileId && selectedId !== member.id && (
								<MembersMenu member={member} server={server} setSelectedId={setSelectedId} />
							)}
							{selectedId === member.id && (
								<Loader2 className="animate-spin text-zinc-500 ml-auto" />
							)}
						</div>
					))}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default ManageMembersModel;

type UserAvatarProps = {
	src?: string;
	className?: string;
};

export const UserAvatar = ({ src, className }: UserAvatarProps) => {
	return (
		<Avatar className={cn('h-8 w-8 md:h-10 md:w-10', className)}>
			<AvatarImage src={src} />
		</Avatar>
	);
};
type MembersMenuProps = {
	member: MemberWithProfile;
	setSelectedId: React.Dispatch<React.SetStateAction<any>>;
	server: Server;
};
const MembersMenu = ({ member, setSelectedId, server }: MembersMenuProps) => {
	const router = useRouter();
	const { onOpen } = useModel();

	const onRoleChange = async (memberId: string, role: MemberRole) => {
		try {
			setSelectedId(memberId);

			const url = qs.stringifyUrl({
				url: `/api/members/${memberId}`,
				query: {
					serverId: server?.id,
				},
			});

			const res: { data: ServerWithMembersWithProfile } = await axios.patch(url, { role });
			router.refresh();
			onOpen('edit-member', { server: res.data });
		} catch (error) {
			console.log('failed to patch role!!!', error);
		} finally {
			setSelectedId('');
		}
	};

	const onKickMember = async (memberId: string) => {
		try {
			setSelectedId(memberId);
			const url = qs.stringifyUrl({
				url: `/api/members/${memberId}`,
				query: {
					serverId: server?.id,
				},
			});
			const res: { data: ServerWithMembersWithProfile } = await axios.delete(url);
			router.refresh();
			onOpen('edit-member', { server: res.data });
		} catch (error) {
			console.log('Failed to kick member', error);
		} finally {
			setSelectedId('');
		}
	};
	return (
		<div className="ml-auto">
			<DropdownMenu>
				<DropdownMenuTrigger>
					<MoreVertical className="h-5 w-5 text-zinc-500" />
				</DropdownMenuTrigger>
				<DropdownMenuContent side="left">
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="flex items-center">
							<ShieldQuestion className="w-4 h-4 mr-2" />
							<span>Role</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem onClick={() => onRoleChange(member.id, 'GUEST')}>
									<Shield className="h-4 w-4 mr-2" />
									Guest
									{member.role === 'GUEST' && <Check className="h-4 w-4 ml-auto" />}
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => onRoleChange(member.id, 'MODERATOR')}>
									<ShieldCheck className="h-4 w-4 mr-2" />
									Moderator
									{member.role === 'MODERATOR' && <Check className="h-4 w-4 ml-auto" />}
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => onKickMember(member.id)}>
						<Axe className="h-4 w-4 mr-2" />
						Kick
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
