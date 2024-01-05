// 'use client';

// import { ReactNode, createContext, useContext, useState } from "react";
// import { User } from "socket.io-client";

// const UserContext = createContext<{
// 	socket?: User
// }>({})

// export const UserContextProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
// 	const [user, setUser] = useState({})


// 	return (
// 		<UserContext.Provider value={{ socket }}>
// 			{children}
// 		</UserContext.Provider>
// 	)
// };

// export const useUserContext = () => useContext(UserContext);