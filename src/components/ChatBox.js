'use client'
import { useEffect, useRef, useState } from "react";
import { 
    Box,
    Input,
    Button
 } from "@mui/material";

import io from 'socket.io-client'

const ChatBox=({gwant, ghave, chat, setChat, toggle})=>{
    const socketRef = useRef();
    const [roomId, setRoomId] = useState();

    useEffect(()=>{
        socketRef.current = io(process.env.NEXT_PUBLIC_API_URL);
        socketRef.current.on('connect', ()=>{
            const socketId = socketRef.current.id;
            socketRef.current.emit('gender', {gwant, ghave});
            socketRef.current.on('getRoom', (roomId) =>{setRoomId(roomId); console.log("Roomid: ", roomId)} );
        })
        return () => {
            socketRef.current.disconnect();
        };
    }, [toggle])
    const handleDisconnect = ()=>{
        setChat(false);
        socketRef.current.disconnect()
    }

    return (
        <>
            <Box border={'2px solid black'}>
                This is the ChatBox
                <br/>
                <button onClick={handleDisconnect}>Disconnect</button>
            </Box>
        </>
    )
}
export default ChatBox;