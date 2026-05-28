const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Returns header structure, injecting the JWT authorization bearer token if active.
 */
const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Public Endpoint: Submit the contact form
  submitContactForm: async (submissionData) => {
    // Maps react keys back to backend schema keys:
    // fName -> name, fEmail -> email, fWA -> phone, fDesc -> description
    const payload = {
      name: submissionData.fName,
      email: submissionData.fEmail,
      phone: submissionData.fWA,
      description: submissionData.fDesc
    };

    const response = await fetch(`${API_BASE_URL}/api/submissions/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw { status: response.status, ...data };
    }
    return data;
  },

  // Authentication Endpoint: Get JWT access token
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw { status: response.status, ...data };
    }
    return data;
  },

  // Admin Endpoint: Fetch all contact submissions
  fetchSubmissions: async (search = '', status = 'all') => {
    let url = `${API_BASE_URL}/api/submissions/?status=${status}`;
    if (search.trim()) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      throw { status: 401, message: 'Session expired. Please log in again.' };
    }

    const data = await response.json();
    if (!response.ok) {
      throw { status: response.status, ...data };
    }
    return data;
  },

  // Admin Endpoint: Update an entry (status/fields)
  updateSubmission: async (id, submissionData) => {
    // submissionData: { name, email, phone/whatsapp, description, status }
    const payload = {
      name: submissionData.name,
      email: submissionData.email,
      phone: submissionData.whatsapp || submissionData.phone,
      description: submissionData.description,
      status: submissionData.status
    };

    const response = await fetch(`${API_BASE_URL}/api/submissions/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      throw { status: 401, message: 'Session expired. Please log in again.' };
    }

    const data = await response.json();
    if (!response.ok) {
      throw { status: response.status, ...data };
    }
    return data;
  },

  // Admin Endpoint: Permanently delete an entry
  deleteSubmission: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/submissions/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      throw { status: 401, message: 'Session expired. Please log in again.' };
    }

    const data = await response.json();
    if (!response.ok) {
      throw { status: response.status, ...data };
    }
    return data;
  }
};
