import React from "react";

// Font awesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle as farCircle } from "@fortawesome/free-regular-svg-icons";
import { faDotCircle as farDotCircle } from "@fortawesome/free-regular-svg-icons";
import { faCheckCircle as farCheckCircle } from "@fortawesome/free-regular-svg-icons";

export default function StatusIcon({ status }) {
  console.log("Received status for status icon", status);
  return status.toLowerCase() === "completed" ? (
    <FontAwesomeIcon
      icon={farCheckCircle}
      size="2x"
      color="green"
      className="statusIcon"
    />
  ) : status.toLowerCase() === "in progress" ? (
    <FontAwesomeIcon
      icon={farDotCircle}
      size="2x"
      color="yellow"
      className="statusIcon"
    />
  ) : (
    <FontAwesomeIcon
      icon={farCircle}
      size="2x"
      color="blue"
      className="statusIcon"
    />
  );
}
