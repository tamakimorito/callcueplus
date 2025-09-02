import React, { useState } from 'react';

interface BulkOperationsProps {
  onApplyAdd: () => void;
  onApplyDelete: () => void;
  text: string;
  onTextChange: (text: string) => void;
  isProcessing: boolean;
}

const BulkOperations: React.FC<BulkOperationsProps> = ({ onApplyAdd, onApplyDelete, text, onTextChange, isProcessing }) => {
  const [mode, setMode] = useState<'add' | 'delete'>('add');

  const isAddMode = mode === 'add';

  const handleApply = () => {
    if (isAddMode) {
      onApplyAdd();
    } else {
      onApplyDelete();
    }
  };
  
  const addTitle = "全キューに一括追加 (オプション)";
  const addDescription = "表示されている全てのキューに、内線番号を一括で追加します。番号はカンマ、スペース、改行などで区切って入力してください。";
  
  const deleteTitle = "全キューから一括削除 (オプション)";
  const deleteDescription = "注意: 全てのキューから、指定した内線番号を一括で削除対象にします。この操作はテーブル上の表示を変更するだけで、すぐにファイルが変更されるわけではありません。";


  return (
    <div className={`bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg flex flex-col transition-colors duration-300 ${!isAddMode ? 'border-red-700/50' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">{isAddMode ? addTitle : deleteTitle}</h2>
        </div>
        <div className="flex bg-slate-700/80 rounded-lg p-1">
          <button
            onClick={() => setMode('add')}
            disabled={isProcessing}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${isAddMode ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-600/50'}`}
          >
            追加
          </button>
          <button
            onClick={() => setMode('delete')}
            disabled={isProcessing}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${!isAddMode ? 'bg-red-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-600/50'}`}
          >
            削除
          </button>
        </div>
      </div>
      
      <p className={`text-sm mb-4 flex-grow ${isAddMode ? 'text-slate-400' : 'text-yellow-300'}`}>
        {isAddMode ? addDescription : deleteDescription}
      </p>
      
      <textarea
        className="block w-full rounded-md bg-slate-900/70 border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-slate-200 placeholder-slate-500 min-h-[70px]"
        placeholder={isAddMode ? '例: 605 919 920' : '例: 102 305'}
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        disabled={isProcessing}
        aria-label="一括操作用テキストエリア"
      />
      <button
        onClick={handleApply}
        disabled={isProcessing || !text.trim()}
        className={`mt-4 w-full sm:w-auto self-start inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200
          ${isAddMode
            ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
          }`
        }
      >
        {isAddMode ? '入力欄に反映' : '削除対象に反映'}
      </button>
    </div>
  );
};

export default BulkOperations;