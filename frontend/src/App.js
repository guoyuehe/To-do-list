import './App.css';
import React,{useState} from 'react';
import Header from './Header';
import Footer from './Footer';
import Note from './Note';
import Login from './Login';
import Register from './Register';
import CreateNote from './CreateNote';
//could use map function to map an array of noteitem into note element.
//use conditional rendering to show login or register page.


function App() {
  const [form, setform] = useState("login");
  const [loginStatus,setLoginStatus] = useState(false);
  const [notes, setNotes] = useState("");
  function toggleForm(formName){
    setform(formName);
  }
  const changeStatus=(v)=>{
    setLoginStatus(v);
  }
  const displayNotes=(taskArray)=>{
    setNotes(taskArray);
  }
  function addNote(newNote) {
    setNotes(newNote);
  }
  const deleteNote=(deleted)=>{
    setNotes(deleted);
  }

  return (
    <div className="App">
      {loginStatus === true? <><Header/><CreateNote onAdd={addNote}/>
      {notes.map((item,index)=>{
        return(
          <Note
            key={index}
            title={item.title}
            description={item.description}
            due={item.due_date}
            onDelete={deleteNote}
          />
        )
      })}<Footer /></>:form==="login"?
        <><h1 className="login-header">Keeper</h1>
        <Login 
          checkStatus={changeStatus} 
          displayTasks={displayNotes}
          onFormSwitch={toggleForm}/></>:
        <><h1 className="login-header">Keeper</h1>
        <Register onFormSwitch={toggleForm}/></>}
    </div>

  );
}

export default App;
