'use client';
import { useSocket } from '@/components/Providers/SocketProvider';
import { Badge } from '@/components/ui/badge';

import React from 'react';

const SocketIndicator = () => {
	const { isConnected } = useSocket();

	if (!isConnected)
		return (
			<Badge variant="outline" className="text-xs text-white bg-yellow-600 border-none">
				Fallback: Polling every 1 sec
			</Badge>
		);
	return (
		<Badge variant="outline" className="text-xs text-white border-none bg-emerald-600">
			Live: Real-Time-updates
		</Badge>
	);
};

export default SocketIndicator;
