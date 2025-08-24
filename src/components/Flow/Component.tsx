import { NodeProps } from "reactflow";
import { ComponentType } from "../../types/Component";
import { ComponentHeader, ComponentHandles } from "./ComponentOptions";
import { useOpenComponent } from "./OpenComponentContext";
import getComponentIcon from "../ContentTypes/getComponentIcon";

function Component({ id, data, isConnectable }: NodeProps<ComponentType>) {
  const setOpenComponent = useOpenComponent()[1];

  return (
    <div className="flex flex-col opacity-85">
      <div className="group flex flex-col items-center gap-1">
        <ComponentHeader id={id} data={data} />
        <div
          onDoubleClick={() => setOpenComponent(data)}
          className={
            "group/component relative flex h-15 w-36 cursor-pointer items-center justify-center rounded-lg border-2 border-base-content bg-primary pr-1.5 pl-1 text-xs font-medium text-primary-content shadow-lg hover:bg-base-100 hover:text-base-content"
          }
        >
          <ComponentHandles component={data} isConnectable={isConnectable} />
          <div className="flex items-center gap-2 group-hover/component:hidden">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-base-100 shadow-sm">
              {getComponentIcon(data.component_name, "small")}
            </div>
            {data.component_name}
          </div>
          <div className="hidden w-full items-center justify-center overflow-hidden text-center group-hover/component:line-clamp-3">
            {data.hover_text || data.component_name}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
