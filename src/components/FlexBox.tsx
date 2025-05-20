import { useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { Plus, X } from "lucide-react";
import { ComponentType } from "../types/Component";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const MAX_ROWS = 5;
const MAX_COLS = 4;
const TOTAL_CELLS = MAX_ROWS * MAX_COLS;
const BOX_WIDTH = 1;
const BOX_HEIGHT = 1;

type GridItem = {
  id: string;
  component: ComponentType;
};

const FlexMatrix = () => {
  const [items, setItems] = useState<GridItem[]>([]);
  const [layout, setLayout] = useState<Layout[]>([]);

  const addBox = () => {
    if (items.length >= TOTAL_CELLS) return;

    const id = Date.now().toString();
    const x = items.length % MAX_COLS;
    const y = Math.floor(items.length / MAX_COLS);

    const newItem: GridItem = {
      id,
      component: {
        id: 0,
        previous_component: null,
        component_name: "",
        component_type: "TELEGRAM",
        component_content_type: 0,
        position_x: x,
        position_y: y,
      },
    };

    setItems((prev) => [...prev, newItem]);
    setLayout((prev) => [
      ...prev,
      {
        i: id,
        x,
        y,
        w: BOX_WIDTH,
        h: BOX_HEIGHT,
        static: false,
      },
    ]);
  };

  const deleteBox = (idToDelete: string) => {
    const updatedItems = items.filter((item) => item.id !== idToDelete);
    // const updatedLayout = layout.filter((l) => l.i !== idToDelete);

    const newLayout = updatedItems.map((item, idx) => ({
      i: item.id,
      x: idx % MAX_COLS,
      y: Math.floor(idx / MAX_COLS),
      w: BOX_WIDTH,
      h: BOX_HEIGHT,
      static: false,
    }));

    setItems(updatedItems);
    setLayout(newLayout);
  };

  return (
    <div className="p-4">
      <GridLayout
        className="layout"
        layout={layout}
        cols={MAX_COLS}
        rowHeight={80}
        width={MAX_COLS * 100}
        compactType="vertical"
        isResizable={false}
        onLayoutChange={setLayout}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="group btn relative items-center justify-center btn-primary"
          >
            {item.component.id}
            <button
              type="button"
              onClick={() => deleteBox(item.id)}
              className="invisible absolute top-1 right-1 cursor-pointer rounded-full p-1 opacity-0 transition-opacity duration-300 ease-in group-hover:visible group-hover:bg-red-500 group-hover:opacity-100 hover:bg-red-300"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </GridLayout>

      <div className="mt-4 flex gap-4">
        <button
          type="button"
          onClick={addBox}
          className="btn btn-secondary"
          disabled={items.length >= TOTAL_CELLS}
        >
          <Plus /> Add Button
        </button>
      </div>
    </div>
  );
};

export default FlexMatrix;
