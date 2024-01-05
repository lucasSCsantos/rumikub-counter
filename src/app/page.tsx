"use client";

import { LegacyRef, MutableRefObject, useEffect, useRef, useState} from "react";
import { useSocketContext } from "./context/socket";
import { useRouter } from "next/navigation";
import { useSessionStorage } from "@uidotdev/usehooks";
import Button from "@/components/button";
// import ChatPage from "@/components/page";

export default function Home() {
  const nameRef: MutableRefObject<HTMLInputElement | undefined> = useRef();
  const roomRef: MutableRefObject<HTMLInputElement | undefined> = useRef();

  const [roomId, setRoomId] = useSessionStorage("roomId", "");
  const [showRoom, setShowRoom] = useState(false);

  const { socket } = useSocketContext();
  
  const handleJoinRoom = () => {
    const [room, name] = [roomRef.current?.value || "", nameRef.current?.value || ""];
    socket?.emit("join_room", { room, name });

    setRoomId(room);
    setShowRoom(true);
  }

  useEffect(() => {
    if (roomId) {
      socket?.emit("join_room", { room: roomId });
      setShowRoom(true);
    }
  }, [])

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
          ref={nameRef as LegacyRef<HTMLInputElement>}
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
        <Button socket={socket} roomId={roomId} />
      </div>
    </div>
  );
}