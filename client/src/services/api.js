import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/sessions
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // Auth endpoints that don't require tokens
    const publicEndpoints = ['/api/auth/login', '/api/auth/register', '/api/auth/create-admin', '/api/auth/check-admin', '/api/auth/admin-exists'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));

    // Only add token if available and not a public endpoint
    if (token && !isPublicEndpoint) {
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = formattedToken;
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const token = localStorage.getItem('token');
      if (!token) {
        handleAuthFailure();
        return Promise.reject(error);
      }

      try {
        console.log('Attempting to refresh token...');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
          headers: {
            Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`
          }
        });

        const { token: newToken } = response.data;
        if (newToken) {
          console.log('Token refreshed successfully');
          localStorage.setItem('token', newToken);

          // Update the Authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Retry the original request with the new token
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        handleAuthFailure();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper to handle authentication failure
const handleAuthFailure = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  if (window.location.pathname !== '/login' &&
    window.location.pathname !== '/register' &&
    window.location.pathname !== '/') {
    window.location.href = '/login?expired=true';
  }
};

// Auth Services
export const authAPI = {
  // Authentication
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  refreshToken: () => api.post('/api/auth/refresh-token'),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/api/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => api.get(`/api/auth/verify-email/${token}`),
  resendVerification: (email) => api.post('/api/auth/resend-verification', { email }),

  // Profile
  getProfile: () => api.get('/api/auth/me'),
  updateProfile: (userData) => api.put('/api/auth/me', userData),
  updatePassword: (currentPassword, newPassword) =>
    api.post('/api/auth/change-password', { currentPassword, newPassword }),

  // Admin
  createAdmin: (adminData) => api.post('/api/auth/create-admin', adminData),
  checkAdminExists: () => api.get('/api/auth/admin-exists'),
  getAdminInfo: () => api.get('/api/auth/admin-info'),
  checkAdmin: () => api.get('/api/auth/check-admin'),
  changePassword: (passwordData) => api.post('/api/auth/change-password', passwordData),
};

// User Services
export const userAPI = {
  getAllUsers: () => api.get('/api/users'),
  getUserById: (id) => api.get(`/api/users/${id}`),
  updateUser: (id, userData) => api.put(`/api/users/${id}`, userData),
  updateUserRole: (id, roleData) => api.patch(`/api/users/${id}/role`, roleData),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
};

// Vendor Services
export const vendorAPI = {
  // Vendor Management (for admin)
  getAllVendors: () => api.get('/api/vendors'),
  getVendor: (id) => api.get(`/api/vendors/${id}`),
  getVendorById: (id) => api.get(`/api/vendors/${id}`), // Alias for backward compatibility
  createVendor: (vendorData) => api.post('/api/vendors', vendorData),
  updateVendor: (id, vendorData) => api.put(`/api/vendors/${id}`, vendorData),
  deleteVendor: (id) => api.delete(`/api/vendors/${id}`),
  verifyVendor: (id, isVerified) => api.patch(`/api/vendors/${id}/verify`, { isVerified }),
  updateVendorStatus: (id, status) => api.patch(`/api/vendors/${id}/status`, { status }),
  getNearbyVendors: (params) => api.get('/api/vendors/nearby', { params }),

  // Vendor Profile (for vendors)
  createProfile: (profileData) => api.post('/api/vendors/profile', profileData),
  updateProfile: (profileData) => api.put('/api/vendors/profile', profileData),
  getProfile: () => api.get('/api/vendors/profile'),
  getProfileStatus: () => api.get('/api/vendors/status'),

  // Vendor Products
  getVendorProducts: (vendorId, params = {}) =>
    api.get(`/api/vendors/${vendorId}/products`, { params }),

  // Vendor Orders
  getVendorOrders: (params = {}) => api.get('/api/orders/vendor/orders', { params }),
  updateOrderStatus: (orderId, status) =>
    api.put(`/api/orders/${orderId}/status`, { status }),

  // Vendor Dashboard
  getDashboard: () => api.get('/api/vendors/dashboard'),

  // Vendor Settings
  updateSettings: (settings) => api.put('/api/vendors/settings', settings),
  updateDeliverySettings: (settings) => api.put('/api/vendors/delivery-settings', settings),

  // Vendor Reviews
  getVendorReviews: (vendorId, params = {}) =>
    api.get(`/api/vendors/${vendorId}/reviews`, { params })
};

// Product Services
export const productAPI = {
  // Product CRUD
  getProducts: (params = {}) => api.get('/api/products', { params }),
  getProduct: (id) => api.get(`/api/products/${id}`),
  createProduct: (productData) => {
    // Check if productData is FormData
    const isFormData = productData instanceof FormData;

    // If it's FormData, we need to set the correct headers
    const config = isFormData ? {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    } : {};

    return api.post('/api/products', productData, config);
  },
  updateProduct: (id, productData) => {
    // Check if productData is FormData
    const isFormData = productData instanceof FormData;

    // If it's FormData, we need to set the correct headers
    const config = isFormData ? {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    } : {};

    return api.put(`/api/products/${id}`, productData, config);
  },
  deleteProduct: (id) => api.delete(`/api/products/${id}`),

  // Product Categories
  getCategories: () => api.get('/api/products/categories'),
  getProductsByCategory: (category, params = {}) =>
    api.get(`/api/products/category/${category}`, { params }),

  // Product Search
  searchProducts: (query, params = {}) =>
    api.get('/api/products/search', { params: { q: query, ...params } }),

  // Featured & Related
  getFeaturedProducts: () => api.get('/api/products/featured'),
  getRelatedProducts: (productId) => api.get(`/api/products/${productId}/related`),

  // Product Reviews
  getProductReviews: (productId) => api.get(`/api/products/${productId}/reviews`),
  createProductReview: (productId, reviewData) =>
    api.post(`/api/products/${productId}/reviews`, reviewData),
  getAllProducts: (params) => {
    console.log('Calling getAllProducts API with params:', params);
    // Use the new /all route that doesn't have validation issues
    return api.get('/api/products/all', { params })
      .then(response => {
        console.log('getAllProducts API response:', response);
        return response;
      })
      .catch(error => {
        console.error('getAllProducts API error:', error);
        throw error;
      });
  },
  getProductById: (id) => {
    console.log(`Fetching product details for ID: ${id}`);
    return api.get(`/api/products/detail/${id}`)
      .then(response => {
        console.log('Product details response from fallback route:', response);
        return response;
      })
      .catch(error => {
        console.error(`Error fetching product ${id} from fallback route:`, error);
        // Try the regular route as a fallback
        console.log(`Trying regular route for product ID: ${id}`);
        return api.get(`/api/products/${id}`)
          .then(response => {
            console.log('Product details response from regular route:', response);
            return response;
          })
          .catch(secondError => {
            console.error(`Error fetching product ${id} from both routes:`, secondError);
            throw secondError;
          });
      });
  },
  getTrendingProducts: () => api.get('/api/products/trending'),
  searchProducts: (query) => api.get('/api/products', { params: query }),
  getSearchSuggestions: (query) => api.get('/api/products/search/suggestions', { params: { q: query } }),
  getNearbyProducts: (params) => api.get('/api/products/nearby', { params }),
  getProductsByCategory: (category, params) => api.get(`/api/products/category/${category}`, { params }),
  getProductsByVendor: (vendorId, params) => api.get(`/api/products/vendor/${vendorId}`, { params }),
  getVendorProducts: () => api.get('/api/products/vendor/me'),
};

// Order Services
export const orderAPI = {
  // Order CRUD
  createOrder: (orderData) => api.post('/api/orders', orderData),
  getOrders: (params = {}) => api.get('/api/orders', { params }),
  getOrder: (id) => api.get(`/api/orders/${id}`),
  updateOrder: (id, orderData) => api.put(`/api/orders/${id}`, orderData),
  cancelOrder: (id, reason) => api.delete(`/api/orders/${id}`, { data: { reason } }),

  // Order Status
  updateOrderStatus: (id, status) =>
    api.put(`/api/orders/${id}/status`, { status }),

  // User Orders
  getMyOrders: (params = {}) => api.get('/api/orders/my/orders', {
    params: { ...params, _t: Date.now() },
    headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
  }),
  getMyOrder: (id) => api.get(`/api/orders/${id}`),
  getUserOrders: (params = {}) => api.get('/api/orders/my/orders', {
    params: { ...params, _t: Date.now() },
    headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
  }),

  // Vendor Orders
  getVendorOrders: (params = {}) => api.get('/api/orders/vendor/orders', {
    params: { ...params, _t: Date.now() },
    headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
  }),
  updateVendorOrderStatus: (id, status) =>
    api.put(`/api/orders/vendor/orders/${id}/status`, { status }),

  // Admin Orders
  getAllOrders: (params = {}) => api.get('/api/orders', { params }),
};

// Cart Services
export const cartAPI = {
  getCart: () => api.get('/api/cart'),
  addToCart: (itemData) => api.post('/api/cart/add', itemData),
  updateCartItem: (productId, quantity) => api.put(`/api/cart/update/${productId}`, { quantity }),
  removeFromCart: (productId) => api.delete(`/api/cart/remove/${productId}`),
  clearCart: () => api.delete('/api/cart/clear'),
};

// Review Services
export const reviewAPI = {
  // Review CRUD
  createReview: (reviewData) => {
    console.log('API: Creating review with data:', reviewData);
    return api.post('/api/reviews', reviewData);
  },
  getReview: (id) => api.get(`/api/reviews/${id}`),
  updateReview: (id, reviewData) => api.put(`/api/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/api/reviews/${id}`),

  // Product Reviews
  getProductReviews: (productId) => {
    console.log('API: Getting reviews for product:', productId);
    return api.get(`/api/reviews/product/${productId}`);
  },

  // Vendor Reviews
  getVendorReviews: (vendorId) =>
    api.get(`/api/reviews/vendor/${vendorId}`),

  // User Reviews
  getUserReviews: () => {
    console.log('API: Getting user reviews');
    return api.get('/api/reviews/user/me');
  },

  // Admin
  getAllReviews: () => api.get('/api/admin/reviews'),
  moderateReview: (reviewId, moderationData) =>
    api.patch(`/api/reviews/${reviewId}/moderate`, moderationData)
};

// Wishlist Services
export const wishlistAPI = {
  getWishlist: () => api.get('/api/wishlist'),
  addToWishlist: (productId) => api.post('/api/wishlist', { productId }),
  removeFromWishlist: (productId) => api.delete(`/api/wishlist/${productId}`),
  checkWishlistStatus: (productId) => api.get(`/api/wishlist/check/${productId}`),
  clearWishlist: () => api.delete('/api/wishlist/clear')
};

// Upload Services
export const uploadAPI = {
  // Single File Upload
  uploadFile: (file, folder = 'misc') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Multiple Files Upload
  uploadFiles: (files, folder = 'misc') => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('folder', folder);

    return api.post('/api/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete File
  deleteFile: (publicId) => api.delete(`/api/upload/files/${publicId}`),

  // Product Images
  uploadProductImage: (file) => uploadAPI.uploadFile(file, 'products'),
  uploadProductImages: (files) => uploadAPI.uploadFiles(files, 'products'),

  // Vendor Images
  uploadVendorLogo: (file) => uploadAPI.uploadFile(file, 'vendors/logo'),
  uploadVendorBanner: (file) => uploadAPI.uploadFile(file, 'vendors/banner'),

  // User Avatar
  uploadAvatar: (file) => uploadAPI.uploadFile(file, 'users/avatars'),
  uploadSingle: (file, folder = 'expresskart') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    return api.post('/api/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadMultiple: (files, folder = 'expresskart') => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    formData.append('folder', folder);
    return api.post('/api/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadProductImages: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.post('/api/upload/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadVendorImages: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.post('/api/upload/vendor', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteImage: (publicId) => api.delete(`/api/upload/${publicId}`),
  deleteMultipleImages: (publicIds) => api.delete('/api/upload/multiple', { data: { publicIds } }),
  getOptimizedUrl: (publicId, options = {}) => api.get(`/api/upload/optimize/${publicId}`, { params: options })
};

// Admin Services
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/api/admin/dashboard/stats'),

  // Users Management
  getUsers: (params = {}) => api.get('/api/admin/users', { params }),
  getUser: (id) => api.get(`/api/admin/users/${id}`),
  updateUser: (id, userData) => api.put(`/api/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),

  // Vendors Management
  getVendors: (params = {}) => api.get('/api/admin/vendors', { params }),
  getVendor: (id) => api.get(`/api/admin/vendors/${id}`),
  updateVendor: (id, vendorData) => api.put(`/api/admin/vendors/${id}`, vendorData),
  deleteVendor: (id) => api.delete(`/api/admin/vendors/${id}`),
  verifyVendor: (id, isVerified) =>
    api.put(`/api/admin/vendors/${id}/verify`, { isVerified }),

  // Products Management
  getProducts: (params = {}) => api.get('/api/admin/products', { params }),
  getProduct: (id) => api.get(`/api/admin/products/${id}`),
  updateProduct: (id, productData) =>
    api.put(`/api/admin/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/api/admin/products/${id}`),

  // Orders Management
  getOrders: (params = {}) => api.get('/api/admin/orders', { params }),
  getOrder: (id) => api.get(`/api/admin/orders/${id}`),
  updateOrder: (id, orderData) => api.put(`/api/admin/orders/${id}`, orderData),

  // Reviews Management
  getReviews: (params = {}) => api.get('/api/admin/reviews', { params }),
  updateReview: (id, reviewData) => api.put(`/api/admin/reviews/${id}`, reviewData),

  // System Settings
  getSettings: () => api.get('/api/admin/settings'),
  updateSettings: (settings) => api.put('/api/admin/settings', settings),

  // Reports
  generateReport: (type, params = {}) =>
    api.get(`/api/admin/reports/${type}`, { params, responseType: 'blob' }),
  getDashboardData: () => api.get('/api/admin/dashboard'),
  getAllUsers: () => api.get('/api/admin/users'),
  getAllVendors: () => api.get('/api/admin/vendors'),
  getAllProducts: () => api.get('/api/admin/products'),
  getAllOrders: () => api.get('/api/orders'),
  getAllReviews: () => api.get('/api/admin/reviews'),
  updateUserStatus: (id, isActive, reason) => api.patch(`/api/admin/users/${id}/status`, { isActive, reason }),
  updateVendorVerification: (id, isVerified, notes) => api.patch(`/api/admin/vendors/${id}/verify`, { isVerified, notes }),
  updateVendorStatus: (id, status, reason) => api.patch(`/api/admin/vendors/${id}/status`, { status, reason }),
  updateProductStatus: (id, isActive, reason) => api.patch(`/api/admin/products/${id}/status`, { isActive, reason }),
  updateOrderStatus: (id, status, notes) => api.patch(`/api/admin/orders/${id}/status`, { status, notes }),
  moderateReview: (id, status, reason) => api.patch(`/api/admin/reviews/${id}/moderate`, { status, reason }),
};

// Enquiry Services
export const enquiryAPI = {
  createEnquiry: (data) => api.post('/api/enquiries', data),
  getAllEnquiries: () => api.get('/api/enquiries'),
  updateEnquiryStatus: (id, status) => api.put(`/api/enquiries/${id}`, { status }),
  deleteEnquiry: (id) => api.delete(`/api/enquiries/${id}`),
};

export default api;
