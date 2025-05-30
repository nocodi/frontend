import { Plus } from "lucide-react";
import { useState } from "react";
import EditableButton, { GridItem } from "./EditableButton";

export default function ButtonGrid() {
  const MAX_ROWS = 5;
  const MAX_COLS = 4;

  const [rows, setRows] = useState<GridItem[][]>([
    [{ id: crypto.randomUUID(), label: "Item" }],
  ]);

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

  return (
    <div className="mt-7 mb-10 flex flex-col gap-3 text-primary-content">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="relative flex flex-wrap gap-3">
          {row.map((item, itemIndex) => {
            return (
              <div key={item.id} className="flex shrink grow items-center">
                <div className="group card relative h-15 flex-1 bg-primary hover:bg-patina-400">
                  <EditableButton
                    item={item}
                    itemIndex={itemIndex}
                    rowIndex={rowIndex}
                    setRows={setRows}
                  />
                </div>
              </div>
            );
          })}

          {row.length < MAX_COLS && (
            <button
              type="button"
              onClick={() => addItemToRow(rowIndex)}
              className="btn my-auto h-15 shrink-0 grow-0 btn-soft btn-secondary"
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
          className="btn mt-2 btn-soft btn-secondary"
        >
          <Plus />
        </button>
      )}
    </div>
  );
}
