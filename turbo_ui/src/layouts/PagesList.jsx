import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '../api';

export default function PagesList() {
  const { domainId } = useParams();
  const [pages, setPages] = useState([]);

  const loadPages = async () => {
    const res = await api.getPages(domainId);
    setPages(res.data);
  };

  useEffect(() => {
    loadPages();
  }, [domainId]);

  const handleBulkGen = async () => {
    await api.bulkGenerate(domainId, 100);
    loadPages();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление страницами</h1>
        <div className="space-x-3">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow-sm" onClick={handleBulkGen}>
            Генерация 100 стр.
          </button>
          <a href={`http://127.0.0.1:8000/api/turbo/${domainId}/feed.xml`} target="_blank" rel="noreferrer" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow-sm">
            RSS Feed
          </a>
        </div>
      </div>
      <div className="bg-white border rounded shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Путь</th>
              <th className="p-4">Обновлено</th>
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pages.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="p-4 text-slate-500">{p.id}</td>
                <td className="p-4 font-mono text-slate-700">{p.url_path}</td>
                <td className="p-4 text-slate-500">{new Date(p.updated_at).toLocaleString()}</td>
                <td className="p-4 text-right space-x-3">
                  <Link to={`/page/${p.id}/edit`} className="text-indigo-600 hover:underline">Редактор</Link>
                  <button className="text-red-500 hover:underline" onClick={async () => { await api.deletePage(p.id); loadPages(); }}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}