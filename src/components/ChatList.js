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
    Button,
    Box,
    Menu,
    MenuItem
} from "@mui/material";
import { Search } from "@mui/icons-material";
import styles from '../styles/chatlist.module.scss'
import NoDataFound from "./NoDataFound";
import MoreIcon from '@mui/icons-material/MoreVert';
import { toast } from "react-toastify";
import apiError from "@/utils/apiError";
import api from "@/utils/api";


const ChatList = ({ chats, handleChatSelect, selectedChat, randomConnect, setConnecting, setSelectedChat, dont, fetchChats, handleReqStatus }) => {
    let [limit, setLimit] = useState(10);
    let [page, setPage] = useState(1);
    let [search, setSearch] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const isOpen = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const deleteChat = async(chatId) => {
        console.log("reaching to delete chat: ", chatId);
        try{
            let response = await api.post(`/api/chat/delete-chat/${chatId}`);
            console.log("The response is : ", response)
            toast.success(response.data.message, {
                position: 'top-center',
                hideProgressBar: false
            });

        }catch(error){
            apiError(error);
        }
    }

    const handleAction = async(action, e, chatId, friendId) => {
        handleMenuClose(e);
        if(action==="delete"){
            await deleteChat(chatId);
            fetchChats(search, limit, page);
        }else if(action==="block"){
            handleReqStatus("block", friendId);
        }
        // Add your action logic here (e.g., API call for report, block, or delete)
    };


    const formatDate = (date) => {
        if (!date) return "N/A"
        const inputDate = new Date(date); // Convert input to a Date object
        const today = new Date(); // Get today's date

        // Helper function to format time in AM/PM
        const formatTime = (date) => {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
            const formattedMinutes = minutes.toString().padStart(2, '0');
            return `${formattedHours}:${formattedMinutes} ${ampm}`;
        };

        // Check if the input date is today
        if (
            inputDate.getFullYear() === today.getFullYear() &&
            inputDate.getMonth() === today.getMonth() &&
            inputDate.getDate() === today.getDate()
        ) {
            return formatTime(inputDate); // Return time in AM/PM format
        }

        // Check if the input date is yesterday
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (
            inputDate.getFullYear() === yesterday.getFullYear() &&
            inputDate.getMonth() === yesterday.getMonth() &&
            inputDate.getDate() === yesterday.getDate()
        ) {
            return 'Yesterday'; // Return "Yesterday"
        }

        // Otherwise, return date in dd/mm/yyyy format
        const day = inputDate.getDate().toString().padStart(2, '0');
        const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
        const year = inputDate.getFullYear();
        return `${day}/${month}/${year}`;
    };


    useEffect(() => {
        fetchChats(search, limit, page)
    }, [search, page, limit]);

    useEffect(()=>{
        console.log("The selectedChat is: ", selectedChat);
    }, [selectedChat])

    return (
        <div className={`${styles.container}`}>
            <div className={styles['chat-list-header']}>
                <div style={{ fontSize: '25px', fontWeight: 'bold', padding: '10px', paddingLeft: '20px' }}>Chats</div>
                <Paper component="form" className={styles.search}>
                    <InputBase
                        className={styles['search-bar']}
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                    <ListItem key={index} className={`${styles['chat-list-item']} ${(chat.id == selectedChat && !chat.gender) ? styles['chat-select'] : ""} ${(chat.gender) ? `${chat.gender}-bg` : ""}`} onClick={() => handleChatSelect(chat.id)}>
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
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end'
                            }}
                        >
                            {/* More Icon Button */}
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={isOpen ? "chat-options-menu" : undefined}
                                aria-haspopup="true"
                                onClick={handleMenuOpen}
                            >
                                <MoreIcon style={{ fontSize: "0.8rem" }} />
                            </IconButton>

                            {/* Small Modal (Menu) */}
                            <Menu
                                id="chat-options-menu"
                                anchorEl={anchorEl}
                                open={isOpen}
                                onClose={handleMenuClose}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                
                            >
                                <MenuItem style={{fontSize: '0.7rem'}} onClick={(e) => handleAction("report", e, chat.id)}>Report</MenuItem>
                                <MenuItem style={{fontSize: '0.7rem'}} onClick={(e) => handleAction("block", e, chat.id, chat.friendId)}>Block</MenuItem>
                                <MenuItem style={{fontSize: '0.7rem'}} onClick={(e) => handleAction("delete", e, chat.id)}>Delete</MenuItem>
                            </Menu>

                            {/* Timestamp */}
                            <Typography
                                style={{ fontSize: "0.6rem", color: "grey" }}
                                className="contactTime"
                            >
                                {formatDate(chat.Last_Message?.createdAt)}
                            </Typography>
                        </Box>
                    </ListItem>
                ))}
            </List>
            {(chats && chats.length == 0) &&
                <NoDataFound heading={"No Chat found"} text={"Please add strangers as friend to see chat list"}>
                    <Button style={{ fontSize: '10px' }} variant="contained" color="primary" onClick={() => {
                        setSelectedChat("");
                        setConnecting(true);
                    }}>Connect Stranger</Button>
                </NoDataFound>
            }
            {(!randomConnect && selectedChat) ?
                <Button style={{ position: "absolute", bottom: '20px', right: '20px', fontSize: '10px' }} variant="contained" color="secondary" onClick={() => {
                    setSelectedChat("");
                    if (dont) setConnecting(true);
                }}>Connect Stranger</Button> : ""
            }
        </div >
    )
}
export default ChatList;