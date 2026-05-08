import axios from 'axios';

const api = axios.create({
    // Относительный путь для работы через Vite Proxy
    baseURL: '/api',
});

// Добавлен слеш в конце, чтобы соответствовать роутам FastAPI и избежать редиректов
export const getDomains = () => api.get('/domains/');
export const createDomain = (name) => api.post('/domains/', { name });
export const getPages = (domainId) => api.get(`/pages/domain/${domainId}`);
export const bulkGenerate = (domainId, count) => api.post(`/pages/bulk-generate/${domainId}?count=${count}`);
export const deletePage = (pageId) => api.delete(`/pages/${pageId}`);