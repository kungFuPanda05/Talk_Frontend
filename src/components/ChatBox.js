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
import { useEffect, useRef, useState } from "react";
import styles from '../styles/chatbox.module.scss'
import RefreshIcon from '@mui/icons-material/Refresh';
import { toast } from "react-toastify";
import apiError from "@/utils/apiError";
import api from "@/utils/api";
import Image from "next/image";
import pending from '../../public/images/pending.png'
import { formatDate } from "@/utils/functions";


const ChatBox = ({ selfId, messages, setMessageContent, messageContent, sendMessage, selectedChat, setRandomConnect, setConnecting, isStrangerLeftChat, handleConnectAgain, strangerId, isReqSent, isReqRecieved, isAccept, isReject, sendFriendRequest, handleReqStatus, setNormalMessageList }) => {
    let [limit, setLimit] = useState(100);
    let [page, setPage] = useState(1);
    let [search, setSearch] = useState("");

    const [hasMore, setHasMore] = useState(true);
    const [isRandomChatDisconnected, setRandomChatDisconnected] = useState(false);

    const sendMessageInputRef = useRef();
    const messageEndRef = useRef();

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

    useEffect(() => {
        sendMessageInputRef.current?.focus();
        setPage(1);
        setLimit(10);
        setSearch("");
        if (selectedChat >= 1) {
            setNormalMessageList([]);
            fetchMessages(selectedChat, "", 100, 1);
        }
    }, [selectedChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);



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
                        flexDirection: 'column-reverse'
                    }}
                // endMessage={
                //     <Typography variant="body2" align="center" color="textSecondary" mt={2}>
                //         No more messages
                //     </Typography>
                // }
                >
                    <div ref={messageEndRef} />
                    {messages.map((message, index) => (
                        <>
                            {message.createdAt?(
                                <Typography className={`${selfId === message.userId ? 'flex-ending' : 'flex-starting'}`} variant="body2" align="center" color="textSecondary" style={{marginBottom: '3.5px', marginTop: '1.5px', fontSize: '0.7em'}}>
                                    {formatDate(message.createdAt)}
                                </Typography>
                            ): (
                                <div className={`${selfId === message.userId ? 'flex-ending' : 'none'}`} style={{ marginBottom: '3px', marginTop: '1px' }}>
                                    <Image src="/images/pending.png" alt="Pending" width={15} height={17} />

                                </div>
                            )}
                            <div key={index} className={`${styles['message-bar']} ${selfId === message.userId ? styles['message-sent'] : ''}`}>
                                {message.content}
                            </div>
                        </>

                    ))}
                    {/* Add a dummy div at the bottom for scrolling */}




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
                        <Avatar />
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
                                sendMessage(); // Call the sendMessage function
                            }
                        }}
                    />
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
            )}

        </div>

    )
}
export default ChatBox;