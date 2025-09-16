import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';

import history from 'browserHistory';
import Project from 'Project';
import Projects from 'Projects';
import AdminUsers from 'Admin/Users';
import AdminProjects from 'Admin/Projects';
import Authenticate from 'Auth/Authenticate';
import PageError from 'shared/components/PageError';
import { AccessDeniedModal } from 'shared/components';
import { getStoredAuthToken } from 'shared/utils/authToken';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      getStoredAuthToken() ? (
        <Component {...props} />
      ) : (
        <Redirect to="/authenticate" />
      )
    }
  />
);

const DefaultRoute = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [redirectPath, setRedirectPath] = React.useState('/authenticate');
  const [showAccessDenied, setShowAccessDenied] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      if (!getStoredAuthToken()) {
        setRedirectPath('/authenticate');
        setIsLoading(false);
        return;
      }

      try {
        // Get user's projects to redirect to first available one
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://ticket-tracker.turing.com/api'}/projects`, {
          headers: {
            'Authorization': `Bearer ${getStoredAuthToken()}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.projects && data.projects.length > 0) {
            // Redirect to projects dashboard instead of first project
            setRedirectPath('/projects');
          } else {
            // No projects available
            const userResponse = await fetch(`${process.env.REACT_APP_API_URL || 'https://ticket-tracker.turing.com/api'}/currentUser`, {
              headers: {
                'Authorization': `Bearer ${getStoredAuthToken()}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              const user = userData.currentUser || userData;
              if (user.role === 'admin') {
                // Global admin with no projects yet - redirect to admin projects page
                setRedirectPath('/admin/projects');
              } else {
                // Regular user with no project access - show modal
                setShowAccessDenied(true);
                setIsLoading(false);
                return; // Don't redirect immediately, let modal handle it
              }
            } else {
              localStorage.removeItem('authToken');
              setRedirectPath('/authenticate');
            }
          }
        } else {
          setRedirectPath('/authenticate');
        }
      } catch (error) {
        setRedirectPath('/authenticate');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleAccessDeniedClose = () => {
    localStorage.removeItem('authToken');
    setShowAccessDenied(false);
    setRedirectPath('/authenticate');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (showAccessDenied) {
    return (
      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={handleAccessDeniedClose}
        onConfirm={handleAccessDeniedClose}
        title="No Project Access"
        message="You do not have access to any projects. Please contact an administrator to get access."
      />
    );
  }

  return <Redirect to={redirectPath} />;
};

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={DefaultRoute} />
      <Route path="/authenticate" component={Authenticate} />
      <PrivateRoute exact path="/projects" component={Projects} />
      <PrivateRoute path="/project/:projectId" component={Project} />
      <PrivateRoute path="/admin/users" component={AdminUsers} />
      <PrivateRoute path="/admin/projects" component={AdminProjects} />
      <Route component={PageError} />
    </Switch>
  </Router>
);

export default Routes;
