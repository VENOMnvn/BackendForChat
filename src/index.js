require('dotenv').config();
/**
 * Module dependencies.
 */
const http = require('http');
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');
const express = require("express");
const cors = require("cors");
const connectdb = require("./config/connectdb.js");
const routes = require("./routes/routes.js");
const cookieParser = require("cookie-parser");
const User = require("./MongoDB/UserSchema.js");
const app = express();
let socketUsers = [];

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// DataBase Connection
connectdb();

const socketUserCheck = (username)=>{
  let status = false;
  socketUsers.forEach(user=>{
    if(user.userId == username){
      status = true;
    }
  })
  return status;
}


app.get("/", (req, res) => {
  res.send("working v.1.8");
});
app.get("/check-online-user",(req,res)=>{
  const user = req.query;
  const status = socketUserCheck(user.user);
  res.send(status);

})
app.use(routes);




app.set('port', port);
/**
 * Create HTTP server.
 */
const server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);

server.on('error', onError);
server.on('listening', onListening);


//WebSocket using SOCKET IO
const io = require("socket.io")(server, {
  cors: "*",
});

const addSocketUser = (userId,socketId)=>{
    !socketUsers.some((user)=>user.userId == userId) && socketUsers.push({userId,socketId});
}

const removeSocketUser = (socketId)=>{
  socketUsers = socketUsers.filter(user => user.socketId != socketId);
  console.log(socketUsers);
}

io.on('connection',(socket,arg)=>{
  
  socket.on('setup',(id)=>{
    socket.join(id);
    addSocketUser(id,socket.id);
    console.log(id + ' connected');
    socket.emit('connected');
  });

  socket.on('disconnect',()=>{
    console.log("disconnected " + socket.id);
    removeSocketUser(socket.id);
  });

  socket.on('message-send',(msgObj)=>{
    socket.to(msgObj.username).emit('message-recieved',msgObj);
  });

  socket.on('typing-recived',(data)=>{
    socket.to(data.username).emit('typing-send',data);
  });

  socket.on('check-online-status',(data)=>{
    const status = socketUserCheck(data.username);
    console.log("check-data",data);
    socket.to(data.checker).emit('send-online-status',{
      user : data.username,
      status,
      checker : data.checker
    });
  })
});





/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('App started. Listening on ' + bind);
}
