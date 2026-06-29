import { ChevronLeft, ChevronRight } from 'lucide-react';

type PageControlsProps = {
  currentPage: number;
  surface?: 'light' | 'dark';
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const PageControls = ({
  currentPage,
  surface = 'light',
  totalPages,
  onPageChange
}: PageControlsProps) => (
  <div
    className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 ${
      surface === 'dark'
        ? 'border-slate-800 bg-slate-950/70'
        : 'border-slate-200 bg-white shadow-[0_10px_30px_-22px_rgba(15,23,42,0.35)]'
    }`}
  >
    <button
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] shadow-sm disabled:opacity-35 ${
        surface === 'dark'
          ? 'border border-slate-700 bg-slate-900 text-slate-200'
          : 'border border-slate-300 bg-white text-slate-600'
      }`}
      type="button"
    >
      <ChevronLeft size={14} strokeWidth={2.3} />
      Previous
    </button>

    <div className="flex flex-wrap justify-center gap-1.5">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`h-7 w-7 rounded-md text-[11px] shadow-sm ${
            currentPage === index + 1
              ? surface === 'dark'
                ? 'bg-white text-slate-900'
                : 'bg-slate-900 text-white'
              : surface === 'dark'
                ? 'border border-slate-700 bg-slate-900 text-slate-400'
                : 'border border-slate-300 bg-white text-slate-500'
          }`}
          type="button"
        >
          {index + 1}
        </button>
      ))}
    </div>

    <button
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] shadow-sm disabled:opacity-35 ${
        surface === 'dark' ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
      }`}
      type="button"
    >
      Next
      <ChevronRight size={14} strokeWidth={2.3} />
    </button>
  </div>
);
