'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ActionTooltip } from '@/components';

type Props = {
	id: string;
	imageUrl: string;
	name: string;
};

const NavigationItem = ({ id, imageUrl, name }: Props) => {
	const params = useParams();
	const router = useRouter();

	const onClick = () => {
		router.push(`/servers/${id}`);
	};

	return (
		<ActionTooltip align="center" side="right" label={name}>
			<button className="group relative flex items-center" onClick={onClick}>
				<div
					className={cn(
						'absolute left-0 bg-primary w-[4px] transition-all rounded-full',
						params?.serverId !== id && 'group-hover:h-[20px]',
						params?.serverId === id ? 'h-[36px]' : 'h-[8px]',
					)}
				/>
				<div
					className={cn(
						'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
						params?.serverId === id && 'bg-primary/10 text-primary rounded-[16px]',
					)}>
					<Image className="object-cover object-center" src={imageUrl} alt="server-image" fill />
				</div>
			</button>
		</ActionTooltip>
	);
};

export default NavigationItem;
