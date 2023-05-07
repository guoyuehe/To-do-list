import React,{useState, useEffect} from "react";
import Axios from "axios";

function Login(props){
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    
    function loginUser(){
        Axios.post("http://localhost:5000/login",{
            username:username,
            password:password
        }).then((response)=>{
            //const userID= response.data.id;//pass the user id to app, so that app can retrieve all tasks from this id;
            if(response.data.message){}//if data has message,display it on screen
            else{
                props.checkStatus(true);
                var tasks = response.data;
                props.displayTasks(tasks);
                console.log(tasks);
            }
        }).catch((err)=>{
            console.log(err);
        })

    }
    const loginWithGoogle = (ev) => {
        ev.preventDefault();
        window.open("http://localhost:5000/auth/google", "_self");
        
      }
    useEffect(()=>{
        Axios.get("http://localhost:5000/googleUser",{withCredentials:true})
        .then(res=>{
            console.log(res.data);
            if(res.data){
            props.checkStatus(true);
            var tasks=[];
            props.displayTasks(tasks);
        }
        })
      },[])
    
    return(
        <div className="login">
            <form className="loginform">
                <input onChange={(e)=>setUsername(e.target.value)} type="text" placeholder="Email"/>
                <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password"/>
                <button onClick={loginUser} type ="button">Login</button>
            </form>
            <button onClick={loginWithGoogle} type="button">Login with Google</button>
            <p>Don't have an account? Register <button className="smallbtn" onClick={()=>props.onFormSwitch("register")}>here</button></p>
        </div>
    )
}

export default Login;