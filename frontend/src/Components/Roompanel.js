import React, { useState, useEffect, useRef , useContext} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import YouTube from "react-youtube";
import MiniPlayer from "./MiniPlayer";
import SongSearch from "./SongSearch";
import Queue from "./Queue";
import RoomContext from '../Context/RoomContext';
import "./roompanel.css";

const port = "3000";

export default function RoomPanel() {
  const { roomCode } = useParams();
  const { setRoomCode} = useContext(RoomContext); 
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [queue, setQueue] = useState([]);

  const localIP = process.env.REACT_APP_LOCAL_IP;
  const WS_URL = `ws://${localIP}:8000`;

  const ws = useRef(null);
  // check for user and verify admin
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/");
      return;
    }
    setUser(storedUser);
    verifyAdmin(storedUser, roomCode);
  }, [navigate, roomCode]);

  const verifyAdmin = async (userId, roomCode) => {
    try {
      const response = await fetch(`http://${localIP}:8000/verifyadmin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, roomCode }),
      });
      const data = await response.json();
      setIsAdmin(data.isAdmin);
    } catch (error) {
     
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [roomCode]);

 
  useEffect(() => {
    if (!roomCode || !localIP) return;

    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
    
      ws.current.send(JSON.stringify({ type: "subscribe", roomCode }));
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "queueUpdate" && data.roomCode === roomCode) {
          setQueue(data.queue);
        }
      } catch (err) {
       
      }
    };

    ws.current.onerror = (error) => {
     
    };

    ws.current.onclose = () => {
      
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [roomCode]);

  const fetchQueue = async () => {
    try {
      const res = await fetch(`http://${localIP}:8000/getqueue?roomCode=${roomCode}`);
      const data = await res.json();
      if (data.success) {
        setQueue(data.queue);
      }
    } catch (err) {
     
    }
  };

  const handleGenerateQR = () => setShowQRCode(true);
  const handleHideQR = () => setShowQRCode(false);

  const handleDeleteRoom = async () => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await fetch(`http://${localIP}:8000/deleteroom`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomCode }),
        });
        localStorage.setItem("disable","NO");
        setRoomCode(null);
        navigate("/Home");

      } catch (error) {
       
      }
    }
  };

  const handleVideoSelect = async (videoId) => {
    setVideoId(videoId);
    setIsPlaying(true);

    try {
      await fetch(`http://${localIP}:8000/removesong`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomCode, videoId }),
      });

      setQueue((prev) => prev.filter((song) => !song.songUrl.includes(videoId)));
    } catch (error) {
    
    }
  };

  const handleVideoEnd = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      handleVideoSelect(nextSong.songUrl.split("v=")[1]);
    } else {
      setVideoId(null);
      setIsPlaying(false);
    }
  };

  const handlePlay = () => {
    if (!videoId && queue.length > 0) {
      const topSong = queue[0];
      handleVideoSelect(topSong.songUrl.split("v=")[1]);
    } else {
      setIsPlaying(true);
    }
  };

  const handleEmptyQueue = async () => {
    if (window.confirm("Are you sure you want to empty the queue?")) {
      try {
        await fetch(`http://${localIP}:8000/emptyqueue`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomCode }),
        });
      } catch (error) {
       
      }
    }
  };

  const handleNextSong = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      handleVideoSelect(nextSong.songUrl.split("v=")[1]);
      setQueue((prev) => prev.slice(1));
    } else {
      setVideoId(null);
      setIsPlaying(false);
    }
  };

  return (
    <div className="room-panel">
      <h2 className="room-header">Room: {roomCode}</h2>

      {isAdmin && (
        <div className="admin-controls">
          <button onClick={handleGenerateQR}>Generate QR Code</button>
          {showQRCode && (
            <div className="qr-container">
              <QRCodeCanvas value={`http://${localIP}:${port}/?roomCode=${roomCode}`} />
              <button className="qr-hide-button" onClick={handleHideQR}>
                Hide QR Code
              </button>
            </div>
          )}
          <button className="delete-button" onClick={handleDeleteRoom}>
            Delete Room
          </button>

          <MiniPlayer onPlay={handlePlay} onEmptyQueue={handleEmptyQueue} onNext={handleNextSong} />
        </div>
      )}

      <SongSearch roomCode={roomCode} />
      <Queue roomCode={roomCode} userId={user} queue={queue} setQueue={setQueue} />
      {videoId && isPlaying && (
      <div
        className="video-container-wrapper"
        style={{
          position: "fixed",
          left: "1%",
          top: "36%",
          transform: "translateY(-50%)",
          zIndex: "1000",
        }}
      >
        <div className="video-box">
          <YouTube
            videoId={videoId}
            className="youtube-player"
            opts={{
              playerVars: { autoplay: 1 },
            }}
            onReady={(e) => e.target.setVolume(100)}
            onEnd={handleVideoEnd}
          />
        </div>
      </div>


      )}
    </div>
  );
}