import api from './api';

export interface NotificationItem {
  id: number;
  title: string;
  content: string;
  type: number; // 1=系统更新, 2=系统维护, 3=安全通知, 4=日常通知
  status: number;
  created_at: string;
  publisher_name: string;
}

export interface GetNotificationsParams {
  page?: number;
  pageSize?: number;
  type?: number;
}

export const getNotifications = async (params: GetNotificationsParams) => {
  return api.get('/admin/notifications', { params });
};

export interface CreateNotificationParams {
  title: string;
  content: string;
  type: number;
}

export const createNotification = async (data: CreateNotificationParams) => {
  return api.post('/admin/notifications', data);
};

export const deleteNotification = async (id: number) => {
  return api.delete(`/admin/notifications/${id}`);
};
