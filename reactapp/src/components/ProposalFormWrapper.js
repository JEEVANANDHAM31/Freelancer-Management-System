import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ProposalForm from './ProposalForm';

const ProposalFormWrapper = ({ projectId }) => {
  return (
    <Router>
      <ProposalForm projectId={projectId} />
    </Router>
  );
};

export default ProposalFormWrapper;
