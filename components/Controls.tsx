import React from 'react';
import { GenerateIcon, SpinnerIcon, ResetIcon } from './Icons';

interface ControlsProps {
  onGenerateRequest: () => void;
  onReset: () => void;
  isProcessing: boolean;
  hasChanges: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onGenerateRequest, onReset, isProcessing, hasChanges }) => {
  const isButtonDisabled = !hasChanges || isProcessing;
    
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-white">3. ファイルを生成</h2>
        <p className="text-sm text-slate-400 mt-1">
          下のボタンを押して変更内容を確認し、更新されたCSVファイルをダウンロードします。
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <button
            onClick={onGenerateRequest}
            disabled={isButtonDisabled}
            className="w-full sm:flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isProcessing ? (
              <>
                  <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  処理中...
              </>
            ) : (
              <>
                  <GenerateIcon className="-ml-1 mr-2 h-5 w-5" />
                  変更を確認して生成
              </>
            )}
          </button>
          <button
            onClick={onReset}
            disabled={isProcessing}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-slate-600 text-base font-medium rounded-md shadow-sm text-slate-200 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 disabled:opacity-50 transition-all duration-200"
          >
            <ResetIcon className="-ml-1 mr-2 h-5 w-5" />
            リセット
          </button>
        </div>
        {!hasChanges && !isProcessing && <p className="text-xs text-yellow-400/80 mt-2 text-center">追加または削除する内線番号がありません。</p>}
      </div>
    </div>
  );
};

export default Controls;