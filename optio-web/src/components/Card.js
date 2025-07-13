import React from "react";
import "./Card.css";

function Card({ title, text }) {
  return (
    <div className="card custom-card">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{text}</p>
      </div>
    </div>
  );
}

export default Card;
