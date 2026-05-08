import React, { useState, useEffect } from 'react';
import * as api from './api';

function App() {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [pages, setPages] = useState([]);
  const [newDomainName, setNewDomainName] = useState('');

  useEffect(() => {
    loadDomains();
  }, []);

  useEffect(() => {
    if (selectedDomain) loadPages(selectedDomain.id);
  }, [selectedDomain]);

  const loadDomains = async () => {
    const res = await api.getDomains();
    setDomains(res.data);
  };

  const loadPages = async (id) => {
    const res = await api.getPages(id);
    setPages(res.data);
  };

  const handleCreateDomain = async () => {
    if (!newDomainName) return;
    await api.createDomain(newDomainName);
    setNewDomainName('');
    loadDomains();
  };

  const handleBulkGen = async () => {
    if (!selectedDomain) return;
    await api.bulkGenerate(selectedDomain.id, 100);
    loadPages(selectedDomain.id);
  };

  const handleDeletePage = async (pageId) => {
    await api.deletePage(pageId);
    loadPages(selectedDomain.id);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="w-80 bg-white border-r shadow-sm p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Домены</h2>
        <div className="flex mb-4">
          <input
            className="border p-2 flex-1 rounded-l text-sm"
            value={newDomainName}
            onChange={(e) => setNewDomainName(e.target.value)}
            placeholder="example.com"
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r"
            onClick={handleCreateDomain}
          >+</button>
        </div>
        <ul className="overflow-y-auto flex-1">
          {domains.map(d => (
            <li
              key={d.id}
              className={`p-3 mb-1 cursor-pointer rounded text-sm transition-colors ${selectedDomain?.id === d.id ? 'bg-blue-100 text-blue-900 font-medium' : 'hover:bg-slate-100 text-slate-700'}`}
              onClick={() => setSelectedDomain(d)}
            >
              {d.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        {selectedDomain ? (
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-slate-800">Страницы: {selectedDomain.name}</h1>
              <div className="space-x-3">
                <button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow-sm transition-colors"
                  onClick={handleBulkGen}
                >
                  Сгенерировать 100 страниц
                </button>
                <a
                  href={`http://127.0.0.1:8000/api/turbo/${selectedDomain.id}/feed.xml`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow-sm transition-colors"
                >
                  RSS Feed
                </a>
              </div>
            </div>

            <div className="bg-white border rounded shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-4 font-medium text-slate-600">ID</th>
                    <th className="p-4 font-medium text-slate-600">Путь</th>
                    <th className="p-4 font-medium text-slate-600">Дата обновления</th>
                    <th className="p-4 font-medium text-slate-600 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pages.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-4 text-slate-500">{p.id}</td>
                      <td className="p-4 font-mono text-slate-700">{p.url_path}</td>
                      <td className="p-4 text-slate-500">{new Date(p.updated_at).toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <button
                          className="text-red-500 hover:text-red-700 hover:underline"
                          onClick={() => handleDeletePage(p.id)}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            Выберите домен в боковой панели
          </div>
        )}
      </div>
    </div>
  );
}

export default App;