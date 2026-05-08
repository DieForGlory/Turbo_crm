import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export const getDomains = () => api.get('/domains');
export const createDomain = (name) => api.post('/domains', { name });
export const getPages = (domainId) => api.get(`/pages/domain/${domainId}`);
export const getPage = (pageId) => api.get(`/pages/${pageId}`);
export const createPage = (domainId) => api.post('/pages', {
    domain_id: domainId,
    url_path: `/new-page-${Date.now()}.html`,
    content_data: { blocks: [] },
    is_active: true
});
export const updatePage = (pageId, data) => api.put(`/pages/${pageId}`, data);
export const bulkGenerate = (domainId, count) => api.post(`/pages/bulk-generate/${domainId}?count=${count}`);
export const bulkGenerateFromDataset = (domainId, payload) => api.post(`/pages/bulk-from-dataset/${domainId}`, payload);
export const deletePage = (pageId) => api.delete(`/pages/${pageId}`);