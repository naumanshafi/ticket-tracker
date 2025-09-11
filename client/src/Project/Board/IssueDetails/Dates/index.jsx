import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { formatDateTimePST } from 'shared/utils/dateTime';

import { Dates } from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
};

const ProjectBoardIssueDetailsDates = ({ issue }) => {
  // Only show "Updated at" if it's different from "Created at" (more than 1 minute difference)
  const createdAt = moment(issue.createdAt);
  const updatedAt = moment(issue.updatedAt);
  const wasUpdated = updatedAt.diff(createdAt, 'minutes') > 1;

  return (
    <Dates>
      <div>Created at {formatDateTimePST(issue.createdAt)}</div>
      {wasUpdated && <div>Updated at {formatDateTimePST(issue.updatedAt)}</div>}
    </Dates>
  );
};

ProjectBoardIssueDetailsDates.propTypes = propTypes;

export default ProjectBoardIssueDetailsDates;
