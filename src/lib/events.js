import { api } from './api';

export const listEvents = () => api.get('/events');
export const getEvent = (slug) => api.get(`/events/${slug}`);
export const registerForEvent = (eventId, data) => api.post(`/events/${eventId}/registrations`, data);
export const captureEventPayment = (data) => api.post('/events/paypal/capture', data);

export const getMyTickets = () => api.get('/tickets/me');

export const getEventAnalytics = () => api.get('/admin/events/analytics');
export const getAdminEvents = () => api.get('/admin/events');
export const getAdminEvent = (id, params = {}) => api.get(`/admin/events/${id}`, { params });
export const createAdminEvent = (data) => api.post('/admin/events', data);
export const updateAdminEvent = (id, data) => api.post(`/admin/events/${id}`, data);
export const setAdminEventStatus = (id, status) => api.post(`/admin/events/${id}/status/${status}`);
export const deleteAdminEvent = (id) => api.post(`/admin/events/${id}/delete`);
export const getTicketRequests = (params = {}) => api.get('/admin/events/requests', { params });
export const approveTicketRequest = (id, notes = '') => api.post(`/admin/events/requests/${id}/approve`, { notes });
export const rejectTicketRequest = (id, notes = '') => api.post(`/admin/events/requests/${id}/reject`, { notes });
export const validateTicketQr = (qrPayload) => api.post('/admin/events/tickets/validate', { qrPayload });
export const getMyNotifications = () => api.get('/notifications/me');
export const getAdminNotifications = () => api.get('/admin/events/notifications');
