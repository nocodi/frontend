import { NodeProps } from "reactflow";
import { ComponentType } from "../../types/Component";
import { ComponentHandles, ComponentHeader } from "./ComponentOptions";
import { sliceString } from "../../utils/freqFuncs";

export const GroupNode = ({
  id,
  data,
  isConnectable,
}: NodeProps<ComponentType>) => {
  return (
    <div className="flex flex-col">
      <div className="group flex flex-col items-center gap-1">
        <ComponentHeader id={id} data={data} />
        <div className="group/component text-top relative flex h-24 w-44 cursor-pointer justify-center rounded-lg border-2 border-base-content bg-primary px-1 text-primary-content shadow-lg hover:bg-base-100 hover:text-base-content">
          <ComponentHandles component={data} isConnectable={isConnectable} />
          <div className="mt-1">
            <div className="text-[10px] font-medium group-hover/component:hidden">
              {data.component_name}
            </div>
            <div className="hidden text-[10px] font-medium group-hover/component:block">
              {data.hover_text ?
                sliceString(data.hover_text, 15)
              : data.component_name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
