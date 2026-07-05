const API_BASE = 'http://localhost:3005';

async function request(path, options = {}) {
  const { method = 'GET', body, headers = {} } = options;
  const config = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  };
  if (body) config.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  register: (data) => request('/api/register', { method: 'POST', body: data }),
  login: (data) => request('/api/login', { method: 'POST', body: data }),
  me: () => request('/api/me'),
  scan: (data) => request('/api/scan', { method: 'POST', body: data }),
  entry: (data) => request('/api/entry', { method: 'POST', body: data }),
  comment: (data) => request('/api/comment', { method: 'POST', body: data }),
  reveal: (data) => request('/api/reveal', { method: 'POST', body: data }),
  report: (data) => request('/api/report', { method: 'POST', body: data }),
  consent: () => request('/api/consent'),
  withdrawConsent: () => request('/api/consent/withdraw', { method: 'POST' }),
  partnerStatus: () => request('/api/partner-status'),
  switchPartner: () => request('/api/switch-partner', { method: 'POST' }),
  forgotPassword: (email) => request('/api/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (data) => request('/api/reset-password', { method: 'POST', body: data }),
  myData: () => request('/api/my-data'),
  deleteAccount: (password) => request('/api/account', { method: 'DELETE', body: { password } }),
  payHistory: () => request('/api/pay/history'),
};
