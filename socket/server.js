const express = require('express');
const app = express();
const socketIO = require('socket.io'); // Fixed the variable name here

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Methods", 'GET, POST, PUT, DELETE');
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type, Authorization');
    next();
});

const server = app.listen(3333, () => { // Fixed the typo here
    console.log('running');
});

const io = socketIO(server, { // Fixed the typo here
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('sendMessage', (data) => {
        console.log(data);
        io.emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
        console.log(socket.id);
    });
});
