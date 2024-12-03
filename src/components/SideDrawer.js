import React, { useState } from 'react';
import {
    Drawer,
    Box,
    IconButton,
    Typography,
    Divider,
    List,
    ListItem,
    Avatar,
    ListItemText,
    Button
} from '@mui/material';

const SideDrawer = ({heading, secondaryHeading, alignment, children, isDrawerOpen, setIsDrawerOpen}) => {

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    return (
        <Drawer anchor={alignment} open={isDrawerOpen} onClose={toggleDrawer(false)}>
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
                    {heading}
                </Typography>
                <Typography
                    sx={{
                        fontSize: '0.85rem', // Smaller font size
                        color: 'gray', // Greyish color
                        fontWeight: 300, // Light font weight
                        marginBottom: 1,
                    }}
                >
                    {secondaryHeading}
                </Typography>
                <Divider />

                {/* Body - List of Friend Requests */}
                {children}

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
    )
}
export default SideDrawer