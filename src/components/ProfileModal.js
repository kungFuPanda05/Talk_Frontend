'use client';

import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import {
  CloseRounded,
  EmojiEventsRounded,
  FavoriteRounded,
  PeopleAltRounded,
  PersonRounded,
  TollRounded,
  VerifiedRounded,
} from '@mui/icons-material';
import ImageAvatar from './ImageAvatar';
import styles from '../styles/navbar.module.scss';
import { apiAssetUrl } from '@/utils/config';

export default function ProfileModal({ profile, profileOpen, setProfileOpen }) {
  const closeProfile = () => setProfileOpen(false);
  const gender = profile?.gender === 'M'
    ? 'Male'
    : profile?.gender === 'F'
      ? 'Female'
      : 'Not specified';
  const profileImage = profile?.pic
    ? apiAssetUrl(profile.pic)
    : '';

  return (
    <Modal
      id="profile-modal"
      open={profileOpen}
      onClose={closeProfile}
      aria-labelledby="profile-modal-title"
      aria-describedby="profile-modal-description"
      BackdropProps={{ className: styles.profileBackdrop }}
    >
      <Box
        className={styles.profileModal}
        component="article"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        aria-describedby="profile-modal-description"
      >
        <div className={styles.profileHalo} aria-hidden="true" />

        <IconButton
          className={styles.profileCloseButton}
          onClick={closeProfile}
          aria-label="Close profile"
        >
          <CloseRounded />
        </IconButton>

        <header className={styles.profileHeader}>
          <span className={styles.eyebrow}>
            <VerifiedRounded fontSize="inherit" />
            Your ChitTalk identity
          </span>
          <Typography id="profile-modal-title" className={styles.profileTitle} component="h2">
            A little space that’s all you
          </Typography>
          <Typography id="profile-modal-description" className={styles.profileDescription}>
            Your friends see these details when you connect and start a conversation.
          </Typography>
        </header>

        <section className={styles.profileIdentity} aria-label="Profile details">
          <div className={styles.profileAvatarShell}>
            <ImageAvatar
              alt={`${profile?.name || 'User'} profile picture`}
              src={profileImage}
              sx={{ width: 88, height: 88 }}
              fallback={profile?.name?.[0]?.toUpperCase() || 'U'}
            />
            <span className={styles.profileOnlineDot} aria-label="Online" />
          </div>

          <div className={styles.identityCopy}>
            <Stack direction="row" alignItems="center" flexWrap="wrap" gap={0.75}>
              <Typography className={styles.identityName} component="h3">
                {profile?.name || 'ChitTalk user'}
              </Typography>
              <span className={styles.verifiedPill}>
                <VerifiedRounded /> Active
              </span>
            </Stack>
            <Typography className={styles.identityEmail}>
              {profile?.email || 'Your email will appear here'}
            </Typography>
            <div className={styles.ratingRow} aria-label="Profile rating: 3 out of 5">
              <Rating
                value={3}
                readOnly
                size="small"
                icon={<FavoriteRounded fontSize="inherit" />}
                emptyIcon={<FavoriteRounded fontSize="inherit" />}
              />
              <span>Good vibes</span>
            </div>
          </div>
        </section>

        <section className={styles.profileStats} aria-label="Profile statistics">
          <div className={`${styles.statCard} ${styles.friendsStat}`}>
            <span className={styles.statIcon} aria-hidden="true">
              <PeopleAltRounded />
            </span>
            <span className={styles.statCopy}>
              <strong>{profile?.friendsCount ?? 0}</strong>
              <small>Friends</small>
            </span>
          </div>
          <div className={`${styles.statCard} ${styles.coinsStat}`}>
            <span className={styles.statIcon} aria-hidden="true">
              <TollRounded />
            </span>
            <span className={styles.statCopy}>
              <strong>{profile?.coins ?? 0}</strong>
              <small>Coins</small>
            </span>
          </div>
          <div className={`${styles.statCard} ${styles.genderStat}`}>
            <span className={styles.statIcon} aria-hidden="true">
              <PersonRounded />
            </span>
            <span className={styles.statCopy}>
              <strong>{gender}</strong>
              <small>Profile</small>
            </span>
          </div>
        </section>

        <div className={styles.profileNote}>
          <EmojiEventsRounded aria-hidden="true" />
          <Typography component="p">
            Keep connecting to grow your circle and collect more ChitTalk coins.
          </Typography>
        </div>

        <Button className={styles.profileDoneButton} fullWidth onClick={closeProfile}>
          Looks good
        </Button>
      </Box>
    </Modal>
  );
}
