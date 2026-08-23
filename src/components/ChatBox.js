import {
    Avatar,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    TextareaAutosize,
} from "@mui/material";
import {
    ArrowBackRounded,
    AttachFileRounded,
    CheckCircleRounded,
    CloseRounded,
    FavoriteRounded,
    MoodRounded,
    OpenInNewRounded,
    PersonAddAltRounded,
    RefreshRounded,
    SendRounded,
    ZoomInRounded,
} from "@mui/icons-material";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from '../styles/chatbox.module.scss'
import { toast } from "react-toastify";
import apiError from "@/utils/apiError";
import api from "@/utils/api";
import Image from "next/image";
import { debounce, formatDate } from "@/utils/functions";
import Typing from "./Typing";
import { getSocketInstance } from "@/utils/socket";
import { useMediaQuery } from "react-responsive";
import EmojiPickerDemo from "./EmojiPicker";
import imageUploadApi from "@/utils/imagUploadApi";
import { v4 as uuidv4 } from 'uuid';
import { apiAssetUrl } from '@/utils/config';


const ChatBox = ({
    selfId,
    messages,
    setMessageContent,
    messageContent,
    sendMessage,
    selectedChat,
    setRandomConnect,
    setConnecting,
    isStrangerLeftChat,
    handleConnectAgain,
    strangerId,
    isReqSent,
    isReqRecieved,
    isAccept,
    isReject,
    isFriend,
    sendFriendRequest,
    handleReqStatus,
    setNormalMessageList,
    isStrangerTyping,
    strangerTypingChatId,
    isTyping,
    setIsTyping,
    profile,
    activeChat,
    onBack,
}) => {
    let [limit, setLimit] = useState(100);
    let [page, setPage] = useState(1);
    let [search, setSearch] = useState("");

    const [hasMore, setHasMore] = useState(true);
    const [isRandomChatDisconnected, setRandomChatDisconnected] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [lightboxImage, setLightboxImage] = useState(null);

    const sendMessageInputRef = useRef();
    const messageEndRef = useRef();
    const fileInputRef = useRef(null);

    const socket = useMemo(() => getSocketInstance(), []);

    const isMobile = useMediaQuery({ maxWidth: 500 });
    const isRandomChat = selectedChat === 0 || selectedChat === "";
    const conversationName = isRandomChat ? "New connection" : (activeChat?.chatName || "Conversation");
    const conversationStatus = isStrangerTyping && (strangerTypingChatId == selectedChat || isRandomChat)
        ? "Typing now…"
        : isRandomChat
            ? "Private live chat"
            : (activeChat?.friendOnlineStatus ? "Online now" : "Messages are private");

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
    const debouncedSetIsTypingFalse = useCallback(
        debounce(() => {
            setIsTyping(false);
        }, 500),
        [] // Ensure debounce function is created only once
    );

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const previewUrl = URL.createObjectURL(selectedFile);
            setFilePreview(previewUrl);
        }
    };
    const sendImage = async () => {
        try {
            if (!file) {
                toast.error("Please select an image to send");
                return;
            }
            if (selectedChat == 0) {
                const reader = new FileReader();
                reader.readAsArrayBuffer(file); // Read image as ArrayBuffer
                reader.onload = () => {
                    sendMessage({ buffer: reader.result, type: file.type }, "image");
                    // socket.emit("message", { messageContent: { buffer: reader.result, type: file.type }, chatId: selectedChat, identityKey, type: "image" });
                };
            } else {
                const formData = new FormData();
                formData.append("sendImage", file);
                const identityKey = uuidv4();
                setNormalMessageList((prevState) => [{ identityKey, userId: selfId, createdAt: null, content: "Photo", chatId: selectedChat, type: "image" }, ...prevState]);
                const response = await imageUploadApi.post(`/api/message/send-image/${selectedChat}`, formData, {
                    params: { identityKey }
                });
            }
            setFile(null);
            setFilePreview(null);
            // toast.success(response.data.message);
        } catch (error) {
            apiError(error);
        }
    }

    useEffect(() => {
        sendMessageInputRef.current?.focus();
        setPage(1);
        setLimit(10);
        setSearch("");
        if (selectedChat >= 1) {
            setNormalMessageList([]);
            fetchMessages(selectedChat, "", 100, 1);
        }
        setIsEmojiPickerOpen(false);
        setLightboxImage(null);
    }, [selectedChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    useEffect(() => {
        if (messageContent && !isTyping) {
            setIsTyping(true);
        }
        debouncedSetIsTypingFalse();
    }, [messageContent]);

    useEffect(() => {
        socket.emit('typing', { chatId: (selectedChat || 0), isTyping: isTyping });
    }, [isTyping]);

    useEffect(() => {
        console.log("the strangertyping: ", isStrangerTyping, strangerTypingChatId, selectedChat);
        if (isStrangerTyping && (strangerTypingChatId == selectedChat || !selectedChat)) scrollToBottom();
    }, [isStrangerTyping, strangerTypingChatId, selectedChat])

    return (
        <section className={styles.container}>
            <header className={styles['conversation-header']}>
                <IconButton className={styles['back-button']} aria-label="Back to chats" onClick={onBack}>
                    <ArrowBackRounded />
                </IconButton>

                <div className={styles['header-avatar-wrap']}>
                    <Avatar
                        className={styles['header-avatar']}
                        alt={conversationName}
                        src={activeChat?.avatar}
                    >
                        {conversationName?.[0] || 'C'}
                    </Avatar>
                    <span className={styles['status-dot']} aria-hidden="true" />
                </div>

                <div className={styles['conversation-copy']}>
                    <strong>{conversationName}</strong>
                    <span><i aria-hidden="true" />{conversationStatus}</span>
                </div>

                {isRandomChat && (
                    <IconButton
                        className={styles['leave-button']}
                        aria-label="Leave random chat"
                        title="Leave this chat"
                        onClick={handleRandomChatDisconnect}
                    >
                        <CloseRounded />
                    </IconButton>
                )}
            </header>

            {isRandomChat && (
                <div className={styles['friendship-area']}>
                    {!isReqSent && !isReqRecieved && !isAccept && !isFriend && (
                        <Button startIcon={<PersonAddAltRounded />} onClick={sendFriendRequest}>
                            Add as friend
                        </Button>
                    )}

                    {isReqRecieved && !isReject && !isAccept && (
                        <div className={styles['request-actions']}>
                            <span>Friend request received</span>
                            <Button className={styles.reject} onClick={() => handleReqStatus('reject')}>Decline</Button>
                            <Button variant="contained" color="primary" onClick={() => handleReqStatus('accept')}>Accept</Button>
                        </div>
                    )}

                    {isReqSent && !isAccept && !isFriend && (
                        <span className={styles['status-pill']}><CheckCircleRounded /> Friend request sent</span>
                    )}

                    {(isAccept || isFriend) && (
                        <span className={`${styles['status-pill']} ${styles.friends}`}><FavoriteRounded /> You’re connected as friends</span>
                    )}
                </div>
            )}

            <div id="scrollableChatBox" className={styles['scroll-container']}>
                <InfiniteScroll
                    dataLength={messages.length}
                    next={() => fetchMessages(selectedChat, search, limit, page, true)}
                    hasMore={hasMore}
                    inverse
                    scrollableTarget="scrollableChatBox"
                    loader={<span className={styles['message-loader']}>Loading earlier messages…</span>}
                    style={{
                        display: 'flex',
                        flexDirection: 'column-reverse',
                        justifyContent: 'flex-start',
                    }}
                >
                    <div ref={messageEndRef} />
                    {isStrangerTyping && (strangerTypingChatId == selectedChat || isRandomChat) && <Typing />}

                    {messages.map((message, index) => {
                        const isOwnMessage = String(selfId) === String(message.userId);
                        const messageKey = message.identityKey || message.id || `${message.createdAt || 'pending'}-${index}`;
                        const imageSource = selectedChat == 0
                            ? message.content
                            : apiAssetUrl(message.content);
                        const imageAlt = isOwnMessage ? "Photo you sent" : "Photo shared with you";

                        return (
                            <div
                                key={messageKey}
                                className={`${styles['message-group']} ${isOwnMessage ? styles.own : styles.received}`}
                            >
                                {message.type === "image" ? (
                                    message.createdAt ? (
                                        <button
                                            type="button"
                                            className={`${styles['chat-image']} ${isOwnMessage ? styles['image-sent'] : ''}`}
                                            aria-label={`Open ${imageAlt.toLowerCase()} in full screen`}
                                            onClick={() => setLightboxImage({ src: imageSource, alt: imageAlt })}
                                        >
                                            <Image
                                                src={imageSource}
                                                alt={imageAlt}
                                                width={250}
                                                height={250}
                                            />
                                            <span className={styles['zoom-hint']} aria-hidden="true">
                                                <ZoomInRounded />
                                                View photo
                                            </span>
                                        </button>
                                    ) : (
                                        <div className={`${styles['message-bar']} ${isOwnMessage ? styles['message-sent'] : ''}`}>
                                            Preparing image…
                                        </div>
                                    )
                                ) : (
                                    <div className={`${styles['message-bar']} ${isOwnMessage ? styles['message-sent'] : ''}`}>
                                        {message.content}
                                    </div>
                                )}

                                <span className={styles['message-meta']}>
                                    {message.createdAt ? formatDate(message.createdAt) : (
                                        <><Image src="/images/pending.png" alt="Sending" width={13} height={14} /> Sending</>
                                    )}
                                </span>
                            </div>
                        );
                    })}
                </InfiniteScroll>
            </div>

            {(isRandomChatDisconnected || isStrangerLeftChat) && isRandomChat ? (
                <div className={styles['reconnect-card']}>
                    <span className={styles['reconnect-icon']}><RefreshRounded /></span>
                    <div>
                        <strong>{isRandomChatDisconnected ? "Chat ended" : "Your stranger left"}</strong>
                        <p>Ready for another conversation?</p>
                    </div>
                    <Button variant="contained" color="secondary" onClick={handleConnectAgain}>Find someone new</Button>
                </div>
            ) : (
                <>
                    {file && (
                        <div className={styles['file-preview']}>
                            <img src={filePreview} alt={`Selected file ${file.name}`} />
                            <span><strong>{file.name}</strong><small>Ready to send</small></span>
                            <IconButton aria-label="Remove selected image" onClick={() => { setFile(null); setFilePreview(null); }}>
                                <CloseRounded fontSize="small" />
                            </IconButton>
                        </div>
                    )}

                    <footer className={styles['send-message']}>
                        <div className={styles['composer-field']}>
                            <TextareaAutosize
                                minRows={1}
                                maxRows={4}
                                className={styles['message-input']}
                                aria-label="Message"
                                placeholder={`Message ${conversationName}`}
                                value={messageContent}
                                onChange={(event) => setMessageContent(event.target.value)}
                                ref={sendMessageInputRef}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' && !event.shiftKey) {
                                        event.preventDefault();
                                        setIsEmojiPickerOpen(false);
                                        if (file) sendImage();
                                        sendMessage().then(() => {
                                            setTimeout(() => sendMessageInputRef.current?.focus(), 250);
                                        });
                                    }
                                }}
                            />
                        </div>

                        <IconButton
                            className={styles['composer-action']}
                            aria-label="Attach an image"
                            title="Attach image"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <AttachFileRounded />
                        </IconButton>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg, image/png"
                            onChange={handleFileChange}
                            hidden
                        />

                        {!isMobile && (
                            <IconButton
                                className={styles['composer-action']}
                                aria-label="Choose an emoji"
                                title="Emoji"
                                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                            >
                                <MoodRounded />
                            </IconButton>
                        )}

                        <IconButton
                            className={styles['send-button']}
                            aria-label="Send message"
                            disabled={!file && !messageContent.trim()}
                            onClick={() => {
                                setIsEmojiPickerOpen(false);
                                if (file) sendImage();
                                sendMessage();
                            }}
                        >
                            <SendRounded />
                        </IconButton>

                        <EmojiPickerDemo
                            message={messageContent}
                            setMessage={setMessageContent}
                            isModalOpen={isEmojiPickerOpen}
                            setIsModalOpen={setIsEmojiPickerOpen}
                        />
                    </footer>
                </>
            )}

            <Dialog
                open={Boolean(lightboxImage)}
                onClose={() => setLightboxImage(null)}
                maxWidth={false}
                aria-labelledby="chat-photo-viewer-title"
                aria-describedby="chat-photo-viewer-description"
                PaperProps={{ className: styles['lightbox-paper'], elevation: 0 }}
                BackdropProps={{ className: styles['lightbox-backdrop'] }}
            >
                <header className={styles['lightbox-header']}>
                    <span className={styles['lightbox-icon']} aria-hidden="true">
                        <ZoomInRounded />
                    </span>
                    <div>
                        <strong id="chat-photo-viewer-title">Photo preview</strong>
                        <small id="chat-photo-viewer-description">{lightboxImage?.alt} · press Escape or tap outside to close</small>
                    </div>
                    <IconButton
                        className={styles['lightbox-original']}
                        component="a"
                        href={lightboxImage?.src || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open original photo in a new tab"
                        title="Open original"
                    >
                        <OpenInNewRounded />
                    </IconButton>
                    <IconButton
                        className={styles['lightbox-close']}
                        aria-label="Close photo preview"
                        title="Close photo preview"
                        onClick={() => setLightboxImage(null)}
                        autoFocus
                    >
                        <CloseRounded />
                    </IconButton>
                </header>

                <DialogContent className={styles['lightbox-content']}>
                    {lightboxImage && (
                        <div className={styles['lightbox-stage']}>
                            <Image
                                src={lightboxImage.src}
                                alt={lightboxImage.alt}
                                fill
                                sizes="(max-width: 600px) 94vw, 88vw"
                                className={styles['lightbox-image']}
                                draggable={false}
                                priority
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    );
}
export default ChatBox;
