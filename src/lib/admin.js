import { api } from './api';

export const adminLogin = (data) =>
  api.post('/auth/login', data); // reuse the same login endpoint — isAdmin flag is in JWT

export const getAdminStats = () =>
  api.get('/admin/stats');

export const getAdminUsers = (page = 1, limit = 20, search = '') =>
  api.get('/admin/users', { params: { page, limit, search } });

export const getPendingPayments = () =>
  api.get('/admin/pending-payments');

export const confirmPayment = (userId) =>
  api.patch(`/admin/confirm-payment/${userId}`);

export const revokeMembership = (userId) =>
  api.patch(`/admin/revoke-membership/${userId}`);