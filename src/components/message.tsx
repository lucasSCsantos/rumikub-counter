"use client"
import React from "react";
import './button.css';

const Message = ({ turn, admin, start }: any) => {
	if (turn) {
		return <span className="text-3xl p-6 py-2 top-36 absolute text-center">Agora é sua vez!</span>
	} else if (start) { 
		return <span className="text-3xl p-6 py-2 top-36 absolute text-center">Se prepare, vai começar!</span>
	} else if (!admin) {
		return <span className="text-3xl p-6 py-2 top-36 absolute text-center">Aguardando o administrador iniciar!</span>
	} else if (admin) {
		return <span className="text-3xl p-6 py-2 top-36 absolute text-center">Pressione start para começar!</span>
	} else {
		return <span className="text-3xl p-6 py-2 top-36 absolute text-center">Não é a sua vez!</span>
	}
};



export default Message;