import React from 'react';

interface BulkDeleteProps {
  onApply: () => void;
  text: string;
  onTextChange: (text: string) => void;
  isProcessing: boolean;
}

const BulkDelete: React.FC<BulkDeleteProps> = ({ onApply, text, onTextChange, isProcessing }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg h-full flex flex-col">
      <h2 className="text-2xl font-semibold text-white mb-2">全キューから一括削除 (オプション)</h2>
      <p className="text-sm text-slate-400 mb-4 flex-grow">
        表示されている全てのキューから、内線番号を一括で削除対象にします。番号はカンマ、スペース、改行などで区切って入力してください。
      </p>
      <textarea
        className="block w-full rounded-md bg-slate-900/70 border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-slate-200 placeholder-slate-500 min-h-[70px]"
        placeholder="例: 102 305"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        disabled={isProcessing}
        aria-label="全キュー一括削除用テキストエリア"
      />
      <button
        onClick={onApply}
        disabled={isProcessing || !text.trim()}
        className="mt-4 w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-900 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200"
      >
        削除対象に反映
      </button>
    </div>
  );
};

export default BulkDelete;
