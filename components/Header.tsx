import React from 'react';
import { CsvIcon, QuestionMarkCircleIcon } from './Icons';

interface HeaderProps {
    onShowManual: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowManual }) => {
  return (
    <header className="text-center mb-6 relative">
        <div className="flex items-center justify-center gap-4">
            <CsvIcon className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
                コールキュー追加CSV生成マシン
            </h1>
        </div>
        <p className="mt-3 text-lg text-slate-400 max-w-2xl mx-auto">
            コールキューに内線番号を簡単に追加し、修正済みのCSVファイルをダウンロードします。
        </p>
        <button 
            onClick={onShowManual}
            className="absolute top-0 right-0 inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-700/70 transition-colors"
            aria-label="使い方マニュアルを開く"
        >
            <QuestionMarkCircleIcon className="w-5 h-5" />
            <span className="hidden sm:inline">使い方</span>
        </button>
    </header>
  );
};

export default Header;
