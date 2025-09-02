import React, { useCallback, useState } from 'react';
import { UploadIcon } from './Icons';

interface FileUploadProps {
  onFileChange: (file: File) => void;
  fileName: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, fileName }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files.length > 0) {
        onFileChange(e.target.files[0])
    }
  }

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">1. CSVファイルをアップロード</h2>
      <label
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-md cursor-pointer transition-colors duration-200
        ${isDragging ? 'border-blue-500 bg-slate-700/50' : 'border-slate-600 hover:border-slate-500'}`}
      >
        <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
        <div className="text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-slate-500"/>
            <p className="mt-2 text-sm text-slate-400">
                <span className="font-semibold text-blue-500">クリックしてアップロード</span>またはドラッグ＆ドロップ
            </p>
            <p className="text-xs text-slate-500">CSVファイルのみ</p>
            {fileName && <p className="text-sm mt-2 text-sky-400 font-medium">{fileName}</p>}
        </div>
      </label>
    </div>
  );
};

export default FileUpload;