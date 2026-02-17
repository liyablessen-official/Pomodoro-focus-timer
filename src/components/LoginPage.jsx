import { useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/login.css"
// for psw hide/show effect
// import {ionicons} from 'react-icons-kit';
// import {eyeDisabled} from 'react-icons-kit/feather/eyeOff';
// import {eye} from 'react-icons-kit/feather/eye'


export default function LoginPage({onLogin}){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    // for psw hide/show effect
    const [icontype, setType] = useState('password');
    // const [icon, setIcon] = useState(eyeDisabled);

    const handleToggle = () => {
        if (icontype==='password'){
        //    setIcon(eye);
           setType('text')
        } else {
        //    setIcon(eyeDisabled)
           setType('password')
        }
    }

    //  end of psw show/hide code

    
    const handleLogin = async () => {
        // console.log("Login payload:", { email, password });

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if(error){
            alert(error.message);
        }
        else{
            onLogin(data.user);
        }
    }

    const handleSignup = async () => {
        const {error} = await supabase.auth.signUp({
            email,
            password
        });
        if(error){
            alert(error.message);
        }
        else{
            alert("Check your email for confirmation!");
        }
    }

    return(
        <div className="focus-timer-container">
            <h3 className="loginpage-h3">Focus Timer Login</h3>
            <input placeholder="Email...." type="email" name="usremail" id="usremail" 
            className="login-input"
            value={email} 
            onChange={(e) =>{
                setEmail(e.target.value);
            }}
            />
            <div
            className="login-input"
            style={{
                display:"flex",
                justifyContent:"space-between", 
                backgroundColor:"#f9dbbd"
            }}
            >
                <input placeholder="Password...." type={icontype} name="usrpsw" id="usrpsw" 
                // className="login-input"
                value={password}
                onChange={(e)=>{
                    setPassword(e.target.value);
                }}
                style={{border:"none", padding:"0px", outline:"none",width:"100%", backgroundColor:"transparent"}}
                />
                <span className="flex justify-around items-center" onClick={handleToggle}>
                    <img 
                    style={{height:"15px", width:"15px", cursor:"pointer"}}
                    src= {icontype === "password" ? 
                    "https://uxwing.com/wp-content/themes/uxwing/download/health-sickness-organs/eye-blind-icon.png" 
                    : "https://uxwing.com/wp-content/themes/uxwing/download/health-sickness-organs/eye-icon.png"} 
                    alt="showHide icon" />
                </span>
            </div>
            <div className="login-button-container">
                <button className="focus-timer-button" 
                style={{borderRadius:"5px"}}
                onClick={handleLogin}
                >Login</button>
                <button className="focus-timer-button" 
                style={{borderRadius:"5px"}}
                onClick={handleSignup}
                >Sign-Up</button>
            </div>
        </div>
    );
}