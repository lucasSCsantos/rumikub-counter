export interface UserJoinEventData {
	username?: string;
	number: number;
	role: "ADMIN" | "USER";
	invite_id: string;
}

export interface UserJoinErrorEventData {
	error: string;
}

export interface UsersChangeEventData {
	number: number;
	role: "ADMIN" | "USER";
}

export interface UsersListEventData extends Omit<UserJoinEventData, "invite_id"> {
	id: string;
}