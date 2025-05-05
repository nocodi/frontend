import { Search } from "lucide-react";
import React from "react";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <label className="input tracking-widest input-primary">
      <Search />
      <input
        type="search"
        placeholder="Search"
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
