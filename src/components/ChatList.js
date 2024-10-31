'use client'

import React, { useEffect, useRef, useState } from "react";
import {
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
import { Search } from "@mui/icons-material";
import styles from '../styles/chatlist.module.scss'

const chats = [
    {
        id: 1,
        chatName: "Alice Johnson",
        newMessageCount: 2,
        Last_Message: {
            content: "Hey, are we still on for tomorrow?",
            createdAt: "2024-10-29T12:45:00Z",
        },
    },
    {
        id: 2,
        chatName: "Bob Smith",
        newMessageCount: 17,
        Last_Message: {
            content: "I'll send you the documents by tonight.",
            createdAt: "2024-10-28T09:30:00Z",
        },
    },
    {
        id: 3,
        chatName: "Cathy Lee",
        newMessageCount: 0,
        Last_Message: {
            content: "Thanks for the update!",
            createdAt: "2024-10-27T18:15:00Z",
        },
    },
    {
        id: 4,
        chatName: "Daniel Adams",
        newMessageCount: 3,
        Last_Message: {
            content: "Are you free to catch up later?",
            createdAt: "2024-10-27T14:20:00Z",
        },
    },
    {
        id: 5,
        chatName: "Evelyn Wright",
        newMessageCount: 0,
        Last_Message: {
            content: "See you at the meeting tomorrow!",
            createdAt: "2024-10-26T17:00:00Z",
        },
    },
    {
        id: 6,
        chatName: "Frank Miller",
        newMessageCount: 5,
        Last_Message: {
            content: "Let me know if you need any help.",
            createdAt: "2024-10-25T11:30:00Z",
        },
    },
    {
        id: 7,
        chatName: "Grace Kim",
        newMessageCount: 0,
        Last_Message: {
            content: "Thanks, talk to you soon!",
            createdAt: "2024-10-24T08:45:00Z",
        },
    },
    {
        id: 8,
        chatName: "Henry Zhao",
        newMessageCount: 2,
        Last_Message: {
            content: "Can you review this document?",
            createdAt: "2024-10-23T19:10:00Z",
        },
    },
    {
        id: 9,
        chatName: "Ivy Tran",
        newMessageCount: 0,
        Last_Message: {
            content: "Let’s schedule a call for next week.",
            createdAt: "2024-10-22T15:00:00Z",
        },
    },
    {
        id: 10,
        chatName: "Jake Liu",
        newMessageCount: 4,
        Last_Message: {
            content: "Thanks for the quick response!",
            createdAt: "2024-10-21T10:05:00Z",
        },
    },
];


const ChatList = () => {
    return (
        <div className={`${styles.container}`}>
            <div className={styles['chat-list-header']}>
                <div style={{fontSize: '25px', fontWeight: 'bold', padding: '10px', paddingLeft: '20px'}}>Chats</div>
                <Paper component="form" className={styles.search}>
                    <InputBase
                        className={styles['search-bar']}
                        placeholder="Search"
                        inputProps={{ "aria-label": "search" }}
                    />
                    <IconButton className={styles['search-icon']} aria-label="search">
                        <Search />
                    </IconButton>
                </Paper>

            </div>

            {/* Chat List */}
            <List>
                {chats?.map((chat, index) => (
                    <ListItem key={index} className={styles['chat-list-item']} onClick={() => handleChatSelect(chat.id)}>
                        <ListItemAvatar>
                            <Badge
                                badgeContent={chat.newMessageCount > 0 ? chat.newMessageCount : null}
                                color="error"
                                sx={{
                                    "& .MuiBadge-badge": {
                                        fontSize: '0.7rem',
                                        minWidth: '17.6px',
                                        height: '18px',
                                        padding: 0,
                                        top: '4px',
                                        right: '5px',
                                        border: '0.1px solid white',  // Adjust padding if needed
                                    },
                                }}

                            >
                                <Avatar alt={chat.chatName} src={chat.avatar} />
                            </Badge>
                        </ListItemAvatar>
                        <ListItemText
                            primary={chat.chatName}
                            secondary={chat.Last_Message?.content}
                            primaryTypographyProps={{ className: styles['chat-name'] }}
                            secondaryTypographyProps={{ className: styles['chat-message'] }}
                        />
                        <Typography style={{ fontSize: '0.7rem', color: 'grey' }} className="contactTime">
                            {chat.Last_Message?.createdAt.split('T')[0]}
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </div >
    )
}
export default ChatList;