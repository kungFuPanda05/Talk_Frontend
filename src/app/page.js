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
import NormalChat from "@/components/NormalChat";


export default function Home() {

  const [normalConnect, setNormalConnect] = useState(false);
  const [randomConnect, setRandomConnect] = useState(false);
  const [selectedGender, setSelectedGender] = useState('M');
  const [normalMessageList, setNormalMessageList] = useState([]);
  const [randomMessageList, setRandomMessageList] = useState([]);
  const [selfId, setSelfId] = useState("");
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const normalSocketRef = useRef();
  const socketRef = useRef();
  const token = Cookies.get('token');

  const fetchUserId = async () => {
    try {
      let response = await api.get('/api/user/getId');
      setSelfId(response.data.result);
    } catch (error) {
      apiError(error);
    }
  }
  const fetchChats = async () => {
    try {
      let response = await api.get('/api/chat/chat-list');
      setChats(response.data.result);
    } catch (error) {
      apiError(error);
    }
  }
  useEffect(() => {
    fetchUserId();
    fetchChats();
  }, []);

  useEffect(() => {
    if (randomConnect && token) {
      socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}/random-chat`, {
        extraHeaders: {
          Authorization: `Bearer ${token}` // Pass JWT token here
        }
      });
      socketRef.current.on('connect', () => {
        console.log("The connection has bee established");
        socketRef.current.emit('gender', { gwant: selectedGender });
        socketRef.current.on('message', (message) => {
          console.log("The message received is: ", message);
          console.log("The message list is: ", randomMessageList);
          setRandomMessageList((prevState) => [...prevState, message]);
        })
      })

      return () => {
        if (socketRef?.current) {
          socketRef.current.disconnect();
          console.log("Disconnected from random chat");
        }
      };
    }
  }, [randomConnect, token]);


  const sendMessage = () => {
    if (!messageContent) return;
    socketRef.current.emit("message", { messageContent });
    setMessageContent("");
  };


  useEffect(() => {
    console.log("The selectedChatID is: ", selectedChat);
  }, [selectedChat])


  const handleChatSelect = (chatId) => {
    setSelectedChat(chatId);
    setChats((prevState) => {
      return prevState.map((chat) =>
        chat.id === chatId ? { ...chat, newMessageCount: 0 } : chat
      );
    });
    setNormalConnect(true);
  }

  return (
    <Box className="container">
      <Box className="chatWrapper">
        {/* Left Sidebar */}
        <Grid item xs={4} className="sidebar">
          {/* Search bar */}
          <Paper component="form" className="searchBar">
            <InputBase
              className="searchInput"
              placeholder="Search"
              inputProps={{ "aria-label": "search" }}
            />
            <IconButton type="submit" aria-label="search">
              <Search />
            </IconButton>
          </Paper>

          {/* Chat List */}
          <List>
            {chats?.map((chat, index) => (
              <ListItem key={index} className="contactListItem" onClick={() => handleChatSelect(chat.id)}>
                <ListItemAvatar>
                  <Badge
                    badgeContent={chat.newMessageCount > 0 ? chat.newMessageCount : null}
                    color="error"
                  >
                    <Avatar alt={chat.chatName} src={chat.avatar} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={chat.chatName}
                  secondary={chat.Last_Message?.content}
                  primaryTypographyProps={{ className: "contactName" }}
                  secondaryTypographyProps={{ className: "contactMessage" }}
                />
                <Typography className="contactTime">
                  {chat.Last_Message?.createdAt.split('T')[0]}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={8} className="chatArea">
          {selectedChat ? (
            <NormalChat selectedChat={selectedChat} selfId={selfId} normalMessageList={normalMessageList} setNormalMessageList={setNormalMessageList} />
          ) : randomConnect ? (
            <div style={{ height: '100%' }}>
              <Box className="chatMessages">
                {randomMessageList?.map((message) => (
                  <Box className={`messageRow ${selfId == message.userId ? "messageRowEnd" : ""}`}>
                    {selfId != message.userId && <Avatar src="/img1.png" className="avatar" />}
                    <Box>
                      <Typography className={selfId == message.userId ? "messageBubbleSent" : "messageBubble"}>
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
                <InputBase className="chatInput" placeholder="Type message" value={messageContent} onChange={(e) => setMessageContent(e.target.value)} />
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
          ) : (
            <RandConnect
              setRandomConnect={setRandomConnect}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
            />
          )}

        </Grid>
      </Box>
    </Box>
  );
}
