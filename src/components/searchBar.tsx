import React from "react";

export default function SearchBar({ value, onChange }) {
    return (
        <label className="input input-bordered bg-patina-100 border-patina-500 text-patina-900 tracking-widest rounded-xl focus:ring-1 focus:ring-patina-400">
            <svg className="h-[1em] opacity-50 text-patina-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
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
