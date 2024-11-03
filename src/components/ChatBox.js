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
import { useEffect, useState } from "react";
import styles from '../styles/chatbox.module.scss'
import RefreshIcon from '@mui/icons-material/Refresh';
import { toast } from "react-toastify";


const ChatBox = ({ selfId, messages, setMessageContent, messageContent, sendMessage, selectedChat, setRandomConnect, setConnecting, isStrangerLeftChat, handleConnectAgain, strangerId, isReqSent, isReqRecieved, isAccept, isReject, sendFriendRequest, handleReqStatus }) => {
    const [hasMore, setHasMore] = useState(false);
    const [isRandomChatDisconnected, setRandomChatDisconnected] = useState(false);

    const handleRandomChatDisconnect = () => {
        setRandomConnect(false);
        setRandomChatDisconnected(true);
    }


    const fetchMoreMessages = () => {

    }


    return (
        <div className={styles.container}>
            {!selectedChat && !isReqSent && !isReqRecieved &&
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
                (<div style={{position: 'absolute'}}>
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
                    next={fetchMoreMessages}
                    hasMore={hasMore}
                    inverse={true} /* Loads on scroll up */
                    scrollableTarget="scrollableChatBox" /* Targets the scrolling box */
                    loader={
                        "Loading..."
                    }
                // endMessage={
                //     <Typography variant="body2" align="center" color="textSecondary" mt={2}>
                //         No more messages
                //     </Typography>
                // }
                >
                    {messages.map((message, index) => (
                        <div className={`${styles['message-bar']} ${selfId === message.userId ? styles['message-sent'] : ''}`}>
                            {message.content}
                        </div>

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