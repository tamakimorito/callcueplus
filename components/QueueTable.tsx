import React from 'react';
import { CsvRow } from '../types';
import { TrashIcon } from './Icons';

interface QueueTableProps {
  data: CsvRow[];
  extensionsToAdd: { [key: number]: string };
  membersToDelete: { [key: number]: string[] };
  onExtensionChange: (index: number, value: string) => void;
  onMemberDeleteToggle: (index: number, member: string) => void;
  nameColumn: string;
  memberColumn: string;
}

const QueueTable: React.FC<QueueTableProps> = ({ data, extensionsToAdd, membersToDelete, onExtensionChange, onMemberDeleteToggle, nameColumn, memberColumn }) => {

  const MemberBadge: React.FC<{ member: string; index: number }> = ({ member, index }) => {
    const isMarkedForDeletion = (membersToDelete[index] || []).includes(member);
    
    return (
      <button
        onClick={() => onMemberDeleteToggle(index, member)}
        title={isMarkedForDeletion ? `削除をキャンセル: ${member}` : `削除する: ${member}`}
        className={`inline-flex items-center px-2 py-1 mr-1 mb-1 text-xs font-medium rounded-full transition-all duration-200 group
          ${isMarkedForDeletion
            ? 'bg-red-800/80 text-red-200 line-through'
            : 'bg-slate-600 text-slate-200 hover:bg-red-700'
          }`}
      >
        <span>{member}</span>
        <TrashIcon className={`ml-1.5 h-3 w-3 ${isMarkedForDeletion ? 'text-red-200' : 'text-slate-400 group-hover:text-white'}`} />
      </button>
    );
  };
  
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[calc(100vh-38rem)] min-h-[300px]">
        <div className="p-4 border-b border-slate-700">
            <h2 className="text-2xl font-semibold text-white">2. 内線番号を追加・削除する</h2>
            <p className="text-sm text-slate-400 mt-1">番号を追加したいキューの行に入力、または既存の番号をクリックして削除します。</p>
        </div>
        <div className="overflow-auto flex-grow">
            <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800 sticky top-0 z-10">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-[30%]">
                            {nameColumn}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-[30%]">
                            追加する内線番号
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-[40%]">
                            {memberColumn} (現在)
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-slate-800/50 divide-y divide-slate-700">
                    {data.map((row, index) => (
                        <tr key={index} className="hover:bg-slate-700/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">{row[nameColumn]}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                               <input
                                  type="text"
                                  className="block w-full rounded-md bg-slate-900/70 border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-slate-200 placeholder-slate-500"
                                  placeholder="例: 101, 205, 333"
                                  value={extensionsToAdd[index] || ''}
                                  onChange={(e) => onExtensionChange(index, e.target.value)}
                               />
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-400">
                               <div className="max-w-md overflow-x-auto flex flex-wrap items-center">
                                {row[memberColumn] ? (
                                  row[memberColumn].split(',').map(m => m.trim()).filter(Boolean).sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).map(member => (
                                    <MemberBadge key={member} member={member} index={index} />
                                  ))
                                ) : (
                                  <span className="italic">なし</span>
                                )}
                               </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default QueueTable;