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
import { AutoAwesomeRounded, ChatBubbleRounded, SearchRounded } from "@mui/icons-material";
import styles from '../styles/chatlist.module.scss'
import NoDataFound from "./NoDataFound";
import MoreIcon from '@mui/icons-material/MoreVert';
import { toast } from "react-toastify";
import apiError from "@/utils/apiError";
import api from "@/utils/api";
import SideDrawer from "./SideDrawer";
import { formatDate } from "@/utils/functions";

const getStrangerGenderTone = (gender) => {
    const normalizedGender = String(gender ?? "").trim().toUpperCase();

    if (["M", "MALE", "MAN"].includes(normalizedGender)) {
        return {
            rowClass: "gender-male",
            pillClass: "gender-pill-male",
            label: "Male match",
        };
    }

    if (["F", "FEMALE", "WOMAN"].includes(normalizedGender)) {
        return {
            rowClass: "gender-female",
            pillClass: "gender-pill-female",
            label: "Female match",
        };
    }

    return {
        rowClass: "gender-neutral",
        pillClass: "gender-pill-neutral",
        label: "Surprise match",
    };
};

const ChatList = ({ chats, handleChatSelect, selectedChat, randomConnect, setConnecting, setSelectedChat, dont, fetchChats, handleReqStatus, isOnlineUsers, setIsOnlineUsers, isOnlineChatUsers, setIsOnlineChatUsers }) => {
    let [limit, setLimit] = useState(10);
    let [page, setPage] = useState(1);
    let [search, setSearch] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorChatId, setAnchorChatId] = useState(null);
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


    const handleMenuOpen = (event, chatId) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setAnchorChatId(chatId);
    };

    const handleMenuClose = (event) => {
        event?.stopPropagation?.();
        setAnchorEl(null);
        setAnchorChatId(null);
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
                <div className={styles['header-row']}>
                    <div className={styles['header-title']}>
                        <span className={styles['header-icon']} aria-hidden="true"><ChatBubbleRounded /></span>
                        <span>
                            <strong>Conversations</strong>
                            <small>{chats?.length || 0} {chats?.length === 1 ? 'chat' : 'chats'} in your circle</small>
                        </span>
                    </div>
                    <IconButton
                        className={styles['header-menu']}
                        aria-label="Conversation list options"
                        aria-controls={isOpen ? "chat-options-menu" : undefined}
                        aria-haspopup="true"
                        onClick={handleChatsMenuOpen}
                    >
                        <MoreIcon />
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
                        <MenuItem onClick={handleBlockedUsersDrawer}>Blocked users</MenuItem>
                        <MenuItem onClick={handleRejectedReqDrawer}>Rejected requests</MenuItem>
                    </Menu>
                </div>
                <Paper component="form" className={styles.search}>
                    <SearchRounded className={styles['search-leading-icon']} aria-hidden="true" />
                    <InputBase
                        className={styles['search-bar']}
                        placeholder="Search conversations"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        inputProps={{ "aria-label": "Search conversations" }}
                    />
                </Paper>
            </div>

            {/* Chat List */}
            <List className={styles['chat-items']}>
                {chats?.map((chat, index) => {
                    const isSelected = chat.id == selectedChat;
                    const isStrangerChat = chat.id == 0 || (
                        String(chat.chatName ?? "").trim().toLowerCase() === "stranger" && Boolean(chat.gender)
                    );
                    const genderTone = isStrangerChat ? getStrangerGenderTone(chat.gender) : null;

                    return (
                    <div key={chat.id ?? index} className={styles['chat-row-wrap']}>
                        <ListItem
                            className={`${styles['chat-list-item']} ${isSelected ? styles['chat-select'] : ""} ${genderTone ? styles[genderTone.rowClass] : ""}`}
                            onClick={() => handleChatSelect(chat.id)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    handleChatSelect(chat.id);
                                }
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`Open conversation with ${chat.chatName || 'stranger'}${genderTone ? `, ${genderTone.label}` : ''}`}
                            aria-pressed={isSelected}
                        >
                            <ListItemAvatar className={styles['avatar-slot']}>
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
                                    <Avatar
                                        className={styles.avatar}
                                        alt={chat.chatName}
                                        src={chat.avatar}
                                        style={{
                                            backgroundColor: chat.chatName ? `hsl(${chat.chatName.charCodeAt(0) * 10 % 360}, 70%, 60%)` : '#ccc',
                                            color: '#fff'
                                        }}
                                    >
                                        {!chat.avatar && chat.chatName ? chat.chatName[0] : null}
                                    </Avatar>


                                </Badge>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <div className={styles['chat-identity']}>
                                        <span>{chat.chatName}</span>
                                        {genderTone && (
                                            <span
                                                className={`${styles['gender-pill']} ${styles[genderTone.pillClass]}`}
                                                title={`${genderTone.label} — gender preference for this connection`}
                                            >
                                                {genderTone.label}
                                            </span>
                                        )}
                                        {isOnlineChatUsers[chat.friendId] == true &&
                                            <span className={styles['online-indicator']} title="Online" aria-label="Online"></span>

                                        }
                                    </div>
                                }
                                secondary={chat.Last_Message?.content ?? "No messages yet..."}
                                primaryTypographyProps={{ className: styles['chat-name'] }}
                                secondaryTypographyProps={{ className: styles['chat-message'] }}
                            />

                            <Box
                                className={styles['chat-trailing']}
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


                                <IconButton
                                    className={styles['row-menu']}
                                    aria-label={`More options for ${chat.chatName || 'conversation'}`}
                                    aria-controls={anchorChatId === chat.id ? `chat-options-${chat.id}` : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={anchorChatId === chat.id && Boolean(anchorEl)}
                                    onClick={(event) => handleMenuOpen(event, chat.id)}
                                >
                                    <MoreIcon />
                                </IconButton>
                                <Menu
                                    id={`chat-options-${chat.id}`}
                                    anchorEl={anchorChatId === chat.id ? anchorEl : null}
                                    open={anchorChatId === chat.id && Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    onClick={(event) => event.stopPropagation()}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                >
                                    <MenuItem onClick={(event) => handleAction("report", event, chat.id, chat.friendId)}>Report</MenuItem>
                                    <MenuItem onClick={(event) => handleAction("block", event, chat.id, chat.friendId)}>Block</MenuItem>
                                    <MenuItem onClick={(event) => handleAction("delete", event, chat.id, chat.friendId)}>Delete</MenuItem>
                                </Menu>


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
                                    className={styles['contact-time']}
                                >
                                    {formatDate(chat.Last_Message?.createdAt)}
                                </Typography>
                            </Box>
                        </ListItem>
                    </div>
                    );
                })}
            </List>
            {(chats && chats.length == 0) &&
                <NoDataFound heading={"Your chat circle is quiet"} text={"Meet someone new and their conversation will appear here."}>
                    <Button className={styles['empty-action']} startIcon={<AutoAwesomeRounded />} variant="contained" color="primary" onClick={() => {
                        setSelectedChat("");
                        setConnecting(true);
                    }}>Meet someone new</Button>
                </NoDataFound>
            }
            {(!randomConnect && selectedChat) &&
                <div className={styles['connect-footer']}>
                    <Button
                        type="button"
                        className={styles['connect-action']}
                        startIcon={<AutoAwesomeRounded />}
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            setSelectedChat("");
                            if (dont) setConnecting(true);
                        }}
                    >
                        New connection
                    </Button>
                </div>
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
                                className={styles['drawer-user']}
                            >
                                {/* Avatar with reduced spacing */}
                                <Avatar
                                    alt={nonChat?.name}
                                    src={nonChat?.avatar}
                                    style={{
                                        backgroundColor: nonChat?.name ? `hsl(${nonChat?.name.charCodeAt(0) * 10 % 360}, 70%, 60%)` : '#ccc',
                                        color: '#fff'
                                    }}
                                >
                                    {!nonChat?.avatar && nonChat?.name ? nonChat?.name[0] : null}
                                </Avatar>
                                {/* <Avatar src={nonChat?.avatar} alt={nonChat?.name} sx={{ marginRight: 1, width: 40, height: 40 }} /> */}


                                {/* Friend Name */}
                                <Box className={styles['drawer-user-copy']}>
                                    <ListItemText
                                        primary={nonChat?.name}
                                        primaryTypographyProps={{ className: styles['drawer-user-name'] }}

                                    />
                                    <Typography className={styles['drawer-status']}>
                                        <span className={isOnlineUsers[nonChat.id] ? styles['status-online'] : styles['status-offline']} aria-hidden="true"></span>{isOnlineUsers[nonChat.id] ? "Online" : "Offline"}
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
