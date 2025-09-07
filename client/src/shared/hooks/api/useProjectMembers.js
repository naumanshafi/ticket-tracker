import { useState, useCallback } from 'react';
import api from 'shared/utils/api';
import toast from 'shared/utils/toast';

export const useProjectMembers = (projectId) => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/projects/${projectId}/users`);
      setMembers(response.users || []);
      return response.users;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to load members');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const addMember = useCallback(async ({ email, role }) => {
    if (!projectId) return;
    
    try {
      await api.post(`/projects/${projectId}/users`, { email, role });
      toast.success('Member added successfully');
      return await fetchMembers();
    } catch (err) {
      toast.error(err.message || 'Failed to add member');
      throw err;
    }
  }, [projectId, fetchMembers]);

  const removeMember = useCallback(async (userId) => {
    if (!projectId) return;
    
    try {
      await api.delete(`/projects/${projectId}/users/${userId}`);
      toast.success('Member removed successfully');
      return await fetchMembers();
    } catch (err) {
      toast.error(err.message || 'Failed to remove member');
      throw err;
    }
  }, [projectId, fetchMembers]);

  const updateMemberRole = useCallback(async (userId, role) => {
    if (!projectId) return;
    
    try {
      await api.put(`/projects/${projectId}/users/${userId}`, { role });
      toast.success('Role updated successfully');
      return await fetchMembers();
    } catch (err) {
      toast.error(err.message || 'Failed to update role');
      throw err;
    }
  }, [projectId, fetchMembers]);

  return {
    members,
    isLoading,
    error,
    fetchMembers,
    addMember,
    removeMember,
    updateMemberRole
  };
};

export default useProjectMembers;
