import { NodeProps } from "reactflow";
import { ComponentType } from "../../types/Component";
import { ComponentHeader, ComponentHandles } from "./ComponentOptions";
import { sliceString } from "../../utils/freqFuncs";
import { useUnattended } from "../Context/UnattendedComponentContext";
import getComponentIcon from "../ContentTypes/getComponentIcon";

function Component({ id, data, isConnectable }: NodeProps<ComponentType>) {
  const setUnattendedComponent = useUnattended()[1];
  const baseClasses =
    "group/component relative flex cursor-pointer rounded-lg border-2 border-base-content bg-primary px-1 text-primary-content shadow-lg hover:bg-base-100 hover:text-base-content";

  const typeOfComponent =
    data.reply_markup_supported ?
      `text-top justify-center h-24 w-44 ${baseClasses}`
    : `items-center text-center h-12 w-24 ${baseClasses}`;

  return (
    <div className="flex flex-col">
      <div className="group flex flex-col items-center gap-1">
        <ComponentHeader id={id} data={data} />
        <div
          onDoubleClick={() => setUnattendedComponent(data)}
          className={typeOfComponent}
        >
          <ComponentHandles component={data} isConnectable={isConnectable} />
          <div
            className={
              data.reply_markup_supported ?
                "mt-1 flex shrink grow"
              : "flex shrink grow items-center"
            }
          >
            <div className="shrink-0 grow-0">
              <span className="flex items-center justify-center">
                {getComponentIcon(data.component_name, "small")}
              </span>
            </div>
            <div className="text-[10px] font-medium group-hover/component:hidden">
              {data.component_name}
            </div>
            <div className="hidden text-[10px] font-medium group-hover/component:block">
              {data.hover_text ?
                sliceString(data.hover_text, 12)
              : data.component_name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
