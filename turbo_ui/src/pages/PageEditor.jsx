import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown, Save } from 'lucide-react';
import * as api from '../api';

export default function PageEditor() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    loadPage();
  }, [pageId]);

  const loadPage = async () => {
    const res = await api.getPage(pageId);
    setPage(res.data);
    setBlocks(res.data.content_data?.blocks || []);
  };

  const handleSave = async () => {
    await api.updatePage(pageId, { content_data: { blocks } });
    navigate(`/domain/${page.domain_id}/pages`);
  };

  const addBlock = (type) => {
    const newBlock = { type, data: {} };
    if (type === 'header') newBlock.data = { text: 'Новый заголовок', level: 2 };
    if (type === 'paragraph') newBlock.data = { text: 'Текст абзаца...' };
    if (type === 'button') newBlock.data = { text: 'Кнопка', url: 'https://', color: '#000000' };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (index, field, value) => {
    const newBlocks = [...blocks];
    newBlocks[index].data[field] = value;
    setBlocks(newBlocks);
  };

  const moveBlock = (index, direction) => {
    if (index + direction < 0 || index + direction >= blocks.length) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + direction];
    newBlocks[index + direction] = temp;
    setBlocks(newBlocks);
  };

  const removeBlock = (index) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  if (!page) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-lg text-slate-800">Редактор страницы</h1>
            <p className="text-xs text-slate-500 font-mono">{page.url_path}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow-sm transition-colors"
        >
          <Save size={16} className="mr-2" /> Сохранить
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 flex justify-center">
        <div className="w-full max-w-3xl space-y-4">
          {blocks.map((block, index) => (
            <div key={index} className="bg-white border rounded shadow-sm group">
              <div className="flex justify-between items-center bg-slate-50 px-3 py-2 border-b">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {block.type}
                </span>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveBlock(index, -1)} className="p-1 hover:bg-slate-200 rounded text-slate-600"><ArrowUp size={14} /></button>
                  <button onClick={() => moveBlock(index, 1)} className="p-1 hover:bg-slate-200 rounded text-slate-600"><ArrowDown size={14} /></button>
                  <button onClick={() => removeBlock(index)} className="p-1 hover:bg-red-100 hover:text-red-600 rounded text-slate-600"><Trash2 size={14} /></button>
                </div>
              </div>

              <div className="p-4">
                {block.type === 'header' && (
                  <div className="flex space-x-2">
                    <select
                      value={block.data.level || 2}
                      onChange={(e) => updateBlock(index, 'level', parseInt(e.target.value))}
                      className="border p-2 rounded"
                    >
                      <option value={1}>H1</option>
                      <option value={2}>H2</option>
                      <option value={3}>H3</option>
                    </select>
                    <input
                      className="border p-2 rounded flex-1 font-bold"
                      value={block.data.text || ''}
                      onChange={(e) => updateBlock(index, 'text', e.target.value)}
                      placeholder="Заголовок"
                    />
                  </div>
                )}

                {block.type === 'paragraph' && (
                  <textarea
                    className="border p-2 rounded w-full min-h-[100px]"
                    value={block.data.text || ''}
                    onChange={(e) => updateBlock(index, 'text', e.target.value)}
                    placeholder="Текст абзаца"
                  />
                )}

                {block.type === 'button' && (
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      className="border p-2 rounded"
                      value={block.data.text || ''}
                      onChange={(e) => updateBlock(index, 'text', e.target.value)}
                      placeholder="Текст кнопки"
                    />
                    <input
                      className="border p-2 rounded"
                      value={block.data.url || ''}
                      onChange={(e) => updateBlock(index, 'url', e.target.value)}
                      placeholder="URL (https://)"
                    />
                    <input
                      type="color"
                      className="border p-1 rounded h-10 w-full"
                      value={block.data.color || '#000000'}
                      onChange={(e) => updateBlock(index, 'color', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="border-2 border-dashed border-slate-300 rounded p-6 flex justify-center space-x-4">
            <button onClick={() => addBlock('header')} className="flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600">
              <Plus size={16} className="mr-1" /> Заголовок
            </button>
            <button onClick={() => addBlock('paragraph')} className="flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600">
              <Plus size={16} className="mr-1" /> Текст
            </button>
            <button onClick={() => addBlock('button')} className="flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600">
              <Plus size={16} className="mr-1" /> Кнопка
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}