'use client'

import { useState } from "react";
import { 
    Box,
    Input,
    Button
 } from "@mui/material";
 import ChatBox from "@/components/ChatBox";

const Chat = ()=>{
    const [gwant, setGwant] = useState("");
    const [ghave, setGhave] = useState("");
    const [chat, setChat] = useState(false);
    const [toggle, setToggle] = useState(true);

    const handleConnStranger = () =>{
        setChat(true);
        setToggle(!toggle);
    }

    return (
        <>
            <Box border={'2px solid black'}>
                <Box m={2}>
                    <lable>Choose ur gender: </lable>
                    <select value={ghave} onChange={(e)=>setGhave(e.target.value)}>
                        <option value="">select</option>
                        <option value='M'>Male</option>
                        <option value="F">Female</option>
                    </select>
                </Box>
                <Box m={2}>
                    <lable>Choose Gender whom you want to connect: </lable>
                    <select value={gwant} onChange={(e)=>setGwant(e.target.value)}>
                        <option value="">select</option>
                        <option value='M'>Male</option>
                        <option value="F">Female</option>
                    </select>
                </Box>

                <Box m={2}>
                    <button onClick={handleConnStranger}>Connect to stranger</button>
                </Box>

                {chat && 
                    <Box m={2}>
                        <ChatBox gwant={gwant} ghave={ghave} chat={chat} setChat={setChat} toggle={toggle}/>
                    </Box>
                }
            </Box>
        </>
    )
}
export default Chat;