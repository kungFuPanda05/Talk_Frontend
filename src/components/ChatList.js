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
import SideDrawer from "./SideDrawer";
import { formatDate } from "@/utils/functions";
import Dropdown from "react-bootstrap/Dropdown";

const ChatList = ({ chats, handleChatSelect, selectedChat, randomConnect, setConnecting, setSelectedChat, dont, fetchChats, handleReqStatus, isOnlineUsers, setIsOnlineUsers, isOnlineChatUsers, setIsOnlineChatUsers }) => {
    let [limit, setLimit] = useState(10);
    let [page, setPage] = useState(1);
    let [search, setSearch] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElChats, setAnchorElChats] = useState(null);
    const [anchorElUsersStatus, setAnchorElUsersStatus] = useState(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportDescription, setReportDescription] = useState("");
    const [friendId, setFriendId] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [nonChatListStatus, setNonChatListStatus] = useState("");
    const [nonChatList, setNonChatList] = useState([]);
    const [menuAnchor, setMenuAnchor] = useState(null);

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

    const handleUsersStatusMenuOpen = (event, id) => {
        setMenuAnchor(event.currentTarget);
        setAnchorElUsersStatus(id); // Track which menu is open
    };

    const handleUsersStatusMenuClose = () => {
        setMenuAnchor(null);
        setAnchorElUsersStatus(null); // Reset menu state
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

    const handleBlockedUsersDrawer = (e) => {
        setNonChatListStatus("blocked");
        setIsDrawerOpen(true);
        handleChatsMenuClose(e);
    }
    const handleRejectedReqDrawer = (e) => {
        setNonChatListStatus("rejected");
        setIsDrawerOpen(true)
        handleChatsMenuClose(e);
    }
    const fetchNonChatList = async () => {
        try {
            let response = await api.get(`/api/user/${nonChatListStatus}-users`);
            let obj = {};
            response.data.users.map(user => {
                if (user.Online > 0) obj[user.id] = 1;
                else obj[user.id] = 0;
            });
            setIsOnlineUsers(obj);
            setNonChatList(response.data.users);
            toast.success(response.data.message, {
                position: 'top-center',
                hideProgressBar: false
            });
        } catch (error) {
            apiError(error);
        }
    }

    const handleDeleteFriend = async (friendId) => {
        try {
            let response = await api.post(`/api/friend/delete-friend/${friendId}`);
            toast.success(response.data.message, {
                position: 'top-center',
                hideProgressBar: false
            });
            fetchNonChatList();
        } catch (error) {
            apiError(error);
        }
    }

    useEffect(() => {
        if (nonChatListStatus && isDrawerOpen) fetchNonChatList();
    }, [isDrawerOpen])

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
                        open={anchorElChats ? true : false}
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
                            primary={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span>{chat.chatName}</span>
                                    {isOnlineChatUsers[chat.friendId] == true &&
                                        <div
                                            className="online"
                                        ></div>

                                    }
                                </div>
                            }
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
                            {/* <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={isOpen ? "chat-options-menu" : undefined}
                                aria-haspopup="true"
                                onClick={handleMenuOpen}
                            >
                                <MoreIcon style={{ fontSize: "0.8rem" }} />
                            </IconButton> */}


                            <Dropdown>
                                <Dropdown.Toggle
                                    // variant="secondary"
                                    // size="sm"
                                    // id={`dropdown-${chat.id}`}
                                    className="options-toggle"
                                    style={{ border: 'none', background: 'none' }}
                                >
                                    <IconButton
                                        size="large"
                                        aria-label="show more"
                                        aria-controls={isOpen ? "chat-options-menu" : undefined}
                                        aria-haspopup="true"
                                        sx={{
                                            height: '30px',
                                            width: '30px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <MoreIcon style={{ fontSize: "0.8rem" }} />
                                    </IconButton>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={(e) => handleAction("report", e, chat.id, chat.friendId)}>
                                        Report
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={(e) => handleAction("block", e, chat.id, chat.friendId)}>
                                        Block
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={(e) => handleAction("delete", e, chat.id, chat.friendId)}>
                                        Delete
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>


                            {/* Small Modal (Menu)
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
                            </Menu> */}

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

            <SideDrawer heading={nonChatListStatus === "blocked" ? "Blocked Users" : "Rejected Users"} secondaryHeading={nonChatListStatus === "blocked" ? "List of blocked users" : "list of rejected user friend requests"} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen}>
                {nonChatList.length > 0 ? (
                    <List sx={{ marginTop: 1, flexGrow: 1 }}>
                        {nonChatList.map((nonChat) => (
                            <ListItem
                                key={nonChat.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: 1,
                                    borderRadius: 3,
                                    backgroundColor: '#f5f5f5',
                                    marginTop: '10px'
                                }}
                            >
                                {/* Avatar with reduced spacing */}
                                <Avatar src={nonChat?.avatar} alt={nonChat?.name} sx={{ marginRight: 1, width: 40, height: 40 }} />


                                {/* Friend Name */}
                                <Box sx={{ flex: 1 }}>
                                    <ListItemText
                                        primary={nonChat?.name}
                                        primaryTypographyProps={{ sx: { fontWeight: 'bold' } }}

                                    />
                                    <Typography
                                        sx={{
                                            fontSize: '0.6rem', // Smaller font size
                                            color: 'gray', // Greyish color
                                            fontWeight: 250, // Light font weight
                                            marginBottom: 1,
                                        }}
                                    >
                                        <div style={{ width: '6px', height: '6px', backgroundColor: isOnlineUsers[nonChat.id] ? "green" : 'red', borderRadius: '50%', display: 'inline-block', marginRight: '3px', marginBottom: '0.4px' }}></div>{isOnlineUsers[nonChat.id] ? "Online" : "Offline"}
                                    </Typography>
                                </Box>

                                {/* Action Buttons */}
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <IconButton
                                        size="large"
                                        aria-label="show more"
                                        aria-controls={isOpen ? "users-status-options-menu" : undefined}
                                        aria-haspopup="true"
                                        onClick={(e) => handleUsersStatusMenuOpen(e, nonChat.id)}
                                        sx={{
                                            height: '100%',
                                        }}
                                    >
                                        <MoreIcon style={{ fontSize: "1rem" }} />
                                    </IconButton>
                                    <Menu
                                        id="chat-options-menu"
                                        anchorEl={anchorElUsersStatus === nonChat.id ? menuAnchor : null} // Only open for the correct ID
                                        open={(anchorElUsersStatus && anchorElUsersStatus == nonChat.id) ? true : false}
                                        onClose={handleUsersStatusMenuClose}
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                    >
                                        {nonChatListStatus == "blocked" ? (

                                            <MenuItem style={{ fontSize: '0.7rem' }} onClick={handleBlockedUsersDrawer}>Unblock</MenuItem>
                                        ) : (
                                            <MenuItem style={{ fontSize: '0.7rem' }} onClick={handleRejectedReqDrawer}>Recover</MenuItem>
                                        )}
                                        <MenuItem style={{ fontSize: '0.7rem' }} onClick={() => handleDeleteFriend(nonChat.id)}>Delete</MenuItem>
                                    </Menu>
                                </Box>
                            </ListItem>
                        ))}
                    </List>

                ) : (
                    <NoDataFound heading={nonChatListStatus === "blocked" ? "No blocked users" : "No rejected requests"} text={nonChatListStatus === "blocked" ? "Blocked users list will appear here" : "Rejected Users friend request will apear here"} />

                )}
            </SideDrawer>
        </div>
    )
}
export default ChatList;
