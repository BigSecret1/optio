import React from "react";
import Card from "./Card";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    { title: "Projects", text: "", path: "/projects/list" },
    { title: "Tasks", text: "", path: "/tasks" },
    { title: "Quick notes", text: "", path: "/quicknote" },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      <div className="row">
        {cards.map((card, index) => (
          <div
            className="col-md-4 mb-3"
            key={index}
            style={{ cursor: "pointer" }}
            onClick={() => handleCardClick(card.path)}
          >
            <Card title={card.title} text={card.text} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;