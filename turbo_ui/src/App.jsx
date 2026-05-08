import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PagesList from './pages/PagesList';
import PageEditor from './pages/PageEditor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<div className="h-full flex items-center justify-center text-slate-400">Выберите домен</div>} />
          <Route path="domain/:domainId/pages" element={<PagesList />} />
          <Route path="domain/:domainId/analytics" element={<div className="p-8">Аналитика в разработке</div>} />
          <Route path="domain/:domainId/settings" element={<div className="p-8">Настройки в разработке</div>} />
        </Route>
        <Route path="/page/:pageId/edit" element={<PageEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;