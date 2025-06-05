import React from 'react'
import {BrowserRouter as Router,Routes, Route} from "react-router-dom";
import Login from './Authentication/login'
import Signup from './Authentication/Signup'
import CreateRoomModal from './Components/createroom';
import Home from './Components/Home';
import Roompanel from './Components/Roompanel';
import Navigates from './Navbar/navigate';
function App() {
  return (
    <Router>
     <Navigates/>
          <Routes>
            <Route exact path="/signup" element={<Signup/>}/>
            <Route exact path="/" element={<Login/>}/>
            <Route exact path="/createroommodel" element={<CreateRoomModal/>}/>
            <Route exact path="/Home" element={<Home/>}/>
            <Route exact path="/Roompanel/:roomCode" element={<Roompanel />} />
          </Routes>
     </Router>
  )
}

export default App;
