import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const NoDataFound = ({heading, text, children}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      textAlign="center"
      paddingX="20px"
      height={'100%'}
    >
      {/* Image Section */}
      <Box marginBottom={1}>
        <Image
          src="https://staticmania.cdn.prismic.io/staticmania/a8befbc0-90ae-4835-bf37-8cd1096f450f_Property+1%3DSearch_+Property+2%3DSm.svg"
          alt="404"
          width={300}
          height={150}
        />
      </Box>

      {/* Title */}
      <Typography variant="h5" fontWeight="bold" marginBottom={1}>
        {heading}
      </Typography>

      {/* Description */}
      <Typography variant="body1" color="textSecondary" marginBottom={3}>
        {text}
      </Typography>

      {/* Button */}
      {children}
    </Box>
  );
};

export default NoDataFound;
