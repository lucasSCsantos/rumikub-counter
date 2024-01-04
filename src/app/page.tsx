"use client";

import { LegacyRef, MutableRefObject, useEffect, useRef} from "react";
import { useSocketContext } from "./context/socket";
import { useRouter } from "next/navigation";
// import ChatPage from "@/components/page";

export default function Home() {
  const nameRef: MutableRefObject<HTMLInputElement | undefined> = useRef();
  const roomRef: MutableRefObject<HTMLInputElement | undefined> = useRef();

  const router = useRouter();

  const { socket } = useSocketContext();
  
  const handleJoinRoom = () => {
    const [room, name] = [roomRef.current?.value || "", nameRef.current?.value || ""];
    socket?.emit("join_room", { room, name });
  }

  useEffect(() => {
    socket?.on("user_join", (data) => {
      router.push("/" + data.roomId)
    })
  }, [])

  return (
    <div>
      <div
        className="h-screen w-screen flex justify-center items-center flex-col gap-4"
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
    </div>
  );
}