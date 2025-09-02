import React from 'react';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 id="modal-title" className="text-xl font-semibold text-white">使い方マニュアル</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="閉じる">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-slate-300 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">はじめに</h3>
            <p>このツールは、コールキューのCSVファイルを更新するためのものです。ExcelなどでCSVを開くと内線番号の書式が崩れる問題を回避し、内線番号の追加・削除を安全かつ簡単に行うことができます。</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">必要なCSVファイルの形式</h3>
            <p className="mb-2">アップロードするCSVファイルには、最低でも以下の3つの列が含まれている必要があります。列名にこれらの単語が含まれていれば、自動で認識します。</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><code className="bg-slate-700 px-1.5 py-0.5 rounded-md text-sky-300">名前</code> (コールキュー名)</li>
              <li><code className="bg-slate-700 px-1.5 py-0.5 rounded-md text-sky-300">メンバー</code> (現在のメンバーの内線番号、カンマ区切り)</li>
              <li><code className="bg-slate-700 px-1.5 py-0.5 rounded-md text-sky-300">内線番号</code> (現在のメンバーの内線番号、`メンバー`列と同じで構いません)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">操作手順</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-200">1. CSVファイルのアップロード</h4>
                <p>「クリックしてアップロード」ボタンを押すか、ファイルを指定のエリア内にドラッグ＆ドロップしてください。ファイルが正常に読み込まれると、テーブルにデータが表示されます。</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-200">2. 内線番号の追加・削除</h4>
                <ul className="list-disc list-inside space-y-2 mt-2 pl-2">
                    <li><strong className="text-green-400">追加:</strong> 各キューの「追加する内線番号」の入力欄に、追加したい番号をカンマ、スペース、改行などで区切って入力します。</li>
                    <li><strong className="text-yellow-400">一括追加:</strong> 「全キューに一括追加」機能を使うと、表示されている全てのキューの入力欄に同じ番号を一度に反映できます。</li>
                    <li><strong className="text-red-400">削除:</strong> 「メンバー(現在)」に表示されている番号のバッジをクリックします。番号に赤色の取り消し線が引かれ、削除対象となります。もう一度クリックすると元に戻ります。</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-200">3. ファイルの生成</h4>
                <p>「変更を確認して生成」ボタンをクリックすると、最終確認画面が表示されます。変更内容に問題がなければ「生成してダウンロード」を押し、更新済みのCSVファイルをダウンロードします。ファイル名は `(元のファイル名)_更新用.csv` となります。</p>
              </div>
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">リセット</h3>
            <p>「リセット」ボタンを押すと、アップロードしたファイルや全ての入力内容がクリアされ、初期状態に戻ります。</p>
          </section>

        </div>
        <div className="flex justify-end gap-3 p-4 mt-auto bg-slate-800/50 border-t border-slate-700 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-slate-200 bg-blue-600 rounded-md hover:bg-blue-700"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualModal;
