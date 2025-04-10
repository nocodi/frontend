import React from "react";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <label className="input-bordered input rounded-xl border-patina-500 bg-patina-100 tracking-widest text-patina-900 focus:ring-1 focus:ring-patina-400">
      <svg
        className="h-[1em] text-patina-500 opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2.5"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </g>
      </svg>
      <input
        type="search"
        required
        placeholder="Search"
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
