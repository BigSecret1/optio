import React, { useState } from 'react';
import './Tasks.css';

const ResizableLayout = ({ columns }) => {
  const initialWidth = 320; // Default width for resizable columns
  const [widths, setWidths] = useState(
    columns.slice(0, -1).map(() => initialWidth) // Initial width for all columns except the last one
  );

  const calculateLastColumnWidth = () => {
    const totalWidth = window.innerWidth; // Or use a specific container width if needed
    const otherColumnsWidth = widths.reduce((acc, width) => acc + width, 0);
    return totalWidth - otherColumnsWidth - (columns.length - 1) * 10; // Adjust based on divider width
  };

  const handleMouseDown = (index, e) => {
    const startX = e.clientX;
    const initialWidths = [...widths];

    const handleMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidths = [...initialWidths];
      newWidths[index] += delta;
      newWidths[index + 1] -= delta;
      setWidths(newWidths);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="resizable-layout">
      {columns.slice(0, -1).map((col, index) => (
        <React.Fragment key={index}>
          <div
            className="panel"
            style={{ width: `${widths[index]}px` }}
          >
            <h2>{col}</h2>
            <input type="text" placeholder={`Enter ${col} details...`} />
          </div>
          <div
            className="divider"
            onMouseDown={(e) => handleMouseDown(index, e)}
          ></div>
        </React.Fragment>
      ))}
      <div
        className="panel"
        style={{ width: `${calculateLastColumnWidth()}px` }}
      >
        <h2>{columns[columns.length - 1]}</h2>
        <input type="text" placeholder={`Enter ${columns[columns.length - 1]} details...`} />
      </div>
    </div>
  );
};

export default ResizableLayout;
