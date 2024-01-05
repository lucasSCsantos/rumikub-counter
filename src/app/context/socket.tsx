'use client';

import { useSocket } from "@/hooks/useSocket";
import { ReactNode, createContext, useContext } from "react";
import { Socket } from "socket.io-client";

const SocketContext = createContext<{
	socket?: Socket
}>({})

export const SocketContextProvider = ({ children }: { children: ReactNode | ReactNode[]}) => {
	const socket = useSocket(process.env.NEXT_PUBLIC_SOCKET_URL);

	return (
		<SocketContext.Provider value={{ socket }}>
			{children}
		</SocketContext.Provider>
	)
};

export const useSocketContext = () => useContext(SocketContext);