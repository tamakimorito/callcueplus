import React, { useState, useCallback, useMemo } from 'react';
import Papa, { ParseResult } from 'papaparse';
import { CsvRow } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import QueueTable from './components/QueueTable';
import Controls from './components/Controls';
import BulkOperations from './components/BulkOperations';
import ConfirmationModal, { ChangeSummary } from './components/ConfirmationModal';
import ManualModal from './components/ManualModal';
import { FileIcon } from './components/Icons';

const App: React.FC = () => {
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [extensionsToAdd, setExtensionsToAdd] = useState<{ [key: number]: string }>({});
  const [membersToDelete, setMembersToDelete] = useState<{ [key: number]: string[] }>({});
  const [bulkOperationText, setBulkOperationText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [nameColumn, setNameColumn] = useState<string | null>(null);
  const [memberColumn, setMemberColumn] = useState<string | null>(null);
  const [extensionColumn, setExtensionColumn] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [changeSummary, setChangeSummary] = useState<ChangeSummary[]>([]);

  const resetState = useCallback(() => {
    setCsvData([]);
    setHeaders([]);
    setExtensionsToAdd({});
    setMembersToDelete({});
    setBulkOperationText('');
    setError(null);
    setFileName(null);
    setNameColumn(null);
    setMemberColumn(null);
    setExtensionColumn(null);
    setProcessing(false);
    setShowConfirmationModal(false);
    setChangeSummary([]);
    // Reset file input visually
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }, []);

  const handleFileChange = useCallback((file: File) => {
    resetState();

    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setFileName(file.name);
      setProcessing(true);
      Papa.parse<CsvRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: ParseResult<CsvRow>) => {
          if (results.errors.length) {
            setError(`ファイル解析エラー ${file.name}: ${results.errors[0].message}`);
            setProcessing(false);
            return;
          }

          const fields = results.meta.fields;
          if (!fields) {
              setError('CSVファイルからヘッダーを読み取れませんでした。');
              setProcessing(false);
              return;
          }

          const detectedNameColumn = fields.find(f => f.includes('名前'));
          const detectedMemberColumn = fields.find(f => f.includes('メンバー'));
          const detectedExtensionColumn = fields.find(f => f.includes('内線番号') && !f.includes('現在の'));

          if (!detectedNameColumn || !detectedMemberColumn || !detectedExtensionColumn) {
            setError(`CSVファイルには '名前', 'メンバー', '内線番号' の列が必要です。`);
          } else {
            setNameColumn(detectedNameColumn);
            setMemberColumn(detectedMemberColumn);
            setExtensionColumn(detectedExtensionColumn);
            setHeaders(fields);
            setCsvData(results.data);
          }
          setProcessing(false);
        },
        error: (err: Error) => {
            setError(`ファイルの解析に失敗しました: ${err.message}`);
            setProcessing(false);
        }
      });
    } else {
      setError('有効な.csvファイルをアップロードしてください。');
      setFileName(null);
    }
  }, [resetState]);
  
  const handleExtensionChange = (index: number, value: string) => {
    setExtensionsToAdd(prev => ({...prev, [index]: value}));
  };

  const handleMemberDeleteToggle = (index: number, member: string) => {
    setMembersToDelete(prev => {
      const currentDeletions = prev[index] || [];
      const newDeletions = currentDeletions.includes(member)
        ? currentDeletions.filter(m => m !== member)
        : [...currentDeletions, member];
      return {...prev, [index]: newDeletions};
    });
  };

  const handleApplyBulkAdd = useCallback(() => {
    if (csvData.length === 0) return;

    const newExtensionsToAdd = { ...extensionsToAdd };
    const bulkExts = bulkOperationText
      .split(/[\s,;]+/)
      .map(ext => ext.trim())
      .filter(ext => /^\d+$/.test(ext));

    if (bulkExts.length > 0) {
        csvData.forEach((_, index) => {
          const existing = (newExtensionsToAdd[index] || '')
            .split(/[\s,;]+/)
            .map(e => e.trim())
            .filter(Boolean);
          
          const combined = [...new Set([...existing, ...bulkExts])];
          newExtensionsToAdd[index] = combined.join(', ');
        });
        setExtensionsToAdd(newExtensionsToAdd);
    }
    
    setBulkOperationText('');
  }, [bulkOperationText, csvData, extensionsToAdd]);

  const handleApplyBulkDelete = useCallback(() => {
    if (csvData.length === 0 || !memberColumn) return;

    const bulkExtsToDelete = bulkOperationText
      .split(/[\s,;]+/)
      .map(ext => ext.trim())
      .filter(ext => /^\d+$/.test(ext));

    if (bulkExtsToDelete.length > 0) {
      const newMembersToDelete = { ...membersToDelete };

      csvData.forEach((row, index) => {
        const currentMembers = (row[memberColumn!] || '').split(',').map(m => m.trim()).filter(Boolean);
        const deletionsForThisRow = bulkExtsToDelete.filter(ext => currentMembers.includes(ext));
        
        if (deletionsForThisRow.length > 0) {
            const existingDeletions = newMembersToDelete[index] || [];
            const combinedDeletions = [...new Set([...existingDeletions, ...deletionsForThisRow])];
            newMembersToDelete[index] = combinedDeletions;
        }
      });

      setMembersToDelete(newMembersToDelete);
    }
    
    setBulkOperationText('');
  }, [bulkOperationText, csvData, memberColumn, membersToDelete]);


  const handleRequestGenerate = useCallback(() => {
    if (!memberColumn || !nameColumn) return;

    const summary: ChangeSummary[] = [];
    csvData.forEach((row, index) => {
      const additions = (extensionsToAdd[index] || '').split(/[\s,;]+/).map(s => s.trim()).filter(Boolean);
      const deletions = membersToDelete[index] || [];

      if (additions.length > 0 || deletions.length > 0) {
        summary.push({
          queueName: row[nameColumn!]!,
          additions,
          deletions,
        });
      }
    });

    if (summary.length > 0) {
      setChangeSummary(summary);
      setShowConfirmationModal(true);
    } else {
      setError("変更点がありません。内線番号を追加または削除してください。");
    }
  }, [csvData, extensionsToAdd, membersToDelete, nameColumn, memberColumn]);


  const handleConfirmAndGenerate = useCallback(() => {
    if (!memberColumn || !nameColumn || !extensionColumn || !headers.length) {
        setError("「名前」「メンバー」「内線番号」列が見つからないため、処理を中断しました。");
        setShowConfirmationModal(false);
        return;
    }
    setProcessing(true);
    setError(null);

    setTimeout(() => { // 処理中のフィードバックを見せるための遅延
        try {
            const updatedData = JSON.parse(JSON.stringify(csvData));
            
            updatedData.forEach((row: CsvRow, index: number) => {
                const toDelete = membersToDelete[index] || [];
                const currentMembers = (row[memberColumn!] || '').split(',').map(m => m.trim()).filter(Boolean);
                let membersAfterDeletion = currentMembers.filter(m => !toDelete.includes(m));
                
                const toAddRaw = extensionsToAdd[index] || '';
                const newExtensions = toAddRaw.split(/[\s,;]+/).map(ext => ext.trim()).filter(ext => /^\d+$/.test(ext));

                const combinedMembers = [...new Set([...membersAfterDeletion, ...newExtensions])];
                combinedMembers.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
                row[memberColumn!] = combinedMembers.join(',');
            });
            
            const updateHeaders = ['現在の内線番号', ...headers];
            
            const statusColumnName = headers.find(h => h.includes('ステータス'));
            const businessHoursColumnName = headers.find(h => h.includes('営業時間を設定'));

            const dataForExport = updatedData.map((row: CsvRow) => {
                const newRow: CsvRow = {...row};
                if (statusColumnName) newRow[statusColumnName] = '';
                if (businessHoursColumnName) newRow[businessHoursColumnName] = '';
                newRow['現在の内線番号'] = row[extensionColumn!];
                return newRow;
            });
            
            const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
            const csvString = Papa.unparse(dataForExport, { header: true, quotes: true, columns: updateHeaders });
            
            const blob = new Blob([bom, csvString], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            const originalName = fileName ? fileName.replace('.csv', '') : 'コールキュー';
            link.setAttribute('download', `${originalName}_更新用.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // After successful download, reset relevant states
            setExtensionsToAdd({});
            setMembersToDelete({});

        } catch(e: any) {
            setError(`予期せぬエラーが発生しました: ${e.message}`);
        } finally {
            setProcessing(false);
            setShowConfirmationModal(false);
        }
    }, 500);
  }, [csvData, headers, extensionsToAdd, membersToDelete, fileName, nameColumn, memberColumn, extensionColumn]);

  const hasValidData = csvData.length > 0 && nameColumn && memberColumn && extensionColumn;
  const hasChanges = useMemo(() => 
    Object.values(extensionsToAdd).some(val => val.trim() !== '') || 
    Object.values(membersToDelete).some(arr => arr.length > 0),
  [extensionsToAdd, membersToDelete]);

  return (
    <>
      <div className="min-h-screen flex flex-col bg-slate-900">
        <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Header onShowManual={() => setShowManualModal(true)} />
          
          {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative my-4" role="alert">
                  <strong className="font-bold">エラー: </strong>
                  <span className="block sm:inline">{error}</span>
                  <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                      <span className="text-2xl">&times;</span>
                  </button>
              </div>
          )}

          <div className="flex flex-col gap-6 mt-6">
              <FileUpload onFileChange={handleFileChange} fileName={fileName} />
              
              {hasValidData ? (
                  <>
                      <BulkOperations
                          onApplyAdd={handleApplyBulkAdd}
                          onApplyDelete={handleApplyBulkDelete}
                          text={bulkOperationText}
                          onTextChange={setBulkOperationText}
                          isProcessing={processing}
                      />
                      <QueueTable
                          data={csvData}
                          extensionsToAdd={extensionsToAdd}
                          membersToDelete={membersToDelete}
                          onExtensionChange={handleExtensionChange}
                          onMemberDeleteToggle={handleMemberDeleteToggle}
                          nameColumn={nameColumn}
                          memberColumn={memberColumn}
                      />
                      <Controls
                          onGenerateRequest={handleRequestGenerate}
                          onReset={resetState}
                          isProcessing={processing}
                          hasChanges={hasChanges}
                      />
                  </>
              ) : (
                  <div className="flex flex-col items-center justify-center bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg p-8 text-center text-slate-500 min-h-[300px]">
                    <FileIcon className="w-16 h-16 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-400">ここにCSVデータが表示されます</h3>
                    <p className="mt-2 max-w-sm">CSVファイルをアップロードして開始してください。ファイルに「名前」「メンバー」「内線番号」列が含まれていることを確認してください。</p>
                  </div>
              )}
          </div>
        </main>
        <footer className="w-full text-center py-4 mt-auto text-slate-500 text-sm">
          © タマシステム 2025
        </footer>
      </div>
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmAndGenerate}
        changes={changeSummary}
        isProcessing={processing}
      />
      <ManualModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
      />
    </>
  );
};

export default App;