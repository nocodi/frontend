import { X } from "lucide-react";
import { useState } from "react";

export type GridItem = {
  id: string;
  label: string;
};

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

  function trimRows(newRows: GridItem[][], rowIndex: number): GridItem[][] {
    if (
      newRows[rowIndex].length === 0 &&
      rowIndex + 1 < newRows.length &&
      newRows[rowIndex + 1].length > 0
    ) {
      newRows[rowIndex].push(newRows[rowIndex + 1].shift()!);
    } else {
      return newRows;
    }

    return trimRows(newRows, rowIndex + 1);
  }

  const saveEdit = (itemId: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.map((item) =>
          item.id === itemId ? { ...item, label: editingLabel } : item,
        ),
      ),
    );
    setEditingItemId(null);
    setEditingLabel("");
  };

  const removeItem = (rowIndex: number, itemIndex: number) => {
    setRows((prev) => {
      let newRows = prev.map((row) => [...row]);
      newRows[rowIndex].splice(itemIndex, 1);

      newRows = trimRows(newRows, rowIndex);

      if (newRows[newRows.length - 1].length === 0 && newRows.length > 1) {
        newRows.pop();
      }

      return newRows;
    });
  };

  return (
    <>
      {editingItemId === item.id ?
        <input
          autoFocus
          type="text"
          value={editingLabel}
          onChange={(e) =>
            setEditingLabel(
              e.target.value.length > 0 ? e.target.value : "default",
            )
          }
          onBlur={() => saveEdit(item.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit(item.id);
          }}
          className="mx-auto my-auto text-center outline-none input-primary"
        />
      : <div
          className="mx-auto my-auto cursor-pointer text-center"
          onClick={() => {
            setEditingItemId(item.id);
            setEditingLabel(item.label);
          }}
        >
          {item.label}
        </div>
      }

      <button
        className="invisible absolute top-0.5 right-0.5 cursor-pointer rounded-full bg-red-500 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 hover:bg-red-300"
        onClick={() => removeItem(rowIndex, itemIndex)}
      >
        <X size={18} />
      </button>
    </>
  );
}
