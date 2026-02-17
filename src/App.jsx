
// also add a hint of each program name in drop-down(on hover)
import { supabase } from "./supabaseClient";
import "./styles/focusTimer.css";

import './app.css';
import { useEffect, useState } from 'react';
import FocusTimer from './components/FocusTimer';
import LoginPage from './components/LoginPage';

export default function App() {

  // login page and focus timer code
const [user,setUser] = useState(null);

useEffect(()=>{
  supabase.auth.getUser().then(({data}) => {
    setUser(data?.user??null);
  });

  const {data: listener} = supabase.auth.onAuthStateChange((_,session) => {
    setUser(session?.user??null);
  });

  return () => listener.subscription.unsubscribe();

},[]);

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert(error.message);
  } else {
    setUser(null);
  }
};


  // toggle dark and light mode 
  const [toggleStatus,setToggleStatus] = useState(true);
  // toggleStatus is true when its light mode and false when its dark mode

  useEffect(() => {
      document.body.style.backgroundColor = toggleStatus ? "#fff" : "#0C1821";
      document.body.style.color = toggleStatus ? "#0C1821" : "#fff";
  }, [toggleStatus]);
  //    /////// end //////

return (
  <div>
    {/* toggle dark/light mode */}
    <div className='user-list-toggle-container'>
        <img src={toggleStatus ? "https://img.icons8.com/?size=100&id=118932&format=png&color=000000" : "https://img.icons8.com/?size=100&id=118932&format=png&color=ffffff"} alt='light icon' className='user-list-icon' />
        <div className="user-list-toggle-element"
        onClick={()=>{
            setToggleStatus(!toggleStatus);
        }}
        style={{
            boxShadow: toggleStatus ? "#364156" : "0.5px 0.5px 5px 0px #CCC9DC"
        }}
        >
            <button className="userlist-toggle-btn" 
            style={{float: toggleStatus ? "left" : "right"}}
            ></button>
        </div>
        <img src={toggleStatus ? "https://img.icons8.com/?size=100&id=TMEWD76XezdX&format=png&color=000000" : "https://img.icons8.com/?size=100&id=TMEWD76XezdX&format=png&color=ffffff" } alt='dark icon' className='user-list-icon' />
        </div>
      {/* </div> */}
    
    
    {!user ? (
      <LoginPage onLogin={setUser} />
    ) : (
      <>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
          <button className="focus-timer-button" onClick={handleLogout}>
            Logout
          </button>
          
        </div>

        <FocusTimer user={user} />
      </>
    )}
  </div>
);

// ///////////end of supabase code ///////////////////
  
}

