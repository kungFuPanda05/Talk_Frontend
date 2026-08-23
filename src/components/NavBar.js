'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AccountCircleRounded,
  ChatBubbleRounded,
  CheckRounded,
  CloseRounded,
  LogoutRounded,
  MenuRounded,
  MoreVertRounded,
  NotificationsRounded,
} from '@mui/icons-material';
import api from '@/utils/api';
import apiError from '@/utils/apiError';
import { eraseCookie } from '@/utils/cookieFunctions';
import NoDataFound from './NoDataFound';
import ProfileModal from './ProfileModal';
import SideDrawer from './SideDrawer';
import styles from '../styles/navbar.module.scss';
import { apiAssetUrl } from '@/utils/config';

const NavBar = ({
  profile,
  isReqRecieved,
  isAccept,
  isReject,
  setIsOnlineUsers,
  isOnlineUsers,
  handleLaterReqStatus,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [friendReq, setFriendReq] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [friendReqCount, setFriendReqCount] = useState(0);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(null);

  const mobileMenuOpen = Boolean(mobileMenuAnchor);
  const profileImage = profile?.pic
    ? apiAssetUrl(profile.pic)
    : undefined;

  const fetchFriendReq = useCallback(async () => {
    try {
      const response = await api.get('/api/friend/get-friend-requests');
      const requests = Array.isArray(response.data.response) ? response.data.response : [];
      const onlineUsers = {};

      requests.forEach((request) => {
        const user = request.SentRequests;
        if (user?.id) onlineUsers[user.id] = user.Online > 0 ? 1 : 0;
      });

      setFriendReq(requests);
      if (typeof setIsOnlineUsers === 'function') setIsOnlineUsers(onlineUsers);
    } catch (error) {
      apiError(error);
    }
  }, [setIsOnlineUsers]);

  const fetchFriendReqCount = useCallback(async () => {
    try {
      const response = await api.get('/api/friend/get-friend-requests-count');
      setFriendReqCount(Number(response.data.count) || 0);
    } catch (error) {
      apiError(error);
    }
  }, []);

  useEffect(() => {
    fetchFriendReqCount();
  }, [fetchFriendReqCount, isReqRecieved, isAccept, isReject]);

  useEffect(() => {
    if (isDrawerOpen) fetchFriendReq();
  }, [fetchFriendReq, isDrawerOpen]);

  const openRequests = () => {
    setMobileMenuAnchor(null);
    setIsDrawerOpen(true);
  };

  const openProfile = () => {
    setMobileMenuAnchor(null);
    setProfileOpen(true);
  };

  const logout = () => {
    eraseCookie('token');
    window.location.href = '/login';
  };

  const handleRequestAction = async (status, userId) => {
    if (typeof handleLaterReqStatus !== 'function') return;

    const requestKey = `${status}-${userId}`;
    setPendingRequest(requestKey);
    try {
      await handleLaterReqStatus(status, userId);
      await Promise.all([fetchFriendReq(), fetchFriendReqCount()]);
    } finally {
      setPendingRequest(null);
    }
  };

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.navGlow} aria-hidden="true" />
        <div className={styles.innernavbar}>
          <div className={styles.left}>
            <Tooltip title="Friend requests" arrow>
              <IconButton
                className={styles.navIconButton}
                onClick={openRequests}
                aria-label={`Open friend requests${friendReqCount ? `, ${friendReqCount} new` : ''}`}
                aria-controls={isDrawerOpen ? 'friend-requests-drawer' : undefined}
                aria-expanded={isDrawerOpen}
              >
                <Badge
                  badgeContent={friendReqCount || null}
                  max={9}
                  classes={{ badge: styles.mobileBadge }}
                >
                  <MenuRounded />
                </Badge>
              </IconButton>
            </Tooltip>
          </div>

          <div className={styles.brand} aria-label="ChitTalk home">
            <span className={styles.brandIcon} aria-hidden="true">
              <ChatBubbleRounded />
            </span>
            <span className={styles.brandCopy}>
              <span className={styles.brandName}>ChitTalk</span>
              <span className={styles.brandTagline}>Connect · Chat · Belong</span>
            </span>
          </div>

          <div className={styles.right}>
            <Box className={styles.desktopActions}>
              <Tooltip title="Friend requests" arrow>
                <IconButton
                  className={styles.navIconButton}
                  onClick={openRequests}
                  aria-label={`Friend requests${friendReqCount ? `, ${friendReqCount} new` : ''}`}
                  aria-controls={isDrawerOpen ? 'friend-requests-drawer' : undefined}
                  aria-expanded={isDrawerOpen}
                >
                  <Badge
                    badgeContent={friendReqCount || null}
                    max={99}
                    classes={{ badge: styles.notificationBadge }}
                  >
                    <NotificationsRounded />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Your profile" arrow>
                <IconButton
                  className={styles.profileButton}
                  onClick={openProfile}
                  aria-label="Open your profile"
                  aria-controls={profileOpen ? 'profile-modal' : undefined}
                  aria-expanded={profileOpen}
                >
                  <Avatar className={styles.navAvatar} src={profileImage} alt="">
                    {profile?.name?.[0]?.toUpperCase() || <AccountCircleRounded />}
                  </Avatar>
                  <span className={styles.profileCopy}>
                    <span className={styles.profileGreeting}>Welcome back</span>
                    <span className={styles.profileName}>{profile?.name || 'Your profile'}</span>
                  </span>
                </IconButton>
              </Tooltip>

              <Tooltip title="Log out" arrow>
                <IconButton className={styles.navIconButton} onClick={logout} aria-label="Log out">
                  <LogoutRounded />
                </IconButton>
              </Tooltip>
            </Box>

            <Box className={styles.mobileActions}>
              <IconButton
                className={styles.navIconButton}
                onClick={(event) => setMobileMenuAnchor(event.currentTarget)}
                aria-label="Open account menu"
                aria-controls={mobileMenuOpen ? 'mobile-account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={mobileMenuOpen}
              >
                <MoreVertRounded />
              </IconButton>
            </Box>
          </div>
        </div>
      </header>

      <Menu
        id="mobile-account-menu"
        anchorEl={mobileMenuAnchor}
        open={mobileMenuOpen}
        onClose={() => setMobileMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ className: styles.mobileMenuPaper }}
        MenuListProps={{ 'aria-label': 'Account actions' }}
      >
        <MenuItem className={styles.mobileMenuItem} onClick={openRequests}>
          <NotificationsRounded fontSize="small" />
          <span>Friend requests</span>
          {friendReqCount > 0 && <span className={styles.menuCount}>{friendReqCount}</span>}
        </MenuItem>
        <MenuItem className={styles.mobileMenuItem} onClick={openProfile}>
          <AccountCircleRounded fontSize="small" />
          <span>Your profile</span>
        </MenuItem>
        <MenuItem className={`${styles.mobileMenuItem} ${styles.logoutMenuItem}`} onClick={logout}>
          <LogoutRounded fontSize="small" />
          <span>Log out</span>
        </MenuItem>
      </Menu>

      <SideDrawer
        id="friend-requests-drawer"
        heading="Friend requests"
        secondaryHeading="People who would love to connect with you"
        alignment="right"
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      >
        {friendReq.length > 0 ? (
          <List className={styles.requestList} disablePadding aria-label="Friend requests">
            {friendReq.map((request) => {
              const user = request?.SentRequests;
              const isOnline = Boolean(isOnlineUsers[user?.id]);
              const acceptKey = `accept-${user?.id}`;
              const rejectKey = `reject-${user?.id}`;
              const isPending = pendingRequest === acceptKey || pendingRequest === rejectKey;

              return (
                <ListItem className={styles.requestCard} key={request.id || user?.id}>
                  <div className={styles.avatarShell}>
                    <Avatar src={request?.avatar || user?.avatar} alt={user?.name || 'User'}>
                      {user?.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <span
                      className={`${styles.presenceDot} ${isOnline ? styles.online : styles.offline}`}
                      aria-hidden="true"
                    />
                  </div>

                  <Box className={styles.requestInfo}>
                    <ListItemText
                      className={styles.requestName}
                      primary={user?.name || 'ChitTalk user'}
                    />
                    <Typography className={styles.presenceLabel} component="span">
                      {isOnline ? 'Online now' : 'Currently offline'}
                    </Typography>
                  </Box>

                  <Box className={styles.requestActions}>
                    <Tooltip title={`Accept ${user?.name || 'request'}`} arrow>
                      <span>
                        <Button
                          className={`${styles.requestAction} ${styles.acceptAction}`}
                          onClick={() => handleRequestAction('accept', user.id)}
                          disabled={isPending || !user?.id || typeof handleLaterReqStatus !== 'function'}
                          aria-label={`Accept friend request from ${user?.name || 'user'}`}
                        >
                          <CheckRounded fontSize="small" />
                          <span>Accept</span>
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title={`Decline ${user?.name || 'request'}`} arrow>
                      <span>
                        <Button
                          className={`${styles.requestAction} ${styles.rejectAction}`}
                          onClick={() => handleRequestAction('reject', user.id)}
                          disabled={isPending || !user?.id || typeof handleLaterReqStatus !== 'function'}
                          aria-label={`Decline friend request from ${user?.name || 'user'}`}
                        >
                          <CloseRounded fontSize="small" />
                          <span>Decline</span>
                        </Button>
                      </span>
                    </Tooltip>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <NoDataFound
            heading="You’re all caught up"
            text="New friend requests will appear here. Keep chatting and meeting new people."
          />
        )}
      </SideDrawer>

      <ProfileModal
        profile={profile}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
      />
    </>
  );
};

export default NavBar;
