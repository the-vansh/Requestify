const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const connectDB = require('./dbconnection');

const Loginroute = require('./Loginroute');
const signuproute = require('./signuproute');
const roomRoutes = require('./createroomroute');
const verifyAdmin = require('./verifyadmin');
const deleteroom = require('./Deleteroom');
const fetchRoom = require('./fetchroom');
const songqueueRoute = require('./songqueueRoute');
const QueueRoute = require('./QueueRoutes');
const voteup = require('./voteup');
const emptyqueue = require('./empty_queue');
const deletetopsong = require('./DeleteTopSong');
const { broadcast, setWSS } = require("./wss");
const app = express();

// Setup WebSocket server

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

setWSS(wss);
const cors = require('cors');

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow all origins 
//     callback(null, origin || '*');
//   },
//   credentials: true
// }));

const corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    optionSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization","auth-token"], // Allowed headers
};
app.use(cors(corsOptions));


app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Connect to MongoDB
connectDB();

app.locals.broadcast = broadcast;

app.post('/login', Loginroute);
app.post('/signup', signuproute);
app.post('/createroom', roomRoutes);
app.post('/verifyadmin', verifyAdmin);
app.post('/deleteroom', deleteroom);
app.post('/getuserroom', fetchRoom);
app.post('/addsong', songqueueRoute);
app.get('/getqueue', QueueRoute);
app.post('/voteup', voteup);
app.post('/emptyqueue', emptyqueue);
app.post('/removesong', deletetopsong);

// WebSocket connection event
wss.on('connection', (ws) => {


  ws.on('message', (message) => {
    
  });

  ws.on('close', () => {
   
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  
});
