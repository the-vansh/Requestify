
import React, { useState } from "react";
import RoomContext from "./RoomContext";

const RoomProvider = ({ children }) => {
    const [roomCode, setRoomCode] = useState(null);

    return (
        <RoomContext.Provider value={{ roomCode, setRoomCode }}>
            {children}
        </RoomContext.Provider>
    );
};

export default RoomProvider;
