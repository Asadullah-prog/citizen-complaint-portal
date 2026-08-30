// Normalize API Base URL to handle missing https:// or missing /api suffix gracefully
const getNormalizedApiBase = () => {
  let raw = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim();
  
  // If no protocol specified (e.g. "citizen-complaint-portal-production.up.railway.app")
  if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
    raw = `https://${raw}`;
  }
  
  // Remove trailing slashes
  raw = raw.replace(/\/+$/, '');
  
  // Ensure /api suffix
  if (!raw.endsWith('/api')) {
    raw = `${raw}/api`;
  }
  
  return raw;
};

const API_BASE = getNormalizedApiBase();

/**
 * Universal fetch wrapper with authorization header injection
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage = (data && data.message) || (typeof data === 'string' ? data : 'An error occurred with the request.');
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signup: (name, email, password, role) => request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password, role }) }),
  getMe: () => request('/auth/me'),

  // Complaints
  getComplaints: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });
    const queryString = searchParams.toString();
    return request(`/complaints${queryString ? `?${queryString}` : ''}`);
  },

  getMyComplaints: () => request('/complaints/mine'),

  getComplaintById: (id) => request(`/complaints/${id}`),

  createComplaint: (data) => request('/complaints', { method: 'POST', body: JSON.stringify(data) }),

  checkDuplicate: (category, area) => {
    const searchParams = new URLSearchParams({ category, area });
    return request(`/complaints/check-duplicate?${searchParams.toString()}`);
  },

  upvoteComplaint: (id) => request(`/complaints/${id}/upvote`, { method: 'PATCH' }),

  updateStatus: (id, status, officerRemark) =>
    request(`/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, officerRemark }),
    }),

  submitFeedback: (id, rating, feedbackComment) =>
    request(`/complaints/${id}/feedback`, {
      method: 'PATCH',
      body: JSON.stringify({ rating, feedbackComment }),
    }),

  // CSV Export via secure authenticated Blob request
  exportCSVBlob: async (params = {}) => {
    const token = localStorage.getItem('token');
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });
    const queryString = searchParams.toString();
    const response = await fetch(`${API_BASE}/complaints/export${queryString ? `?${queryString}` : ''}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to export CSV file.');
    }
    return response.blob();
  },

  // AI Briefing
  getOfficerBriefing: () => request('/ai/officer-summary', { method: 'POST' }),
};

export default api;
