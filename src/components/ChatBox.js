import {
    Box,
    Avatar,
    InputBase,
    IconButton,
    Typography,
    TextareaAutosize,
    Button,
} from "@mui/material";
import { AttachFile, InsertEmoticon, Send } from "@mui/icons-material";
import InfiniteScroll from 'react-infinite-scroll-component';
import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from '../styles/chatbox.module.scss'
import RefreshIcon from '@mui/icons-material/Refresh';
import { toast } from "react-toastify";
import apiError from "@/utils/apiError";
import api from "@/utils/api";
import Image from "next/image";
import pending from '../../public/images/pending.png'
import { debounce, formatDate } from "@/utils/functions";
import Typing from "./Typing";
import { getSocketInstance } from "@/utils/socket";
import { useMediaQuery } from "react-responsive";
import EmojiPickerDemo from "./EmojiPicker";
import EmojiPicker from 'emoji-picker-react';
import { memo } from 'react';
import imageUploadApi from "@/utils/imagUploadApi";
import { v4 as uuidv4 } from 'uuid';


const ChatBox = ({ selfId, messages, setMessageContent, messageContent, sendMessage, selectedChat, setRandomConnect, setConnecting, isStrangerLeftChat, handleConnectAgain, strangerId, isReqSent, isReqRecieved, isAccept, isReject, sendFriendRequest, handleReqStatus, setNormalMessageList, isStrangerTyping, strangerTypingChatId, isTyping, setIsTyping, profile }) => {
    let [limit, setLimit] = useState(100);
    let [page, setPage] = useState(1);
    let [search, setSearch] = useState("");

    const [hasMore, setHasMore] = useState(true);
    const [isRandomChatDisconnected, setRandomChatDisconnected] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const sendMessageInputRef = useRef();
    const messageEndRef = useRef();
    const fileInputRef = useRef(null);

    const socket = useMemo(() => getSocketInstance(), []);

    const isMobile = useMediaQuery({ maxWidth: 500 });

    const handleRandomChatDisconnect = () => {
        setRandomConnect(false);
        setRandomChatDisconnected(true);
    }

    const fetchMessages = async (chatId, search, limit, page, more = false) => {
        console.log("Fetching messages: ", chatId);
        try {
            const response = await api.get(`/api/message/fetch-messages/${chatId}`, {
                params: { search, limit, page },
            });

            const newMessages = response.data.result;

            // If the number of fetched messages is less than the limit, no more messages are available
            if (newMessages.length < limit) {
                setHasMore(false);
            }

            // Update the page and append the new messages to the list
            setPage((prevPage) => prevPage + 1);
            if (more) setNormalMessageList((prevMessages) => [...newMessages, ...prevMessages]);
            else setNormalMessageList(newMessages);
        } catch (error) {
            apiError(error);
            setHasMore(false); // Stop infinite scroll if there's an error
        }
    };


    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView();
    };
    const debouncedSetIsTypingFalse = useCallback(
        debounce(() => {
            setIsTyping(false);
        }, 500),
        [] // Ensure debounce function is created only once
    );

    const MemoizedEmojiPicker = memo(({ isOpen, onEmojiClick }) => (
        isOpen ?
            <EmojiPicker
                style={{ position: 'absolute', bottom: '90px', right: '20px' }}
                autoFocusSearch={false}
                open={isOpen}
                onEmojiClick={onEmojiClick}
            />
            : null
    ));

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const previewUrl = URL.createObjectURL(selectedFile);
            setFilePreview(previewUrl);
        }
    };
    const sendImage = async () => {
        try {
            if (!file) {
                toast.error("Please select an image to send");
                return;
            }
            if (selectedChat == 0) {
                const reader = new FileReader();
                reader.readAsArrayBuffer(file); // Read image as ArrayBuffer
                reader.onload = () => {
                    sendMessage({ buffer: reader.result, type: file.type }, "image");
                    // socket.emit("message", { messageContent: { buffer: reader.result, type: file.type }, chatId: selectedChat, identityKey, type: "image" });
                };
            } else {
                const formData = new FormData();
                formData.append("sendImage", file);
                const identityKey = uuidv4();
                setNormalMessageList((prevState) => [{ identityKey, userId: selfId, createdAt: null, content: "Photo", chatId: selectedChat, type: "image" }, ...prevState]);
                const response = await imageUploadApi.post(`/api/message/send-image/${selectedChat}`, formData, {
                    params: { identityKey }
                });
            }
            setFile(null);
            setFilePreview(null);
            // toast.success(response.data.message);
        } catch (error) {
            apiError(error);
        }
    }

    useEffect(() => {
        sendMessageInputRef.current?.focus();
        setPage(1);
        setLimit(10);
        setSearch("");
        if (selectedChat >= 1) {
            setNormalMessageList([]);
            fetchMessages(selectedChat, "", 100, 1);
        }
        setIsEmojiPickerOpen(false);
    }, [selectedChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    useEffect(() => {
        if (messageContent && !isTyping) {
            setIsTyping(true);
        }
        debouncedSetIsTypingFalse();
    }, [messageContent]);

    useEffect(() => {
        socket.emit('typing', { chatId: (selectedChat || 0), isTyping: isTyping });
    }, [isTyping]);

    useEffect(() => {
        console.log("the strangertyping: ", isStrangerTyping, strangerTypingChatId, selectedChat);
        if (isStrangerTyping && (strangerTypingChatId == selectedChat || !selectedChat)) scrollToBottom();
    }, [isStrangerTyping, strangerTypingChatId, selectedChat])

    return (
        <div className={styles.container}>
            {!selectedChat && !isReqSent && !isReqRecieved && !isAccept && !isReject &&
                <Button variant="contained" color="primary"
                    style={{
                        position: 'absolute',
                        width: '100px',
                        fontSize: '10px',
                        background: 'red'
                    }}
                    onClick={sendFriendRequest}
                >Add friend</Button>
            }
            {!selectedChat && isReqRecieved && !isReject && !isAccept &&
                (<div style={{ position: 'absolute' }}>
                    <Button variant="contained" color="primary"
                        style={{

                            width: '80px',
                            fontSize: '10px',
                            background: 'red',
                            marginRight: '5px'
                        }}
                        onClick={() => handleReqStatus('reject')}
                    >Reject</Button>

                    <Button variant="contained" color="primary"
                        style={{
                            width: '80px',
                            fontSize: '10px',
                            background: 'green'
                        }}
                        onClick={() => handleReqStatus('accept')}
                    >Accept</Button>
                </div>)
            }
            <div id="scrollableChatBox" className={` ${styles['scroll-container']}`}>
                <InfiniteScroll
                    dataLength={messages.length}
                    next={() => fetchMessages(selectedChat, search, limit, page, true)}
                    hasMore={hasMore}
                    inverse={true} /* Loads on scroll up */
                    scrollableTarget="scrollableChatBox" /* Targets the scrolling box */
                    loader={
                        "Loading..."
                    }
                    style={{
                        display: 'flex',
                        flexDirection: 'column-reverse',
                        justifyContent: 'flex-start',
                    }}
                // endMessage={
                //     <Typography variant="body2" align="center" color="textSecondary" mt={2}>
                //         No more messages
                //     </Typography>
                // }
                >
                    <div ref={messageEndRef} />
                    {isStrangerTyping && (strangerTypingChatId == selectedChat || !selectedChat) && <Typing />}
                    {messages.map((message, index) => (
                        <>
                            {message.createdAt ? (
                                <Typography className={`${selfId === message.userId ? 'flex-ending' : 'flex-starting'}`} variant="body2" align="center" color="textSecondary" style={{ marginBottom: '3.5px', marginTop: '1.5px', fontSize: (isMobile ? '0.55em' : '0.7em') }}>
                                    {formatDate(message.createdAt)}
                                </Typography>
                            ) : (
                                <div className={`${selfId === message.userId ? 'flex-ending' : 'none'}`} style={{ marginBottom: '3px', marginTop: '1px' }}>
                                    <Image src="/images/pending.png" alt="Pending" width={15} height={17} />

                                </div>
                            )}
                            {message.type === "image" ? (
                                (message.createdAt ? (
                                    <div key={index} className={`${styles['chat-image']} ${selfId === message.userId ? styles['image-sent'] : ''}`}>
                                        {/* <Image style={{borderRadius: 'inherit' }} src={process.env.NEXT_PUBLIC_API_URL + "/"+ message.content} alt="Unable to load the image" width={250} height={250}></Image> */}
                                        <Image
                                            // style={{ borderRadius: 'inherit' }}
                                            src={(selectedChat == 0) ? message.content : `${process.env.NEXT_PUBLIC_API_URL}/${message.content}`}
                                            alt="Unable to load the image"
                                            layout="intrinsic" // This will maintain the aspect ratio
                                            width={250} // Max width
                                            height={250} // Auto height based on aspect ratio
                                        />
                                    </div>) : (
                                    <div key={index} className={`${styles['message-bar']} ${selfId === message.userId ? styles['message-sent'] : ''}`}>
                                        Sending Image...
                                    </div>
                                ))
                            ) : (
                                <div key={index} className={`${styles['message-bar']} ${selfId === message.userId ? styles['message-sent'] : ''}`}>
                                    {message.content}
                                </div>
                            )}
                        </>

                    ))}
                </InfiniteScroll>

            </div>
            {((isRandomChatDisconnected || isStrangerLeftChat) && !selectedChat) ? (
                <div style={{ paddingTop: '20px' }}>
                    <p style={{ fontFamily: 'cursive' }}>{isRandomChatDisconnected ? "Chat Disconnected" : "Stranger left the chat"}</p>
                    <Button variant="contained" color="secondary" onClick={handleConnectAgain}>Click to connect again</Button>
                </div>
            ) : (
                <Box

                    className={`${styles['send-message']}`}>
                    {selectedChat ? (
                        // <Avatar />
                        <Avatar
                            alt={profile?.name}
                            src={profile?.avatar}
                            style={{
                                backgroundColor: profile?.name ? `hsl(${profile?.name.charCodeAt(0) * 10 % 360}, 70%, 60%)` : '#ccc',
                                color: '#fff'
                            }}
                        >
                            {!profile?.avatar && profile?.name ? profile?.name[0] : null}
                        </Avatar>
                    ) : (
                        <RefreshIcon style={{ fontSize: '35px', color: 'grey', cursor: 'pointer' }} onClick={handleRandomChatDisconnect} />
                    )}
                    <TextareaAutosize
                        minRows={1} // Minimum number of rows (lines)
                        maxRows={4} // Optional: Maximum number of rows before scrolling
                        style={{
                            flex: 1,
                            marginLeft: '9px',
                            backgroundColor: '#F0F2F5',
                            padding: '10px',
                            height: '20px',
                            borderRadius: '5px',
                            width: '100%',
                            border: 'none'
                        }}
                        placeholder="Type message"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        ref={sendMessageInputRef}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault(); // Prevents a new line from being added
                                setIsEmojiPickerOpen(false);
                                if (file) sendImage();
                                sendMessage().then(() => {
                                    console.log("Focusing again");

                                    setTimeout(() => {
                                        sendMessageInputRef.current?.focus(); // 🔥 Ensure keyboard remains open
                                    }, 1000); // Small delay to re-focus after React re-renders
                                });
                            }
                        }}
                    />
                    <IconButton onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                        <AttachFile />
                    </IconButton>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg, image/png"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    {file &&
                        <img src={filePreview} style={{ width: '50px', height: '50px' }} onClick={() => { setFile(null); setFilePreview(null) }} />
                    }
                    {!isMobile &&
                        <IconButton onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}>
                            <InsertEmoticon />
                        </IconButton>
                    }
                    <IconButton onClick={() => { setIsEmojiPickerOpen(false); if (file) sendImage(); sendMessage() }}>
                        <Send />
                    </IconButton>
                    <EmojiPickerDemo
                        message={messageContent}
                        setMessage={setMessageContent}
                        isModalOpen={isEmojiPickerOpen}
                        setIsModalOpen={setIsEmojiPickerOpen}
                    ></EmojiPickerDemo>
                    {/* <EmojiPicker style={{ position: 'absolute', bottom: '90px', right: '20px' }} autoFocusSearch={true} open={isEmojiPickerOpen} onEmojiClick={(emojiObj) => setMessageContent(prevState => prevState + emojiObj.emoji)} /> */}
                    {/* <MemoizedEmojiPicker
                        isOpen={isEmojiPickerOpen}
                        onEmojiClick={(emojiObj) => setMessageContent(prev => prev + emojiObj.emoji)}
                    /> */}
                </Box>

            )}

        </div>

    )
}
export default ChatBox;