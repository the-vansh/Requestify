import React, { useEffect } from "react";
import "./Queue.css";

export default function Queue({ roomCode, userId, queue, setQueue }) {
  const localIP = process.env.REACT_APP_LOCAL_IP;

  useEffect(() => {
    if (!roomCode || !localIP) return;

    const ws = new WebSocket(`ws://${localIP}:8000`);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "subscribe", roomCode }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "queueUpdate" && data.roomCode === roomCode) {
          setQueue(data.queue);
        }
      } catch (err) {
      
      }
    };

    ws.onerror = (error) => {
    
    };

    ws.onclose = () => {
     
    };

    return () => {
      ws.close();
    };
  }, [roomCode, setQueue, localIP]);

  const handleVoteUp = async (videoId) => {
    try {
      const res = await fetch(`http://${localIP}:8000/voteup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomCode, videoId, userId }),
      });

      const data = await res.json();
      if (!data.success) {
      
      }
    } catch (error) {
     
    }
  };

  const hasUserVoted = (votedBy = []) => {
    return votedBy.some((vote) => vote.userId === userId);
  };

  return (
    <div className="queue-container">
      <h3>🎵 Song Queue</h3>
      {(!queue || queue.length === 0) ? (
        <p>No songs in queue.</p>
      ) : (
        <ul className="queue-list">
          {queue.map((song, index) => (
            <li key={index} className="queue-item">
              <img
                src={song.thumbnail}
                alt="thumbnail"
                className="queue-thumbnail"
              />
              <div className="queue-info">
                <p className="queue-title">{song.songName}</p>
                <p>Votes: {song.Vote}</p>
              </div>
              <button
                className="vote-button"
                disabled={hasUserVoted(song.Voted_By)}
                onClick={() => handleVoteUp(song.songUrl.split("v=")[1])}
              >
                {hasUserVoted(song.Voted_By) ? "Voted" : "Vote Up"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}