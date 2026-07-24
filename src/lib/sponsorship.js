import { api } from './api';

export const paySponsorship = (data) => api.post('/sponsorship/pay', data);