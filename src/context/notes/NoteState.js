import noteContext from './noteContext';
import { useState } from 'react';

const NoteState = (props)=>{
  const host = 'http://localhost:5000';
  const notesInitial = [{title: "no title", description:"No description", tag: "no tag"}];
    const [notes, setNotes] = useState(notesInitial);

    const addNote = async (title, description, tag)=>{
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({title, description, tag})
      });
      const note = await response.json();
      setNotes(notes.concat(note));
    }
    const getNotes = async ()=>{
      const response = await fetch(`${host}/api/notes/getallnotes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
      }});
      const json = await response.json();
      setNotes(json);
    }
    const deleteNote = async (id)=>{
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }});
        const newNote = notes.filter(note => {return note._id !== id});

        setNotes(newNote);
    }
    const editNote = async (id, title, description, tag)=>{
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({title, description, tag})
      });
      const json = await response.json();
      let newNotes = JSON.parse(JSON.stringify(notes));
        for (let index = 0; index < newNotes.length; index++) {
          const element = newNotes[index];
          if(element._id===id){
          newNotes[index].title = title;
          newNotes[index].description = description;
          newNotes[index].tag = tag;
          break;
        }
      }
        setNotes(newNotes);
    }
    return (
        <noteContext.Provider value = {{notes, addNote, deleteNote, editNote, getNotes}}>
            {props.children}
        </noteContext.Provider>
    )
}

export default NoteState;