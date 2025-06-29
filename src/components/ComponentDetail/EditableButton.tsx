import { X } from "lucide-react";
import { useState } from "react";
import { GridItem } from "../../types/ComponentDetailForm";

type EditableButtonProps = {
  item: GridItem;
  rowIndex: number;
  itemIndex: number;
  setRows: React.Dispatch<React.SetStateAction<GridItem[][]>>;
};

export default function EditableButton({
  item,
  rowIndex,
  itemIndex,
  setRows,
}: EditableButtonProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");

  const saveEdit = (id: string) => {
    setRows((prev) => {
      const newRows = prev.map((row) =>
        row.map((item) =>
          item.id === id ? { ...item, value: editingLabel } : item,
        ),
      );
      return newRows;
    });
    setEditingItemId(null);
  };

  const removeItem = (rowIndex: number, itemIndex: number) => {
    setRows((prev) => {
      const newRows = [...prev];
      newRows[rowIndex] = newRows[rowIndex].filter(
        (_, idx) => idx !== itemIndex,
      );

      // Remove empty rows
      if (newRows[rowIndex].length === 0) {
        newRows.splice(rowIndex, 1);
      }

      return newRows;
    });
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center p-3">
      {editingItemId === item.id ?
        <input
          autoFocus
          type="text"
          value={editingLabel}
          onChange={(e) =>
            setEditingLabel(
              e.target.value.length > 0 ? e.target.value : "New Button",
            )
          }
          onBlur={() => saveEdit(item.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit(item.id);
          }}
          className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-center text-white placeholder-white/50 backdrop-blur-sm transition-all duration-200 outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20"
          placeholder="Enter button text..."
        />
      : <div
          className="group/edit flex h-full w-full cursor-pointer items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/10"
          onClick={() => {
            setEditingItemId(item.id);
            setEditingLabel(item.value);
          }}
        >
          <span className="cursor-text text-lg font-medium text-base-content">
            {item.value}
          </span>
        </div>
      }

      <button
        className="absolute -top-2 -right-2 hidden rounded-full bg-error p-1.5 text-white opacity-0 shadow-lg transition-all duration-200 group-hover:block group-hover:opacity-100 hover:bg-error/80"
        onClick={() => removeItem(rowIndex, itemIndex)}
        title="Remove Button"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
