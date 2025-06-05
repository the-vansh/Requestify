
import React from "react";
import "./MiniPlayer.css";

export default function MiniPlayer({ onPlay, onEmptyQueue, onNext }) {
    return (
        <div className="mini-player">
            <h4>🎧 Mini Player</h4>
            <div className="mini-controls">
                <button onClick={onPlay}>▶️ Play</button>
                <button onClick={onNext}>⏭ Next</button>
                <button onClick={onEmptyQueue} className="danger">🗑 Empty Queue</button>
            </div>
        </div>
    );
}