import React, { useState } from "react";
import "./SongSearch.css";

const API_KEY = process.env.REACT_APP_API_KEY;
const localIP = process.env.REACT_APP_LOCAL_IP;

export default function SongSearch({ roomCode }) {
    const [songSearch, setSongSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState("");
    const [hideResults, setHideResults] = useState(false);

    const searchYouTube = async () => {
        const query = songSearch.trim();
        if (!query) {
            setError("Please enter a song name.");
            return;
        }

        try {
            const res = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&q=${encodeURIComponent(query)}&key=${API_KEY}`
            );
            const data = await res.json();
            if (data.items && data.items.length > 0) {
                setSearchResults(data.items);
                setHideResults(false);
                setError("");
                setSongSearch("");
            } else {
                setSearchResults([]);
                setError("No results found.");
            }
        } catch (err) {
            setError("Error fetching data from YouTube.");
        }
    };

    const handleAddToQueue = async (video) => {
        const songName = video.snippet.title;
        const songUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
        const thumbnail = video.snippet.thumbnails.default.url;

        try {
            const res = await fetch(`http://${localIP}:8000/addsong`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    songName,
                    songUrl,
                    thumbnail,
                    roomCode
                })
            });

            const data = await res.json();
            if (data.success) {
                alert("Song added to queue!");
                setHideResults(true);
            } else {
                alert("Failed to add song to queue.");
            }
        } catch (err) {
            alert("Server error.");
        }
    };

    return (
        <div className="search-container">
            <input
                className="search-input"
                type="text"
                placeholder="Enter song name"
                value={songSearch}
                onChange={(e) => setSongSearch(e.target.value)}
            />
            <button className="search-button" onClick={searchYouTube}>
                Search
            </button>

            {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

            {!hideResults && searchResults.length > 0 && (
                <div className="results-scrollable">
                    <ul className="result-list">
                        {searchResults.map((video) => (
                            <li key={video.id.videoId} className="result-item">
                                <img
                                    src={video.snippet.thumbnails.default.url}
                                    alt={video.snippet.title}
                                    className="result-thumbnail"
                                />
                                <span className="result-title">
                                    {video.snippet.title}
                                </span>
                                <button
                                    onClick={() => handleAddToQueue(video)}
                                    className="play-button"
                                >
                                    ➕ Add to Queue
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}