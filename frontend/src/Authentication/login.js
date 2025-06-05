import React,{useState} from 'react'
import { useNavigate } from "react-router-dom";
import './login.css'
import { Link} from "react-router-dom";
const localIP = process.env.REACT_APP_LOCAL_IP;
export default function Login() {
    const [credentials,setcredentails] = useState({email:" ",password:""})

    let navigate = useNavigate();
    const submit= async(e)=>{
      
        e.preventDefault();
        const  {email,password}=credentials;
        const response = await fetch(`http://${localIP}:8000/login`, {
            method: "POST", 
            headers:{
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email,password}),
        });
        const json  = await response.json();
        
        const redirectRoom = new URLSearchParams(window.location.search).get("roomCode");
        if (json.success) {
            localStorage.setItem("token", json.authtoken);
            localStorage.setItem("user", JSON.stringify(json.user));
            localStorage.setItem("disable","NO");
            alert("Logged in successfully!");

            // If a roomCode exists, redirect to that room; otherwise, go to Home
            if (redirectRoom) {
                navigate(`/Roompanel/${redirectRoom}`);
            } else {
                navigate("/Home");
            }
        } else {
            alert("Invalid Credentials");
            setcredentails({ email: "", password: "" });
        }
    }

    const onchange = (e)=>{
        setcredentails({...credentials,[e.target.name]: e.target.value});
    }
    return (
        <>
            <div className='one'>
                <section className='sectioning'>
                    <span></span><span></span><span></span><span></span><span></span><span></span><span>
                    </span><span></span><span></span><span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span><span></span><span></span><span>
                    </span><span></span><span></span><span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span><span></span><span></span><span>
                    </span><span></span><span></span><span></span><span></span><span></span><span>
                    </span><span></span><span></span><span></span><span></span><span></span><span>
                    </span><span></span><span></span><span></span><span></span><span></span><span>
                    </span><span></span><span></span><span></span><span></span><span></span><span>
                    </span><span></span><span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span><span></span><span></span><span>
                    </span><span></span><span></span><span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span>
                    </span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span>
                    </span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span>
                    </span><span></span><span></span><span></span><span></span><span></span>
                    <span></span><span></span>
                    <div className="signin">
                        <div className="content">
                            <h2>Log In</h2>
                            <div className="form">
                                <div className="inputBox">
                                    <input type='email' name='email' value={credentials.email} onChange={onchange} required /> <i>Email</i>
                                </div>
                                <div className="inputBox">
                                    <input type='password' name='password' value={credentials.password} onChange={onchange} required /> <i>Password</i>
                                </div>
                                <div className="links"> <h4>Do not have account?</h4> <Link to="/signup">Signup</Link>
                                </div>
                                <div className="inputBox">
                                    <input type='submit' onClick={submit} value="Login" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

