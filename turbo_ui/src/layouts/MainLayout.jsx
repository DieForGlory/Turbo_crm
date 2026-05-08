import React, { useState, useEffect } from 'react';
import { Outlet, Link, useParams, useNavigate } from 'react-router-dom';
import * as api from '../api';
import { LayoutDashboard, FileText, Settings, Activity } from 'lucide-react';

export default function MainLayout() {
  const [domains, setDomains] = useState([]);
  const [newDomainName, setNewDomainName] = useState('');
  const { domainId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    api.getDomains().then(res => setDomains(res.data));
  }, []);

  const handleCreateDomain = async () => {
    if (!newDomainName) return;
    const res = await api.createDomain(newDomainName);
    setDomains([...domains, res.data]);
    setNewDomainName('');
    navigate(`/domain/${res.data.id}/pages`);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      <div className="w-64 bg-white border-r shadow-sm flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-indigo-600 tracking-tight">Turbo CRM</h2>
        </div>
        <div className="p-4">
          <div className="flex">
            <input
              className="border p-2 flex-1 rounded-l text-sm outline-none focus:border-indigo-500"
              value={newDomainName}
              onChange={(e) => setNewDomainName(e.target.value)}
              placeholder="Новый домен"
            />
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-r transition-colors"
              onClick={handleCreateDomain}
            >+</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {domains.map(d => {
            const isActive = parseInt(domainId) === d.id;
            return (
              <div key={d.id} className={`rounded overflow-hidden border transition-colors ${isActive ? 'border-indigo-200 bg-indigo-50' : 'border-transparent hover:bg-slate-100'}`}>
                <div
                  className="p-3 font-medium cursor-pointer"
                  onClick={() => navigate(`/domain/${d.id}/pages`)}
                >
                  {d.name}
                </div>
                {isActive && (
                  <div className="px-3 pb-3 flex flex-col space-y-1 text-sm">
                    <Link to={`/domain/${d.id}/pages`} className="flex items-center text-slate-600 hover:text-indigo-600 p-1 rounded hover:bg-white">
                      <FileText size={16} className="mr-2" /> Страницы
                    </Link>
                    <Link to={`/domain/${d.id}/analytics`} className="flex items-center text-slate-600 hover:text-indigo-600 p-1 rounded hover:bg-white">
                      <Activity size={16} className="mr-2" /> Аналитика
                    </Link>
                    <Link to={`/domain/${d.id}/settings`} className="flex items-center text-slate-600 hover:text-indigo-600 p-1 rounded hover:bg-white">
                      <Settings size={16} className="mr-2" /> Настройки
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}