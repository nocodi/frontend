import { Plus, X } from "lucide-react";
import { useState } from "react";

type GridItem = {
  id: string;
  label: string;
};

export default function FlexibleButtonGrid() {
  const MAX_ROWS = 5;
  const MAX_COLS = 4;

  const [rows, setRows] = useState<GridItem[][]>([
    [{ id: crypto.randomUUID(), label: "Item" }],
  ]);

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");

  const addItemToRow = (rowIndex: number) => {
    setRows((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex && row.length < MAX_COLS ?
          [...row, { id: crypto.randomUUID(), label: "Item" }]
        : row,
      ),
    );
  };

  const addRow = () => {
    setRows((prev) => {
      if (prev.length >= MAX_ROWS) return prev;
      const lastRow = prev[prev.length - 1];
      if (lastRow.length === 0) return prev;
      return [...prev, [{ id: crypto.randomUUID(), label: "Item" }]];
    });
  };

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

  return (
    <div className="mt-5 mb-15 space-y-6 p-4 text-primary-content">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="relative flex flex-wrap gap-2">
          {row.map((item, itemIndex) => (
            <div key={item.id} className="flex items-center gap-1">
              <div className="group card relative h-15 w-20 bg-primary p-2 hover:bg-patina-500">
                {editingItemId === item.id ?
                  <input
                    autoFocus
                    type="text"
                    value={editingLabel}
                    onChange={(e) => setEditingLabel(e.target.value)}
                    onBlur={() => saveEdit(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(item.id);
                    }}
                    className="mx-auto my-auto w-full text-center outline-none input-primary"
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
              </div>
            </div>
          ))}

          {row.length < MAX_COLS && (
            <button
              type="button"
              onClick={() => addItemToRow(rowIndex)}
              className="btn absolute right-0 rounded-full btn-secondary"
            >
              <Plus size={20} />
            </button>
          )}
        </div>
      ))}

      {rows.length < MAX_ROWS && rows[rows.length - 1].length > 0 && (
        <button
          type="button"
          onClick={addRow}
          className="btn mt-2 rounded-xl btn-accent"
        >
          <Plus />
        </button>
      )}
    </div>
  );
}
