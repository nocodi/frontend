import { Handle, NodeProps, Position } from "reactflow";
import { ComponentType } from "../../types/Component";

function ButtonNode({ data, isConnectable }: NodeProps<ComponentType>) {
  return (
    <div className="tooltip">
      <div className="tooltip-content bg-base-content text-base-300">
        <div className="text-xs">{data.component_name}</div>
      </div>
      <div className="group/component relative flex h-5 w-5 cursor-pointer items-center rounded-lg border-2 border-base-content bg-base-100 px-1 text-center shadow-lg">
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="!bg-base-content"
        ></Handle>
      </div>
    </div>
  );
}

export default ButtonNode;
