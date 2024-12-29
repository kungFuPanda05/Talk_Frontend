'use client'

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
} from "@mui/material";
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
import { v4 as uuidv4 } from 'uuid';


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
  const [isOnlineUsers, setIsOnlineUsers] = useState({});
  const [isOnlineChatUsers, setIsOnlineChatUsers] = useState({});
  const [profile, setProfile] = useState({});

  const socketRef = useRef();
  const selectedChatRef = useRef(selectedChat);
  const selfIdRef = useRef(selfId);
  const isOnlineUsersRef = useRef(isOnlineUsers);
  const isOnlineChatUsersRef = useRef(isOnlineChatUsers);
  const chatListRef = useRef(chats);

  const token = Cookies.get('token');

  const fetchUserId = async () => {
    try {
      let response = await api.get('/api/user/getId');
      setSelfId(response.data.result);
    } catch (error) {
      apiError(error);
    }
  }
  const fetchChats = async (search = "", limit = 10, page = 1) => {
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
      let obj = {};
      response.data.result.map(user => {
        obj[user.friendId] = user.friendOnlineStatus;
      });
      setIsOnlineChatUsers(obj);
    } catch (error) {
      apiError(error);
    }
  }
  useEffect(() => {
    fetchUserId();
    fetchProfile();
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
          } else if(selfIdRef.current!==message.userId) {
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
        // fetchFriendRequestDetails();
      });

      socketRef.current.on('receive-request-accept', (res) => {
        // setIsAccept(true);
        fetchChats();
        toast.info("Stranger has accepted the friend request");
      })

      socketRef.current.on('receive-request-accept-later', (message) => {
        toast.info(message);
        fetchChats();
      })

      socketRef.current.on('online', (userId) => {
        console.log(`The user with id: ${userId} came online`);
        // console.log("Old is online users state(Online): ", isOnlineUsers);
        if (isOnlineChatUsersRef.current.hasOwnProperty(userId)) setIsOnlineChatUsers(prevState => { return { ...prevState, [userId]: 1 } });
        if (isOnlineUsersRef.current.hasOwnProperty(userId)) setIsOnlineUsers(prevState => { return { ...prevState, [userId]: 1 } });
        // setIsOnlineUsers(prevState => { return {...prevState, [userId]: 1}});
        // setIsOnlineUsers({...isOnlineUsers, [userId]: 1});
      })

      socketRef.current.on('offline', (userId) => {
        // console.log(`The user with id: ${userId} got offline`);
        // console.log("Old isOnline users state(Offline): ", isOnlineUsers);
        if (isOnlineChatUsersRef.current.hasOwnProperty(userId)) setIsOnlineChatUsers(prevState => { return { ...prevState, [userId]: 0 } });
        if (isOnlineUsersRef.current.hasOwnProperty(userId)) setIsOnlineUsers(prevState => { return { ...prevState, [userId]: 0 } });
        // setIsOnlineUsers(prevState => { return {...prevState, [userId]: 0}});
        // setIsOnlineUsers({...isOnlineUsers, [userId]: 0});
      })

      socketRef.current.on('error', (error) => {
        console.log("on the frontend receiving error");
        toast.error(error.message);
        setRandomConnect(false);
        setConnecting(false);
        setDont(false);
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
    console.log("The online users are: ", isOnlineUsers);
    isOnlineUsersRef.current = isOnlineUsers;
  }, [isOnlineUsers])

  useEffect(() => {
    console.log("The online chat users are: ", isOnlineChatUsers);
    isOnlineChatUsersRef.current = isOnlineChatUsers;
  }, [isOnlineChatUsers])

  useEffect(() => {
    if (strangerId && selfId) fetchFriendRequestDetails();
  }, [strangerId, selfId]);

  useEffect(()=>{
    chatListRef.current = chats;
  }, [chats]);

  useEffect(() => {
    console.log("Random connect use effect triggered: ", randomConnect);
    if (!randomConnect) {
      console.log("reaching to set chats 2");
      setChats(chats.slice(1));
      socketRef.current.emit('leave-room');
      fetchProfile();
    } else {
      console.log("random connect trigger  hu gya");
      console.log("reaching to set chats 3");
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
      const identityKey = uuidv4();
      setNormalMessageList((prevState) => [{identityKey, userId: selfId, createdAt: null, content: messageContent, chatId: (selectedChat || 0)}, ...prevState]);
      await createMessage(messageContent, identityKey);
      fetchChats();
    }
    setMessageContent("");
  };

  const createMessage = async (messageContent, identityKey=null) => {
    try {
      let response = await api.post('/api/message/create-message', { chatId: selectedChat, content: messageContent, identityKey });
      setNormalMessageList((prevState) =>
        prevState.map((message) =>
          message.identityKey === response.data.identityKey
            ? { ...message, createdAt: response.data.createdAt }
            : message
        )
      );
      
      toast.success(response.data.messages);
    } catch (error) {
      apiError(error);
    }
  }


  const handleChatSelect = (chatId) => {
    // if (chatId >= 1) fetchMessages(chatId);
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

  const handleReqStatus = async (status, friendId) => {
    try {
      let response = await api.post('/api/friend/set-status', { status, strangerId: (friendId || strangerId) });
      toast.success(response.data.messages);
      if (status === "reject") {
        setIsReject(true);
      } else if (status === 'accept') {
        socketRef.current.emit('send-request-accept');
        setIsAccept(true);
        fetchChats();
      } else if (status === "block") {
        fetchChats();
      }
    } catch (error) {
      apiError(error);
    }

  }

  const handleLaterReqStatus = async (status, friendId) => {
    try {
      let response = await api.post('/api/friend/set-status', { status, strangerId: (friendId || strangerId) });
      toast.success(response.data.messages);
      if (status === "reject") {
        setIsReject(true);
      } else if (status === 'accept') {
        socketRef.current.emit('send-request-accept-later', friendId);
        setIsAccept(true);
        fetchChats();
      } else if (status === "block") {
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
  const fetchProfile = async () => {
    try {
      let response = await api.get('/api/user/getProfile');
      setProfile(response.data.profile);
    } catch (error) {
      apiError(error);
    }
  }

  return (
    <div className={styles.home}>
      <NavBar 
        profile={profile} 
        isReqRecieved={isReqRecieved} 
        isAccept={isAccept} 
        isReject={isReject} 
        setIsOnlineUsers={setIsOnlineUsers} 
        isOnlineUsers={isOnlineUsers}
        handleLaterReqStatus={handleLaterReqStatus}  
      />
      <div className={`${styles.chat}`}>
        <div className={`${styles['chat-list']}`}>
          <ChatList
            chats={chats}
            handleChatSelect={handleChatSelect}
            selectedChat={selectedChat}
            randomConnect={randomConnect}
            setConnecting={setConnecting}
            setSelectedChat={setSelectedChat}
            dont={dont}
            fetchChats={fetchChats}
            handleReqStatus={handleReqStatus}
            isOnlineUsers={isOnlineUsers}
            setIsOnlineUsers={setIsOnlineUsers}
            isOnlineChatUsers={isOnlineChatUsers}
            setIsOnlineChatUsers={setIsOnlineChatUsers}
          />
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
              profile={profile}
            />
          )}


        </div>
      </div>
    </div>
  );
}
