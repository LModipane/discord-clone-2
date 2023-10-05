'use client';
import { Plus } from 'lucide-react';
import React from 'react';

import { useModel } from '@/hooks/useModelhook';
import { ActionTooltip } from '@/components';

const NavigationAction = () => {
	const { onOpen } = useModel();
	return (
		<div>
			<ActionTooltip label="add your server" side="right" align="center">
				<button className="flex items-center group" onClick={() => onOpen('create-server')}>
					<div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[10px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
						<Plus className="transition group-hover:text-white text-emerald-500" size={25} />
					</div>
				</button>
			</ActionTooltip>
		</div>
	);
};

export default NavigationAction;
