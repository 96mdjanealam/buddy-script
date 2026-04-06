import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NewFolksPagination } from "@/types/types";

interface NewFolksPaginationProps {
  pagination: NewFolksPagination;
  onPageChange: (page: number) => void;
}

const NewFolksPaginationBar = ({ pagination, onPageChange }: NewFolksPaginationProps) => {
  const { page, totalPages } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#0081ff] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={14} />
        Prev
      </button>

      <span className="text-xs text-slate-400">
        {page} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#0081ff] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default NewFolksPaginationBar;


