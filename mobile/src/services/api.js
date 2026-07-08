import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../config';

const CACHE_PREFIX = 'api_cache_';
const CACHE_TTL = 5 * 60 * 1000;

async function request(path, options = {}) {
  const { method = 'GET', body, headers = {}, skipCache } = options;
  const cacheKey = CACHE_PREFIX + path;
  const config = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  };
  if (body) config.body = JSON.stringify(body);

  if (method === 'GET' && !skipCache) {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) return data;
      } catch {}
    }
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, config);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');

    if (method === 'GET') {
      await AsyncStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    }
    return data;
  } catch (e) {
    if (method === 'GET') {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const { data } = JSON.parse(cached);
        return data;
      }
    }
    throw e;
  }
}

function clearCache() {
  AsyncStorage.getAllKeys().then(keys => {
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    if (cacheKeys.length) AsyncStorage.multiRemove(cacheKeys);
  });
}

export const api = {
  register: (data) => request('/api/register', { method: 'POST', body: data, skipCache: true }),
  login: (data) => request('/api/login', { method: 'POST', body: data, skipCache: true }),
  me: () => request('/api/me'),
  scan: (data) => { clearCache(); return request('/api/scan', { method: 'POST', body: data, skipCache: true }); },
  entry: (data) => { clearCache(); return request('/api/entry', { method: 'POST', body: data, skipCache: true }); },
  comment: (data) => { clearCache(); return request('/api/comment', { method: 'POST', body: data, skipCache: true }); },
  reveal: (data) => { clearCache(); return request('/api/reveal', { method: 'POST', body: data, skipCache: true }); },
  report: (data) => request('/api/report', { method: 'POST', body: data, skipCache: true }),
  consent: () => request('/api/consent'),
  withdrawConsent: () => { clearCache(); return request('/api/consent/withdraw', { method: 'POST', skipCache: true }); },
  partnerStatus: () => request('/api/partner-status'),
  switchPartner: () => { clearCache(); return request('/api/switch-partner', { method: 'POST', skipCache: true }); },
  forgotPassword: (email) => request('/api/forgot-password', { method: 'POST', body: { email }, skipCache: true }),
  resetPassword: (data) => request('/api/reset-password', { method: 'POST', body: data, skipCache: true }),
  myData: () => request('/api/my-data', { skipCache: true }),
  deleteAccount: (password) => request('/api/account', { method: 'DELETE', body: { password }, skipCache: true }),
  payHistory: () => request('/api/pay/history'),
  notifications: () => request('/api/notifications'),
  markNotifRead: (id) => { clearCache(); return request(`/api/notifications/read/${id}`, { method: 'POST', skipCache: true }); },
  markAllNotifRead: () => { clearCache(); return request('/api/notifications/read-all', { method: 'POST', skipCache: true }); },
  notifPreferences: () => request('/api/notifications/preferences'),
  updateNotifPreferences: (prefs) => { clearCache(); return request('/api/notifications/preferences', { method: 'POST', body: { preferences: prefs }, skipCache: true }); },
  subscribePush: (subscription) => request('/api/push/subscribe', { method: 'POST', body: { subscription }, skipCache: true }),
  unsubscribePush: () => request('/api/push/unsubscribe', { method: 'POST', skipCache: true }),
  createRazorpayOrder: (product) => request('/api/pay/razorpay/create', { method: 'POST', body: { product }, skipCache: true }),
  verifyRazorpayPayment: (data) => request('/api/pay/razorpay/verify', { method: 'POST', body: data, skipCache: true }),
  createStripeSession: (product) => request('/api/pay/stripe/create', { method: 'POST', body: { product }, skipCache: true }),
};
