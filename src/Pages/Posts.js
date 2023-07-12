import React, { useState, useEffect, useContext } from "react";
import { database, storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { onChildAdded, push, ref as messageRef, set } from "firebase/database";
import { UserContext } from "../App";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Avatar,
  Card,
  CardMedia,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

// this can be a page like a message board where users can chat or post? or we can have both

const DB_MESSAGES_KEY = "messages";
const STORAGE_KEY = "images/";

export default function Posts() {
  const [messages, setMessages] = useState([]);
  const [fileAdded, setFileAdded] = useState(null);
  const [fileValue, setFileValue] = useState("");
  const [input, setInput] = useState("");

  // getting user context
  const userInfo = useContext(UserContext);

  useEffect(() => {
    const messagesRef = messageRef(database, DB_MESSAGES_KEY);
    onChildAdded(messagesRef, (data) => {
      setMessages((state) => [...state, { key: data.key, val: data.val() }]);
    });
  }, []);

  const submitData = () => {
    const fullStorageRef = storageRef(storage, STORAGE_KEY + fileAdded.name);
    uploadBytes(fullStorageRef, fileAdded).then(() => {
      console.log(`fileadded: ${fileAdded}`);
      getDownloadURL(fullStorageRef).then((url) => {
        console.log(`fileadded.name: ${fileAdded.name}`);
        console.log(url);
        writeData(url);
      });
    });
  };
  const writeData = (url) => {
    const messageListRef = messageRef(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      message: input,
      time: new Date().toLocaleString(),
      url: url,
      name: userInfo.name,
    });
    setInput("");
    setFileAdded(null);
    setFileValue("");
  };

  const Message = ({ message }) => {
    const isUser = message.val.name === userInfo.name;

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: isUser ? "flex-start" : "flex-end",
          mb: 2,
        }}
      >
        {isUser ? (
          <Avatar
            alt="user"
            src={userInfo.avatar}
            sx={{
              bgcolor: "primary.main",
              width: 86,
              height: 86,
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: 86,
              height: 86,
              bgcolor: "secondary.main",
            }}
          >
            {message.val.name}
          </Avatar>
        )}

        <Card sx={{ maxWidth: 250 }}>
          <CardMedia
            sx={{ height: 250, width: 250 }}
            image={message.val.url}
            title="picture"
            borderRadius=""
          />
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              backgroundColor: isUser ? "primary.light" : "secondary.light",
              borderRadius: isUser ? "0px 00px 20px 5px" : "0px 0px 5px 20px",
            }}
          >
            <Typography variant="body1">{message.val.message}</Typography>
          </Paper>
        </Card>
      </Box>
    );
  };

  return (
    <div>
      <h1>Show off your own recipes/creations!</h1>
      <Box
        sx={{
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "grey.200",
        }}
      >
        <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </Box>
        <Box sx={{ p: 2, backgroundColor: "background.default" }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message"
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Grid>
            <Grid item xs={2} sx={{ fontSize: 25 }}>
              <input
                type="file"
                name="file"
                value={fileValue}
                onChange={(e) => {
                  setFileAdded(e.target.files[0]);
                  setFileValue(e.target.value);
                }}
              />
              <br />
            </Grid>
            <Grid item xs={2}>
              <Button
                fullWidth
                size="large"
                color="primary"
                variant="contained"
                endIcon={<SendIcon />}
                onClick={submitData}
              >
                Send
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}
