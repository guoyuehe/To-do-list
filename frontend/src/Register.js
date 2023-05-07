import React, {useState} from "react";
import Axios from "axios";

function Register(props){
    const [usernameReg,setUsernameReg] = useState('');
    const [emailReg,setEmailReg] = useState('');
    const [passwordReg,setPasswordReg] = useState('');
    function registerUser(){
        Axios.post("http://localhost:5000/register",{
            username:usernameReg,
            email:emailReg,
            password:passwordReg//TODO: form validation(email pattern, password..)
        }).then((response)=>{
            console.log(response);
        }).catch((err)=>{
            console.log(err);
        })
    }
    return(
        <div className="register">
            <form className="loginform">
                <input onChange={(e)=>setUsernameReg(e.target.value)} type="text" placeholder="Username"/>
                <input onChange={(e)=>setEmailReg(e.target.value)} type="text" placeholder="Email"/>
                <input onChange={(e)=>setPasswordReg(e.target.value)} type="password" placeholder="Password"/>
                <button onClick={registerUser} type ="button">Register</button>
            </form>
            <p>Already have an account? Login <button className="smallbtn"onClick={()=>props.onFormSwitch("login")}>here</button></p>
        </div>
    )
}

export default Register;