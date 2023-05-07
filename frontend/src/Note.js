import React,{useState} from "react";
import Axios from "axios";

function Note(props){
    const [isDone, setIsDone]=useState(false);
    const handleClick=()=>{
        setIsDone(prevState=>{
            return !prevState;
        })
    }
    const handleDelete=()=>{
        Axios.post("http://localhost:5000/delnote",{
            title:props.title,
            description:props.description,
        }).then((response)=>{
            console.log(response);
            var allTasks = response.data;
            props.onDelete(allTasks);
        }).catch((err)=>{
            console.log(err);
        })
    }
    return (
        <div className="note">
            <h1 onClick={handleClick} style={{textDecoration:isDone?"line-through":"none"}}> {props.title}</h1>
            <p style={{textDecoration:isDone?"line-through":"none"}}>{props.description}</p>
            <p>{props.due}</p>
            <button onClick={handleDelete}>DELETE</button>
        </div>
    )
}
export default Note;