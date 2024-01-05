"use client"

import { useEffect, useRef } from "react"
import { ManagerOptions, io, Socket, SocketOptions } from "socket.io-client"

export const useSocket = (
	uri: string,
	opts?: Partial<ManagerOptions & SocketOptions> | undefined
): Socket => {
	const { current: socket } = useRef(io(uri, opts));

	return socket;
}