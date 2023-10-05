import { useSocket } from '@/components/Providers/SocketProvider';
import { useInfiniteQuery } from '@tanstack/react-query';
import qs from 'query-string';

type Props = {
	queryKey: string;
	apiUrl: string;
	paramKey: 'channelId' | 'conversationId';
	paramValue: string;
};

export const useChatQuery = ({ apiUrl, paramKey, paramValue, queryKey }: Props) => {
	const { isConnected } = useSocket();

	const fetchMessage = async ({ pageParam = undefined }) => {
		const url = qs.stringifyUrl(
			{
				url: apiUrl,
				query: {
					cursor: pageParam,
					[paramKey]: paramValue,
				},
			},
			{ skipNull: true },
		);

		const res = await fetch(url);
		return res.json();
	};

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
		queryKey: [queryKey],
		queryFn: fetchMessage,
		getNextPageParam: lastpage => lastpage?.nextCursor,
		refetchInterval: isConnected ? false : 1000, //this line always to fetch the message every second but only if we are not connected to our web socket
	});

	return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
};
