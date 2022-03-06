import React, {useContext} from "react";
import noteContext from "../context/notes/noteContext";
const NoteItem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote} = props;
  return (
    <div className="col-md-3 my-2">
      <div className="card">
        <div className="card-body">
            <div className="d-flex">
            <h5 className="card-title">{note.title}</h5>
            <i className="fa-solid fa-pen-to-square my-1 mx-2" onClick={()=>{updateNote(note)}}></i>
            <i className="fa-solid fa-trash-can my-1" onClick={()=>{deleteNote(note._id)}}></i>
            </div>
          <p className="card-text">{note.description}</p>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
