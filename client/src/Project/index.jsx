import React from 'react';
import { Route, Redirect, useRouteMatch, useHistory, useParams } from 'react-router-dom';

import useApi from 'shared/hooks/api';
import { updateArrayItemById } from 'shared/utils/javascript';
import { createQueryParamModalHelpers } from 'shared/utils/queryParamModal';
import { PageLoader, PageError, Modal, Avatar } from 'shared/components';
import useCurrentUser from 'shared/hooks/currentUser';

import NavbarLeft from './NavbarLeft';
import Sidebar from './Sidebar';
import Board from './Board';
import IssueSearch from './IssueSearch';
import IssueCreate from './IssueCreate';
import ProjectSettings from './ProjectSettings';
import ProjectMembers from './Members';
import { ProjectPage } from './Styles';

const Project = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const { projectId } = useParams();
  const { currentUser } = useCurrentUser();

  const issueSearchModalHelpers = createQueryParamModalHelpers('issue-search');
  const issueCreateModalHelpers = createQueryParamModalHelpers('issue-create');

  const [{ data, error, setLocalData }, fetchProject] = useApi.get(`/project/${projectId}`);

  if (!data) return <PageLoader />;
  if (error) return <PageError />;

  const { project } = data;

  const updateLocalProjectIssues = (issueId, updatedFields) => {
    setLocalData(currentData => ({
      project: {
        ...currentData.project,
        issues: updateArrayItemById(currentData.project.issues, issueId, updatedFields),
      },
    }));
  };

  return (
    <ProjectPage>
      <NavbarLeft
        issueSearchModalOpen={issueSearchModalHelpers.open}
        issueCreateModalOpen={issueCreateModalHelpers.open}
      />

      <Sidebar project={project} />

      {/* Top Header with User Info */}
      {currentUser && (
        <div style={{
          position: 'fixed',
          top: '0',
          right: '0',
          zIndex: '1000',
          padding: '12px 24px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e8eaed',
          borderLeft: '1px solid #e8eaed',
          borderBottomLeftRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Avatar 
              name={currentUser.name}
              avatarUrl={currentUser.avatarUrl}
              size={36}
            />
            <div>
              <div style={{ 
                color: '#172b4d', 
                fontWeight: '600', 
                fontSize: '14px',
                lineHeight: '1.2'
              }}>
                {currentUser.name}
              </div>
              <div style={{ 
                color: '#5e6c84', 
                fontSize: '12px',
                lineHeight: '1.2'
              }}>
                {currentUser.email}
              </div>
            </div>
            <div style={{
              background: currentUser.role === 'admin' ? 
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {currentUser.role === 'admin' ? '👑 ADMIN' : '👤 USER'}
            </div>
          </div>
        </div>
      )}

      {issueSearchModalHelpers.isOpen() && (
        <Modal
          isOpen
          testid="modal:issue-search"
          variant="aside"
          width={600}
          onClose={issueSearchModalHelpers.close}
          renderContent={() => <IssueSearch project={project} />}
        />
      )}

      {issueCreateModalHelpers.isOpen() && (
        <Modal
          isOpen
          testid="modal:issue-create"
          width={800}
          withCloseIcon={false}
          onClose={issueCreateModalHelpers.close}
          renderContent={modal => (
            <IssueCreate
              project={project}
              fetchProject={fetchProject}
              onCreate={() => history.push(`${match.url}/board`)}
              modalClose={modal.close}
            />
          )}
        />
      )}

      <Route
        path={`${match.path}/board`}
        render={() => (
          <Board
            project={project}
            fetchProject={fetchProject}
            updateLocalProjectIssues={updateLocalProjectIssues}
          />
        )}
      />

      <Route
        path={`${match.path}/settings`}
        render={() => <ProjectSettings project={project} fetchProject={fetchProject} />}
      />

      <Route
        path={`${match.path}/members`}
        render={() => <ProjectMembers project={project} />}
      />

      {match.isExact && <Redirect to={`${match.url}/board`} />}
    </ProjectPage>
  );
};

export default Project;
