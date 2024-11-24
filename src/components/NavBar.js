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

const NavBar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [friendReq, setFriendReq] = useState([]);

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
    } catch (error) {
      apiError(error);
    }
  }
  const handleReqStatus = async (status, strangerId) => {
    try {
      let response = await api.post('/api/friend/set-status', { status, strangerId });
      toast.success(response.data.messages);
      fetchFriendReq();
      // if (status === "reject") {
      //   // setIsReject(true);
      // } else if (status === 'accept') {
      //   socketRef.current.emit('send-request-accept');
      //   // setIsAccept(true);
      // }
    } catch (error) {
      apiError(error);
    }

  }

  useEffect(() => {
    fetchFriendReq();
  }, [])

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
                <Badge badgeContent={friendReq?.length} color="error">
                  <NotificationsIcon style={{ color: 'white' }} />
                </Badge>
              </IconButton>
              <IconButton size="large" edge="end" aria-label="account of current user">
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
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 450, // Reduced width
            padding: 2,
            paddingTop: 1,
            paddingBottom: 1,
            position: 'relative',
            borderLeft: '1px solid #ddd', // Subtle border on left side
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'space-between'
          }}
          role="presentation"
          onKeyDown={toggleDrawer(false)}
        >
          {/* Close Button at Top Right */}
          <IconButton
            aria-label="close"
            onClick={toggleDrawer(false)}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            ✖
          </IconButton>

          {/* Header */}
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Friend Requests
          </Typography>
          <Typography
            sx={{
              fontSize: '0.85rem', // Smaller font size
              color: 'gray', // Greyish color
              fontWeight: 300, // Light font weight
              marginBottom: 1,
            }}
          >
            List of the friend requests
          </Typography>
          <Divider />

          {/* Body - List of Friend Requests */}
          {friendReq.length>0?(
            <List sx={{ marginTop: 1, flexGrow: 1 }}>
              {friendReq.map((request) => (
                <ListItem
                  key={request.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 1,
                    borderRadius: 3,
                    backgroundColor: '#f5f5f5' ,
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
                      {request.createdAt.split('T')[0]}
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{ minWidth: '50px', fontSize: '0.65rem', padding: '2px 8px' }}
                      onClick={()=>handleReqStatus('accept', request.SentRequests.id)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{ minWidth: '50px', fontSize: '0.65rem', padding: '2px 8px' }}
                      onClick={()=>handleReqStatus('reject', request.SentRequests.id)}
                    >
                      Reject
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>

          ):(
            <NoDataFound heading={"No friend requests received"} text={"You haven't received any friend requests, connect with strangers and behave accordinlgy to get friend requests"}/>

          )}

          {/* Footer */}
          <Divider sx={{ marginTop: 2 }} />
          <Box sx={{ textAlign: 'right', margin: '10px', alignSelf: 'flex-end' }}>
            {/* Close Button at Bottom Right */}
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={toggleDrawer(false)}
              sx={{ fontSize: '0.7rem', padding: '4px 12px' }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Drawer>

    </>
  );
};

export default NavBar;
