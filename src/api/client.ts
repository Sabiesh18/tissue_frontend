const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('tissue_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  login: async (credentials: { username: string; password: string }) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },
  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: getAuthHeaders() });
    return res.json();
  },
  logout: async () => {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Dashboard
  getDashboardMetrics: async () => {
    const res = await fetch(`${API_BASE}/dashboard/metrics`, { headers: getAuthHeaders() });
    return res.json();
  },

  // Assets
  getAssets: async (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/assets?${qs}`, { headers: getAuthHeaders() });
    return res.json();
  },
  saveAsset: async (data: any) => {
    const res = await fetch(`${API_BASE}/assets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  deleteAsset: async (id: string) => {
    const res = await fetch(`${API_BASE}/assets/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Vendors
  getVendors: async (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/vendors?${qs}`, { headers: getAuthHeaders() });
    return res.json();
  },
  saveVendor: async (data: any) => {
    const res = await fetch(`${API_BASE}/vendors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  deleteVendor: async (id: string) => {
    const res = await fetch(`${API_BASE}/vendors/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Customers
  getCustomers: async (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/customers?${qs}`, { headers: getAuthHeaders() });
    return res.json();
  },
  saveCustomer: async (data: any) => {
    const res = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Production
  getPlans: async (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/production/plans?${qs}`, { headers: getAuthHeaders() });
    return res.json();
  },
  savePlan: async (data: any) => {
    const res = await fetch(`${API_BASE}/production/plans`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getBatches: async (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/production/batches?${qs}`, { headers: getAuthHeaders() });
    return res.json();
  },
  saveBatch: async (data: any) => {
    const res = await fetch(`${API_BASE}/production/batches`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Products & Inventory
  getProducts: async (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/products?${qs}`, { headers: getAuthHeaders() });
    return res.json();
  },
  saveProduct: async (data: any) => {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getInventory: async (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/inventory?${qs}`, { headers: getAuthHeaders() });
    return res.json();
  },
  adjustStock: async (data: any) => {
    const res = await fetch(`${API_BASE}/inventory/adjust`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getMovements: async (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/inventory/movements?${qs}`, { headers: getAuthHeaders() });
    return res.json();
  },

  // Orders
  getPurchaseOrders: async (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/orders/purchase?${qs}`, { headers: getAuthHeaders() });
    return res.json();
  },
  savePurchaseOrder: async (data: any) => {
    const res = await fetch(`${API_BASE}/orders/purchase`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getSalesOrders: async (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/orders/sales?${qs}`, { headers: getAuthHeaders() });
    return res.json();
  },
  saveSalesOrder: async (data: any) => {
    const res = await fetch(`${API_BASE}/orders/sales`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Settings & Admin
  getUsers: async (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/users?${qs}`, { headers: getAuthHeaders() });
    return res.json();
  },
  saveUser: async (data: any) => {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`, { headers: getAuthHeaders() });
    return res.json();
  },
  saveSetting: async (data: any) => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getLogs: async (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/logs?${qs}`, { headers: getAuthHeaders() });
    return res.json();
  },
};
