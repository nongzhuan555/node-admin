import api from './api';

export const login = async (student_no: string) => {
  return api.post('/admin/login', { student_no });
};
