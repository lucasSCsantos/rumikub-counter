"use client"
import React, { useEffect, useRef, useState } from "react";
import './button.css';
import Countdown, { CountdownTimeDelta } from "react-countdown";

interface IMsgDataTypes {
	roomId: String | number;
	msg: String;
	time: String;
	start: boolean;
	number: Number;
}

const Button = ({ socket, roomId }: any) => {
	const [currentMsg, setCurrentMsg] = useState("");
	const [chat, setChat] = useState<IMsgDataTypes[]>([]);
	const [number, setNumber] = useState<number>(0);
	const [turn, setTurn] = useState<boolean>(false);
	const [start, setStart] = useState<boolean>(false);

	const audioRef = useRef<HTMLAudioElement>();
	const audio2Ref = useRef<HTMLAudioElement>();

	const colors = ["gray", "green", "red", "blue"];
	// const bgColors = ["bg-gray-500", "bg-green-500", "bg-red-500", "bg-blue-500"]

	const sendData = async (e: React.MouseEvent | CountdownTimeDelta) => {
		// e.preventDefault();
		const msgData: IMsgDataTypes = {
			roomId,
			msg: "butao pressionado",
			number,
			start: start && !turn,
			time:
				new Date(Date.now()).getHours() +
				":" +
				new Date(Date.now()).getMinutes(),
		};
		setTurn(false);
		setStart(false);
		await socket.emit("press_btn", msgData);
		
	};

	const play = () => {
		if (audioRef.current) {
			audioRef.current.play()
		} else {
			// Throw error
		}
	}

	const play2 = () => {
		if (audio2Ref.current) {
			audio2Ref.current.play()
		} else {
			// Throw error
		}
	}

	useEffect(() => {
		socket.on("number", (data: number) => {
			setNumber(data);
		})

		socket.on("turn", () => {
			setTurn(true);
			setStart(true);
			//start a contagem
		})

		socket.on("start", () => {
			setStart(true);
		})
	}, [socket]);

	console.log(turn, start);

	return (
		<div className="h-screen w-screen flex justify-center items-center flex-col">
			{/* <Cronometer></Cronometer> */}
			{turn ? (
				<Countdown date={Date.now() + 6000} onComplete={(e) => {
					sendData(e);
					// const audio = new Audio('src.mp3');
					// audio.play();
					// const audio = new window.Audio();
					// audio.src = "src.mp3"
					play2();
				}} className="text-white text-2xl mb-5" />
			) : (
					<>
						{start ? (<span className="text-white text-2xl mb-5">Aperte para começar</span>): (<span className="text-white text-2xl mb-5">Não é a sua vez!</span>)}
					</>
					
			)}
			<audio ref={audioRef as React.LegacyRef<HTMLAudioElement> | undefined} autoPlay>
				<source src='src.mp3' type="audio/mp3" />
			</audio>
			<audio ref={audio2Ref as React.LegacyRef<HTMLAudioElement> | undefined }>
				<source src='src.mp3' type="audio/mp3" />
			</audio>
			<button disabled={!turn && !start} onClick={(e) => {
				sendData(e);
				play2();
			}} className={` active:mt-10 w-72 h-72 rounded-full ${turn || start ? `bg-${colors[number || 0]}-500` : `bg-${colors[0]}-500`} border-1 border-black ${turn || start ? `box-shadow-bottom-${colors[number || 0]}` : 'active:box-shadow-bottom-none' } active:box-shadow-bottom-none`}  >

			</button>
		</div>
	);
};

export default Button;