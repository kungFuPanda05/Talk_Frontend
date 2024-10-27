'use client'

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  Typography,
  InputBase,
  Paper,
  IconButton,
} from "@mui/material";
import { Search, AttachFile, InsertEmoticon, Send } from "@mui/icons-material";
import RandConnect from "@/components/RandConnect";
import Cookies from "js-cookie";
import io from 'socket.io-client'
import api from "@/utils/api";
import apiError from "@/utils/apiError";

export default function NormalChat({selectedChat, selfId, normalMessageList, setNormalMessageList}) {
    const roomId = selectedChat;
    const [messageContent, setMessageContent] = useState("");
    const socketRef = useRef();
    const token = Cookies.get('token');

    useEffect(() => {
      if(!selectedChat) return;
      fetchMessages(selectedChat);
      socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}/normal-chat`, {
        extraHeaders: {
          Authorization: `Bearer ${token}` // Pass JWT token here
        }
      });
      socketRef.current.on('connect', () => {
        console.log("The normal chat connection has been established");
        socketRef.current.emit('joinChat',  selectedChat);
        socketRef.current.on('message', (message) => {
          console.log("The message received is: ", message);
          console.log("The message list is: ", normalMessageList);
          setNormalMessageList((prevState) => [...prevState, message]);
        })
      })

      return () => {
        if (socketRef?.current) {
          socketRef.current.disconnect();
          console.log("Disconnected from normal chat");
        }
      };
    }, [selectedChat]);

    const handleDisconnect = ()=>{
        socketRef.current.disconnect()
    }
    useEffect(()=>{
        console.log("The selectedChatID is: ", selectedChat);
    }, [selectedChat])
    
  const sendMessage = () => {
    if(!messageContent) return;
    socketRef.current.emit("message", { roomId, messageContent });
    createMessage(messageContent);
    setMessageContent("");
  };
  const createMessage = async(messageContent) => {
    try{
      let response = await api.post('/api/message/create-message', {chatId: selectedChat, content: messageContent});
    }catch(error){
      apiError(error);
    }
  }
  const fetchMessages = async(chatId) => {
    try{
      const response = await api.get(`/api/message/fetch-messages/${chatId}`);
      console.log("The mesasge lis: ", response.data.result);
      setNormalMessageList(response.data.result);
    }catch(error){
      apiError(error);
    }
  }

  return (
    <div style={{height: '100%'}}>
        <Box className="chatMessages">
          {normalMessageList?.map((message)=>(
            <Box className={`messageRow ${selfId==message.userId?"messageRowEnd":""}`}>
              {selfId!=message.userId && <Avatar src="/img1.png" className="avatar" />} 
              <Box>
                <Typography className={selfId==message.userId? "messageBubbleSent":"messageBubble"}>
                  {message.content}
                </Typography>
                <Typography variant="caption" className="messageTime">
                  12:00 PM | Aug 13
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box className="chatInputWrapper">
          <Avatar src="/img1.png" />
          <InputBase className="chatInput" placeholder="Type message" value={messageContent} onChange={(e)=>setMessageContent(e.target.value)}/>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <InsertEmoticon />
          </IconButton>
          <IconButton onClick={sendMessage}>
            <Send />
          </IconButton>
        </Box>
    </div>
  );
}
