"use client";
// import styles from "./page.module.css";
import { io } from "socket.io-client";
import { useState } from "react";
import Button from "@/components/button";
// import ChatPage from "@/components/page";

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [roomId, setroomId] = useState("");

  var socket: any;
  socket = io("https://3879-187-44-192-104.ngrok-free.app");

  const handleJoin = () => {
    if (roomId !== "") {
      socket.emit("join_room", roomId);
      setShowSpinner(true);
      // You can remove this setTimeout and add your own logic
      setTimeout(() => {
        setShowChat(true);
        setShowSpinner(false);
      }, 4000);
    } else {
      alert("Please fill in Username and Room Id");
    }
  };

  return (
    <div>
      <div
        className="h-screen w-screen flex justify-center items-center flex-col gap-4"
        style={{ display: showChat ? "none" : "" }}
      >
       
        <input
          className="h-8 w-60 p-1 text-black"
          type="text"
          placeholder="room id"
          onChange={(e) => setroomId(e.target.value)}
          disabled={showSpinner}
        />
        <button className="h-8 w-60 justify-center flex items-center bg-red-500" onClick={() => handleJoin()}>
          {!showSpinner ? (
            "Join"
          ) : (
            <div className="rounded-full border-4 border-solid border-black border-t-4 border-t-orange-500 w-5 h-5 animate-spin"></div>
          )}
        </button>
      </div>
      <div style={{ display: !showChat ? "none" : "" }}>
        <Button socket={socket} roomId={roomId} />
        {/* <ChatPage socket={socket} roomId={roomId} username={userName} /> */}
      </div>
    </div>
  );
}