'use client';
import { useChatQuery } from '@/hooks/chat-query-hook';
import { MessageWithMemberWithProfile } from '@/types';
import { Member } from '@prisma/client';
import { Hash, Loader2, ServerCrash } from 'lucide-react';
import React, { Fragment } from 'react';
import ChatItem from './ChatItem';
import { format } from 'date-fns';
import { DATE_FORMAT } from '@/constants/data-formate';
import { useChatSocket } from '@/hooks/chat-socket-hook';

type Props = {
	name: string;
	member: Member;
	chatId: string;
	apiUrl: string;
	socketUrl: string;
	socketQuery: Record<string, string>;
	paramKey: 'channelId' | 'conversationId';
	paramValue: string;
	type: 'channel' | 'conversation';
};

const ChatMessage = ({
	apiUrl,
	chatId,
	member,
	name,
	paramKey,
	paramValue,
	socketQuery,
	socketUrl,
	type,
}: Props) => {
	const queryKey = `chat:${chatId}`;
	const addKey = `chat:${chatId}:messages`;
	const updateKey = `chat:${chatId}:messages:update`;
	useChatSocket({ queryKey, addKey, updateKey });

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
		apiUrl,
		paramKey,
		paramValue,
		queryKey,
	});

	if (status === 'loading') {
		return (
			<div className="flex flex-col items-center justify-center flex-1 gap-y-3">
				<Loader2 className="h-7 w-7 text-zinc-500 animate-spin" />
				<p className="text-xs text-zinc-500 dark:text-zinc-400">Loading messages....</p>
			</div>
		);
	}

	if (status === 'error') {
		return (
			<div className="flex flex-col items-center justify-center flex-1 gap-y-3">
				<ServerCrash className="h-7 w-7 text-zinc-500" />
				<p className="text-xs text-zinc-500 dark:text-zinc-400">Opps, Something went wrong !!!!</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col flex-1 py-4 overflow-x-auto">
			<ChatWelcome type={type} name={name} />
			<div className="flex flex-col-reverse">
				{data?.pages?.map((group, i) => (
					<Fragment key={i}>
						{group.items.map((message: MessageWithMemberWithProfile) => (
							<ChatItem
								key={message.id}
								content={message.content}
								currentMember={member}
								fileUrl={message.fileUrl}
								id={message.id}
								isDeleted={message.isDeleted}
								isUpdated={message.updatedAt !== message.createdAt}
								member={message.member}
								socketQuery={socketQuery}
								socketUrl={socketUrl}
								timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
							/>
						))}
					</Fragment>
				))}
			</div>
		</div>
	);
};

export default ChatMessage;

type ChatWelcomeProps = {
	type: 'channel' | 'conversation';
	name: string;
};

const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
	return (
		<div className="px-4 mb-4 space-y-2 mt-auto">
			{type === 'channel' && (
				<div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
					<Hash className="w-12 h-12 text-white" />
				</div>
			)}
			<p className="text-xl font-bold md:text-3xl">
				{type === 'channel' ? 'welcome to #' : ''}
				{name}
			</p>
			<p>
				{type === 'channel'
					? `This is the start of the #${name} channel`
					: `This is the start of your conversation conversation with ${name}`}
			</p>
		</div>
	);
};
