import { api } from './api';

export const submitCmeEntry = (data) => api.post('/cme', data);
export const getCmeEntries = () => api.get('/admin/cme');
