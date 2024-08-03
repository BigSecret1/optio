import React from 'react';
import Card from './Card';

const Dashboard = () => {
  const cards = [
    { title: "Projects", text: "total number of projects : x" },
    { title: "Tasks", text: "14 completed  12 running 12 pending tasks: 18" },
    { title: "Performance", text: "completed : 20%" },
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
