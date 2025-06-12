import { Handle, NodeProps, Position } from "reactflow";
import { ComponentType } from "../../types/Component";
import { ComponentHeader } from "./ComponentOptions";

// can move this to ComponentOptions
export const GroupNode = ({
  id,
  data,
  isConnectable,
}: NodeProps<ComponentType>) => {
  return (
    <div className="group flex flex-col items-center gap-1">
      <div className="">
        <ComponentHeader id={id} data={data} />
      </div>
      <div className="h-20 w-30">
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          isConnectableStart={false}
          style={{
            width: 1,
            height: 8,
            borderRadius: 1,
          }}
        />
        <div className="">{data.component_name}</div>
      </div>
    </div>
  );
};
