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
import NavBar from "@/components/NavBar";
import styles from '../styles/chat.module.scss'
import ChatBox from "@/components/ChatBox";
import ChatList from "@/components/ChatList";


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
    <div className={styles.home}>
      <NavBar/>
      <div className={`${styles.chat}`}>
        <div className={`${styles['chat-list']}`}>
          <ChatList/>
        </div>
        <div className={`${styles['chat-area']}`}>
          <ChatBox/>
        </div>
      </div>
    </div>
  );
}
