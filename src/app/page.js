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
  CircularProgress,
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
import SelectGender from "@/components/SelectGender";
import { toast } from "react-toastify";


export default function Home() {

  const [randomConnect, setRandomConnect] = useState(false);
  const [selectedGender, setSelectedGender] = useState('M');
  const [normalMessageList, setNormalMessageList] = useState([]);
  const [randomMessageList, setRandomMessageList] = useState([]);
  const [selfId, setSelfId] = useState("");
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [dont, setDont] = useState(false);
  const [isStrangerLeftChat, setStrangerLeftChat] = useState(false);
  const [strangerId, setStrangerId] = useState("");
  const [randomUserIds, setRandomUserIds] = useState([]);
  const [isReqSent, setReqSent] = useState(false);
  const [isReqRecieved, setReqReceived] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [isReject, setIsReject] = useState(false);

  const socketRef = useRef();
  const selectedChatRef = useRef(selectedChat);
  const selfIdRef = useRef(selfId);

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
    socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      extraHeaders: {
        Authorization: `Bearer ${token}` // Pass JWT token here
      }
    });
    socketRef.current.on('connect', () => {
      console.log("The connection has been established with backend");

      socketRef.current.on('message', (message) => {
        console.log("The message received is: ", message);
        if (message.randomRoomId) {
          delete message.randomRoomId;
          setRandomMessageList((prevState) => [...prevState, message]);
        } else if (message.chatId) {
          console.log("The selectedChat after receiveing: ", selectedChatRef.current);
          if (message.chatId == selectedChatRef.current) {
            delete message.chatId;
            setNormalMessageList((prevState) => [...prevState, message]);
          } else {
            //send notifications to those chats
            handleNormalMessageNotifications(message);
            console.log("printing the selfId and message.userId: ", selfId, message.userId);
            if (parseInt(selfIdRef.current, 10) !== parseInt(message.userId, 10)) { //meaning the message is received message
              updateNewMessageCount(message.chatId, selfIdRef.current);
            }
          }
        }
      });

      socketRef.current.on('user-left', (data) => {
        setStrangerLeftChat(true);
        setRandomConnect(false);
      });

      socketRef.current.on('strangers-connected', (response) => {

        if (response.success) {
          setRandomConnect(true);
          setConnecting(false);
          setRandomUserIds(response.users);
          toast.success(response.message);
        }
      });

      socketRef.current.on('receive-request', (res)=>{
        setReqReceived(true);
      });

      socketRef.current.on('receive-request-accept', (res)=>{
        setIsAccept(true);
      })
      

      socketRef.current.on('error', (error) => {
        toast.error(error.message);
        setRandomConnect(false);
        setConnecting(false);
      });
    })

    return () => {
      if (socketRef?.current) {
        socketRef.current.disconnect();
        setRandomConnect(false);
        console.log("Disconnected from chat");
      }
    };
  }, []);
  useEffect(()=>{
    console.log("The strangerID is: ", strangerId);
  }, [strangerId]);

  useEffect(() => {
    console.log("Random connect use effect triggered: ", randomConnect);
    if (!randomConnect) {
      setChats(chats.slice(1));
      socketRef.current.emit('leave-room');
    } else {
      console.log("random connect trigger  hu gya");
      setChats([{ chatName: "Stranger", gender: selectedGender }, ...chats]);
      setStrangerLeftChat(false);
    }
  }, [randomConnect]);

  useEffect(() => {
    console.log("connecting to stranger: ", connecting);
    if (connecting) {
      setStrangerId("");
      if (!selectedGender) toast.error("Please select the preffered gender first");
      socketRef.current.emit('join-room', { gwant: selectedGender });
      setMessageContent("");
      setRandomMessageList([]);
    }
  }, [connecting]);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
    setMessageContent("");
  }, [selectedChat]);

  useEffect(() => {
    selfIdRef.current = selfId;
    setMessageContent("");
  }, [selfId]);

  useEffect(() => {
    console.log("The stranger left the chat: ", isStrangerLeftChat);
    if (isStrangerLeftChat) {
      toast.info("Stranger left the chat", {
        position: 'top-center',
        hideProgressBar: true
      });
    }
  }, [isStrangerLeftChat]);

  useEffect(()=>{
    if(selfId && randomUserIds){
      if(randomUserIds[0]==selfId) setStrangerId(randomUserIds[1]);
      else setStrangerId(randomUserIds[0]);
    }
  }, [randomUserIds, selfId]);


  const sendMessage = () => {
    if (!messageContent) return;
    socketRef.current.emit("message", { messageContent, chatId: selectedChat });
    if (selectedChat) createMessage(messageContent);
    setMessageContent("");
  };

  const createMessage = async (messageContent) => {
    try {
      let response = await api.post('/api/message/create-message', { chatId: selectedChat, content: messageContent });
      toast.success(response.data.messages);
    } catch (error) {
      apiError(error);
    }
  }
  const fetchMessages = async (chatId) => {
    try {
      const response = await api.get(`/api/message/fetch-messages/${chatId}`);
      console.log("The message lis: ", response.data.result);
      setNormalMessageList(response.data.result);
    } catch (error) {
      apiError(error);
    }
  }


  const handleChatSelect = (chatId) => {
    if (chatId >= 1) fetchMessages(chatId);
    setSelectedChat(chatId);
    setChats((prevState) => {
      return prevState.map((chat) =>
        chat.id === chatId ? { ...chat, newMessageCount: 0 } : chat
      );
    });
  }

  const handleNormalMessageNotifications = (message) => {
    setChats((prevList) => {
      // Find the matching chat
      const matchingChat = prevList.find((chat) => chat.id === message.chatId);

      if (!matchingChat) return prevList;

      // Update the matching chat
      const updatedChat = {
        ...matchingChat,
        Last_Message: {
          ...matchingChat.Last_Message,
          content: message.content,
          sentBy: message.userId, // Updating sentBy as well
        },
        newMessageCount: matchingChat.newMessageCount + 1,
      };

      return [updatedChat, ...prevList.filter((chat) => chat.id !== message.chatId)];
    });
  };

  const handleConnectAgain = () => {
    setConnecting(true)
  }

  const updateNewMessageCount = async (chatId, userId) => {
    console.log("Update message count ke andar ki cheezein: ", chatId, userId);
    try {
      const response = await api.post(`/api/message/update-new-messages-count`, { chatId, userId });
      console.log("Reposne: ", response);
      toast.success(response.data.messages);
    } catch (error) {
      apiError(error);
    }
  }

  const sendFriendRequest = async() => {
    try {
      let response = await api.post('/api/friend/send-friend-req', { selfId, strangerId});
      socketRef.current.emit('send-request');
      toast.success(response.data.messages);
    } catch (error) {
      apiError(error);
    }
    setReqSent(true);
  }

  const handleReqStatus = (status) => {
    if(status==="reject"){
      //write the request rejection logic
      setIsReject(true);
    }else if(status==='accept'){
      //write request accept logic 

      socketRef.current.emit('send-request-accept');
      setIsAccept(true);
    }
  }

  return (
    <div className={styles.home}>
      <NavBar />
      <div className={`${styles.chat}`}>
        <div className={`${styles['chat-list']}`}>
          <ChatList chats={chats} handleChatSelect={handleChatSelect} selectedChat={selectedChat} />
        </div>
        <div className={`${styles['chat-area']}`}>
          {connecting ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                flexDirection: 'column',
                gap: '25px'
              }}
            >
              <CircularProgress />
              connecting to stranger...
            </Box>
          ) : (selectedChat || randomConnect || dont) ? (
            <ChatBox
              selfId={selfId}
              messages={selectedChat ? normalMessageList : randomMessageList}
              messageContent={messageContent}
              setMessageContent={setMessageContent}
              sendMessage={sendMessage}
              selectedChat={selectedChat}
              setRandomConnect={setRandomConnect}
              setConnecting={setConnecting}
              isStrangerLeftChat={isStrangerLeftChat}
              setStrangerLeftChat={setStrangerLeftChat}
              handleConnectAgain={handleConnectAgain}
              strangerId={strangerId}
              isReqSent={isReqSent}
              isReqRecieved={isReqRecieved}
              isAccept={isAccept}
              isReject={isReject}
              sendFriendRequest={sendFriendRequest}
              handleReqStatus={handleReqStatus}
            />
          ) : (
            <SelectGender
              setConnecting={setConnecting}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
              setDont={setDont}
            />
          )}


        </div>
      </div>
    </div>
  );
}
