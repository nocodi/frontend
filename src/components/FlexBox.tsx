import { useState } from "react";
import { ComponentType } from "../types/Component";

const MAX_ROWS = 5;
const MAX_COLS = 5;

type ComponentFlex = { rowIdx: number; component: ComponentType };

type Matrix = ComponentFlex[][];

const FlexMatrix = () => {
  const [matrix, setMatrix] = useState<Matrix>([[]]);

  const addRow = () => {
    if (matrix.length < MAX_ROWS) {
      setMatrix((prev) => [...prev, []]);
    }
  };

  const addBox = (rowIndex: number, component: ComponentType) => {
    setMatrix((prev) =>
      prev.map((row, i) =>
        i === rowIndex && row.length < MAX_COLS ?
          [
            ...row,
            {
              rowIdx: rowIndex,
              component: component,
            },
          ]
        : row,
      ),
    );
  };

  const deleteBox = (rowIndex: number, colIndex: number) => {
    setMatrix((prev) =>
      prev.map((row, i) =>
        i === rowIndex ? row.filter((_, j) => j !== colIndex) : row,
      ),
    );
  };

  return (
    <div className="p-4">
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex} className="mb-4 flex items-center gap-2">
          <div className="flex gap-2">
            {row.map((_, colIndex) => (
              <div
                key={colIndex}
                className="relative flex h-16 w-16 items-center justify-center rounded bg-blue-500 text-white"
              >
                {colIndex + 1}
                <button
                  onClick={() => deleteBox(rowIndex, colIndex)}
                  className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                >
                  ×
                </button>
              </div>
            ))}

            {row.length < MAX_COLS && (
              <button
                onClick={() =>
                  addBox(rowIndex, {
                    id: 0,
                    previous_component: null,
                    component_name: "",
                    component_type: "TELEGRAM",
                    component_content_type: 0,
                    position_x: 0,
                    position_y: 0,
                  })
                }
                className="h-16 w-16 rounded bg-green-600 text-white"
              >
                +
              </button>
            )}
          </div>

          {rowIndex === matrix.length - 1 && matrix.length < MAX_ROWS && (
            <button
              onClick={addRow}
              className="ml-4 rounded bg-purple-700 px-4 py-2 text-white"
            >
              + Row
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default FlexMatrix;
