"use client";

import { LegacyRef, MutableRefObject, useEffect, useRef, useState} from "react";
import { useSocketContext } from "./context/socket";
import { useSessionStorage } from "usehooks-ts";
import Button from "@/components/button";
import { UserJoinErrorEventData, UserJoinEventData, UsersChangeEventData } from "@/@types/socket";
import actions from "@/data/actions";

export default function Home() {
  const usernameRef: MutableRefObject<HTMLInputElement | undefined> = useRef();
  const roomRef: MutableRefObject<HTMLInputElement | undefined> = useRef();

  const [inviteId, setInviteId] = useState("");
  const [role, setRole] = useState<string | null>(null);

  const [number, setNumber] = useState<number>(0);
  const [roomId, setRoomId] = useSessionStorage("roomId", "");
  const [username, setUsername] = useSessionStorage("username", "");
  const [showRoom, setShowRoom] = useState(false);

  const { socket } = useSocketContext();
  
  const handleJoinRoom = () => {
    const [room, username] = [roomRef.current?.value || "", usernameRef.current?.value || ""];
    socket?.emit("join_room", { roomId: room, username });

    setRoomId(room);
  }

  useEffect(() => {
    if (roomId) {
      socket?.emit("join_room", { roomId, username });
    }
  }, [])

  useEffect(() => {
    socket?.on("user_join", ({ invite_id, username, role, number }: UserJoinEventData) => {
      setInviteId(invite_id);
      setRole(role);
      setNumber(number);
      setShowRoom(true);

      if (username) {
        setUsername(username);
      } else {
        // show modal de username
      }
    });

    socket?.on("user_join_error", ({ error }: UserJoinErrorEventData) => {
      alert(error);
    });

    socket?.on("users_change", ({ role: newRole, number }: UsersChangeEventData) => {
      setNumber(number);

      if (newRole !== role && newRole === "ADMIN") {
        setRole(newRole);
      }
    });

    socket?.on("user_log", ({ id, username, action }) => {
      console.log(`[${id}] - User ${username} ${actions[action as keyof typeof actions]}`)
    })
  }, [socket]);


  return (
    <div>
      <div
        className="h-screen w-screen flex justify-center items-center flex-col gap-4"
        style={{ display: showRoom ? "none" : "" }}
      >
        <input
          className="h-8 w-60 p-1 text-black"
          type="text"
          placeholder="Username"
          ref={usernameRef as LegacyRef<HTMLInputElement>}
        />
        <input
          className="h-8 w-60 p-1 text-black"
          type="text"
          placeholder="room id"
          ref={roomRef as LegacyRef<HTMLInputElement>}
        />
        <button className="h-8 w-60 justify-center flex items-center bg-red-500" onClick={() => handleJoinRoom()}>
          Join
        </button>
      </div>
      <div style={{ display: !showRoom ? "none" : "" }}>
        <Button socket={socket} roomId={roomId} number={number} admin={role === "ADMIN"} />
      </div>
    </div>
  );
}