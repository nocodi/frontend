import React, { useState } from "react";
import SearchBar from "./SearchBar";

const data = ["Apple", "Banana", "Orange", "Grapes", "Strawberry"];

export default function FilteredList() {
    const [query, setQuery] = useState("");

    const filtered = data.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="p-4">
            <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
            
            {query && (
                <ul className="mt-4">
                    {filtered.length > 0 ? (
                        filtered.map((item, i) => (
                            <li key={i} className="py-1">{item}</li>
                        ))
                    ) : (
                        <li className="py-1 text-gray-500 italic">No results found</li>
                    )}
                </ul>
            )}
        </div>
    );
}
