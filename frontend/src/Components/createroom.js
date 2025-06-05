import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./createroom.css"; 

const localIP = process.env.REACT_APP_LOCAL_IP;

export default function CreateRoomModal() {
  const [roomName, setRoomName] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleCreateRoom = async () => {
    if (!user) {
      alert("Please log in to create a room!");
      return;
    }

    const roomCode = Math.random().toString(36).substr(2, 6);
    try {
      const response = await fetch(`http://${localIP}:8000/createroom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName,
          roomCode,
          admin: user,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("disable", "YES");
        navigate(`/Roompanel/${roomCode}`);
      } else {
       
      }
    } catch (error) {
    
    }
  };

  const handleCancel = () => {
    setRoomName("");
    navigate("/Home");
  };

  return (
    <div className="create-room-container">
      <div className="create-room-box">
        <h2>Create a New Room</h2>
        <input
          type="text"
          placeholder="Enter Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <div>
          <button className="create-btn" onClick={handleCreateRoom}>
            Create Room
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}