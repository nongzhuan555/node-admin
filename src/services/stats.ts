import api from './api';

export const getFeatureStats = async () => {
  return api.get('/admin/stats/features');
};

export const getDashboardStats = async () => {
  return api.get('/admin/stats/dashboard');
};

export const getUserDistribution = async () => {
  return api.get('/admin/stats/user-distribution');
};

export const getActiveUserPortrait = async (date?: string) => {
  return api.get('/admin/stats/active-user-portrait', { params: { date } });
};
