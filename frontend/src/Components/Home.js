import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import RoomContext from "../Context/RoomContext"; 
import './Home.css';
const localIP = process.env.REACT_APP_LOCAL_IP;
export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
   // const [roomCode, setRoomCode] = useState(null);
    const { roomCode, setRoomCode } = useContext(RoomContext);
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            navigate("/login"); // Redirect if not logged in
        } else {
            setUser(storedUser);
            fetchUserRoom(storedUser);
        }
    }, [navigate]);

    const fetchUserRoom = async (userId) => {
        try {
            const response = await fetch(`http://${localIP}:8000/getuserroom`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId })
            });
            const data = await response.json();
            if (data.roomCode) {
                setRoomCode(data.roomCode);
                localStorage.setItem("disable","YES");
            }
        } catch (error) {
          
        }
    };

   return (
    <div className="home-container">
        <div className="welcome-box">
        <h2>Welcome, {user?.name}</h2>
        {roomCode ? (
            <button
            className="home-button"
            onClick={() => navigate(`/Roompanel/${roomCode}`)}
            >
            Go to My Room
            </button>
        ) : (
            <p className="home-message">You are not an admin of any room.</p>
        )}
        </div>
    </div>
    );
}
