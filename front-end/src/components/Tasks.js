import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import './Tasks.css';

const ResizableLayout = ({ columns = ['Project', 'Tasks', 'Details', 'Status'] }) => {
  const data = {
    Project: ['Project Alpha', 'Project Beta'],
    Tasks: ['Design UI', 'Implement Backend', 'Testing'],
    Details: ['Due in 3 days', 'High Priority', 'Assigned to Team A'],
    Status: ['In Progress', 'Pending', 'Completed'],
  };

  return (
    <div className="resizable-layout-container">
      <PanelGroup direction="horizontal">
        {columns.map((col, index) => (
          <React.Fragment key={index}>
            <Panel className="panel">
              <h2>{col}</h2>
              <input type="text" placeholder={`Enter ${col} details...`} />
              <ul className="panel-list">
                {data[col].map((item, i) => (
                  <li key={i} className="panel-list-item">
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>

            {index < columns.length - 1 && (
              <PanelResizeHandle className="resize-handle" />
            )}
          </React.Fragment>
        ))}

        {/* Add an inactive resize handle to the right of the last panel */}
        <PanelResizeHandle className="resize-handle inactive" />
      </PanelGroup>
    </div>
  );
};

export default ResizableLayout;
