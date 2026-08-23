'use client'

import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { ArrowBackRounded } from "@mui/icons-material";
import api from "@/utils/api";
import apiError from "@/utils/apiError";
import NavBar from "@/components/NavBar";
import styles from '../styles/chat.module.scss'
import ChatBox from "@/components/ChatBox";
import ChatList from "@/components/ChatList";
import SelectGender from "@/components/SelectGender";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';
import { getSocketInstance } from "@/utils/socket";

export default function Home() {

  const [randomConnect, setRandomConnect] = useState(false);
  const [selectedGender, setSelectedGender] = useState('M');
  const [strangerGender, setStrangerGender] = useState("");
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
  const [isFriend, setIsFriend] = useState(false);
  const [isOnlineUsers, setIsOnlineUsers] = useState({});
  const [isOnlineChatUsers, setIsOnlineChatUsers] = useState({});
  const [profile, setProfile] = useState({});
  const [isStrangerTyping, setIsStrangerIsTyping] = useState(false);
  const [strangerTypingChatId, setStrangerTypingChatId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [ratingRange, setRatingRange] = useState([0, 5]); // State for min and max rating
  const [showChatList, setShowChatList] = useState(true);
  const [isTablet, setIsTablet] = useState(false);

  const selectedChatRef = useRef(selectedChat);
  const selfIdRef = useRef(selfId);
  const isOnlineUsersRef = useRef(isOnlineUsers);
  const isOnlineChatUsersRef = useRef(isOnlineChatUsers);
  const chatListRef = useRef(chats);
  const connectingRef = useRef(connecting);
  const selectedGenderRef = useRef(selectedGender);

  const socket = getSocketInstance();

  useEffect(() => {
    // The server and first client render both use the desktop tree. Applying
    // the media query after mount avoids react-responsive hydrating with a
    // different branch tree, while still reacting to orientation changes.
    const tabletQuery = window.matchMedia('(max-width: 900px)');
    const updateLayout = () => setIsTablet(tabletQuery.matches || window.innerWidth <= 900);

    updateLayout();
    const layoutFrame = window.requestAnimationFrame(updateLayout);
    tabletQuery.addEventListener('change', updateLayout);
    window.addEventListener('resize', updateLayout);

    return () => {
      window.cancelAnimationFrame(layoutFrame);
      tabletQuery.removeEventListener('change', updateLayout);
      window.removeEventListener('resize', updateLayout);
    };
  }, []);

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
      setChats((prevChats)=>{
        let strangerChat = prevChats.find((chat) => chat.chatName === "Stranger");
        if(strangerChat) return [strangerChat, ...response.data.result];
        else return response.data.result;
      });
      
      let obj = {};
      response.data.result.map(user => {
        obj[user.friendId] = user.friendOnlineStatus;
      });
      setIsOnlineChatUsers(obj);
    } catch (error) {
      apiError(error);
    }
  }
  const registeredEvents = new Set();

  function safeEventListener(socket, eventName, callback) {
    // Check if the event is already registered
    if (!registeredEvents.has(eventName)) {
      socket.on(eventName, callback);
      registeredEvents.add(eventName);
      console.log(`Event '${eventName}' registered.`);
    } else {
      console.log(`Event '${eventName}' is already registered.`);
    }
  }

  useEffect(() => {
    fetchUserId();
    fetchProfile();
  }, []);

  useEffect(() => {
  
    if (!socket) {
      console.log("No socket");
      return;
    }
  
    if (!socket.connected) {
      console.log("Socket not connected. Connecting now...");
      socket.connect(); // Explicitly connect the socket
    }
    const clearEvents = () => {
      registeredEvents.forEach(eventName => {
        socket.off(eventName);
        console.log(`Event '${eventName}' cleared.`);
      });
      registeredEvents.clear();
    };
  
    clearEvents();
  
    safeEventListener(socket, 'connect', () => {
      console.log("The connection has been established with backend");
  
      safeEventListener(socket, 'message', (message) => {
        console.log("The message received is: ", message);
        console.log("The message.chatId: ", message.chatId, " selectedChatRef.current: ", selectedChatRef.current);
        if(message.type=="image"){
          if(message.chatId==0){
            const blob = new Blob([message.content.buffer], { type: message.content.type }); // Adjust type if needed
            message.content = URL.createObjectURL(blob);
            console.log("the final image content url: ", message.content);
          }
        }
        if (message.chatId == 0){
          if(selfIdRef.current == message.userId){
            setRandomMessageList((prevState) => {
              const messageExists = prevState.some(
                (prevMessage) => prevMessage.identityKey === message.identityKey
              );
              if(messageExists){
                return prevState.map((prevMessage) => {
                return prevMessage.identityKey === message.identityKey
                  ? { ...prevMessage, content: message.content, createdAt: message.createdAt }
                  : prevMessage;
                })
              }else{
                return [message, ...prevState];
              }
            }
            );
          }else{
            setRandomMessageList((prevState) => [message, ...prevState]);
          }
        }
  
        if (message.chatId == selectedChatRef.current) {
          // if (message.chatId == 0) {
          //   handleMessageNotifications(message, false);
          // } else if (selfIdRef.current !== message.userId) {
          //   setNormalMessageList((prevState) => [message, ...prevState]);
          //   handleMessageNotifications(message, false);
          // }
          
          if(selfIdRef.current == message.userId){
            if(message.chatId){
                setNormalMessageList((prevState) => {
                const messageExists = prevState.some(
                  (prevMessage) => prevMessage.identityKey === message.identityKey
                );
                if (messageExists) {
                  return prevState.map((prevMessage) =>
                  prevMessage.identityKey === message.identityKey
                    ? { ...prevMessage, content: message.content, createdAt: message.createdAt }
                    : prevMessage
                  );
                } else {
                  return [message, ...prevState];
                }
                });
              fetchChats();
            }
          }else{
            if(message.chatId){
              setNormalMessageList((prevState) => [message, ...prevState]);
            }
          }
          handleMessageNotifications(message, false);
        } else {
          handleMessageNotifications(message);
          if (parseInt(selfIdRef.current, 10) !== parseInt(message.userId, 10)) {
            updateNewMessageCount(message.chatId, selfIdRef.current);
          }
        }
      });
  
      safeEventListener(socket, 'user-left', (data) => {
        setStrangerLeftChat(true);
        setRandomConnect(false);
      });
  
      safeEventListener(socket, 'strangers-connected', (response) => {
        // A late socket response can arrive just after the user cancels a
        // search. Ignore it so the preference screen is not replaced by a
        // conversation the user no longer asked for.
        if (response.success && connectingRef.current) {
          const matchedStranger = selfIdRef.current
            ? response.users.find((user) => String(user.id) !== String(selfIdRef.current))
            : response.users[1] || response.users[0];

          setStrangerGender(matchedStranger?.gender || selectedGenderRef.current);
          setRandomConnect(true);
          setConnecting(false);
          setRandomUserIds(response.users.map(user => user.id));
          toast.success(response.message);
        }
      });
  
      safeEventListener(socket, 'receive-request', (res) => {
        setReqReceived(true);
      });
  
      safeEventListener(socket, 'receive-request-accept', (res) => {
        fetchChats();
        toast.info("Stranger has accepted the friend request");
      });
  
      safeEventListener(socket, 'receive-request-accept-later', (message) => {
        toast.info(message);
        fetchChats();
      });
  
      safeEventListener(socket, 'online', (userId) => {
        console.log(`The user with id: ${userId} came online`);
        if (isOnlineChatUsersRef.current.hasOwnProperty(userId)) setIsOnlineChatUsers(prevState => { return { ...prevState, [userId]: 1 }; });
        if (isOnlineUsersRef.current.hasOwnProperty(userId)) setIsOnlineUsers(prevState => { return { ...prevState, [userId]: 1 }; });
      });
  
      safeEventListener(socket, 'offline', (userId) => {
        console.log(`The user with id: ${userId} got offline`);
        if (isOnlineChatUsersRef.current.hasOwnProperty(userId)) setIsOnlineChatUsers(prevState => { return { ...prevState, [userId]: 0 }; });
        if (isOnlineUsersRef.current.hasOwnProperty(userId)) setIsOnlineUsers(prevState => { return { ...prevState, [userId]: 0 }; });
      });
  
      safeEventListener(socket, 'error', (error) => {
        console.log("Socket error: ", error);
        apiError(error);
        setRandomConnect(false);
        setConnecting(false);
        setDont(false);
      });
      safeEventListener(socket, 'typing-status', (res) => {
        if(res.userId===selfId) return;
        setIsStrangerIsTyping(res.isTyping);
        setStrangerTypingChatId(res.chatId);
      });
    });
  
    return () => {
      if (socket) {
        clearEvents();
        socket.disconnect();
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

  useEffect(() => {
    chatListRef.current = chats;
  }, [chats]);

  useEffect(() => {
    selectedGenderRef.current = selectedGender;
  }, [selectedGender]);

  useEffect(() => {
    if (!randomConnect) {
      setChats(chats.slice(1));
      socket.emit('leave-room');
      fetchProfile();
    } else {
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
        gender: strangerGender || selectedGender
      }, ...chats]);
      setSelectedChat(0);
      setStrangerLeftChat(false);
    }
  }, [randomConnect]);

  useEffect(() => {
    connectingRef.current = connecting;
    console.log("connecting to stranger: ", connecting);
    if (connecting) {
      setStrangerId("");
      if (!selectedGender) toast.error("Please select the preffered gender first");
      socket.emit('join-room', { gwant: selectedGender, miRating: ratingRange[0], maRating: ratingRange[1] });
      setMessageContent("");
      setRandomMessageList([]);
    }
  }, [connecting]);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
    if (selectedChat !== "" && selectedChat !== null && selectedChat !== undefined) {
      setMessageContent("");
      setConnecting(false);
      setShowChatList(false);
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


  const sendMessage = async (content=messageContent, type="text") => {
    if (!content || !(selectedChat || selectedChat==0)) return;
    setIsTyping(false);
    setMessageContent("");
    const identityKey = uuidv4();
    socket.emit("message", { messageContent: content, chatId: selectedChat, identityKey, type });
    if (selectedChat) {
      setNormalMessageList((prevState) => [{ identityKey, userId: selfId, createdAt: null, content: content, chatId: selectedChat, type }, ...prevState]);
    // await createMessage(content, identityKey);
      // fetchChats();
    }else{
      setRandomMessageList((prevState) => [{ identityKey, userId: selfId, createdAt: null, content: content, chatId: selectedChat, type }, ...prevState]);
    }
  };

  const createMessage = async (messageContent, identityKey = null) => {
    try {
      let response = await api.post('/api/message/create-message', { chatId: selectedChat, content: messageContent, identityKey });
      // setNormalMessageList((prevState) =>
      //   prevState.map((message) =>
      //     message.identityKey === response.data.identityKey
      //       ? { ...message, createdAt: response.data.createdAt }
      //       : message
      //   )
      // );

      toast.success(response.data.messages);
    } catch (error) {
      apiError(error);
    }
  }


  const handleChatSelect = (chatId) => {
    // if (chatId >= 1) fetchMessages(chatId);
    setSelectedChat(chatId);
    if (isTablet) setShowChatList(false);
    setChats((prevState) => {
      return prevState.map((chat) =>
        chat.id === chatId ? { ...chat, newMessageCount: 0 } : chat
      );
    });
  }

  const handleStartNewConnection = (chatId) => {
    setSelectedChat(chatId);

    // ChatList uses an empty selection to open the matching flow. On mobile,
    // the list and matching pane are mutually exclusive, so switch panes as
    // part of the same user action instead of waiting for a chat selection.
    if (chatId === "" || chatId === null || chatId === undefined) {
      setShowChatList(false);
    }
  }

  const resetMatchSearch = (returnToList = false) => {
    connectingRef.current = false;
    if (socket?.connected) socket.emit('leave-room');

    setConnecting(false);
    setRandomConnect(false);
    setDont(false);
    setSelectedChat("");
    setMessageContent("");
    setRandomMessageList([]);
    setRandomUserIds([]);
    setStrangerId("");
    setStrangerGender("");
    setStrangerLeftChat(false);
    setShowChatList(returnToList);
  }

  const handleMatchingBack = () => {
    if (connecting) {
      resetMatchSearch(true);
      return;
    }

    setShowChatList(true);
  }

  useEffect(() => {
    if (connecting && isTablet) setShowChatList(false);
  }, [connecting, isTablet]);

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
          content: (message?.type=="image")?"Photo":message.content,
          sentBy: message.userId, // Updating sentBy as well
          type: message.type,
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
      // console.log("Reposne: ", response);
      // toast.success(response.data.messages);
    } catch (error) {
      apiError(error);
    }
  }

  const sendFriendRequest = async () => {
    try {
      let response = await api.post('/api/friend/send-friend-req', { selfId, strangerId });
      socket.emit('send-request');
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
        socket.emit('send-request-accept');
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
        socket.emit('send-request-accept-later', friendId);
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
      setIsFriend(response.data.response.isFriend);
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
        {((isTablet && showChatList) || !isTablet) && 
          <div className={`${styles['chat-list']}`}>
            <ChatList
              chats={chats}
              handleChatSelect={handleChatSelect}
              selectedChat={selectedChat}
              randomConnect={randomConnect}
              setConnecting={setConnecting}
              setSelectedChat={handleStartNewConnection}
              dont={dont}
              fetchChats={fetchChats}
              handleReqStatus={handleReqStatus}
              isOnlineUsers={isOnlineUsers}
              setIsOnlineUsers={setIsOnlineUsers}
              isOnlineChatUsers={isOnlineChatUsers}
              setIsOnlineChatUsers={setIsOnlineChatUsers}
            />
          </div>
        }
        {((isTablet && !showChatList) || !isTablet) && 
          <div className={`${styles['chat-area']}`}>
            {isTablet && !randomConnect && (selectedChat === "" || selectedChat === null || selectedChat === undefined) && (
              <div className={styles['mobile-pane-nav']}>
                <IconButton
                  className={styles['mobile-back-button']}
                  aria-label="Back to conversations"
                  onClick={handleMatchingBack}
                >
                  <ArrowBackRounded />
                </IconButton>
                <span>New connection</span>
              </div>
            )}
            <div className={styles['chat-pane-content']}>
              {connecting ? (
                <div className={styles.connecting}>
                  <div className={styles['loader-shell']}>
                    <CircularProgress size={48} thickness={4.5} sx={{ color: 'var(--clay-primary)' }} />
                  </div>
                  <div className={styles['connecting-copy']}>
                    <strong>Finding your next conversation</strong>
                    <span>Matching your preferences with someone who is ready to chat.</span>
                  </div>
                  <Button
                    className={styles['cancel-search']}
                    variant="outlined"
                    startIcon={<ArrowBackRounded />}
                    onClick={() => resetMatchSearch(false)}
                  >
                    Adjust preferences
                  </Button>
                </div>
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
                  isFriend={isFriend}
                  sendFriendRequest={sendFriendRequest}
                  handleReqStatus={handleReqStatus}
                  setNormalMessageList={setNormalMessageList}
                  isStrangerTyping={isStrangerTyping}
                  strangerTypingChatId={strangerTypingChatId}
                  isTyping={isTyping}
                  setIsTyping={setIsTyping}
                  profile={profile}
                  activeChat={chats.find((chat) => chat.id == selectedChat)}
                  onBack={() => setShowChatList(true)}
                />
              ) : (
                <SelectGender
                  setConnecting={setConnecting}
                  selectedGender={selectedGender}
                  setSelectedGender={setSelectedGender}
                  setDont={setDont}
                  profile={profile}
                  ratingRange={ratingRange}
                  setRatingRange={setRatingRange}
                />
              )}
            </div>


          </div>
        }
      </div>
    </div>
  );
}
