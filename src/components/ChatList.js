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
    MenuItem,
    Modal,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
    const [anchorElChats, setAnchorElChats] = useState(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportDescription, setReportDescription] = useState("");
    const [friendId, setFriendId] = useState("");

    const isOpen = Boolean(anchorEl);


    const handleMenuOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const handleChatsMenuOpen = (event) => {
        event.stopPropagation();
        setAnchorElChats(event.currentTarget);
    };

    const handleChatsMenuClose = (event) => {
        event.stopPropagation();
        setAnchorElChats(null);
    };

    const deleteChat = async (chatId) => {
        console.log("reaching to delete chat: ", chatId);
        try {
            let response = await api.post(`/api/chat/delete-chat/${chatId}`);
            console.log("The response is : ", response)
            toast.success(response.data.message, {
                position: 'top-center',
                hideProgressBar: false
            });
        } catch (error) {
            apiError(error);
        }
    };

    const handleReport = async () => {
        try {
            let response = await api.post(`/api/report/report-user`, { to: friendId, description: reportDescription });
            toast.success(response.data.message, {
                position: 'top-center',
                hideProgressBar: false
            });
            setReportDescription(""); // Clear the description
            setIsReportModalOpen(false); // Close the modal
        } catch (error) {
            apiError(error);
        }
    };

    const handleAction = async (action, e, chatId, friendId) => {
        handleMenuClose(e);
        console.log("Receving the friend id in fhandleaction: ", friendId);
        setFriendId(friendId);
        if (action === "delete") {
            await deleteChat(chatId);
            fetchChats(search, limit, page);
        } else if (action === "block") {
            handleReqStatus("block", friendId);
        } else if (action === "report") {
            setIsReportModalOpen(true); // Open the report modal
        }
    };

    const formatDate = (date) => {
        if (!date) return "N/A"
        const inputDate = new Date(date); // Convert input to a Date object
        const today = new Date(); // Get today's date

        const formatTime = (date) => {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
            const formattedMinutes = minutes.toString().padStart(2, '0');
            return `${formattedHours}:${formattedMinutes} ${ampm}`;
        };

        if (
            inputDate.getFullYear() === today.getFullYear() &&
            inputDate.getMonth() === today.getMonth() &&
            inputDate.getDate() === today.getDate()
        ) {
            return formatTime(inputDate); // Return time in AM/PM format
        }

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (
            inputDate.getFullYear() === yesterday.getFullYear() &&
            inputDate.getMonth() === yesterday.getMonth() &&
            inputDate.getDate() === yesterday.getDate()
        ) {
            return 'Yesterday';
        }

        const day = inputDate.getDate().toString().padStart(2, '0');
        const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
        const year = inputDate.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleBlockedUsersDrawer = (e) => {
        handleChatsMenuClose(e);
    }
    const handleRejectedReqDrawer = (e) => {
        handleChatsMenuClose(e);
    }

    useEffect(() => {
        fetchChats(search, limit, page)
    }, [search, page, limit]);


    return (
        <div className={`${styles.container}`}>
            <div className={styles['chat-list-header']}>
                <div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '25px', fontWeight: 'bold', padding: '10px', paddingLeft: '20px' }}>Chats</div>
                    <IconButton
                        size="large"
                        aria-label="show more"
                        aria-controls={isOpen ? "chat-options-menu" : undefined}
                        aria-haspopup="true"
                        onClick={handleChatsMenuOpen}
                        sx={{
                            height: '100%',
                        }}
                    >
                        <MoreIcon style={{ fontSize: "1rem" }} />
                    </IconButton>
                    <Menu
                        id="chat-options-menu"
                        anchorEl={anchorElChats}
                        open={anchorElChats?true:false}
                        onClose={handleChatsMenuClose}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                    >
                        <MenuItem style={{ fontSize: '0.7rem' }} onClick={handleBlockedUsersDrawer}>Blocked Users</MenuItem>
                        <MenuItem style={{ fontSize: '0.7rem' }} onClick={handleRejectedReqDrawer}>Rejected Requests</MenuItem>
                    </Menu>
                </div>
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
                                        border: '0.1px solid white',
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
                                <MenuItem style={{ fontSize: '0.7rem' }} onClick={(e) => handleAction("report", e, chat.id, chat.friendId)}>Report</MenuItem>
                                <MenuItem style={{ fontSize: '0.7rem' }} onClick={(e) => handleAction("block", e, chat.id, chat.friendId)}>Block</MenuItem>
                                <MenuItem style={{ fontSize: '0.7rem' }} onClick={(e) => handleAction("delete", e, chat.id, chat.friendId)}>Delete</MenuItem>
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

            {/* Report Modal */}
            <Dialog open={isReportModalOpen} onClose={() => setIsReportModalOpen(false)}>
                <DialogTitle>Report</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 100 }}
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        helperText={`${reportDescription.length}/100`}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsReportModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleReport} color="primary" variant="contained">Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
export default ChatList;
