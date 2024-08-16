import React, { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import './Tasks.css';
import { Modal, Button } from 'react-bootstrap';

const ResizableLayout = ({ columns }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true); 

  const data = {
    Project: ['Project Alpha', 'Project Beta'],
    Tasks: [
      'Design UI',
      'Implement Backend',
      'Testing',
      'some more random',
      'anything else',
      'and defined one',
    ],
    Details: ['Due in 3 days', 'High Priority', 'Assigned to Team A'],
    Status: ['In Progress', 'Pending', 'Completed'],
  };

  return (
    <div className="resizable-layout-container">
      <div><h3>This is for task button</h3></div>
      <PanelGroup direction="horizontal">
        {columns.map((col, index) => (
          <React.Fragment key={index}>
            <Panel className="panel">
              <h2>{col}</h2>
              <input type="text" placeholder={`Enter ${col} details...`} />
            </Panel>

            {index < columns.length - 1 && (
              <PanelResizeHandle className="resize-handle inactive" />
            )}
          </React.Fragment>
        ))}
      </PanelGroup>

      <div className="dialogue-box">
        {data.Tasks.map((task, index) => (
          <div
            key={index}
            className="task-item"
            style={{ backgroundColor: index % 2 === 0 ? 'red' : 'yellow' }}
          >
            <p>{task}</p>
          </div>
        ))}
      </div>

 <Button variant="primary" onClick={handleShow}>
        Open Form
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Form Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name:</label>
              <input type="text" className="form-control" id="name" required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input type="email" className="form-control" id="email" required />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default ResizableLayout;
