import { UserAvatar, MobileToggle } from '@/components';
import { SocketIndicator } from '@/components';
import { Hash } from 'lucide-react';

type ChatHeaderProps = {
	serverId: string;
	name: string;
	type: 'channel' | 'conversation';
	imageUrl?: string;
};

const ChatHeader = ({ name, serverId, type, imageUrl }: ChatHeaderProps) => {
	return (
		<div className="flex items-center h-12 px-3 font-semibold border-b-2 text-md border-neutral-200 dark:border-neutral-800 gap-x-2">
			<MobileToggle serverId={serverId} />
			{type === 'channel' && <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zonc-400" />}
			{type === 'conversation' && <UserAvatar className="w-8 h-8 md:h-8 md:w-8" src={imageUrl} />}
			<p className="font-semibold text-black text-md dark:text-white">{name}</p>
			<div className="flex items-center ml-auto">
				<SocketIndicator />
			</div>
		</div>
	);
};

export default ChatHeader;
