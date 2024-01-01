"use client"
import React, { useEffect, useRef, useState } from "react";
import './button.css';
import Countdown, { CountdownTimeDelta } from "react-countdown";

interface IMsgDataTypes {
	roomId: String | number;
	user: String;
	msg: String;
	time: String;
	number: Number;
}

const Button = ({ socket, username, roomId }: any) => {
	const [currentMsg, setCurrentMsg] = useState("");
	const [chat, setChat] = useState<IMsgDataTypes[]>([]);
	const [number, setNumber] = useState<number>(0);
	const [turn, setTurn] = useState<boolean>(false);
	const [start, setStart] = useState<boolean>(false);

	const colors = ["gray", "green", "red", "blue"]
	// const bgColors = ["bg-gray-500", "bg-green-500", "bg-red-500", "bg-blue-500"]

	const sendData = async (e: React.MouseEvent | CountdownTimeDelta) => {
		// e.preventDefault();
			const msgData: IMsgDataTypes = {
				roomId,
				user: username,
				msg: "butao pressionado",
				number,
				time:
					new Date(Date.now()).getHours() +
					":" +
					new Date(Date.now()).getMinutes(),
			};
		setTurn(false);
		await socket.emit("press_btn", msgData);
		
	};


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

	console.log(turn);

	return (
		<div className="h-screen w-screen flex justify-center items-center flex-col">
			{/* <Cronometer></Cronometer> */}
			{turn ? (
				<Countdown date={Date.now() + 60000} onComplete={(e) => {
					sendData(e);
					const audio = new Audio('src.mp3');
					audio.play();
				}} className="text-white text-2xl mb-5" />
			) : (
					<span className="text-white text-2xl mb-5">Não é a sua vez!</span>
			)}
			<button disabled={!turn && !start} onClick={(e) => {
				const audio = new Audio('button-click.mp3');
				sendData(e);
				audio.play();
			}} className={` active:mt-10 w-72 h-72 rounded-full ${turn ? `bg-${colors[number || 0]}-500` : `bg-${colors[0]}-500`} border-1 border-black ${turn ? `box-shadow-bottom-${colors[number || 0]}` : 'active:box-shadow-bottom-none' } active:box-shadow-bottom-none`}  >

			</button>
		</div>
	);
};

export default Button;