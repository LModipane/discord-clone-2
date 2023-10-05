import { useSocket } from '@/components/Providers/SocketProvider';
import { MessageWithMemberWithProfile } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

type Props = {
	addKey: string;
	updateKey: string;
	queryKey: string;
};
export const useChatSocket = ({ addKey, queryKey, updateKey }: Props) => {
	const { socket } = useSocket();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!socket) return;

		socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
			queryClient.setQueryData([queryKey], (oldData: any) => {
				if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;

				const newdata = oldData.pages.map((page: any) => {
					return {
						...page,
						items: page.items.map((item: MessageWithMemberWithProfile) => {
							if (item.id === message.id) return message;

							return item;
						}),
					};
				});

				return {
					...oldData,
					pages: newdata,
				};
			});
		});

		socket.on(addKey, (message: MessageWithMemberWithProfile) => {
			queryClient.setQueryData([queryKey], (oldData: any) => {
				if (!oldData || !oldData.pages || oldData.pages.length === 0)
					return { pages: [{ items: [message] }] };

				const newData = [...oldData.pages];
				newData[0] = { ...newData[0], items: [message, ...newData[0].items] };

				return { ...oldData, pages: newData };
			});
		});

		return () => {
			socket.off(addKey);
			socket.off(updateKey);
		};
	}, [socket, queryClient, queryKey, updateKey, addKey]);
};
