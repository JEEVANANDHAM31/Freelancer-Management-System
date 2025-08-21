import React from 'react';

const Milestone = ({ milestone }) => {
  return (
    <div>
      <h4>{milestone.description}</h4>
      <p>Status: {milestone.status}</p>
    </div>
  );
};

export default Milestone;
