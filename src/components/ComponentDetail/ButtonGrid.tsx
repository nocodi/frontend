import { Plus, Grid, MessageSquare, Reply } from "lucide-react";
import EditableButton from "./EditableButton";
import {
  GridItem,
  KeyboardType,
  formValuesType,
} from "../../types/ComponentDetailForm";
import { generateUUID } from "./generateUUID";
import { componentSchemaType } from "./makeFormData";

type ButtonGridProps = {
  rows: GridItem[][];
  setRows: React.Dispatch<React.SetStateAction<GridItem[][]>>;
  keyboardType: KeyboardType;
  setKeyboardType: React.Dispatch<React.SetStateAction<KeyboardType>>;
  formValues: formValuesType;
  componentSchema: componentSchemaType;
  componentName: string;
};

export default function ButtonGrid({
  rows,
  setRows,
  keyboardType,
  setKeyboardType,
}: ButtonGridProps) {
  const MAX_ROWS = 3;
  const MAX_COLS = 3;

  const addItemToRow = (rowIndex: number) => {
    setRows((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex && row.length < MAX_COLS ?
          [
            ...row,
            { id: generateUUID(), value: "New Button", next_component: null },
          ]
        : row,
      ),
    );
  };

  const addRow = () => {
    setRows((prev) => {
      if (prev.length >= MAX_ROWS) return prev;
      return [
        ...prev,
        [{ id: generateUUID(), value: "New Button", next_component: null }],
      ];
    });
  };

  return (
    <div className="mt-4 flex flex-col gap-4 text-primary-content">
      {rows.length === 0 || rows.every((row) => row.length === 0) ?
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/20 bg-base-200/50 p-8 transition-all duration-200 hover:border-primary/40 hover:bg-base-200">
          <Grid className="mb-3 size-12 text-primary/40" />
          <h3 className="mb-2 text-lg font-semibold text-base-content">
            No Buttons Yet
          </h3>
          <p className="mb-4 text-center text-sm text-base-content/70">
            Start by adding your first button to create an interactive grid
          </p>
          <button
            type="button"
            onClick={addRow}
            className="btn btn-lg btn-primary"
          >
            <Plus className="mr-2 size-5" />
            Add First Button
          </button>
        </div>
      : <div className="rounded-xl border-2 border-dashed border-primary/20 bg-base-200/50 p-6 transition-all duration-200 hover:border-primary/40 hover:bg-base-200">
          {/* Header with Type Toggle */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-base-content/70">
                Keyboard Type:
              </span>

              {/* Segmented Control */}
              <div className="join">
                <button
                  type="button"
                  onClick={() => setKeyboardType("InlineKeyboard")}
                  className={`btn join-item btn-xs ${
                    keyboardType === "InlineKeyboard" ? "btn-primary" : (
                      "text-base-content/60 btn-ghost hover:text-base-content"
                    )
                  }`}
                >
                  <MessageSquare className="mr-1 size-3" />
                  Inline
                </button>
                <button
                  type="button"
                  onClick={() => setKeyboardType("ReplyKeyboard")}
                  className={`btn join-item btn-xs ${
                    keyboardType === "ReplyKeyboard" ? "btn-primary" : (
                      "text-base-content/60 btn-ghost hover:text-base-content"
                    )
                  }`}
                >
                  <Reply className="mr-1 size-3" />
                  Reply
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="relative flex gap-4">
                <div className="flex flex-1 gap-4">
                  {row.map((item, itemIndex) => (
                    <div key={item.id} className="min-w-0 flex-1">
                      <div className="group card relative h-12 overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md">
                        <EditableButton
                          item={item}
                          itemIndex={itemIndex}
                          rowIndex={rowIndex}
                          setRows={setRows}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addItemToRow(rowIndex)}
                  disabled={row.length >= MAX_COLS}
                  className={`btn my-auto h-12 w-12 shrink-0 grow-0 rounded-lg border-2 border-dashed btn-soft btn-secondary ${
                    row.length >= MAX_COLS ?
                      "cursor-not-allowed border-gray-200 text-gray-400 opacity-50"
                    : "border-gray-300 hover:border-primary/50"
                  }`}
                  title={
                    row.length >= MAX_COLS ? "Row is full" : "Add Button to Row"
                  }
                >
                  <Plus size={18} />
                </button>
              </div>
            ))}

            {rows.length < MAX_ROWS && (
              <button
                type="button"
                onClick={() => {
                  addRow();
                }}
                className="btn mt-2 btn-block rounded-xl btn-soft btn-secondary"
              >
                <Plus className="mr-2 size-5" />
                Add New Row
              </button>
            )}
          </div>
        </div>
      }
    </div>
  );
}
