import React, {useState} from "react";
import Axios from "axios";

function CreateNote(props){
    const[title,setTitle]=useState("");
    const[content,setContent]=useState("");
    function addNote(){
        Axios.post("http://localhost:5000/note",{
            title:title,
            description:content,
        }).then((response)=>{
            console.log(response);
            var allTasks = response.data;
            props.onAdd(allTasks);
            setTitle("");
            setContent("");
        }).catch((err)=>{
            console.log(err);
        })
    }
    return(
        <div>
            <form className="noteform">
                <input name="title" onChange={(e)=>setTitle(e.target.value)} placeholder="Title" value={title}/>
                <hr></hr>
                <textarea name="content" onChange={(e)=>setContent(e.target.value)} placeholder="Take a note..." rows="3" value={content}/>
                <button type="button" onClick={addNote}>+</button>
            </form>
        </div>
    )
}

export default CreateNote;