"use client"
import React, { LegacyRef, RefObject, useEffect, useRef, useState } from "react";
import './button.css';
import Countdown, { CountdownProps, CountdownRendererFn, CountdownTimeDelta } from "react-countdown";

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

const renderer: CountdownRendererFn = ({ hours, minutes, seconds }) => {
	return <span className="text-white text-9xl mb-5">{minutes === 1 ? 60 : seconds}</span>;
};

const Button = ({ socket, roomId }: any) => {
	const [number, setNumber] = useState<number>(0);
	const [turn, setTurn] = useState<boolean>(false);
	const [start, setStart] = useState<boolean>(false);
	// const [paused, setPaused] = useState<boolean>(false);

	const audio2Ref = useRef<HTMLAudioElement>();

	const ref = useRef() as LegacyRef<Countdown> | undefined;

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

	const handleStartStop = () => {

		if ((ref as unknown as CountdownRef)?.current?.isPaused()) {
			(ref as unknown as CountdownRef).current?.start();
		} else {
			(ref as unknown as CountdownRef)?.current?.pause();
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
			<>
				{!turn && start ? (<span className="text-white text-2xl mb-5">Aperte para começar</span>) : turn && start ? (<span className="text-white text-2xl mb-5">Agora é a sua vez!</span>) : (<span className="text-white text-2xl mb-5">Não é a sua vez!</span>)}
			</>
			<audio ref={audio2Ref as React.LegacyRef<HTMLAudioElement> | undefined }>
				<source src='button-click.mp3' type="audio/mp3" />
			</audio>
			<button disabled={!turn && !start} onClick={(e) => {
				sendData(e);
				playButtonAudio();
			}} className={`flex justify-center items-center active:mt-10 w-72 h-72 rounded-full ${turn || start ? `bg-${colors[number || 0]}-500` : `bg-${colors[0]}-500`} border-1 border-black ${turn || start ? `box-shadow-bottom-${colors[number || 0]}` : 'active:box-shadow-bottom-none' } active:box-shadow-bottom-none`}  >
				{turn && (
					<Countdown ref={ref} date={Date.now() + 600000} renderer={renderer} onComplete={(e) => {
						sendData(e);
						playFinishAudio();
					}} />
				)}
			</button>
			{start && turn && <button className="mt-16 border border-white rounded-2xl text-3xl p-6 py-2" onClick={() => handleStartStop()}>Continuar/Parar</button>}
		</div>
	);
};



export default Button;