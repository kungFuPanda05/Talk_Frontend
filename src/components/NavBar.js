'use client';
import React, { useEffect, useState } from 'react';
import styles from '../styles/navbar.module.scss';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Avatar } from '@mui/material';
import api from '@/utils/api';
import apiError from '@/utils/apiError';
import { toast } from 'react-toastify';
import NoDataFound from './NoDataFound';
import SideDrawer from './SideDrawer';
import ProfileModal from './ProfileModal';

const NavBar = ({ profile, isReqRecieved, isAccept, isReject, setIsOnlineUsers, isOnlineUsers, handleLaterReqStatus }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [friendReq, setFriendReq] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [friendReqCount, setFriendReqCount] = useState(0);


  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const fetchFriendReq = async () => {
    try {
      let response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/friend/get-friend-requests`);
      setFriendReq(response.data.response);
      let obj = {};
      response.data.response.map(user => {
        user = user.SentRequests;
        if (user.Online > 0) obj[user.id] = 1;
        else obj[user.id] = 0;
      });
      setIsOnlineUsers(obj);
    } catch (error) {
      apiError(error);
    }
  }
  // const handleLaterReqStatus = async (status, strangerId) => {
  //   try {
  //     let response = await api.post('/api/friend/set-status', { status, strangerId });
  //     toast.success(response.data.messages);
  //     fetchFriendReq();
  //   } catch (error) {
  //     apiError(error);
  //   }

  // }
  const fetchFriendReqCount = async () => {
    try {
      let response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/friend/get-friend-requests-count`);
      setFriendReqCount(response.data.count);
    } catch (error) {
      apiError(error);
    }
  }

  useEffect(() => {
    fetchFriendReqCount();
  }, [isReqRecieved, isAccept, isReject,])

  useEffect(() => {
    if (isDrawerOpen) fetchFriendReq();
  }, [isDrawerOpen])


  return (
    <>
      <div className={`${styles.navbar} primary-background`}>
        <div className={`${styles.innernavbar}`}>
          <div className={styles.left}>
            <IconButton size="large" edge="start" aria-label="open drawer">
              <MenuIcon className='menu-icon' style={{ color: 'white', fontSize: '30px' }} />
            </IconButton>
            <div className='search nav-search'>
              <SearchIcon className='search-icon' />
              <input placeholder='Search...' />
            </div>
          </div>
          <div className='primary-font abs-center'>WeTalk</div>
          <div className={styles.right}>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton size="large" aria-label="show 4 new mails">
                <Badge badgeContent={4} color="error">
                  <MailIcon style={{ color: 'white' }} />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show notifications"
                onClick={toggleDrawer(true)}
              >
                <Badge badgeContent={friendReqCount > 0 ? friendReqCount : null} color="error">
                  <NotificationsIcon style={{ color: 'white' }} />
                </Badge>
              </IconButton>
              <IconButton onClick={() => setProfileOpen(true)} size="large" edge="end" aria-label="account of current user">
                <AccountCircle style={{ color: 'white' }} />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton size="large" aria-label="show more">
                <MoreIcon style={{ color: 'white' }} />
              </IconButton>
            </Box>
          </div>
        </div>
      </div>

      {/* Drawer Component */}
      <SideDrawer heading={"Friend Requests"} secondaryHeading={"List of the friend requests"} alignment={"right"} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen}>
        {friendReq.length > 0 ? (
          <List sx={{ marginTop: 1, flexGrow: 1 }}>
            {friendReq.map((request) => (
              <ListItem
                key={request.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: 1,
                  borderRadius: 3,
                  backgroundColor: '#f5f5f5',
                  marginY: 1
                }}
              >
                {/* Avatar with reduced spacing */}
                <Avatar src={request.avatar} alt={request.SentRequests.name} sx={{ marginRight: 1, width: 40, height: 40 }} />

                {/* Friend Name */}
                <Box sx={{ flex: 1 }}>
                  <ListItemText
                    primary={request.SentRequests.name}
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
                    {/* {request.createdAt?.split('T')[0]} */}
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center', marginTop: '-5px', padding: '0' }}>
                      <div
                        className={isOnlineUsers[request.SentRequests.id] ? "online" : "offline"}
                        style={{ margin: '0' }}
                      >

                      </div>
                      <div>
                        {isOnlineUsers[request.SentRequests.id] ? "Online" : "Offline"}

                      </div>

                    </div>
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{ minWidth: '50px', fontSize: '0.65rem', padding: '2px 8px' }}
                    onClick={() => { handleLaterReqStatus('accept', request.SentRequests.id).then(res => fetchFriendReq()) }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{ minWidth: '50px', fontSize: '0.65rem', padding: '2px 8px' }}
                    onClick={() => { handleLaterReqStatus('reject', request.SentRequests.id).then(res => fetchFriendReq()) }}
                  >
                    Reject
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>

        ) : (
          <NoDataFound heading={"No friend requests received"} text={"You haven't received any friend requests, connect with strangers and behave accordingly to get friend requests"} />

        )}
      </SideDrawer>

      {/*Profile modal*/}
      <ProfileModal profile={profile} profileOpen={profileOpen} setProfileOpen={setProfileOpen} />

    </>
  );
};

export default NavBar;
