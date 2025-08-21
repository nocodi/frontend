import { NodeProps } from "reactflow";
import { ComponentType } from "../../types/Component";
import { ComponentHeader, ComponentHandles } from "./ComponentOptions";
import { sliceString } from "../../utils/freqFuncs";
import { useOpenComponent } from "./context/OpenComponentContext";
import getComponentIcon from "../ContentTypes/getComponentIcon";

function Component({ id, data, isConnectable }: NodeProps<ComponentType>) {
  const setOpenComponent = useOpenComponent()[1];
  const baseClasses =
    "group/component relative flex cursor-pointer text-center items-center rounded-lg border-2 border-base-content px-1 text-primary-content shadow-lg hover:text-base-content";

  const typeOfComponent =
    data.reply_markup_supported ?
      `h-16 w-34 bg-primary/40 hover:bg-base-100/40 ${baseClasses}`
    : `h-12 w-24 bg-primary hover:bg-base-100 ${baseClasses}`;

  return (
    <div className="flex flex-col">
      <div className="group flex flex-col items-center gap-1">
        <ComponentHeader id={id} data={data} />
        <div
          onDoubleClick={() => setOpenComponent(data)}
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
