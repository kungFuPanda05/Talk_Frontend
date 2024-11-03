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


const ChatList = ({chats, handleChatSelect, selectedChat}) => {
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
                    <ListItem key={index} className={`${styles['chat-list-item']} ${(chat.id==selectedChat && !chat.gender)? styles['chat-select']: ""} ${(chat.gender)? `${chat.gender}-bg`:""}`} onClick={() => handleChatSelect(chat.id)}>
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
                            secondary={chat.Last_Message?.content ?? "No messages yet..."}
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