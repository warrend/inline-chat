const express = require('express')
const webpack = require('webpack')
const path = require('path') 
const open = require('open')
const app = express();  
const port = 8000;  

app.use(express.static(__dirname + '/public'));

const server = app.listen(port, function(err) {  
  if (err) {
    console.log(err);
  } else {
    open(`http://localhost:${port}`);
  }
});

const io = require('socket.io')(server); 

io.on('connection', (socket) => {  
  console.log('a user connected');
	socket.on('chat', (data) => {
		io.sockets.emit('chat', data)
		console.log("Chat emitted from server")
	})

	socket.on('disconnect', () => {
    console.log('user disconnected');
  });
})