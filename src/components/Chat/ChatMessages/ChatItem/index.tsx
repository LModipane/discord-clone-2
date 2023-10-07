'use client';
import { UserAvatar, ActionTooltip } from '@/components';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, Form } from '@/components/ui/form';
import { roleMap } from '@/constants/icon-maps';
import { useModel } from '@/hooks/useModelhook';
import { cn } from '@/lib/utils';
import { MemberWithProfile } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Member, MemberRole } from '@prisma/client';
import axios from 'axios';
import { Edit, Trash, File } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { EditMessageFormSchema } from '@/types/formschema';
import qs from 'query-string';

type ChatItemProps = {
	id: string;
	member: MemberWithProfile;
	content: string;
	timestamp: string;
	fileUrl: string | null;
	isDeleted: boolean;
	isUpdated: boolean;
	currentMember: Member;
	socketUrl: string;
	socketQuery: Record<string, string>;
};

const ChatItem = ({
	content,
	currentMember,
	fileUrl,
	id,
	isDeleted,
	isUpdated,
	member,
	socketQuery,
	socketUrl,
	timestamp,
}: ChatItemProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const { onOpen } = useModel();
	const router = useRouter();

	const isAdmin = currentMember.role === MemberRole.ADMIN;
	const isModerator = currentMember.role === MemberRole.MODERATOR;
	const isOwner = currentMember.id === member.id;

	const canDeleteMessage = !isDeleted && (isAdmin || isModerator || isOwner);
	const canEditMessage = !isDeleted && isOwner && !fileUrl;

	const fileType = fileUrl?.split('.').pop();
	const isPDF = fileType === 'pdf';
	const isImage = !isPDF && fileUrl;

	const form = useForm<z.infer<typeof EditMessageFormSchema>>({
		defaultValues: {
			content: '',
		},
		resolver: zodResolver(EditMessageFormSchema),
	});

	const isLoading = form.formState.isSubmitting;

	useEffect(() => {
		form.reset({
			content: content,
		});
	}, [content, form]);

	useEffect(() => {
		const handleKeysDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' || event.keyCode === 27) setIsEditing(false);
		};

		window.addEventListener('keydown', handleKeysDown);
		return () => window.removeEventListener('keydown', handleKeysDown);
	}, []);

	const onSubmit = async (value: z.infer<typeof EditMessageFormSchema>) => {
		console.log('Hello from onSubmit');
		try {
			const url = qs.stringifyUrl({
				url: `${socketUrl}/${id}`,
				query: socketQuery,
			});

			await axios.patch(url, value);

			setIsEditing(false);
			form.reset();
		} catch (error) {
			console.log('failed to sumbit edited message', error);
		}
	};

	const onMemberClick = () => {
		if (member.id === currentMember.id) return;
		router.push(`/servers/${member.serverId}/conversations/${member.id}`);
	};

	return (
		<div className="relative flex items-center w-full p-4 transition group hover:bg-black/5">
			<div className="flex items-start w-full group gap-x-2 ">
				<div
					className="transition cursor-pointer hover:drop-shadow-md"
					onClick={() => onMemberClick()}>
					<UserAvatar src={member.profile.imageUrl} />
				</div>
				<div className="flex flex-col w-full">
					<div className="flex item-center gap-x-2">
						<div className="flex items-center gap-x-1">
							<p
								className="text-sm font-semibold cursor-pointer hover:underline"
								onClick={() => onMemberClick()}>
								{member.profile.name}
							</p>
							<ActionTooltip label={member.role} side="top">
								{roleMap[member.role]}
							</ActionTooltip>
						</div>
						<span className="text-xs text-zinc-500 dark:text-zinc-400">{timestamp}</span>
					</div>
					{isImage && (
						<a
							href={fileUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="relative flex items-center w-48 h-48 mt-2 border rounded-md aspect-square overflow-hidded bg-secondary">
							<Image src={fileUrl} alt={content} fill className="object-cover" />
						</a>
					)}
					{isPDF && (
						<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
							<File className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
							<a
								href={fileUrl || ''}
								target="_blank"
								rel="noopener noreferrer"
								className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
								PDF File
							</a>
						</div>
					)}
					{!fileUrl && !isEditing && (
						<p
							className={cn(
								'text-sm text-zinc-600 dark:text-zinc-300',
								isDeleted && 'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1',
							)}>
							{content}
							{isUpdated && !isDeleted && (
								<span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">(edited)</span>
							)}
						</p>
					)}
					{!fileUrl && isEditing && (
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="flex items-center w-full pt-2 gap-x-2">
								<FormField
									control={form.control}
									name="content"
									render={({ field }) => (
										<FormItem className="flex-1">
											<div className="relative w-full">
												<Input
													disabled={isLoading}
													className="p-2 border-0 border-none bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
													placeholder="Edit Message"
													{...field}
												/>
											</div>
										</FormItem>
									)}
								/>
								<Button size="sm" variant="primary" disabled={isLoading}>
									Save
								</Button>
							</form>
							<span className="text-[10px] mt-1 text-zinc-400">
								Press escape to cancel, enter to save
							</span>
						</Form>
					)}
				</div>
			</div>
			{canDeleteMessage && (
				<div className="absolute items-center hidden p-1 bg-white border rounded-sm group-hover:flex gap-x-2 -top-2 right-5 dark:bg-zinc-800">
					{canEditMessage && (
						<ActionTooltip label="edit">
							<Edit
								className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
								onClick={() => setIsEditing(true)}
							/>
						</ActionTooltip>
					)}
					<ActionTooltip label="edit">
						<Trash
							className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
							onClick={() =>
								onOpen('delete-message', { apiUrl: `${socketUrl}/${id}`, query: socketQuery })
							}
						/>
					</ActionTooltip>
				</div>
			)}
		</div>
	);
};

export default ChatItem;
