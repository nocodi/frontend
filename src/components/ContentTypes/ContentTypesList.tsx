import React, { useState } from "react";
import { ContentType } from "../../types/Component";
import SearchBar from "../searchBar";
import { X, Bot, Zap, BrainCircuit } from "lucide-react";
import { useContentTypes } from "../../services/getQueries";
import { useDnD } from "../Flow/DnDContext";
import getComponentIcon from "./getComponentIcon";

const CATEGORIES = {
  Bot: {
    icon: <Bot className="h-6 w-6 text-blue-500" />,
    component_types: ["TELEGRAM"],
  },
  Trigger: {
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    component_types: ["TRIGGER"],
  },
  Logical: {
    icon: <BrainCircuit className="h-6 w-6 text-violet-500" />,
    component_types: ["CONDITIONAL", "CODE", "STATE"],
  },
};
function ContentTypesList({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (component: ContentType) => void;
}) {
  const setContent = useDnD()[1];
  const { contentTypes } = useContentTypes();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof CATEGORIES>();

  const handleCategoryClick = (ctg: keyof typeof CATEGORIES) => {
    if (ctg == selectedCategory) setSelectedCategory(undefined);
    else setSelectedCategory(ctg);
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    component: ContentType,
  ) => {
    setContent(component);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleComponentClick = (content: ContentType) => {
    onSelect(content);
    onClose();
  };

  const lowerCaseQuery = query.toLowerCase();
  const categoryTypes =
    selectedCategory ? CATEGORIES[selectedCategory].component_types : null;

  const filtered = contentTypes?.filter((item) => {
    const matchesQuery =
      !query.length || item.name.toLowerCase().includes(lowerCaseQuery);
    const matchesCategory =
      !categoryTypes || categoryTypes.includes(item.component_type);
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="flex h-full w-full flex-col bg-base-100 px-6 pt-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-2xl font-bold">Add Component</h1>
        <button
          type="button"
          onClick={onClose}
          className="group btn btn-circle btn-ghost hover:bg-primary/10"
        >
          <X className="h-6 w-6 transition-transform group-hover:rotate-90" />
          <span className="sr-only">close</span>
        </button>
      </div>

      <div className="-mx-6 flex shrink-0 items-center gap-1 self-stretch px-6 py-2 shadow-md">
        <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
        {Object.entries(CATEGORIES).map(([name, ctg]) => (
          <button
            type="button"
            key={name}
            onClick={() => handleCategoryClick(name as keyof typeof CATEGORIES)}
            className={`tooltip btn tooltip-bottom btn-square btn-primary ${name == selectedCategory ? "" : "btn-outline"}`}
            data-tip={name}
          >
            {ctg.icon}
            <span className="sr-only">{name}</span>
          </button>
        ))}
      </div>

      <div className="-mr-[15px] flex grow flex-col items-stretch gap-2 overflow-x-hidden overflow-y-scroll pt-4 pb-10">
        {filtered?.map((item) => (
          <div
            key={item.id}
            data-tip={item.description}
            onClick={() => handleComponentClick(item)}
            className="group tooltip tooltip-bottom flex cursor-pointer flex-row items-center gap-4 rounded-xl border border-base-300 bg-base-200 p-2 shadow-sm transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:shadow-md"
            onDragStart={(event) => handleDragStart(event, item)}
            draggable
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-base-100 shadow-sm transition-all duration-200 group-hover:bg-primary/10">
              {getComponentIcon(item.name)}
            </div>
            <span className="truncate text-lg font-semibold">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentTypesList;
export { getComponentIcon };
