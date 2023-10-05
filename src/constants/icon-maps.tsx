import { ChannelType, MemberRole } from '@prisma/client';
import { Mic, Hash, Video, ShieldAlert, ShieldCheck } from 'lucide-react';

export const iconMap = {
	[ChannelType.AUDIO]: <Mic className="w-4 h-4 mr-2" />,
	[ChannelType.TEXT]: <Hash className="w-4 h-4 mr-2" />,
	[ChannelType.VIDEO]: <Video className="w-4 h-4 mr-2" />,
};

export const roleMap = {
	[MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
	[MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />,
	[MemberRole.GUEST]: null,
};