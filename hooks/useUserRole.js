'use client';

import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import axiosSecure from '@/lib/axiosSecure';

const useUserRole = () => {
  const { user, loading } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data;
    },
  });

  return {
    role: data?.role || 'user',
    status: data?.status || 'active',
    roleLoading: loading || isLoading,
  };
};

export default useUserRole;
