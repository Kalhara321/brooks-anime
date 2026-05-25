"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

type Props = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="max-w-2xl mx-auto mb-10">
      <div className="flex items-center bg-[#111827] rounded-full px-5 py-4 border border-purple-500/20">
        <Search className="text-gray-400" />
        <input
          type="text"
          placeholder="Search anime..."
          className="bg-transparent outline-none w-full ml-3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
}