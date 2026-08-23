import React from 'react';
import { Box, Typography } from '@mui/material';
import { AutoAwesomeRounded, SearchRounded } from '@mui/icons-material';
import styles from '../styles/navbar.module.scss';

const NoDataFound = ({ heading, text, children }) => {
  return (
    <Box className={styles.emptyState} role="status">
      <div className={styles.emptyIllustration} aria-hidden="true">
        <span className={`${styles.emptyBlob} ${styles.emptyBlobOne}`} />
        <span className={`${styles.emptyBlob} ${styles.emptyBlobTwo}`} />
        <span className={styles.emptyIconShell}>
          <SearchRounded />
        </span>
        <AutoAwesomeRounded className={styles.sparkleOne} />
        <AutoAwesomeRounded className={styles.sparkleTwo} />
      </div>

      <Typography className={styles.emptyTitle} component="h3">
        {heading}
      </Typography>
      <Typography className={styles.emptyText} component="p">
        {text}
      </Typography>

      {children && <div className={styles.emptyActions}>{children}</div>}
    </Box>
  );
};

export default NoDataFound;
