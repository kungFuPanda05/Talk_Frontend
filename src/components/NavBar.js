'use client'
import styles from '../styles/navbar.module.scss'
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import * as React from 'react';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';


const NavBar = () => {
  return (
    <>
      <div className={`${styles.navbar} primary-background`}>
        <div className={`${styles.innernavbar}`}>
          <div className={styles.left}>
            <div>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                className='menu-icon'
              >
                <MenuIcon className='menu-icon' style={{ color: 'white', fontSize: '30px' }} />
              </IconButton>
            </div>
            <div className='search nav-search'>
              <SearchIcon className='search-icon' />
              <input className='' placeholder='Search...' />
            </div>
          </div>
          <div className='primary-font abs-center'>WeTalk</div>
          <div className={styles.right}>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="error">
                  <MailIcon style={{ color: 'white' }} />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon style={{ color: 'white' }} />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
              >
                <AccountCircle style={{ color: 'white' }} />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-haspopup="true"
              >
                <MoreIcon style={{ color: 'white' }} />
              </IconButton>
            </Box>
          </div>
        </div>
      </div>
    </>
  )
}
export default NavBar;