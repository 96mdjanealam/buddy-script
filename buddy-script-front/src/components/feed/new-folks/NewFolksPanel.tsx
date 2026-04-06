"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, Users } from "lucide-react";
import { userService } from "@/services/user.service";
import { NewFolksUser, NewFolksPagination } from "@/types/types";
import UserRow from "./UserRow";
import NewFolksPaginationBar from "./NewFolksPaginationBar";

const LIMIT = 5;
const DEBOUNCE_MS = 400;

// ── Skeleton row shown while loading ────────────────────────────────────────
const SkeletonRow = () => (
  <div className="flex items-center justify-between gap-2 py-2.5 animate-pulse">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-full bg-slate-100 shrink-0" />
      <div className="h-3 w-28 rounded bg-slate-100" />
    </div>
    <div className="h-2.5 w-16 rounded bg-slate-100" />
  </div>
);

// ── Main panel ───────────────────────────────────────────────────────────────
const NewFolksPanel = () => {
  const [users, setUsers] = useState<NewFolksUser[]>([]);
  const [pagination, setPagination] = useState<NewFolksPagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(""); // debounced value
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce the search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setPage(1); // reset to first page on new search
      setQuery(value);
    }, DEBOUNCE_MS);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.getLatestUsers({
        page,
        limit: LIMIT,
        search: query.trim() || undefined,
      });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return (
    <div className="w-full bg-white rounded-md shadow-sm border border-slate-100 p-5">
      {/* Header */}
      <h2 className="text-[15px] font-semibold text-slate-900 mb-4 tracking-tight">
        Newbies
      </h2>

      {/* Search input */}
      <div className="relative mb-3">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          id="new-folks-search"
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name…"
          className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md placeholder:text-slate-400 text-slate-800 outline-none focus:border-[#0081ff] focus:ring-1 focus:ring-[#0081ff]/20 transition-all"
        />
      </div>

      {/* User list */}
      <div className="divide-y divide-slate-50">
        {loading ? (
          Array.from({ length: LIMIT }).map((_, i) => <SkeletonRow key={i} />)
        ) : error ? (
          <p className="py-6 text-center text-sm text-red-400">{error}</p>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
            <Users size={28} strokeWidth={1.5} />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          users.map((user) => <UserRow key={user._id} user={user} />)
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && pagination && (
        <NewFolksPaginationBar pagination={pagination} onPageChange={setPage} />
      )}
    </div>
  );
};

export default NewFolksPanel;


