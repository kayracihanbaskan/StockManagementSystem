import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Category API
export const getCategories = () => api.get('/categories');
export const getCategory = (id) => api.get(`/categories/${id}`);
export const createCategory = (category) => api.post('/categories', category);
export const updateCategory = (id, category) => api.put(`/categories/${id}`, category);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Product API
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const getProductsByCategory = (categoryId) => api.get(`/products/category/${categoryId}`);
export const createProduct = (product) => api.post('/products', product);
export const updateProduct = (id, product) => api.put(`/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Inventory API
export const getInventory = () => api.get('/inventory');
export const getInventoryItem = (id) => api.get(`/inventory/${id}`);
export const getInventoryByProduct = (productId) => api.get(`/inventory/product/${productId}`);
export const getLowStockItems = () => api.get('/inventory/low-stock');
export const createInventory = (inventory) => api.post('/inventory', inventory);
export const updateInventory = (id, inventory) => api.put(`/inventory/${id}`, inventory);
export const updateStock = (productId, quantity) => api.put(`/inventory/product/${productId}`, { quantity });
export const addStock = (productId, quantity) => api.put(`/inventory/product/${productId}/add`, { quantity });
export const removeStock = (productId, quantity) => api.put(`/inventory/product/${productId}/remove`, { quantity });
export const deleteInventory = (id) => api.delete(`/inventory/${id}`);

export default api;
