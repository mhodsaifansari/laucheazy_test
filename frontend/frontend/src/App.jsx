import { useState, useEffect } from 'react'
import './App.css'
import MicrosoftLogin from "react-microsoft-login";
import axios from "axios";
function App() {
  const [msalInstance, onMsalInstanceChange] = useState();
  const [status,setStatus] = useState(false);
  const [err,setErr] = useState("Not Logged In");
  const [user,setUser] = useState();
  useEffect(()=>{
    if(localStorage.getItem('access_token')&&localStorage.getItem('refresh_token'))
    { 
      axios.get("http://127.0.0.1:8000",{headers:{'Authorization':'Bearer '+localStorage.getItem('access_token')}}).then((data)=>{
        console.log(data);
        setStatus(true);
        setUser(data.data.user);
      }).catch((err)=>{
        
        setStatus(err.error);
      })
    }
  },[])
  const authHandler = (err,authData,msal)=>{
    console.log(err,authData);
    if (!err && authData) {
      onMsalInstanceChange(msal);
      axios.post("http://127.0.0.1:8000/auth/convert-token",{
        "grant_type":"convert_token",
        "client_id":import.meta.env.VITE_APPLICATION_CLIENT_ID,
        "client_secret":import.meta.env.VITE_APPLICATION_CLIENT_SECRET,
        "backend":"azuread-oauth2",
        "token":authData.idToken
      }).then((data)=>{
        localStorage.setItem('access_token',data.data.access_token);
        localStorage.setItem('refresh_token',data.data.refresh_token);
        localStorage.setItem('msalInstance',msalInstance);
        axios.get("http://127.0.0.1:8000",{headers:{'Authorization':'Bearer '+localStorage.getItem('access_token')}}).then((data)=>{
          setStatus(true);
          setUser(data.data.user);
        }).catch((err)=>{
          setStatus(false);
          onMsalInstanceChange("");
          setErr(err.error);
        })
      })
      .catch((err)=>{
        msalInstance.logout();
        onMsalInstanceChange("");
        setStatus(err.error);
      })
    }
  }
  const logoutHandler = ()=>{
    if(msalInstance)
    {
      try{
    msalInstance.logout();}
    catch(err)
    {
      console.log(err);
    }
    }
    // catch(err)
    // {
    //   console.log(err);
    // }
    setStatus("Logged Out");
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
  return (
    <>
      <div>
        <h1>Test</h1>
        
       {status==true?
       <div>
            <h1>Logged In SuccessFully</h1>
            <button onClick={logoutHandler}>Logout</button>
            {user?
                  <div>
                    <h4>User Detail</h4>
                    <p>user id: {user.id}</p>
                    <p>username: {user.username}</p>
                    <p>email: {user.email}</p>
                    <p>First Name: {user.first_name}</p>
                    <p>Last Name: {user.last_name}</p>
                  </div>:''}
       </div>
       :<div>
        <div>
        {msalInstance?<button onClick={logoutHandler}>Logout</button>
          : 
            <MicrosoftLogin clientId={import.meta.env.VITE_CLIENT_ID} authCallback={authHandler} ></MicrosoftLogin>
          }
          </div>
          <h3>Not Logged In</h3></div>}
       
      </div>
    </>
  )
}

export default App
