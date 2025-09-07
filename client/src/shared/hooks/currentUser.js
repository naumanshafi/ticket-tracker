import { get } from 'lodash';

import useApi from 'shared/hooks/api';

const useCurrentUser = ({ cachePolicy = 'no-cache' } = {}) => {
  const [{ data, error, isLoading }] = useApi.get('/currentUser', {}, { cachePolicy });

  // If there's an auth error, clear token and redirect
  if (error && error.status === 401) {
    localStorage.removeItem('authToken');
    if (window.location.pathname !== '/authenticate') {
      window.location.href = '/authenticate';
    }
  }

  // Extract user from the currentUser wrapper
  const user = data?.currentUser || data;

  return {
    currentUser: user || null,
    currentUserId: get(user, 'id'),
    isLoading,
    error
  };
};

export default useCurrentUser;
