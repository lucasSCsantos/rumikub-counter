"use client"
import React, { LegacyRef, RefObject, useEffect, useRef, useState } from "react";
import './button.css';
import Countdown, { CountdownRendererFn } from "react-countdown";
import Message from "./message";

import { DropResult, DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

interface IMsgDataTypes {
	roomId: String | number;
	msg: String;
	time: String;
	start: boolean;
	number: Number;
}

type CountdownRef = {
	current: {
		start: () => void;
		pause: () => void;
		isPaused: () => boolean;
	}
}

type ButtonRef = {
	current: {
		textContent: string;
	}
}

const renderer: CountdownRendererFn = ({ hours, minutes, seconds }) => {
	return <span className={`text-white text-9xl`}>{minutes === 1 ? 60 : seconds}</span>;
};

const Button = ({ socket, roomId, number, admin, handleExit, users, setUsers, username: name }: any) => {
	const [turn, setTurn] = useState<boolean>(false);
	const [start, setStart] = useState<boolean>(false);
	const [started, setStarted] = useState<boolean>(false);
	const [time, setTime] = useState<number>(60000);
	const [key, setKey] = useState(1);
	const audio2Ref = useRef<HTMLAudioElement>();

	const countdownRef = useRef() as LegacyRef<Countdown> | undefined;
	const buttonRef = useRef<HTMLButtonElement>();

	// const colors = ["gray", "pink", "red", "blue", "yellow", "pink", "brown"];

	const handleStartStop = () => {
		if ((countdownRef as unknown as CountdownRef)?.current?.isPaused()) {
			(countdownRef as unknown as CountdownRef).current?.start();
			(buttonRef as unknown as ButtonRef).current.textContent = "Pausar";
		} else {
			(buttonRef as unknown as ButtonRef).current.textContent = "Continuar";
			(countdownRef as unknown as CountdownRef)?.current?.pause();
		}
	}

	const playFinishAudio = () => {
		const audioContext = new (window.AudioContext)();
		const source = audioContext.createBufferSource();
		source.addEventListener('ended', () => {
			source.stop();
			audioContext.close();
		});

		const request = new XMLHttpRequest();
		request.open('GET', 'src.mp3', true);
		request.responseType = 'arraybuffer';
		request.onload = () => {
			audioContext.decodeAudioData(
				request.response,
				(buffer) => {
					source.buffer = buffer;
					source.connect(audioContext.destination);
					source.start();
				},
				(e) => {
					console.log('Error with decoding audio data' + e.message);
				});
		}

		request.send();
	}

	const playButtonAudio = () => {
		if (audio2Ref.current) {
			audio2Ref.current.play()
		} else {
			// Throw error
		}
	}


	const handleStartTimer = () => {
		setStart(true);
		(countdownRef as unknown as CountdownRef).current?.start();

		if (number === 1) {
			socket.emit("start", roomId);
			setStarted(true);
		}
	}

	const handleStopTimer = () => {
		if (number === 1) {
			socket.emit("stop", roomId);
			setStart(false);
			setTurn(false);
			setStarted(false);
		}
	}

	const handleStartTurn = () => {
		setTurn(true);
		setStart(false);
	}

	const handleChangeTurn = () => {
		setTurn(false);
		socket.emit("change_turn", {
			roomId,
			number
		});
	}

	const handleRestartTurn = () => {
		setKey((k) => k + 1);
		if ((buttonRef as unknown as ButtonRef).current.textContent === "Continuar") {	
			setTimeout(() => {
				(countdownRef as unknown as CountdownRef)?.current?.pause();

			}, 1000)
		}
	}

	const handleDrop = (droppedItem: DropResult) => {
		// Ignore drop outside droppable container
		console.log(droppedItem)
		if (!droppedItem.destination) return;
		var updatedList = [...users];

		const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);

		updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
		
		updatedList = updatedList.map((item, index) => (
			{
				...item,
				number: index + 1,
			}
		))

		socket.emit("change_order", { roomId, admin, newOrder: updatedList });

		setUsers(updatedList);
	};

	useEffect(() => {
		socket.on("turn", () => {
			handleStartTurn();
			//start a contagem
		})

		socket.on("start", () => {
			setStarted(true);
		})

		socket.on("stop", () => {
			setStart(false);
			setTurn(false);
			setStarted(false);
		})
	}, [socket]);

	return (
		<div className="h-screen w-screen flex justify-center items-center flex-col relative">
			<audio ref={audio2Ref as React.LegacyRef<HTMLAudioElement> | undefined }>
				<source src='button-click.mp3' type="audio/mp3" />
			</audio>
			<div className="top-0 absolute flex flex-col">
				<span className="text-xl p-6 py-2">Sala: {roomId}</span>
				<span className="text-xl p-6 py-2">Nome: {name}</span>
				{admin ? (
					<DragDropContext onDragEnd={handleDrop}>
						<Droppable droppableId="list-container">
							{(provided) => (
								<div
									className="list-container"
									{...provided.droppableProps}
									ref={provided.innerRef}
								>
									{users.length > 0 && users.map((user:  {username: string, id: string }) => user.username).map((username: string, index: number) => (
										<Draggable key={username} draggableId={username} index={index}>
											{(provided) => (
												<div
													className="item-container"
													ref={provided.innerRef}
													{...provided.dragHandleProps}
													{...provided.draggableProps}
												>
													{username}
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</DragDropContext>
				): (
						<>
						{users.length > 0 && users.map(({ username }: { username: string }) => (
							<span className="text-xl p-6 py-2" key={username}>{username}</span>
						))}
						</>
				)}
			</div>

			<Message admin={admin} turn={turn} start={start} />
			<button disabled={!turn} onClick={(e) => {
				handleChangeTurn();
				playButtonAudio();
			}} className={`flex justify-center items-center enabled:active:scale-90 enabled:transition-all w-72 h-72 rounded-full bg-${turn ? "green" : "gray"}-500 disabled:bg-gray-500`}  >

				{start && (
					<Countdown ref={countdownRef} date={Date.now() + 3000} renderer={renderer} onComplete={() => {
						handleStartTurn();
					}} />
				)}
				{turn && (
					<Countdown ref={countdownRef} date={Date.now() + time} key={key} renderer={renderer} onComplete={(e) => {
						playFinishAudio();
						handleChangeTurn();
					}} />
				)}

			</button>
			<div className="h-1/4 absolute bottom-12 flex flex-col gap-4">
				{turn && <button ref={buttonRef as RefObject<HTMLButtonElement>} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all" onClick={() => handleStartStop()}>Pausar</button>}
				{turn && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all" onClick={() => handleRestartTurn()}>Reiniciar</button>}
				
				{!started && number === 1 && <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all" onClick={() => handleStartTimer()}>Começar</button>}
				{started && admin && <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all" onClick={() => handleStopTimer()}>Recomeçar</button>}

			</div>
			<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all absolute bottom-6 w-72" onClick={() => handleExit()}>Sair</button>
		</div>
	);
};



export default Button;