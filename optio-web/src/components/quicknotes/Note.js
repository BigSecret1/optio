import React, { useState } from "react";
import "./styles/note.css";

function Note() {
  const [note, setNote] = useState("");

  function handleInput(e) {
    setNote(e.target.innerText);
    console.log("note here is", note);
  }

  return (
    <div
      contentEditable="true"
      className="note-container"
      onInput={handleInput}
      suppressContentEditableWarning={true}
      placeholder="Write your notes here..."
    ></div>
  );
}

export default Note;
