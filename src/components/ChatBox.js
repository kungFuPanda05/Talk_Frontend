import {
    Box,
    Avatar,
    InputBase,
    IconButton,
    Typography,
    TextareaAutosize,
} from "@mui/material";
import { AttachFile, InsertEmoticon, Send } from "@mui/icons-material";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState } from "react";
import styles from '../styles/chatbox.module.scss'

const ChatBox = ({ selfId, messages, setMessageContent, messageContent, sendMessage }) => {
    const [hasMore, setHasMore] = useState(false);

    const fetchMoreMessages = () => {

    }

    return (
        <div className={styles.container}>
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
            <Box

                className={`${styles['send-message']}`}>
                <Avatar />
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
        </div>

    )
}
export default ChatBox;