'use client'

import React, { useState } from 'react';
import {
    Box, Modal, Typography, Button, Avatar, IconButton, Divider, Stack, Rating,
} from '@mui/material';
import { AccessTime, Star, Chat } from '@mui/icons-material';

export default function ProfileModal({ profile, profileOpen, setProfileOpen }) {
    // const [profileOpen, setProfileOpen] = useState(false);

    // const () => setProfileOpen(true) = () => setProfileOpen(true);
    // const () => setProfileOpen(false) = () => setProfileOpen(false);

    return (
        <div>

            <Modal open={profileOpen} onClose={() => setProfileOpen(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: '#F0F8FF',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h5" fontWeight="bold">Your can edit your name</Typography>

                    <Stack direction="row" justifyContent="space-between" my={2}>
                        <Typography variant="h7">
                            {profile.gender==='M'?"Male":"Female"}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                            {profile.coins}C
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                        <Avatar
                            alt="Profile Pic"
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-2.webp"
                            sx={{
                                width: 70,
                                height: 70,
                                border: '3px solid black',
                            }}
                        />
                        <Box>
                            <Stack direction="row" alignItems="center">
                                <Typography>{profile.name}</Typography>

                                <Rating
                                    value={3}
                                    precision={0.5}
                                    readOnly
                                    size="small"
                                    icon={<Star fontSize="inherit" />}
                                    emptyIcon={<Star fontSize="inherit" />}
                                />
                            </Stack>

                            <Stack direction="row" spacing={1} mt={1}>

                                <Typography
                                    sx={{
                                        fontSize: '0.85rem', // Smaller font size
                                        color: 'gray', // Greyish color
                                        fontWeight: 300, // Light font weight
                                        marginBottom: 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div
                                        className="online"
                                        style={{marginLeft: 0, marginRight: '3px'}}
                                    ></div>
                                    <div>
                                        {profile.email}

                                    </div>
                                </Typography>
                            </Stack>
                        </Box>
                    </Stack>

                    <Divider style={{ color: 'black', border: '0.1px solid black' }} />
                    <Typography variant="body1" my={2}>
                        {profile.friendsCount} friends
                    </Typography>

                    <Button
                        variant="contained"
                        // color="success"
                        fullWidth
                        size="large"
                    // onClick={() => setProfileOpen(false)}
                    >
                        Edit
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}
