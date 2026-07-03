import { api } from './api';

// ─── Read ─────────────────────────────────────────────────────────

/** Lightweight — username + avatar. Used in navbar. */
export const getUsername = () => api.get('/profile/me');

/**
 * Full profile with every related table + profileStep + nextStep.
 * Call this on the profile-completion page to know where to resume.
 */
export const getFullProfile = () => api.get('/profile');

// ─── Step 1: Basic Info ───────────────────────────────────────────
/**
 * Accepts FormData (multipart/form-data) because of the optional image upload.
 * Build FormData on the calling side; this function just sends it.
 */
export const saveBasicInfo = (formData) =>
  api.post('/profile/basic', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ─── Step 2: Medical Education ────────────────────────────────────
export const saveMedicalEducation = (data) =>
  api.post('/profile/medical', data);

// ─── Step 3: Home Address ─────────────────────────────────────────
/**
 * Body shape: { home: { street, city, state, zipCode, country, homePhone? } }
 */
export const saveAddress = (data) =>
  api.post('/profile/address', data);

// ─── Step 4: Office Info (optional) ──────────────────────────────
export const saveOfficeInfo = (data) =>
  api.post('/profile/office', data);

/** Call when user clicks "Skip" on step 4. */
export const skipOfficeInfo = () =>
  api.post('/profile/office/skip');

// ─── Step 5: Membership ───────────────────────────────────────────
export const selectMembership = (data) =>
  api.post('/profile/membership', data);

export const createSquareCheckout = () =>
  api.post('/profile/membership/square/create-checkout');

export const verifySquareMembershipPayment = () =>
  api.post('/profile/membership/square/verify');

export const payMembershipWithSquareToken = (data) =>
  api.post('/profile/membership/square/pay', data);
