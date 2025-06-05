const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const connectDB = require('./dbconnection');
const { broadcast, setWSS } = require("./wss");

// Routes
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

const app = express();
const corsOptions = {
    origin: ["https://requestify-frontend.vercel.app","https://www.requestify.online"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization","auth-token"],
};
app.use(cors(corsOptions));
app.use(express.json());

// Add root route for Render health check
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// WebSocket setup
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
setWSS(wss);

// DB connection
connectDB();

// Broadcast accessible in routes
app.locals.broadcast = broadcast;

// API routes
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

// WebSocket events
wss.on('connection', (ws) => {
  ws.on('message', (message) => { });
  ws.on('close', () => { });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
