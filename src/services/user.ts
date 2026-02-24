import api from './api';

export const getUsers = async (params: { page?: number; pageSize?: number; keyword?: string }) => {
  return api.get('/admin/users', { params });
};

export const updateUserRole = async (id: number, role_code: number) => {
  return api.put(`/admin/users/${id}/role`, { role_code });
};
