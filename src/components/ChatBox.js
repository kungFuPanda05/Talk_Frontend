import {
    Box,
    Avatar,
    InputBase,
    IconButton,
    Typography,
} from "@mui/material";
import { AttachFile, InsertEmoticon, Send } from "@mui/icons-material";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState } from "react";
import styles from '../styles/chatbox.module.scss'

const ChatBox = () => {
    const [selfId, setSelfId] = useState(1);
    const [messages, setMessages] = useState([
        { content: "First message", userId: 1 },
        { content: "Second message", userId: 2 },
        { content: "Third message", userId: 1 },
        { content: "Fourth message", userId: 1 },
        { content: "Fifth message", userId: 2 },
        { content: "Sixth message", userId: 1 },
        { content: "Seventh message", userId: 2 },
        { content: "Eighth message", userId: 2 },
        { content: "Nineth message", userId: 1 },
        { content: "Tenth, kyu be bhadwe kaha gand mara rha hai be chutiye gendu message", userId: 2 },
    ]);
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
                <Avatar src="/img1.png" />
                <InputBase style={{ flex: 1, marginLeft: '9px', backgroundColor: 'F1F1F1' }} className="" placeholder="Type message" />
                <IconButton>
                    <AttachFile />
                </IconButton>
                <IconButton>
                    <InsertEmoticon />
                </IconButton>
                <IconButton>
                    <Send />
                </IconButton>
            </Box>
        </div>

    )
}
export default ChatBox;