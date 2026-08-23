'use client';

import React, { useId } from 'react';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Typography,
} from '@mui/material';
import { CloseRounded, PeopleAltRounded } from '@mui/icons-material';
import styles from '../styles/navbar.module.scss';

const SideDrawer = ({
  id,
  heading,
  secondaryHeading,
  alignment,
  children,
  isDrawerOpen,
  setIsDrawerOpen,
}) => {
  const generatedId = useId();
  const headingId = `${id || generatedId}-heading`;

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <Drawer
      anchor={alignment}
      open={isDrawerOpen}
      onClose={closeDrawer}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        id,
        className: styles.drawerPaper,
        role: 'dialog',
        'aria-modal': true,
        'aria-labelledby': headingId,
      }}
      BackdropProps={{ className: styles.drawerBackdrop }}
    >
      <Box className={styles.drawerShell}>
        <div className={styles.drawerAccent} aria-hidden="true" />

        <header className={styles.drawerHeader}>
          <div className={styles.drawerHeadingGroup}>
            <span className={styles.drawerIcon} aria-hidden="true">
              <PeopleAltRounded />
            </span>
            <div>
              <Typography id={headingId} className={styles.drawerTitle} component="h2">
                {heading}
              </Typography>
              {secondaryHeading && (
                <Typography className={styles.drawerSubtitle} component="p">
                  {secondaryHeading}
                </Typography>
              )}
            </div>
          </div>

          <IconButton
            className={styles.drawerCloseButton}
            aria-label={`Close ${heading || 'drawer'}`}
            onClick={closeDrawer}
          >
            <CloseRounded />
          </IconButton>
        </header>

        <div className={styles.drawerDivider} aria-hidden="true" />

        <div className={styles.drawerBody}>{children}</div>

        <footer className={styles.drawerFooter}>
          <Button className={styles.drawerDoneButton} onClick={closeDrawer}>
            Done
          </Button>
        </footer>
      </Box>
    </Drawer>
  );
};

export default SideDrawer;
