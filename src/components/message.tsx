"use client"
import React from "react";
import './button.css';

const Message = ({ turn, start, number, started }: any) => {
	if (turn) {
		return <span className="text-3xl p-6 py-2 top-36 absolute text-center">Agora é sua vez!</span>
	} else if (start) {
		return <span className="text-3xl p-6 py-2 top-36 absolute text-center">Se prepare, vai começar!</span>
	} else if (started) { 
		return <span className="text-3xl p-6 py-2 top-36 absolute text-center">Ainda não é sua vez!</span>
	} else if (number === 1) {
		return <span className="text-3xl p-6 py-2 top-36 absolute text-center">Você será o primeiro.</span>
	} else {
		return <span className="text-3xl p-6 py-2 top-36 absolute text-center">Aguarde começar</span>
	}
}

export default Message;