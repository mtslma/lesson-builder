import type { AdvancedGrammarBlock, BlockFormProps, BlockPreviewProps } from '../types/index';

export const AdvancedGrammarForm = ({
  block,
  onUpdate
}: BlockFormProps<AdvancedGrammarBlock>) => {
  const updateHeader = (i: number, val: string) => {
    const n = [...block.tableHeaders];
    n[i] = val;
    onUpdate({ tableHeaders: n });
  };
  const addHeader = () => onUpdate({ tableHeaders: [...block.tableHeaders, 'New Col'] });
  const addRow = () =>
    onUpdate({
      tableRows: [...block.tableRows, { elements: Array(block.tableHeaders.length).fill('') }]
    });
  const updateCell = (rIdx: number, cIdx: number, val: string) => {
    const n = [...block.tableRows];
    n[rIdx].elements[cIdx] = val;
    onUpdate({ tableRows: n });
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        className="w-full p-2 border rounded text-sm font-bold"
        value={block.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Grammar Topic"
      />
      <input
        type="text"
        className="w-full p-2 border rounded text-sm"
        value={block.explanation}
        onChange={(e) => onUpdate({ explanation: e.target.value })}
        placeholder="Short explanation"
      />
      <div className="border p-2 rounded bg-slate-50 space-y-2">
        <span className="text-[10px] font-bold uppercase block">Table Headers</span>
        <div className="flex gap-1">
          {block.tableHeaders.map((h: string, i: number) => (
            <input
              key={i}
              type="text"
              className="flex-1 p-1 text-xs border rounded"
              value={h}
              onChange={(e) => updateHeader(i, e.target.value)}
            />
          ))}
          <button
            type="button"
            onClick={addHeader}
            className="bg-blue-100 text-blue-600 px-2 rounded font-bold text-xs"
          >
            +
          </button>
        </div>
        {block.tableRows.map((r, rIdx) => (
          <div key={rIdx} className="flex gap-1">
            {r.elements.map((cell: string, cIdx: number) => (
              <input
                key={cIdx}
                type="text"
                className="flex-1 p-1 text-xs border rounded"
                value={cell}
                onChange={(e) => updateCell(rIdx, cIdx, e.target.value)}
              />
            ))}
          </div>
        ))}
        <button
          type="button"
          onClick={addRow}
          className="text-[10px] bg-slate-200 px-2 py-1 rounded font-bold mt-1"
        >
          + Add Row
        </button>
      </div>
    </div>
  );
};

export const AdvancedGrammarPreview = ({ block }: BlockPreviewProps<AdvancedGrammarBlock>) => (
  <div className="my-8 rounded-2xl border border-slate-900 overflow-hidden shadow-md">
    <div className="bg-slate-900 p-5 text-white">
      <h3 className="text-lg font-serif font-black">{block.title}</h3>
      <p className="text-sm text-slate-300 mt-1">{block.explanation}</p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[400px]">
        <thead>
          <tr>
            {block.tableHeaders.map((h: string, i: number) => (
              <th
                key={i}
                className="p-3 bg-slate-100 border-b text-xs font-black text-slate-600 uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.tableRows.map((r, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
              {r.elements.map((c: string, j: number) => (
                <td
                  key={j}
                  className="p-3 text-sm font-sans font-medium text-slate-800 border-r last:border-0"
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
