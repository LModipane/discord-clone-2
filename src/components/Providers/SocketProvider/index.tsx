'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io as ClientIO } from 'socket.io-client';

type SocketContext = {
	socket: any | null;
	isConnected: boolean;
};

const SocketContext = createContext<SocketContext>({
	socket: null,
	isConnected: false,
});

export const useSocket = () => {
	return useContext(SocketContext);
};

type Props = {
	children: React.ReactNode;
};

const SocketProvider = ({ children }: Props) => {
	const [socket, setSocket] = useState(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
			path: '/api/socket/io',
			addTrailingSlash: false,
		});

		socketInstance.on('connect', () => {
			setIsConnected(true);
		});

		socketInstance.on('disconnect', () => {
			setIsConnected(false);
		});

		setSocket(socketInstance);

		return () => {
			socketInstance.disconnect();
		};
	}, []);

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
	);
};

export default SocketProvider;
