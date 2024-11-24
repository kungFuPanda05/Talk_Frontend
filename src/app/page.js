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
  const fetchChats = async (search="", limit=10, page=1) => {
    try {
      let response = await api.get('/api/chat/chat-list', {
        params: {
          limit, search, page
        }
      });
      let strangerChat = chats.find((chat) => chat.chatName === "Stranger");
      if (strangerChat) {
        let finalChatList = [strangerChat, ...response.data.result];
        setChats(finalChatList);
      } else setChats(response.data.result);
    } catch (error) {
      apiError(error);
    }
  }
  useEffect(() => {
    fetchUserId();
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

        console.log("The message.chatId: ", message.chatId, " selectedChatRef.current: ", selectedChatRef.current);
        if (message.chatId == 0) setRandomMessageList((prevState) => [message, ...prevState]);
        if (message.chatId == selectedChatRef.current) {
          if (message.chatId == 0) {
            handleMessageNotifications(message, false);
          } else {
            setNormalMessageList((prevState) => [message, ...prevState]);
          }
        } else {
          //send notifications to those chats
          handleMessageNotifications(message);
          console.log("printing the selfId and message.userId: ", selfId, message.userId);
          if (parseInt(selfIdRef.current, 10) !== parseInt(message.userId, 10)) { //meaning the message is received message
            updateNewMessageCount(message.chatId, selfIdRef.current);
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

      socketRef.current.on('receive-request', (res) => {
        setReqReceived(true);
      });

      socketRef.current.on('receive-request-accept', (res) => {
        // setIsAccept(true);
        toast.info("Stranger has accepted the friend request");
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
  useEffect(() => {
    if (strangerId && selfId) fetchFriendRequestDetails();
  }, [strangerId, selfId]);

  useEffect(() => {
    console.log("Random connect use effect triggered: ", randomConnect);
    if (!randomConnect) {
      setChats(chats.slice(1));
      socketRef.current.emit('leave-room');
    } else {
      console.log("random connect trigger  hu gya");

      setChats([{
        id: 0,
        chatName: "Stranger",
        isGroupChat: false,
        avatar: null,
        Last_Message: {
          content: "No Messages yet",
          sentBy: null,
          createdAt: new Date()
        },
        newMessageCount: 0,
        gender: selectedGender
      }, ...chats]);
      setSelectedChat(0);
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
    if (selectedChat) {
      setMessageContent("");
      setConnecting(false);

    }
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

  useEffect(() => {
    if (selfId && randomUserIds) {
      if (randomUserIds[0] == selfId) setStrangerId(randomUserIds[1]);
      else setStrangerId(randomUserIds[0]);
    }
  }, [randomUserIds, selfId]);


  const sendMessage = async () => {
    if (!messageContent) return;
    socketRef.current.emit("message", { messageContent, chatId: (selectedChat || 0) });
    if (selectedChat) {
      await createMessage(messageContent);
      fetchChats();
    }
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
  

  const handleChatSelect = (chatId) => {
    // if (chatId >= 1) fetchMessages(chatId);
    console.log("call reaching to handle chat select");
    setSelectedChat(chatId);
    setChats((prevState) => {
      return prevState.map((chat) =>
        chat.id === chatId ? { ...chat, newMessageCount: 0 } : chat
      );
    });
  }

  const handleMessageNotifications = (message, increaseMessageCount = true) => {
    setChats((prevList) => {
      // Find the matching chat
      const matchingChat = prevList.find((chat) => chat.id === message.chatId);
      const strangerChat = prevList.find((chat) => chat.chatName === "Stranger");
      console.log("MAtchingchat: ", matchingChat, " strangerChat: ", strangerChat);
      if (!matchingChat) return prevList;

      // Update the matching chat
      const updatedChat = {
        ...matchingChat,
        Last_Message: {
          ...matchingChat.Last_Message,
          content: message.content,
          sentBy: message.userId, // Updating sentBy as well
        },
        newMessageCount: matchingChat.newMessageCount + (increaseMessageCount ? 1 : 0),
      };
      if (strangerChat && message.chatId != 0) return [strangerChat, updatedChat, ...prevList.filter((chat) => (chat.id !== message.chatId && chat.chatName !== "Stranger"))]
      return [updatedChat, ...prevList.filter((chat) => chat.id !== message.chatId)];
    });
  };

  const handleConnectAgain = () => {
    setConnecting(true)
  }

  const updateNewMessageCount = async (chatId, userId) => {
    if (chatId == 0) return;
    try {
      const response = await api.post(`/api/message/update-new-messages-count`, { chatId, userId });
      console.log("Reposne: ", response);
      toast.success(response.data.messages);
    } catch (error) {
      apiError(error);
    }
  }

  const sendFriendRequest = async () => {
    try {
      let response = await api.post('/api/friend/send-friend-req', { selfId, strangerId });
      socketRef.current.emit('send-request');
      toast.success(response.data.messages);
    } catch (error) {
      apiError(error);
    }
    setReqSent(true);
  }

  const handleReqStatus = async (status) => {
    try {
      let response = await api.post('/api/friend/set-status', { status, strangerId });
      toast.success(response.data.messages);
      if (status === "reject") {
        setIsReject(true);
      } else if (status === 'accept') {
        socketRef.current.emit('send-request-accept');
        setIsAccept(true);
        fetchChats();
      }
    } catch (error) {
      apiError(error);
    }

  }

  const fetchFriendRequestDetails = async () => {
    try {
      let response = await api.post('/api/friend/fetch-friend-status', { selfId, strangerId });
      setReqSent(response.data.response.isReqSent);
      setIsReject(response.data.response.isReject);
      setIsAccept(response.data.response.isAccept);
      setReqReceived(response.data.response.isReqRecieved);
    } catch (error) {
      apiError(error);
    }
  }

  return (
    <div className={styles.home}>
      <NavBar />
      <div className={`${styles.chat}`}>
        <div className={`${styles['chat-list']}`}>
          <ChatList chats={chats} handleChatSelect={handleChatSelect} selectedChat={selectedChat} randomConnect={randomConnect} setConnecting={setConnecting} setSelectedChat={setSelectedChat} dont={dont} fetchChats={fetchChats} />
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
              setNormalMessageList={setNormalMessageList}
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
