import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import * as api from '../api';

export default function PagesList() {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const fileInputRef = useRef(null);
  const [activeTemplateId, setActiveTemplateId] = useState(null);

  const loadPages = async () => {
    const res = await api.getPages(domainId);
    setPages(res.data);
  };

  useEffect(() => {
    loadPages();
  }, [domainId]);

  const handleCreatePage = async () => {
    const res = await api.createPage(domainId);
    navigate(`/page/${res.data.id}/edit`);
  };

  const triggerFileUpload = (pageId) => {
    setActiveTemplateId(pageId);
    fileInputRef.current.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      if (data.length > 0) {
        await api.bulkGenerateFromDataset(domainId, {
          base_page_id: activeTemplateId,
          dataset: data
        });
        loadPages();
      }
      e.target.value = null; // reset input
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление страницами</h1>
        <div className="space-x-3">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow-sm" onClick={handleCreatePage}>
            Создать страницу
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
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pages.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="p-4 text-slate-500">{p.id}</td>
                <td className="p-4 font-mono text-slate-700">{p.url_path}</td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => triggerFileUpload(p.id)} className="text-emerald-600 font-medium hover:underline">
                    Загрузить Excel
                  </button>
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