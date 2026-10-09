import { api } from './api';

export const listEvents = () => api.get('/events');
export const getEvent = (slug) => api.get(`/events/${slug}`);
export const registerForEvent = (eventId, data) => api.post(`/events/${eventId}/registrations`, data);
export const verifyEventPayment = (data) => api.post('/events/square/verify', data);
export const captureEventPayment = verifyEventPayment;
export const payEventWithSquareToken = (data) => api.post('/events/square/pay', data);

export const getMyTickets = () => api.get('/tickets/me');

export const getEventAnalytics = () => api.get('/admin/events/analytics');
export const getAdminEvents = () => api.get('/admin/events');
export const getAdminEvent = (id, params = {}) => api.get(`/admin/events/${id}`, { params });
export const createAdminEvent = (data) => api.post('/admin/events', data);
export const updateAdminEvent = (id, data) => api.post(`/admin/events/${id}`, data);
export const setAdminEventStatus = (id, status) => api.post(`/admin/events/${id}/status/${status}`);
export const deleteAdminEvent = (id) => api.post(`/admin/events/${id}/delete`);
export const getTicketRequests = (params = {}) => api.get('/admin/events/requests', { params });
export const getAdminTicketsByEmail = (email) => api.get('/admin/events/tickets/by-email', { params: { email } });
export const approveTicketRequest = (id, notes = '') => api.post(`/admin/events/requests/${id}/approve`, { notes });
export const rejectTicketRequest = (id, notes = '') => api.post(`/admin/events/requests/${id}/reject`, { notes });
export const cancelTicketRequest = (id, notes = '') => api.post(`/admin/events/requests/${id}/cancel`, { notes });
export const deleteTicketRequest = (id) => api.post(`/admin/events/requests/${id}/delete`);
export const createCashTicket = (eventId, data) => api.post(`/admin/events/${eventId}/cash-tickets`, data);
export const validateTicketQr = (qrPayload) => api.post('/admin/events/tickets/validate', { qrPayload });
export const resetTicketCheckIn = (ticketNumber) => api.post(`/admin/events/tickets/${encodeURIComponent(ticketNumber)}/reset-check-in`);

// This endpoint only accepts the scanner capability, never an admin login.
export const validatePublicTicketQr = (qrPayload, scannerToken) =>
  api.post('/check-in/validate', { qrPayload }, {
    headers: { 'X-Scanner-Token': scannerToken },
  });
export const getMyNotifications = () => api.get('/notifications/me');
export const getAdminNotifications = () => api.get('/admin/events/notifications');
