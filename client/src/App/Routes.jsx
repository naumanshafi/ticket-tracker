import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';

import history from 'browserHistory';
import Project from 'Project';
import AdminUsers from 'Admin/Users';
import AdminProjects from 'Admin/Projects';
import { MyProjects } from 'shared/components';
import Authenticate from 'Auth/Authenticate';
import PageError from 'shared/components/PageError';
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
          
          // Get user info to determine redirect path
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
              // Admin users go to admin my-projects
              setRedirectPath('/admin/my-projects');
            } else {
              // Regular users go to user my-projects (even if no projects)
              setRedirectPath('/user/my-projects');
            }
          } else {
            localStorage.removeItem('authToken');
            setRedirectPath('/authenticate');
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Redirect to={redirectPath} />;
};

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={DefaultRoute} />
      <Route path="/authenticate" component={Authenticate} />
      <PrivateRoute path="/project/:projectId" component={Project} />
      <PrivateRoute path="/admin/users" component={AdminUsers} />
      <PrivateRoute exact path="/admin/projects" component={AdminProjects} />
      <PrivateRoute path="/admin/my-projects" component={MyProjects} />
      <PrivateRoute path="/user/my-projects" component={MyProjects} />
      <Route component={PageError} />
    </Switch>
  </Router>
);

export default Routes;
