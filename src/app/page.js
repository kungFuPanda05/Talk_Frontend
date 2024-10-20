import React from "react";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  Typography,
  InputBase,
  Paper,
  IconButton,
} from "@mui/material";
import { Search, AttachFile, InsertEmoticon, Send } from "@mui/icons-material";
import RandConnect from "@/components/randConnect";

export default function Home() {
  return (
    <Box className="container">
      <Box className="chatWrapper">
        {/* Left Sidebar */}
        <Grid item xs={4} className="sidebar">
          {/* Search bar */}
          <Paper component="form" className="searchBar">
            <InputBase
              className="searchInput"
              placeholder="Search"
              inputProps={{ "aria-label": "search" }}
            />
            <IconButton type="submit" aria-label="search">
              <Search />
            </IconButton>
          </Paper>

          {/* Contact List */}
          <List>
            {[
              { name: "Marie Horwitz", message: "Hello, Are you there?", time: "Just now", count: 3, avatar: "/img1.png" },
              { name: "Alexa Chung", message: "Lorem ipsum dolor sit.", time: "5 mins ago", count: 2, avatar: "/img2.png" },
              { name: "Danny McChain", message: "Lorem ipsum dolor sit.", time: "Yesterday", count: 0, avatar: "/img3.png" },
              { name: "Ashley Olsen", message: "Lorem ipsum dolor sit.", time: "Yesterday", count: 0, avatar: "/img4.png" },
              { name: "Kate Moss", message: "Lorem ipsum dolor sit.", time: "Yesterday", count: 0, avatar: "/img5.png" },
            ].map((contact, index) => (
              <ListItem key={index} className="contactListItem">
                <ListItemAvatar>
                  <Badge
                    badgeContent={contact.count > 0 ? contact.count : null}
                    color="error"
                  >
                    <Avatar alt={contact.name} src={contact.avatar} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={contact.name}
                  secondary={contact.message}
                  primaryTypographyProps={{ className: "contactName" }}
                  secondaryTypographyProps={{ className: "contactMessage" }}
                />
                <Typography className="contactTime">
                  {contact.time}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={8} className="chatArea">
            <RandConnect/>
          {/* <div style={{height: '100%'}}> */}
            {/* <Box className="chatMessages">
              <Box className="messageRow">
                <Avatar src="/img1.png" className="avatar" />
                <Box>
                  <Typography className="messageBubble">
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat.
                  </Typography>
                  <Typography variant="caption" className="messageTime">
                    12:00 PM | Aug 13
                  </Typography>
                </Box>
              </Box>

              <Box className="messageRow messageRowEnd">
                <Box>
                  <Typography className="messageBubbleSent">
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa
                    qui officia deserunt mollit anim id est laborum.
                  </Typography>
                  <Typography variant="caption" className="messageTime">
                    12:00 PM | Aug 13
                  </Typography>
                </Box>
                <Avatar src="/img1.png" className="avatar" />
              </Box>

              <Box className="messageRow">
                <Avatar src="/img1.png" className="avatar" />
                <Box>
                  <Typography className="messageBubble">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem.
                  </Typography>
                  <Typography variant="caption" className="messageTime">
                    12:00 PM | Aug 13
                  </Typography>
                </Box>
              </Box>
            </Box> */}

            {/* <Box className="chatInputWrapper">
              <Avatar src="/img1.png" />
              <InputBase className="chatInput" placeholder="Type message" />
              <IconButton>
                <AttachFile />
              </IconButton>
              <IconButton>
                <InsertEmoticon />
              </IconButton>
              <IconButton>
                <Send />
              </IconButton>
            </Box> */}

          {/* </div> */}
        </Grid>
      </Box>
    </Box>
  );
}
