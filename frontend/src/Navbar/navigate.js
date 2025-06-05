import { useNavigate } from 'react-router-dom';
import './navbar.css';
import { useContext } from 'react';
import RoomContext from '../Context/RoomContext';

export default function Navigate() {
    const navigate = useNavigate();
    const { roomCode } = useContext(RoomContext); 

    const performLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    }
    return (
        <nav>
            <h2>Requestify</h2>
            <ul>
                {!localStorage.getItem('token') ? (
                    <li><h3 style={{ color: 'white' }}>Welcome</h3></li>
                ) : (
                    <ul>
                        <li>
                            <button
                                id="createRoomBtn"
                                disabled={localStorage.getItem('disable')==="YES"}
                                onClick={() => navigate('/createroommodel')}
                            >
                                Create Room
                            </button>
                        </li>
                        <li><button onClick={performLogout} style={{"color":"#c41a1a","backgroundColor":"white"}} id='Deletebtn'>Logout</button></li>
                    </ul>
                )}
            </ul>
        </nav>
    );
}
