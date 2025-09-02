import React from 'react';
import { GenerateIcon, SpinnerIcon } from './Icons';

export interface ChangeSummary {
  queueName: string;
  additions: string[];
  deletions: string[];
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  changes: ChangeSummary[];
  isProcessing: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, changes, isProcessing }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 id="modal-title" className="text-xl font-semibold text-white">変更内容の確認</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="閉じる">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="p-6 overflow-y-auto" aria-labelledby="modal-title">
          <p className="text-slate-300 mb-4">以下の変更でCSVファイルを生成します。よろしいですか？</p>
          <ul className="space-y-3">
            {changes.map((change, index) => (
              <li key={index} className="bg-slate-900/50 p-3 rounded-md">
                <h3 className="font-semibold text-blue-400">{change.queueName}</h3>
                {change.additions.length > 0 && (
                  <div className="mt-1 text-sm text-green-300">
                    <span className="font-medium">追加: </span>
                    <span>{change.additions.join(', ')}</span>
                  </div>
                )}
                {change.deletions.length > 0 && (
                  <div className="mt-1 text-sm text-red-300">
                    <span className="font-medium">削除: </span>
                    <span>{change.deletions.join(', ')}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end gap-3 p-4 mt-auto bg-slate-800/50 border-t border-slate-700 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <SpinnerIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                処理中...
              </>
            ) : (
              <>
                <GenerateIcon className="-ml-1 mr-2 h-4 w-4" />
                生成してダウンロード
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;