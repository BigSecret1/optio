import React from 'react';
import Card from './Card';

const Dashboard = () => {
  const cards = [
    { title: "Projects", text: "Status details" },
    { title: "Tasks", text: "Datasources details" },
    { title: "Performance", text: "Segments details" },
  ];

  return (
    <div className="container">
      <div className="row">
        {cards.map((card, index) => (
          <div className="col-md-4 mb-3" key={index}>
            <Card title={card.title} text={card.text} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
